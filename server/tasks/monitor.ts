export default defineTask({
  meta: {
    name: 'monitor',
    description: 'Run KMS server monitoring.'
  },
  async run() {
    const monitorList = getMonitorList()
    const monitorStorage =
      (await storage.getItem<MonitorStorage>('monitor.json')) || {}
    const nextMonitorStorage: MonitorStorage = {}
    const now = Date.now()

    for (const host of monitorList) {
      let monitorData = monitorStorage[host]

      if (!Array.isArray(monitorData)) {
        monitorData = []
      }

      if (monitorData.length >= 120) {
        monitorData.shift()
      }

      const { status, delay } = await runVlmcs({ host })

      monitorData.push({
        status,
        time: now,
        delay
      })

      nextMonitorStorage[host] = monitorData
    }

    await storage.setItem<MonitorStorage>('monitor.json', nextMonitorStorage)

    return { result: 'Done' }
  }
})
