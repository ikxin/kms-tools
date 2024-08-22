import fetch from '@/utils/fetch'

export const useMonitorStore = defineStore('monitor', () => {
  const monitors = useStorage<RecordItem[]>('monitors', [])

  const getMonitors = async () => {
    try {
      const { data } = await fetch('/api/server')
      data.sort((prev: { rate: number }, next: { rate: number }) => {
        return next.rate - prev.rate
      })
      monitors.value = data
    } catch (err) {
      console.log(err)
    }
  }

  return { getMonitors, monitors }
})
