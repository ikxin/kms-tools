import axios from 'axios'
import dayjs from 'dayjs'
import { Notification } from '@arco-design/web-vue'

export const useMonitorStore = defineStore('monitor', () => {
  const apiUrl = 'https://api.uptimerobot.com/v2/getMonitors'

  const apiKey = ['m794366630-4128d6474ac33847941241ec', 'm794366608-72bc068b4b9b17ef4ed6485d']

  const timestamps = Array.from({ length: 120 }, (_, num) => {
    return (
      dayjs().startOf('day').subtract(num, 'day').unix() +
      '_' +
      dayjs().startOf('day').subtract(num, 'day').endOf('day').unix()
    )
  }).reverse()

  const monitorData = ref([])

  const getMonitorData = async () => {
    apiKey.forEach(async item => {
      try {
        const {
          data: { monitors = [] },
        } = await axios.post(apiUrl, {
          api_key: item,
          custom_uptime_ranges: timestamps.join('-'),
        })
        monitorData.value.push(...monitors)
      } catch ({ code, message }) {
        Notification.error({ title: code, content: message })
      }
    })
  }

  getMonitorData()

  return { monitorData }
})
