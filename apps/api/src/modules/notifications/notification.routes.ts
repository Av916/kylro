import { Router, type RequestHandler, type Response } from "express";
import { and, db, desc, eq, gt, isNull, schemas, sql } from "@kylro/database";
import { z } from "zod";
import { requireAuth } from "../auth/auth.middleware.js";
import { validateRequest } from "../../shared/middlewares/validateRequest.js";
import ApiError from "../../shared/utils/ApiError.js";
import ApiResponse from "../../shared/utils/ApiResponse.js";

export const notificationRoutes: Router = Router();
notificationRoutes.use(requireAuth);
notificationRoutes.use((_req, res, next) => { res.setHeader("Cache-Control", "no-store"); next(); });
const handle = (fn: RequestHandler): RequestHandler => (req, res, next) => { Promise.resolve(fn(req, res, next)).catch(next); };
// Membership is checked at read time as well as fan-out time to prevent stale access.
const visible = (userId: string) => and(eq(schemas.notifications.userId, userId), sql`exists (select 1 from ${schemas.workspaceMembers} wm where wm.workspace_id=${schemas.notifications.workspaceId} and wm.user_id=${userId})`, sql`(${schemas.notifications.projectId} is null or exists (select 1 from ${schemas.projectMembers} pm where pm.project_id=${schemas.notifications.projectId} and pm.user_id=${userId}))`);
notificationRoutes.get("/notifications", handle(async (req, res) => {
    const offset = Math.max(0, Math.min(10000, Number(req.query.offset) || 0));
    const [items, unread] = await Promise.all([
        db.select().from(schemas.notifications).where(visible(req.user!.id)).orderBy(desc(schemas.notifications.createdAt), desc(schemas.notifications.id)).limit(30).offset(Math.floor(offset)),
        db.select({ count: sql<number>`count(*)::int` }).from(schemas.notifications).where(and(visible(req.user!.id), isNull(schemas.notifications.readAt))),
    ]);
    ApiResponse.success(res, "Notifications retrieved", { items, unreadCount: unread[0]?.count || 0, nextOffset: items.length === 30 ? Math.floor(offset) + 30 : null });
}));
notificationRoutes.post("/notifications/read-all", handle(async (req, res) => {
    await db.update(schemas.notifications).set({ readAt: new Date() }).where(and(visible(req.user!.id), isNull(schemas.notifications.readAt)));
    ApiResponse.noContent(res);
}));
notificationRoutes.patch("/notifications/:id", validateRequest({ params: z.object({ id: z.string().uuid() }), body: z.object({ read: z.boolean() }) }), handle(async (req, res) => {
    const [item] = await db.update(schemas.notifications).set({ readAt: req.body.read ? new Date() : null }).where(and(eq(schemas.notifications.id, String(req.params.id)), visible(req.user!.id))).returning();
    if (!item) throw ApiError.notFound("Notification not found");
    ApiResponse.success(res, "Notification updated", item);
}));

const connections = new Map<string, Set<Response>>();
notificationRoutes.get("/events", (req, res) => {
    const userId = req.user!.id, sessionId = req.session!.id;
    const group = connections.get(userId) || new Set<Response>();
    if (group.size >= 5) { const oldest = group.values().next().value; oldest?.end(); }
    group.add(res); connections.set(userId, group);
    res.status(200).set({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", "Connection": "keep-alive", "X-Accel-Buffering": "no" });
    res.flushHeaders(); res.write("retry: 3000\n\n");
    let closed = false, revision = "", timer: ReturnType<typeof setTimeout> | undefined;
    res.on("close", () => { closed = true; if (timer) clearTimeout(timer); group.delete(res); if (!group.size) connections.delete(userId); });
    async function tick() {
        try {
            const [row] = await db.select({ revision: schemas.userUpdates.revision }).from(schemas.sessions).leftJoin(schemas.userUpdates, eq(schemas.userUpdates.userId, schemas.sessions.userId)).where(and(eq(schemas.sessions.id, sessionId), eq(schemas.sessions.userId, userId), gt(schemas.sessions.expiresAt, new Date()))).limit(1);
            if (closed) return;
            if (!row) { res.write('event: session-ended\ndata: {}\n\n'); res.end(); return; }
            const next = String(row.revision || 0);
            if (revision !== next) { res.write(`event: change\nid: ${next}\ndata: ${JSON.stringify({ revision: next })}\n\n`); revision = next; }
            else res.write(": heartbeat\n\n");
        } catch { if (!closed) { res.write('event: unavailable\ndata: {}\n\n'); res.end(); } return; }
        if (!closed) timer = setTimeout(() => void tick(), 2000);
    }
    void tick();
});
