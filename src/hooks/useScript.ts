import { Message } from '@arco-design/web-vue'

export function useScript() {
  function useScriptDownload(script, fileName) {
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

  function useScriptCopy(script) {
    navigator.clipboard
      .writeText(script)
      .then(() => {
        Message.success('复制成功')
      })
      .catch((error) => {
        Message.error(error)
      })
  }

  return {
    useScriptDownload,
    useScriptCopy,
  }
}
