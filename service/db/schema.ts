import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const record = sqliteTable("record", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  createdAt: integer("created_at").notNull(),
});
