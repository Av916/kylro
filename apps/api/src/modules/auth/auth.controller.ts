import type { NextFunction, Request, Response } from "express";
import env from "../../shared/config/env.js";
import ApiResponse from "../../shared/utils/ApiResponse.js";
import {
    authService,
    getOAuthStateCookieOptions,
    getSessionCookieOptions,
    OAUTH_STATE_COOKIE_NAME,
    SESSION_COOKIE_NAME,
} from "./auth.service.js";

export class AuthController {
    /**
     * Handles POST /api/auth/magic-link
     * Sends a magic sign-in link to the provided email.
     * Always returns an identical 200 response to prevent email enumeration.
     */
    async requestMagicLink(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email } = req.body as { email: string };
            await authService.sendMagicLink(email);

            ApiResponse.success(
                res,
                "If your email is registered or can receive sign-in links, a verification link has been sent.",
            );
        } catch (err) {
            next(err);
        }
    }

    /**
     * Handles POST /api/auth/magic-link/verify
     * Verifies the magic link token, provisions user if new,
     * creates database session, and sets the HttpOnly session cookie.
     */
    async verifyMagicLink(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const token = (req.body?.token ?? req.query?.token) as string;
            const { user, sessionToken } = await authService.verifyMagicLink(token);

            res.cookie(SESSION_COOKIE_NAME, sessionToken, getSessionCookieOptions());

            ApiResponse.success(res, "Authenticated successfully", { user });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Handles GET /api/auth/google
     * Generates a CSRF state token, sets a temporary state cookie,
     * and redirects the browser to Google OAuth 2.0 consent screen.
     */
    initiateGoogleAuth(_req: Request, res: Response, next: NextFunction): void {
        try {
            const { authUrl, state } = authService.getGoogleAuthUrl();

            res.cookie(OAUTH_STATE_COOKIE_NAME, state, getOAuthStateCookieOptions());
            res.redirect(authUrl);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Handles GET /api/auth/google/callback
     * Validates state, exchanges code for Google profile, links/provisions account,
     * sets session cookie, and redirects user to the frontend dashboard.
     */
    async handleGoogleCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const code = req.query.code as string | undefined;
            const state = req.query.state as string | undefined;
            const error = req.query.error as string | undefined;
            const storedState = req.cookies?.[OAUTH_STATE_COOKIE_NAME] as string | undefined;

            // Always clear the temporary state cookie
            res.clearCookie(OAUTH_STATE_COOKIE_NAME, getOAuthStateCookieOptions());

            // Handle user denial or Google error redirect
            if (error) {
                return res.redirect(`${env.CLIENT_URL}/login?error=${encodeURIComponent(error)}`);
            }

            if (!code || !state) {
                return res.redirect(`${env.CLIENT_URL}/login?error=invalid_callback_params`);
            }

            const { sessionToken } = await authService.handleGoogleCallback({
                code,
                state,
                storedState,
            });

            res.cookie(SESSION_COOKIE_NAME, sessionToken, getSessionCookieOptions());
            return res.redirect(`${env.CLIENT_URL}/workspace`);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Handles GET /api/auth/me
     * Returns the currently authenticated user profile.
     */
    getMe(req: Request, res: Response, _next: NextFunction): void {
        ApiResponse.success(res, "Profile retrieved successfully", {
            user: req.user,
        });
    }

    /**
     * Handles POST /api/auth/logout
     * Revokes the active database session and clears the session cookie.
     */
    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const rawToken = req.cookies?.[SESSION_COOKIE_NAME] as string | undefined;

            if (rawToken) {
                await authService.revokeSession(rawToken);
            }

            res.clearCookie(SESSION_COOKIE_NAME, getSessionCookieOptions());

            ApiResponse.success(res, "Logged out successfully");
        } catch (err) {
            next(err);
        }
    }
}

export const authController = new AuthController();
