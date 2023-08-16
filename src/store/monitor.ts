import axios from 'axios'
import dayjs from 'dayjs'
import { Notification } from '@arco-design/web-vue'

export const useMonitorStore = defineStore('monitor', () => {
  const apiUrl = 'https://api.uptimerobot.com/v2/getMonitors'
  const apiKey = ['m794366630-4128d6474ac33847941241ec', 'm790633514-8e1d658a806daa670799a6f5']

  const timestamps = Array.from({ length: 120 }, (_, num) => {
    return (
      dayjs().startOf('day').subtract(num, 'day').unix() +
      '_' +
      dayjs().startOf('day').subtract(num, 'day').endOf('day').unix()
    )
  }).reverse()

  const loading = ref(false)
  const monitors = useStorage('monitors', [])

  const getMonitors = async () => {
    loading.value = true
    const _monitors = []
    if (monitors.value.length !== 0) {
      loading.value = false
      return
    }
    for (const api_key of apiKey) {
      try {
        const { data } = await axios.post(apiUrl, {
          api_key,
          custom_uptime_ranges: timestamps.join('-'),
        })
        _monitors.push(...data.monitors)
      } catch ({ code, message }) {
        Notification.error({ title: code, content: message })
        loading.value = false
      }
    }
    monitors.value = _monitors
    loading.value = false
  }

  return { getMonitors, loading, monitors }
})
