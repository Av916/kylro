import { and, db, eq, schemas, sql } from "@kylro/database";
import ApiError from "../../shared/utils/ApiError.js";
import { generateRandomToken, hashToken } from "../../shared/utils/crypto.js";
import { sendInvitationEmail } from "../../shared/utils/email.js";
import { workspaceService } from "./workspace.service.js";
import env from "../../shared/config/env.js";

type InviteRole = "admin" | "member" | "viewer";
const fields = { id: schemas.workspaceInvitations.id, email: schemas.workspaceInvitations.email, role: schemas.workspaceInvitations.role, status: schemas.workspaceInvitations.status, deliveryStatus: schemas.workspaceInvitations.deliveryStatus, expiresAt: schemas.workspaceInvitations.expiresAt, createdAt: schemas.workspaceInvitations.createdAt };
async function manage(userId: string, workspaceId: string) {
    const ws = await workspaceService.getWorkspace(userId, workspaceId);
    if (ws.role !== "owner" && ws.role !== "admin") throw ApiError.forbidden("Only owners and admins can invite members");
    return ws;
}
export const invitationService = {
    async list(userId: string, workspaceId: string) {
        await manage(userId, workspaceId);
        return db.select(fields).from(schemas.workspaceInvitations).where(eq(schemas.workspaceInvitations.workspaceId, workspaceId)).orderBy(schemas.workspaceInvitations.createdAt);
    },
    async send(userId: string, workspaceId: string, email: string, role: InviteRole) {
        const workspace = await manage(userId, workspaceId);
        if (role === "admin" && workspace.role !== "owner") throw ApiError.forbidden("Only the owner can invite admins");
        const normalized = email.trim().toLowerCase();
        const rawToken = generateRandomToken();
        const tokenHash = hashToken(rawToken);
        const invitation = await db.transaction(async tx => {
            // Serializes sends for a workspace: duplicate requests cannot bypass the cooldown.
            await tx.select({ id: schemas.workspaces.id }).from(schemas.workspaces).where(eq(schemas.workspaces.id, workspaceId)).for("update");
            const [access] = await tx.select().from(schemas.workspaceMembers).where(and(eq(schemas.workspaceMembers.workspaceId, workspaceId), eq(schemas.workspaceMembers.userId, userId)));
            if (!access || !["owner", "admin"].includes(access.role) || (role === "admin" && access.role !== "owner")) throw ApiError.forbidden("Your invitation permissions have changed");
            const [member] = await tx.select({ id: schemas.users.id }).from(schemas.workspaceMembers).innerJoin(schemas.users, eq(schemas.users.id, schemas.workspaceMembers.userId)).where(and(eq(schemas.workspaceMembers.workspaceId, workspaceId), sql`lower(${schemas.users.email}) = ${normalized}`));
            if (member) throw ApiError.conflict("This person is already a workspace member");
            const [existing] = await tx.select().from(schemas.workspaceInvitations).where(and(eq(schemas.workspaceInvitations.workspaceId, workspaceId), eq(schemas.workspaceInvitations.email, normalized)));
            if (existing?.role === "admin" && access.role !== "owner") throw ApiError.forbidden("Only the owner can manage admin invitations");
            if (existing && Date.now() - existing.updatedAt.getTime() < 60_000) throw new ApiError(429, "Please wait one minute before resending this invitation");
            const recent = await tx.select({ count: sql<number>`count(*)::int` }).from(schemas.workspaceInvitations).where(and(eq(schemas.workspaceInvitations.workspaceId, workspaceId), sql`${schemas.workspaceInvitations.updatedAt} > now() - interval '1 hour'`));
            if ((recent[0]?.count || 0) >= 50) throw new ApiError(429, "Invitation limit reached. Try again later.");
            const values = { workspaceId, email: normalized, role, invitedBy: userId, tokenHash, status: "pending", deliveryStatus: "sending", expiresAt: new Date(Date.now() + 7 * 86400_000), acceptedAt: null, updatedAt: new Date() };
            const [row] = await tx.insert(schemas.workspaceInvitations).values(values).onConflictDoUpdate({ target: [schemas.workspaceInvitations.workspaceId, schemas.workspaceInvitations.email], set: values }).returning(fields);
            return row!;
        });
        try {
            const url = new URL("/invitations", env.CLIENT_URL); url.searchParams.set("token", rawToken);
            await sendInvitationEmail({ toEmail: normalized, workspaceName: workspace.name, role, invitationLink: url.toString() });
            await db.update(schemas.workspaceInvitations).set({ deliveryStatus: "sent" }).where(and(eq(schemas.workspaceInvitations.id, invitation.id), eq(schemas.workspaceInvitations.tokenHash, tokenHash), eq(schemas.workspaceInvitations.status, "pending")));
            return { ...invitation, deliveryStatus: "sent" };
        } catch (error) {
            await db.update(schemas.workspaceInvitations).set({ deliveryStatus: "failed" }).where(and(eq(schemas.workspaceInvitations.id, invitation.id), eq(schemas.workspaceInvitations.tokenHash, tokenHash)));
            throw error;
        }
    },
    async revoke(userId: string, workspaceId: string, invitationId: string) {
        const ws = await manage(userId, workspaceId);
        await db.transaction(async tx => {
            const [invite] = await tx.select().from(schemas.workspaceInvitations).where(and(eq(schemas.workspaceInvitations.id, invitationId), eq(schemas.workspaceInvitations.workspaceId, workspaceId))).for("update");
            if (!invite) throw ApiError.notFound("Invitation not found");
            if (invite.role === "admin" && ws.role !== "owner") throw ApiError.forbidden("Only the owner can revoke admin invitations");
            if (invite.status !== "pending") throw ApiError.conflict("This invitation is no longer pending");
            await tx.update(schemas.workspaceInvitations).set({ status: "revoked", updatedAt: new Date() }).where(eq(schemas.workspaceInvitations.id, invitationId));
        });
    },
    async preview(token: string) {
        const [invite] = await db.select({ ...fields, workspaceName: schemas.workspaces.name, workspaceId: schemas.workspaces.id }).from(schemas.workspaceInvitations).innerJoin(schemas.workspaces, eq(schemas.workspaces.id, schemas.workspaceInvitations.workspaceId)).where(eq(schemas.workspaceInvitations.tokenHash, hashToken(token)));
        if (!invite) throw ApiError.notFound("This invitation is invalid or has been replaced by a newer invitation");
        if (invite.status !== "pending" || invite.expiresAt <= new Date() || invite.deliveryStatus !== "sent") throw new ApiError(410, "This invitation has expired, was revoked, or has already been accepted. Ask an admin for a new invitation.");
        return invite;
    },
    async accept(userId: string, email: string, token: string) {
        return db.transaction(async tx => {
            const [invite] = await tx.select().from(schemas.workspaceInvitations).where(eq(schemas.workspaceInvitations.tokenHash, hashToken(token))).for("update");
            if (!invite) throw ApiError.notFound("Invitation not found");
            if (invite.email !== email.trim().toLowerCase()) throw ApiError.forbidden("Sign in with the email address this invitation was sent to");
            if (invite.status !== "pending" || invite.expiresAt <= new Date() || invite.deliveryStatus !== "sent") throw new ApiError(410, "This invitation is no longer available");
            // Existing memberships are never escalated by an old invitation.
            await tx.insert(schemas.workspaceMembers).values({ workspaceId: invite.workspaceId, userId, role: invite.role }).onConflictDoNothing();
            await tx.update(schemas.workspaceInvitations).set({ status: "accepted", acceptedAt: new Date(), updatedAt: new Date() }).where(eq(schemas.workspaceInvitations.id, invite.id));
            return { workspaceId: invite.workspaceId };
        });
    },
};
