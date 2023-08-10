import { platform } from 'os'
import { execFile, ExecFileException } from 'child_process'

const getData = formData => {
  const { domain, port, protocol, software } = formData
  return new Promise<{
    error: ExecFileException | null
    stdout: string
    stderr: string
  }>(resolve => {
    execFile(
      `./service/vlmcs/vlmcs-${platform()}`,
      [`${domain}:${port}`, `-${protocol}`, `-l ${software}`],
      { timeout: 5 * 1000 },
      (error, stdout, stderr) => resolve({ error, stdout, stderr }),
    )
  })
}

const server = Bun.serve({
  async fetch(req) {
    const url = new URL(req.url)
    if (url.pathname === '/api/kms/check') {
      const formData = Object.fromEntries(await req.formData())
      const { error, stdout, stderr } = await getData(formData)
      if (error === null) {
        return new Response(JSON.stringify({ type: 'success', message: stdout }))
      } else {
        return new Response(JSON.stringify({ type: 'error', message: stderr || stdout }))
      }
    }
  },
})

console.log(`Server running at http://localhost:${server.port}`)
