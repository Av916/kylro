import { Router, type RequestHandler } from "express";
import { z } from "zod";
import { and, db, eq, inArray, schemas, sql } from "@kylro/database";
import ApiError from "../../shared/utils/ApiError.js";
import ApiResponse from "../../shared/utils/ApiResponse.js";
import { validateRequest } from "../../shared/middlewares/validateRequest.js";
import { workspaceService } from "./workspace.service.js";
import { workspaceIdSchema } from "./workspace.validation.js";

export const workspaceDataRoutes: Router = Router();
const handle = (fn: RequestHandler): RequestHandler => (req, res, next) => { Promise.resolve(fn(req, res, next)).catch(next); };
const memberParams = workspaceIdSchema.extend({ userId: z.string().uuid() });
const role = z.enum(["admin", "member", "viewer"]);
async function manage(userId: string, workspaceId: string) {
    const ws = await workspaceService.getWorkspace(userId, workspaceId);
    if (ws.role !== "owner" && ws.role !== "admin") throw ApiError.forbidden("Only owners and admins can manage members");
    return ws;
}
workspaceDataRoutes.get("/:workspaceId/dashboard", validateRequest({ params: workspaceIdSchema }), handle(async (req, res) => {
    const workspaceId = String(req.params.workspaceId);
    const workspace = await workspaceService.getWorkspace(req.user!.id, workspaceId);
    const projects = await db.select({ id: schemas.projects.id, name: schemas.projects.name, workspaceId: schemas.projects.workspaceId, createdAt: schemas.projects.createdAt, updatedAt: schemas.projects.updatedAt, role: schemas.projectMembers.role })
        .from(schemas.projects).innerJoin(schemas.projectMembers, eq(schemas.projectMembers.projectId, schemas.projects.id))
        .where(and(eq(schemas.projects.workspaceId, workspaceId), eq(schemas.projectMembers.userId, req.user!.id)));
    const ids = projects.map(p => p.id);
    const [issues, projectMembers, members] = await Promise.all([
        ids.length ? db.select().from(schemas.issues).where(inArray(schemas.issues.projectId, ids)) : [],
        ids.length ? db.select({ projectId: schemas.projectMembers.projectId }).from(schemas.projectMembers).where(inArray(schemas.projectMembers.projectId, ids)) : [],
        db.select({ userId: schemas.users.id, name: schemas.users.name, email: schemas.users.email, role: schemas.workspaceMembers.role, createdAt: schemas.workspaceMembers.createdAt }).from(schemas.workspaceMembers)
            .innerJoin(schemas.users, eq(schemas.users.id, schemas.workspaceMembers.userId)).where(eq(schemas.workspaceMembers.workspaceId, workspaceId)),
    ]);
    ApiResponse.success(res, "Workspace retrieved", { workspace, projects: projects.map(p => ({ ...p, issueCount: issues.filter(i => i.projectId === p.id).length, memberCount: projectMembers.filter(m => m.projectId === p.id).length })), issues, members });
}));
workspaceDataRoutes.post("/:workspaceId/members", validateRequest({ params: workspaceIdSchema, body: z.object({ email: z.string().trim().email().toLowerCase(), role: role.default("member") }) }), handle(async (req, res) => {
    const workspaceId = String(req.params.workspaceId);
    const access = await manage(req.user!.id, workspaceId);
    if (req.body.role === "admin" && access.role !== "owner") throw ApiError.forbidden("Only the owner can appoint admins");
    const [user] = await db.select().from(schemas.users).where(sql`lower(${schemas.users.email}) = ${req.body.email}`).limit(1);
    if (!user) throw ApiError.notFound("No Kylro account has this email. Ask your teammate to sign up first.");
    const [member] = await db.insert(schemas.workspaceMembers).values({ workspaceId, userId: user.id, role: req.body.role }).onConflictDoNothing().returning();
    if (!member) throw ApiError.conflict("This person already belongs to the workspace");
    ApiResponse.created(res, "Member added", member);
}));
workspaceDataRoutes.patch("/:workspaceId/members/:userId", validateRequest({ params: memberParams, body: z.object({ role }) }), handle(async (req, res) => {
    const workspaceId = String(req.params.workspaceId), userId = String(req.params.userId);
    const access = await manage(req.user!.id, workspaceId);
    await db.transaction(async tx => {
        const [target] = await tx.select().from(schemas.workspaceMembers).where(and(eq(schemas.workspaceMembers.workspaceId, workspaceId), eq(schemas.workspaceMembers.userId, userId))).for("update");
        if (!target) throw ApiError.notFound("Member not found");
        if (target.role === "owner" || userId === req.user!.id) throw ApiError.forbidden("You cannot change this membership");
        if (access.role !== "owner" && (target.role === "admin" || req.body.role === "admin")) throw ApiError.forbidden("Only the owner can manage admins");
        await tx.update(schemas.workspaceMembers).set({ role: req.body.role, updatedAt: new Date() }).where(eq(schemas.workspaceMembers.id, target.id));
    });
    ApiResponse.success(res, "Role updated", null);
}));
workspaceDataRoutes.delete("/:workspaceId/members/:userId", validateRequest({ params: memberParams }), handle(async (req, res) => {
    const workspaceId = String(req.params.workspaceId), userId = String(req.params.userId);
    const access = await manage(req.user!.id, workspaceId);
    await db.transaction(async tx => {
        const [target] = await tx.select().from(schemas.workspaceMembers).where(and(eq(schemas.workspaceMembers.workspaceId, workspaceId), eq(schemas.workspaceMembers.userId, userId))).for("update");
        if (!target) throw ApiError.notFound("Member not found");
        if (target.role === "owner" || userId === req.user!.id || (target.role === "admin" && access.role !== "owner")) throw ApiError.forbidden("You cannot remove this member");
        const projects = await tx.select({ id: schemas.projects.id, role: schemas.projectMembers.role }).from(schemas.projects).innerJoin(schemas.projectMembers, eq(schemas.projectMembers.projectId, schemas.projects.id)).where(and(eq(schemas.projects.workspaceId, workspaceId), eq(schemas.projectMembers.userId, userId)));
        if (projects.some(p => p.role === "owner")) throw ApiError.conflict("This member owns a project. Its owner must delete that project before removal.");
        const ids = projects.map(p => p.id);
        if (ids.length) {
            await tx.update(schemas.issues).set({ assignedTo: null, updatedAt: new Date() }).where(and(inArray(schemas.issues.projectId, ids), eq(schemas.issues.assignedTo, userId)));
            await tx.delete(schemas.projectMembers).where(and(inArray(schemas.projectMembers.projectId, ids), eq(schemas.projectMembers.userId, userId)));
        }
        await tx.delete(schemas.workspaceMembers).where(eq(schemas.workspaceMembers.id, target.id));
    });
    ApiResponse.noContent(res);
}));
