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

type LocaleValue = 'zh-cn' | 'en'

interface LocaleItem {
  lable: string
  icon?: string
  value: LocaleValue
}
