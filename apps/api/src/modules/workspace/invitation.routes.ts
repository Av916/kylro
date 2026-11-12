import { Router, type RequestHandler } from "express";
import { z } from "zod";
import { validateRequest } from "../../shared/middlewares/validateRequest.js";
import ApiResponse from "../../shared/utils/ApiResponse.js";
import { requireAuth } from "../auth/auth.middleware.js";
import { authService } from "../auth/auth.service.js";
import { invitationService } from "./invitation.service.js";
import { workspaceIdSchema } from "./workspace.validation.js";
const handle = (fn: RequestHandler): RequestHandler => (req, res, next) => { Promise.resolve(fn(req, res, next)).catch(next); };
const tokenParams = z.object({ token: z.string().regex(/^[a-f0-9]{64}$/) });
export const invitationPublicRoutes: Router = Router();
invitationPublicRoutes.use((_req, res, next) => { res.setHeader("Cache-Control", "no-store"); res.setHeader("Referrer-Policy", "no-referrer"); next(); });
invitationPublicRoutes.get("/:token", validateRequest({ params: tokenParams }), handle(async (req, res) => {
    ApiResponse.success(res, "Invitation retrieved", await invitationService.preview(String(req.params.token)));
}));
invitationPublicRoutes.post("/:token/sign-in", validateRequest({ params: tokenParams }), handle(async (req, res) => {
    const token = String(req.params.token);
    const invite = await invitationService.preview(token);
    await authService.sendMagicLink(invite.email, `/invitations?token=${token}`);
    ApiResponse.success(res, "Check your email for a sign-in link");
}));
invitationPublicRoutes.post("/:token/accept", requireAuth, validateRequest({ params: tokenParams }), handle(async (req, res) => {
    ApiResponse.success(res, "Invitation accepted", await invitationService.accept(req.user!.id, req.user!.email, String(req.params.token)));
}));
export const workspaceInvitationRoutes: Router = Router();
workspaceInvitationRoutes.get("/:workspaceId/invitations", validateRequest({ params: workspaceIdSchema }), handle(async (req, res) => {
    ApiResponse.success(res, "Invitations retrieved", await invitationService.list(req.user!.id, String(req.params.workspaceId)));
}));
workspaceInvitationRoutes.post("/:workspaceId/invitations", validateRequest({ params: workspaceIdSchema, body: z.object({ email: z.string().trim().email().toLowerCase().max(254), role: z.enum(["admin", "member", "viewer"]).default("member") }) }), handle(async (req, res) => {
    ApiResponse.created(res, "Invitation sent", await invitationService.send(req.user!.id, String(req.params.workspaceId), req.body.email, req.body.role));
}));
workspaceInvitationRoutes.delete("/:workspaceId/invitations/:invitationId", validateRequest({ params: workspaceIdSchema.extend({ invitationId: z.string().uuid() }) }), handle(async (req, res) => {
    await invitationService.revoke(req.user!.id, String(req.params.workspaceId), String(req.params.invitationId));
    ApiResponse.noContent(res);
}));
