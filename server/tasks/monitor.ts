export default defineTask({
  meta: {
    name: 'monitor',
    description: 'Run KMS server monitoring.',
  },
  async run() {
    const results = await Promise.all(
      monitorList.map(async host => {
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
          delay,
        })

        await storage.setItem<MonitorData[]>(`${host}.json`, monitorData)

        return { host, status }
      }),
    )

    const count = results.filter(item => {
      if (!item.status) {
        console.log('Monitor failed:', item.host)
      }
      return item.status
    }).length

    console.log(
      new Date().toISOString(),
      `Monitor task completed, successful: ${count}`,
    )

    return { result: 'Done' }
  },
})
