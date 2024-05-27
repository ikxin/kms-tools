import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const logs = sqliteTable('logs', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  server: text('server').notNull(),
  status: integer('status', { mode: 'boolean' }).notNull(),
  delay: integer('delay').notNull(),
  createdAt: integer('created_at').notNull(),
})
