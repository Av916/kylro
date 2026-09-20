import { Router } from "express";
import { validateRequest } from "../../shared/middlewares/validateRequest.js";
import { requireAuth } from "./auth.middleware.js";
import { authController } from "./auth.controller.js";
import { requestMagicLinkSchema, verifyMagicLinkSchema } from "./auth.validator.js";

export const authRoutes: Router = Router();

// Passwordless Magic Link routes
authRoutes.post(
    "/magic-link",
    validateRequest({ body: requestMagicLinkSchema }),
    authController.requestMagicLink.bind(authController),
);

authRoutes.post(
    "/magic-link/verify",
    validateRequest({ body: verifyMagicLinkSchema }),
    authController.verifyMagicLink.bind(authController),
);

// Google OAuth 2.0 routes
authRoutes.get("/google", authController.initiateGoogleAuth.bind(authController));
authRoutes.get("/google/callback", authController.handleGoogleCallback.bind(authController));

// Authenticated session & profile routes
authRoutes.get("/me", requireAuth, authController.getMe.bind(authController));
authRoutes.post("/logout", authController.logout.bind(authController));

