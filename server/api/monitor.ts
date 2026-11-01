import { asc, eq, inArray } from 'drizzle-orm'
import { monitorRecords, servers } from '../database/schema'
import { getD1Database, type KmsDatabase } from '../utils/database'

interface MonitorEntry {
  host: string
  data: MonitorData[]
}

const summarizeMonitorEntries = (entries: MonitorEntry[]) => {
  const results = entries.map(({ host, data }) => {
    const total = data.length
    const success = data.filter(({ status }) => status).length
    const fail = total - success
    const averageDelay = total
      ? data.reduce((sum, item) => sum + item.delay, 0) / total
      : 0

    return {
      host,
      total,
      success,
      fail,
      delay: averageDelay ? Number(averageDelay.toFixed(2)) : 0,
      data
    }
  })

  const getSuccessRate = (item: (typeof results)[number]) => {
    return item.total ? item.success / item.total : 0
  }

  const sortedData = results.sort((a, b) => {
    return getSuccessRate(b) - getSuccessRate(a) || a.delay - b.delay
  })

  return sortedData
}

const getD1MonitorEntries = async (database: KmsDatabase) => {
  const monitoredServers = await database
    .select({
      id: servers.id,
      host: servers.host,
      port: servers.port
    })
    .from(servers)
    .where(eq(servers.enabled, true))

  const dataByServer = new Map<number, MonitorData[]>()

  if (monitoredServers.length) {
    const records = await database
      .select({
        serverId: monitorRecords.serverId,
        status: monitorRecords.status,
        delay: monitorRecords.delay,
        checkedAt: monitorRecords.checkedAt
      })
      .from(monitorRecords)
      .where(
        inArray(
          monitorRecords.serverId,
          monitoredServers.map(server => server.id)
        )
      )
      .orderBy(asc(monitorRecords.checkedAt), asc(monitorRecords.id))

    for (const record of records) {
      const data = dataByServer.get(record.serverId) || []

      data.push({
        status: record.status,
        time: record.checkedAt.getTime(),
        delay: record.delay
      })

      dataByServer.set(record.serverId, data)
    }
  }

  return monitoredServers.map(server => ({
    host: server.port === 1688 ? server.host : `${server.host}:${server.port}`,
    data: dataByServer.get(server.id) || []
  }))
}

export default defineEventHandler(async () => {
  const entries = await getD1MonitorEntries(getD1Database())

  return summarizeMonitorEntries(entries)
})
