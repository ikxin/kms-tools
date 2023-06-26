import { Elysia } from 'elysia'

import { arch, platform } from 'os'

import { execFileSync } from 'child_process'

const app = new Elysia()

app.get('/', () => 'KMS Tools')

app.post('/api/check-kms', ({ body }) => {
  console.log(arch(), platform())
  const result = execFileSync('./src/files/vlmcs-darwin', [body.host])

  return result.toString()
})

app.listen(8080)

console.log(`🦊 Elysia is running at ${app.server.hostname}:${app.server.port}`)
