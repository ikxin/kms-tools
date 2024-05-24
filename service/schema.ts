import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const logs = sqliteTable("logs", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  createdAt: integer("created_at").notNull(),
});
