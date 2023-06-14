// uno.config.ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  presets: [presetAttributify(), presetUno(), presetIcons()],
  transformers: [transformerDirectives()],
})
