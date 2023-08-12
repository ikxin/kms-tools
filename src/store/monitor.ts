import axios from 'axios'
import dayjs from 'dayjs'

export const useMonitorStore = defineStore('monitor', () => {
  const apiUrl = 'https://api.uptimerobot.com/v2/getMonitors'

  const apiKey = [
    'm794366630-4128d6474ac33847941241ec',
    // 'm794366608-72bc068b4b9b17ef4ed6485d',
    // 'm794366683-525bb3bcd660d58d54fd8045',
    // 'm791948435-e8e6c704d43fac76fb6cd3ea',
    // 'm794992994-7688fbdc23c247ff8f2cd07d',
  ]

  const timestamps = Array.from({ length: 120 }, (_, num) => {
    return (
      dayjs().startOf('day').subtract(num, 'day').unix() +
      '_' +
      dayjs().startOf('day').subtract(num, 'day').endOf('day').unix()
    )
  }).reverse()

  const data = ref([])

  const getMonitorData = async (api_key: string) => {
    return await axios.post(apiUrl, {
      api_key,
      custom_uptime_ranges: timestamps.join('-'),
    })
  }

  apiKey.forEach(async item => {
    data.value.push(await getMonitorData(item))
  })

  return { data }
})
