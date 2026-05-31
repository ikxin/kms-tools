export default defineTask({
  meta: {
    name: 'monitor',
    description: 'Run KMS server monitoring.'
  },
  async run() {
    for (const host of getMonitorList()) {
      let monitorData = await storage.getItem<MonitorData[]>(`${host}.json`)

      if (!Array.isArray(monitorData)) {
        monitorData = []
      }

      if (monitorData.length >= 120) {
        monitorData.shift()
      }

      const { status, delay } = await runVlmcs({ host })

      monitorData.push({
        status,
        time: Date.now(),
        delay
      })

      await storage.setItem<MonitorData[]>(`${host}.json`, monitorData)
    }

    return { result: 'Done' }
  }
})
