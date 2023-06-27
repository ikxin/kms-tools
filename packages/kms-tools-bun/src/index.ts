import { Elysia } from 'elysia'
import { platform } from 'os'
import { execFile } from 'child_process'

const server = new Elysia()

server.get('/*', () => 'KMS Tools')

type Body = {
  port: string
  host: string
  domain: string
  app: string
  protocol: '4' | '5' | '6'
}

server.post('/api/check-kms', async context => {
  if (platform() !== 'linux' && platform() !== 'darwin') return

  let { host, port, domain, app, protocol } = context.body as Body

  const getResult = () => {
    return new Promise(resolve => {
      execFile(
        `./src/vlmcs/vlmcs-${platform()}`,
        [
          `-${['4', '5', '6'].includes(protocol) ? protocol : '6'}`,
          `${domain || host}:${port}`,
          `${app === '' ? '' : '-l ' + app}`
        ],
        {
          timeout: 5000
        },
        (err, std) => {
          if (err) {
            resolve({ msg: 'error', result: std.toString() })
          }
          if (std) {
            resolve({ msg: 'success', result: std.toString() })
          }
        }
      )
    })
  }

  return await getResult()
})

server.listen(8080)

console.log(`🦊 Elysia is running at ${server.server.hostname}:${server.server.port}`)
