import { and, db, eq, gt, isNull, lt, schemas } from "@kylro/database";
import env from "../../shared/config/env.js";
import ApiError from "../../shared/utils/ApiError.js";
import { generateRandomToken, hashToken, timingSafeCompare } from "../../shared/utils/crypto.js";
import { sendMagicLinkEmail } from "../../shared/utils/email.js";
import type { AuthSession, AuthUser } from "../../types/express.js";

export const SESSION_COOKIE_NAME = "klyro_session";
export const SESSION_EXPIRATION_DAYS = 30;
export const SESSION_EXPIRATION_MS = SESSION_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;
export const MAGIC_LINK_EXPIRATION_MS = 15 * 60 * 1000; // 15 minutes
export const MAGIC_LINK_COOLDOWN_MS = 60 * 1000; // 60 seconds cooldown
export const OAUTH_STATE_COOKIE_NAME = "klyro_oauth_state";
export const OAUTH_STATE_MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes

export function getSessionCookieOptions() {
    return {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: SESSION_EXPIRATION_MS,
    };
}

export function getOAuthStateCookieOptions() {
    return {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: OAUTH_STATE_MAX_AGE_MS,
    };
}

interface GoogleUserInfo {
    sub: string;
    email: string;
    email_verified?: boolean;
    name?: string;
    picture?: string;
}

export class AuthService {
    /**
     * Creates a new database-backed session for a user.
     * Generates a 256-bit high-entropy token, stores only its SHA-256 hash,
     * and returns the raw token to be set on the client's HttpOnly cookie.
     */
    async createSession(userId: string): Promise<{ rawToken: string; session: AuthSession }> {
        const rawToken = generateRandomToken(32);
        const tokenHash = hashToken(rawToken);
        const expiresAt = new Date(Date.now() + SESSION_EXPIRATION_MS);

        const [session] = await db
            .insert(schemas.sessions)
            .values({
                userId,
                tokenHash,
                expiresAt,
            })
            .returning();

        if (!session) {
            throw ApiError.internal("Failed to create database session");
        }

        return { rawToken, session };
    }

    /**
     * Validates an incoming session token from a cookie.
     * Hashes the token with SHA-256, looks up the session in PostgreSQL,
     * verifies expiration, and returns the joined user record.
     */
    async validateSession(rawToken: string): Promise<{ user: AuthUser; session: AuthSession } | null> {
        if (!rawToken || typeof rawToken !== "string") {
            return null;
        }

        const tokenHash = hashToken(rawToken);

        const rows = await db
            .select({
                user: schemas.users,
                session: schemas.sessions,
            })
            .from(schemas.sessions)
            .innerJoin(schemas.users, eq(schemas.sessions.userId, schemas.users.id))
            .where(
                and(
                    eq(schemas.sessions.tokenHash, tokenHash),
                    gt(schemas.sessions.expiresAt, new Date()),
                ),
            )
            .limit(1);

        const match = rows[0];
        if (!match) {
            return null;
        }

        return match;
    }

    /**
     * Revokes a session by deleting its record from the database.
     */
    async revokeSession(rawToken: string): Promise<void> {
        if (!rawToken || typeof rawToken !== "string") {
            return;
        }

        const tokenHash = hashToken(rawToken);

        await db
            .delete(schemas.sessions)
            .where(eq(schemas.sessions.tokenHash, tokenHash));
    }

    /**
     * Purges expired magic link tokens and sessions from PostgreSQL.
     */
    async cleanupExpired(): Promise<{ deletedMagicTokens: number; deletedSessions: number }> {
        const now = new Date();

        const deletedMagic = await db
            .delete(schemas.magicLinkTokens)
            .where(lt(schemas.magicLinkTokens.expiresAt, now))
            .returning({ id: schemas.magicLinkTokens.id });

        const deletedSess = await db
            .delete(schemas.sessions)
            .where(lt(schemas.sessions.expiresAt, now))
            .returning({ id: schemas.sessions.id });

        return {
            deletedMagicTokens: deletedMagic.length,
            deletedSessions: deletedSess.length,
        };
    }

