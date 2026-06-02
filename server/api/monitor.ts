export default defineEventHandler(async () => {
  const results = await Promise.all(
    getMonitorList().map(async host => {
      let data = await storage.getItem<MonitorData[]>(`${host}.json`)

      if (!Array.isArray(data)) {
        data = []
      }

      const total = data.length

      const success = data.filter(({ status }) => status).length

      const fail = total - success

      const delay = data.reduce((acc, { delay }) => acc + delay, 0) / total

      return {
        host,
        total,
        success,
        fail,
        delay: delay ? Number(delay.toFixed(2)) : 0,
        data
      }
    })
  )

  const getSuccessRate = (item: (typeof results)[number]) => {
    return item.total ? item.success / item.total : 0
  }

  const sortedData = results.sort((a, b) => {
    return getSuccessRate(b) - getSuccessRate(a) || a.delay - b.delay
  })

  return sortedData
})
