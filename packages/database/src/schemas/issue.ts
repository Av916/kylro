import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { projects } from "./project";
import { users } from "./user";

export const issueStatusEnum = pgEnum("issue_status", [
  "todo",
  "in_progress",
  "done",
]);

export const issues = pgTable("issues", {
  id: uuid("id").defaultRandom().primaryKey(),

  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, {
      onDelete: "cascade",
    }),

  title: text("title").notNull(),

  description: text("description"),

  status: issueStatusEnum("status")
    .default("todo")
    .notNull(),

  assignedTo: uuid("assigned_to")
    .references(() => users.id, {
      onDelete: "set null",
    }),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});