    /**
     * Initiates passwordless authentication.
     * 1. Checks 60s cooldown to prevent email flooding.
     * 2. Generates a 256-bit random token and stores only its SHA-256 hash.
     * 3. Dispatches the magic link via Brevo.
     */
    async sendMagicLink(email: string): Promise<void> {
        const normalizedEmail = email.trim().toLowerCase();

        // 60-second rate-limit cooldown per email
        const cooldownThreshold = new Date(Date.now() - MAGIC_LINK_COOLDOWN_MS);
        const [recentToken] = await db
            .select({ id: schemas.magicLinkTokens.id })
            .from(schemas.magicLinkTokens)
            .where(
                and(
                    eq(schemas.magicLinkTokens.email, normalizedEmail),
                    gt(schemas.magicLinkTokens.createdAt, cooldownThreshold),
                ),
            )
            .limit(1);

        if (recentToken) {
            // Early return: client still receives identical 200 response to prevent enumeration
            return;
        }

        const rawToken = generateRandomToken(32);
        const tokenHash = hashToken(rawToken);
        const expiresAt = new Date(Date.now() + MAGIC_LINK_EXPIRATION_MS);

        await db.insert(schemas.magicLinkTokens).values({
            email: normalizedEmail,
            tokenHash,
            expiresAt,
        });

        const magicLink = `${env.CLIENT_URL}/auth/verify?token=${rawToken}`;

        await sendMagicLinkEmail({
            toEmail: normalizedEmail,
            magicLink,
        });
    }

    /**
     * Verifies a magic-link token.
     * 1. Hashes incoming token.
     * 2. Atomically marks usedAt = NOW() where usedAt IS NULL and expiresAt > NOW().
     * 3. Finds or creates the user in users table.
     * 4. Provisions a database session and returns user and session token.
     */
    async verifyMagicLink(rawToken: string): Promise<{ user: AuthUser; session: AuthSession; sessionToken: string }> {
        if (!rawToken || typeof rawToken !== "string") {
            throw ApiError.unauthorized("Verification token is required");
        }

        const tokenHash = hashToken(rawToken);

        // Atomic update ensures single-use even under concurrent clicks/scanners
        const [tokenRecord] = await db
            .update(schemas.magicLinkTokens)
            .set({ usedAt: new Date() })
            .where(
                and(
                    eq(schemas.magicLinkTokens.tokenHash, tokenHash),
                    isNull(schemas.magicLinkTokens.usedAt),
                    gt(schemas.magicLinkTokens.expiresAt, new Date()),
                ),
            )
            .returning();

        if (!tokenRecord) {
            throw ApiError.unauthorized("Invalid, expired, or already used magic link");
        }

        // Check if user exists
        const [existingUser] = await db
            .select()
            .from(schemas.users)
            .where(eq(schemas.users.email, tokenRecord.email))
            .limit(1);

        let user: AuthUser;

        if (existingUser) {
            user = existingUser;
        } else {
            // Provision new user with collision-free username
            const rawPrefix = tokenRecord.email.split("@")[0] ?? "user";
            const cleanPrefix = rawPrefix.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 15) || "user";
            const uniqueUsername = `${cleanPrefix}_${generateRandomToken(3)}`;
            const displayName = cleanPrefix.charAt(0).toUpperCase() + cleanPrefix.slice(1);

            const [newUser] = await db
                .insert(schemas.users)
                .values({
                    name: displayName,
                    username: uniqueUsername,
                    email: tokenRecord.email,
                })
                .returning();

            if (!newUser) {
                throw ApiError.internal("Failed to provision new user account");
            }

            user = newUser;
        }

        const { rawToken: sessionToken, session } = await this.createSession(user.id);

