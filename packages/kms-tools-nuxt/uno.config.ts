// uno.config.ts
import { defineConfig, presetUno, presetIcons, presetAttributify } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  // ...UnoCSS options
  presets: [presetUno(), presetIcons(), presetAttributify()],
  transformers: [transformerDirectives()],
})
