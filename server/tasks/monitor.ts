export default defineTask({
  meta: {
    name: 'monitor',
    description: 'Run KMS server monitoring.',
  },
  async run() {
    let monitorData: Record<string, any[]> =
      (await useStorage<{}>().getItem('monitorData')) || {}

    if (Object.keys(monitorData).length === 0) {
      monitorData = monitorList.reduce((acc, host) => {
        acc[host] = []
        return acc
      }, {} as Record<string, any[]>)
    }

    for (const host of monitorList) {
      const { status, delay } = await runVlmcs({ host })

      if (!monitorData[host]) {
        monitorData[host] = []
      }

      monitorData[host].push({
        time: Date.now(),
        status,
        delay,
      })

      if (monitorData[host].length > 100) {
        monitorData[host].shift()
      }
    }

    await useStorage().setItem('monitorData', monitorData)

    return { result: 'Done' }
  },
})
