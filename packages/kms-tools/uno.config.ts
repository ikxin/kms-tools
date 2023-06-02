// uno.config.ts
import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetAttributify(), presetUno(), presetIcons()],
  theme: {
    width: {
      container: '1080px',
    },
  },
})
