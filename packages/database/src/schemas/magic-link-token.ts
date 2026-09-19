import {
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const magicLinkTokens = pgTable("magic_link_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),

  email: text("email").notNull(),

  tokenHash: text("token_hash").notNull().unique(),

  usedAt: timestamp("used_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  expiresAt: timestamp("expires_at").notNull(),
});