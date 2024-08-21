import { count, eq, sql, sum } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema'
import { runVlmcs } from './utils'

const connection = await mysql.createConnection(
  Bun.env.DATABASE_URL || 'mysql://root:password@localhost:3306/database',
)

export const db = drizzle(connection, { schema, mode: 'default' })

export const runCheck = async () => {
  const servers = await db.query.server.findMany()
  if (Array.isArray(servers) && servers?.length > 0) {
    for await (const item of servers) {
      const result = await runVlmcs({
        host: item.host,
        port: item.port,
      })
      await db.insert(schema.logs).values({
        ...result,
        createdAt: new Date(),
      })
    }

    const result = await db
      .select({
        host: schema.logs.host,
        total: count(),
        success: sum(eq(schema.logs.status, true)).mapWith(Number),
        fail: sum(eq(schema.logs.status, false)).mapWith(Number),
        delay: sql<number>`avg(case when ${schema.logs.status} = true then ${schema.logs.delay} else null end)`,
      })
      .from(schema.logs)
      .groupBy(schema.logs.host)

    for await (const item of result) {
      const { host, total, success, fail, delay } = item

      await db
        .update(schema.server)
        .set({
          total,
          success,
          fail,
          delay: Number(delay),
          rate: Number((success / total).toFixed(4)),
          updatedAt: new Date(),
        })
        .where(eq(schema.server.host, host))
    }
  }
}
