import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'

export const domain = sqliteTable('domain', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  domain: text('domain').unique().notNull(),
})

export const log = sqliteTable('log', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  domainId: integer('domain_id').references(() => domain.id),
  delay: integer('delay', { mode: 'number' }),
  status: integer('status', { mode: 'boolean' }),
  timestamp: integer('timestamp', { mode: 'timestamp_ms' }),
})
