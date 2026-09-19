import { pgTable, text } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: text("a").primaryKey().unique(),
    username: text("user_name").unique(),
    password: text("password"),
})