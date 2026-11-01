import { and, desc, eq, notInArray } from 'drizzle-orm'
import { monitorRecords, servers } from '../database/schema'
import { getD1Database, type KmsDatabase } from '../utils/database'

const monitorRecordLimit = 120

const runD1Monitor = async (database: KmsDatabase) => {
  const monitoredServers = await database
    .select()
    .from(servers)
    .where(eq(servers.enabled, true))
  const checkedAt = new Date()

  for (const server of monitoredServers) {
    const { status, delay } = await runVlmcs({
      host: server.host,
      port: server.port
    })
    const retainedRecords = database
      .select({ id: monitorRecords.id })
      .from(monitorRecords)
      .where(eq(monitorRecords.serverId, server.id))
      .orderBy(desc(monitorRecords.checkedAt), desc(monitorRecords.id))
      .limit(monitorRecordLimit)

    await database.batch([
      database.insert(monitorRecords).values({
        serverId: server.id,
        status,
        delay,
        checkedAt
      }),
      database
        .delete(monitorRecords)
        .where(
          and(
            eq(monitorRecords.serverId, server.id),
            notInArray(monitorRecords.id, retainedRecords)
          )
        )
    ])
  }
}

export default defineTask({
  meta: {
    name: 'monitor',
    description: 'Run KMS server monitoring.'
  },
  async run() {
    await runD1Monitor(getD1Database())

    return { result: 'Done' }
  }
})
