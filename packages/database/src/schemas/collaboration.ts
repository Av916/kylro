import { bigint, index, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { users } from "./user";
import { workspaces } from "./workspace";
import { projects } from "./project";
import { workspaceRoleEnum } from "./workspace-member";

export const workspaceInvitations = pgTable("workspace_invitations", {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: workspaceRoleEnum("role").notNull().default("member"),
    invitedBy: uuid("invited_by").references(() => users.id, { onDelete: "set null" }),
    tokenHash: text("token_hash").notNull().unique(),
    status: text("status").notNull().default("pending"),
    deliveryStatus: text("delivery_status").notNull().default("sending"),
    expiresAt: timestamp("expires_at").notNull(),
    acceptedAt: timestamp("accepted_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, t => [unique("workspace_invitation_email_unique").on(t.workspaceId, t.email)]);

export const notifications = pgTable("notifications", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    href: text("href").notNull(),
    readAt: timestamp("read_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
}, t => [index("notifications_user_created_idx").on(t.userId, t.createdAt)]);

// A transactional, per-user change cursor. SSE uses this across API processes.
export const userUpdates = pgTable("user_updates", {
    userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
    revision: bigint("revision", { mode: "bigint" }).notNull().default(0n),
});
