import {
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { issues } from "./issue";
import { users } from "./user";

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),

  issueId: uuid("issue_id")
    .notNull()
    .references(() => issues.id, {
      onDelete: "cascade",
    }),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  content: text("content").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});