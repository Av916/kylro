import type { NextFunction, Request, Response } from "express";
import ApiError from "../../shared/utils/ApiError.js";
import { authService, getSessionCookieOptions, SESSION_COOKIE_NAME } from "./auth.service.js";

/**
 * Authentication middleware that enforces an active, valid session.
 * 1. Reads the session cookie.
 * 2. Hashes the raw token and checks sessions + users tables.
 * 3. Rejects invalid or expired sessions with 401 Unauthorized.
 * 4. Attaches the loaded user to req.user and session to req.session.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const rawToken = req.cookies?.[SESSION_COOKIE_NAME];

        if (!rawToken) {
            throw ApiError.unauthorized("Authentication required");
        }

        const authData = await authService.validateSession(rawToken);

        if (!authData) {
            res.clearCookie(SESSION_COOKIE_NAME, getSessionCookieOptions());
            throw ApiError.unauthorized("Session expired or invalid");
        }

        req.user = authData.user;
        req.session = authData.session;

        next();
    } catch (err) {
        next(err);
    }
}

/**
 * Optional authentication middleware:
 * Attaches user and session to Request if a valid cookie is present,
 * but allows the request to proceed if unauthenticated.
 */
export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
        const rawToken = req.cookies?.[SESSION_COOKIE_NAME];

        if (rawToken) {
            const authData = await authService.validateSession(rawToken);
            if (authData) {
                req.user = authData.user;
                req.session = authData.session;
            }
        }

        next();
    } catch {
        // If anything fails in optional auth, continue as guest
        next();
    }
}
