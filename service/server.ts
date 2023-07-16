import { createServer } from 'http'
import { platform } from 'os'
import { execFile } from 'child_process'

const getResult = body => {
  const { port, host, app, protocol } = body

  return new Promise(resolve => {
    execFile(
      `./vlmcs/vlmcs-${platform()}`,
      [
        `-${['4', '5', '6'].includes(protocol) ? protocol : '6'}`,
        `${host}:${port}`,
        `${app === '' ? '' : '-l ' + app}`
      ],
      { timeout: 5000 },
      (err, std) => {
        if (err) {
          resolve({ msg: 'error', result: std.toString() })
        } else {
          resolve({ msg: 'success', result: std.toString() })
        }
      }
    )
  })
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)

  const body = Object.fromEntries(url.searchParams)

  if (url.pathname === '/check') {
    res.end(JSON.stringify(await getResult(body)))
  } else {
    res.end('KMS Tools')
  }
})

server.listen(3000, () => console.log('Server running at http://localhost:3000/'))
