/// <reference types="vite/client" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

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
