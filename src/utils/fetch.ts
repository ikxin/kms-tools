import axios, { AxiosResponse } from 'axios'
import { Notification } from '@arco-design/web-vue'

const fetch = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'https://kms.ikxin.com',
  timeout: 10 * 1000,
})

fetch.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err: Error) => {
    Notification.error({ title: 'Error', content: String(err).trim() })
  },
)

export default fetch
