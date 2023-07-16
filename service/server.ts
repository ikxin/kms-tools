import { platform } from 'os'
import { execFile } from 'child_process'

const fetchData = params => {
  return new Promise(resolve => {
    const { host, port, app, protocol } = params
    execFile(
      `./service/vlmcs/vlmcs-${platform()}`,
      [`-l ${app}`, `-${protocol}`, `${host}:${port}`],
      { timeout: 10 * 1000 },
      function (error, stdout) {
        resolve({ result: error ? 'error' : 'success', stdout: stdout.toString() })
      }
    )
  })
}

const server = Bun.serve({
  async fetch(req) {
    const url = new URL(req.url)
    if (url.pathname === '/api/kms-check') {
      const params = Object.fromEntries(url.searchParams)
      const result = await fetchData(params)
      return new Response(JSON.stringify(result))
    } else {
      return new Response(`404!`)
    }
  }
})

console.log(`Server running at http://localhost:${server.port}`)
