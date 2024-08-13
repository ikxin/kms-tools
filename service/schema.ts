import {
  boolean,
  float,
  int,
  mysqlTable,
  text,
  timestamp,
} from 'drizzle-orm/mysql-core'

export const serviceTable = mysqlTable('service', {
  id: int('id').autoincrement().primaryKey(),
  domain: text('domain').notNull(),
  port: int('port').notNull().default(1688),
  total: int('total').notNull().default(0),
  success: int('success').notNull().default(0),
  fail: int('fail').notNull().default(0),
  successRate: float('success_rate').notNull().default(0),
  recentSuccessRate: float('recent_success_rate').notNull().default(0),
  averageDelay: float('average_delay').notNull().default(0),
  updatedAt: timestamp('updated_at'),
  createdAt: timestamp('created_at'),
})

export const logsTable = mysqlTable('logs', {
  id: int('id').autoincrement().primaryKey(),
  domain: text('domain').notNull(),
  delay: int('delay').notNull().default(0),
  content: text('content'),
  status: boolean('status').notNull().default(false),
  createdAt: timestamp('created_at').notNull(),
})
