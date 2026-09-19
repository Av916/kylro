import {
    pgEnum,
    pgTable,
    timestamp,
    unique,
    uuid,
} from "drizzle-orm/pg-core";

import { users } from "./user";
import { projects } from "./project";

export const projectRoleEnum = pgEnum("project_role", [
    "owner",
    "admin",
    "member",
    "viewer",
]);

export const projectMembers = pgTable("project_members", {
    id: uuid("id").defaultRandom().primaryKey(),

    projectId: uuid("project_id")
        .notNull()
        .references(() => projects.id, {
            onDelete: "cascade",
        }),

    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, {
            onDelete: "cascade",
        }),

    role: projectRoleEnum("role")
        .default("member")
        .notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
},

    (table) => [
        unique("project_member_unique").on(
            table.projectId,
            table.userId,
        ),
    ],

);