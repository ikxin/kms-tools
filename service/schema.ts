import {
  boolean,
  float,
  int,
  mysqlTable,
  text,
  timestamp,
} from 'drizzle-orm/mysql-core'

export const server = mysqlTable('server', {
  id: int('id').autoincrement().primaryKey(),
  host: text('host').notNull(),
  port: int('port').notNull().default(1688),
  total: int('total').notNull().default(0),
  success: int('success').notNull().default(0),
  fail: int('fail').notNull().default(0),
  delay: float('delay').notNull().default(0),
  rate: float('rate').notNull().default(0),
  rateAll: float('rate_all').notNull().default(0),
  updatedAt: timestamp('updated_at'),
  createdAt: timestamp('created_at'),
})

export const logs = mysqlTable('logs', {
  id: int('id').autoincrement().primaryKey(),
  host: text('host').notNull(),
  delay: int('delay').notNull().default(0),
  content: text('content'),
  status: boolean('status').notNull().default(false),
  createdAt: timestamp('created_at').notNull(),
})
