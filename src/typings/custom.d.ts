declare module '*.vue' {
  import type { ComponentOptions } from 'vue'
  const Component: ComponentOptions
  export default Component
}

declare module '*.md' {
  import type { ComponentOptions } from 'vue'
  const Component: ComponentOptions
  export default Component
}

type LocaleValue =
  | 'zh-cn'
  | 'zh-tw'
  | 'de'
  | 'en'
  | 'fr'
  | 'ja'
  | 'ko'
  | 'nl'
  | 'ru'

interface LocaleItem {
  lable: string
  icon?: string
  value: LocaleValue
}

interface EditionItem {
  version: string
  edition: string[][]
}

interface RecordItem {
  id: number
  host: string
  port: number
  total: number
  success: number
  fail: number
  delay: number
  rate: number
  updatedAt: Date
  createdAt: Date
}

interface ActivateFormData {
  edition: string
  arch: string
  host: string
  license: string
}
