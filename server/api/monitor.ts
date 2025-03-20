export default defineEventHandler(async () => {
  const results = await Promise.all(
    monitorList.map(async host => {
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
        data,
      }
    }),
  )

  // Sort by success rate and delay
  const sortedData = results.sort((a, b) => {
    const successRateA = a.success / a.total
    const successRateB = b.success / b.total

    return successRateB - successRateA || a.delay - b.delay
  })

  return results
})
