import { Message } from '@arco-design/web-vue'

export function useScript() {
  const { t } = useI18n()

  const useScriptCopy = async (script: string) => {
    const { copy, copied } = useClipboard()
    await copy(script)
    copied.value ? Message.success(t('activate.message.success')) : Message.error(t('activate.message.error'))
  }

  const useScriptDownload = (script, fileName) => {
    const file = new File([script], fileName, { type: 'application/txt' })
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return {
    useScriptCopy,
    useScriptDownload
  }
}
