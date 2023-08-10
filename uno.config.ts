import { defineConfig, presetAttributify, presetIcons, presetUno, transformerDirectives } from 'unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'

export default defineConfig({
  presets: [
    presetAttributify(),
    presetUno(),
    presetIcons({
      collections: {
        icons: FileSystemIconLoader('./src/assets/icons/others'),
        languages: FileSystemIconLoader('./src/assets/icons/languages'),
      },
    }),
  ],
  transformers: [transformerDirectives()],
})