        return { user, session, sessionToken };
    }

    /**
     * Generates Google OAuth authorization URL and cryptographically secure state.
     */
    getGoogleAuthUrl(): { authUrl: string; state: string } {
        if (!env.GOOGLE_CLIENT_ID) {
            throw ApiError.badRequest("Google OAuth is not configured on the server. Missing GOOGLE_CLIENT_ID.");
        }

        const state = generateRandomToken(16);

        const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
        googleAuthUrl.searchParams.set("client_id", env.GOOGLE_CLIENT_ID);
        googleAuthUrl.searchParams.set("redirect_uri", env.GOOGLE_CALLBACK_URL);
        googleAuthUrl.searchParams.set("response_type", "code");
        googleAuthUrl.searchParams.set("scope", "openid email profile");
        googleAuthUrl.searchParams.set("state", state);
        googleAuthUrl.searchParams.set("access_type", "offline");
        googleAuthUrl.searchParams.set("prompt", "select_account");

        return { authUrl: googleAuthUrl.toString(), state };
    }

    /**
     * Handles Google OAuth callback:
     * 1. Validates state against stored cookie using timingSafeCompare (CSRF protection).
     * 2. Exchanges code for Google access token.
     * 3. Fetches user info from Google's OpenID endpoint.
     * 4. Maps account using Google's immutable sub identifier.
     * 5. Links to existing user if verified email matches, or creates new user & account.
     * 6. Creates a new database-backed session.
     */
    async handleGoogleCallback(params: {
        code: string;
        state: string;
        storedState?: string;
    }): Promise<{ user: AuthUser; sessionToken: string }> {
        const { code, state, storedState } = params;

        if (!state || !storedState || !timingSafeCompare(state, storedState)) {
            throw ApiError.badRequest("Invalid or expired OAuth state parameter");
        }

        if (!code) {
            throw ApiError.badRequest("Authorization code is missing");
        }

        if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
            throw ApiError.internal("Google OAuth credentials are missing on the server");
        }

        // Exchange authorization code for tokens
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                code,
                client_id: env.GOOGLE_CLIENT_ID,
                client_secret: env.GOOGLE_CLIENT_SECRET,
                redirect_uri: env.GOOGLE_CALLBACK_URL,
                grant_type: "authorization_code",
            }),
        });

        if (!tokenResponse.ok) {
            const errorDetails = await tokenResponse.text();
            console.error("[Google OAuth Token Exchange Error]:", errorDetails);
            throw ApiError.unauthorized("Failed to exchange authorization code with Google");
        }

        const tokenData = (await tokenResponse.json()) as { access_token: string };

        // Fetch verified profile from Google OpenID Userinfo
        const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        });

        if (!userInfoResponse.ok) {
            throw ApiError.unauthorized("Failed to fetch user profile from Google");
        }

        const googleProfile = (await userInfoResponse.json()) as GoogleUserInfo;

        if (!googleProfile.sub || !googleProfile.email) {
            throw ApiError.unauthorized("Google profile did not contain required identity attributes");
        }

        const normalizedEmail = googleProfile.email.trim().toLowerCase();

        // 1. Check if account with provider = 'google' and providerAccountId = sub already exists
        const [existingAccount] = await db
            .select()
            .from(schemas.accounts)
            .where(
                and(
                    eq(schemas.accounts.provider, "google"),
                    eq(schemas.accounts.providerAccountId, googleProfile.sub),
                ),
            )
            .limit(1);

        let user: AuthUser;

        if (existingAccount) {
            // Existing Google account, find linked user
            const [userRecord] = await db
                .select()
                .from(schemas.users)
                .where(eq(schemas.users.id, existingAccount.userId))
                .limit(1);

            if (!userRecord) {
                throw ApiError.unauthorized("User account linked to this Google profile was not found");
            }

            user = userRecord;
        } else {
            // 2. Account not found: check if user exists with the same email
            const [userWithEmail] = await db
                .select()
                .from(schemas.users)
                .where(eq(schemas.users.email, normalizedEmail))
                .limit(1);

            if (userWithEmail) {
                // Link account to existing user (only when Google confirms email is verified)
                if (googleProfile.email_verified === false) {
                    throw ApiError.forbidden("Google email is unverified. Account linking refused.");
                }

                user = userWithEmail;
            } else {
                // 3. New user signup
                const displayName = googleProfile.name?.trim() || normalizedEmail.split("@")[0] || "User";
                const rawPrefix = (googleProfile.name || normalizedEmail.split("@")[0] || "user")
                    .toLowerCase()
                    .replace(/[^a-z0-9_]/g, "")
                    .slice(0, 15) || "user";
                const uniqueUsername = `${rawPrefix}_${generateRandomToken(3)}`;

                const [newUser] = await db
                    .insert(schemas.users)
                    .values({
                        name: displayName,
                        username: uniqueUsername,
                        email: normalizedEmail,
                    })
                    .returning();

                if (!newUser) {
                    throw ApiError.internal("Failed to create user account");
                }

                user = newUser;
            }

            // Create account mapping using Google's immutable sub identifier (not email)
            await db.insert(schemas.accounts).values({
                userId: user.id,
                provider: "google",
                providerAccountId: googleProfile.sub,
            });
        }

        const { rawToken: sessionToken } = await this.createSession(user.id);

        return { user, sessionToken };
    }
}

export const authService = new AuthService();
