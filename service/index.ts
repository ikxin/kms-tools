import { $ } from 'bun'
import { arch, platform } from 'os'
import { Elysia } from 'elysia'
import { execFile } from 'child_process'
import { staticPlugin } from '@elysiajs/static'
import { cors } from '@elysiajs/cors'
import { cron, Patterns } from '@elysiajs/cron'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema'

const connection = await mysql.createConnection(
  Bun.env.DATABASE_URL || 'mysql://root:password@localhost:3306/database',
)

const db = drizzle(connection, { schema, mode: 'default' })

export type RunVlmcsType = {
  domain: string
  port?: number
  protocol?: number
  app?: number
}

const runVlmcs = ({
  domain,
  port = 1688,
  protocol = 6,
  app = 26,
}: RunVlmcsType) => {
  return new Promise<{
    content: string
    delay: number
    domain: string
    status: boolean
  }>(resolve => {
    const before = Date.now()
    execFile(
      `./service/binaries/vlmcs-${platform()}-${arch()}`,
      [`${domain}:${port}`, `-${protocol}`, `-l ${app}`],
      { timeout: 5 * 1000 },
      (err, stdout) => {
        resolve({
          content: stdout.trim(),
          delay: Date.now() - before,
          domain,
          status: err ? false : true,
        })
      },
    )
  })
}

const app = new Elysia()

app.use(
  staticPlugin({
    assets: 'dist/assets',
    prefix: '/assets',
  }),
)

app.use(cors())

app.use(
  cron({
    name: 'heartbeat',
    pattern: Patterns.everySenconds(1),
    async run() {
      const vlmcsdService = await db.query.serviceTable.findMany()
      if (Array.isArray(vlmcsdService) && vlmcsdService?.length > 0) {
        for (const item of vlmcsdService) {
          const { domain, port } = item
          const data = await runVlmcs({ domain, port })
          const result = await db.insert(schema.logsTable).values({
            ...data,
            createdAt: new Date(),
          })
          console.log(result)
        }
      }
    },
  }),
)

app.get('/*', () => Bun.file('dist/index.html'))

app.get('/api/logs', async () => {
  return await db.query.logsTable.findMany()
})

app.post('/api/check', async request => {
  const body = request.body as RunVlmcsType
  return await runVlmcs(body)
})

app.listen(Bun.env.PORT || 3000)

console.log(`Elysia is running at on port ${app.server?.url} ...`)

try {
  platform() === 'win32'
    ? await $`taskkill /IM vlmcsd* /F`.nothrow()
    : await $`pkill -f vlmcsd`.nothrow()
} catch (err) {
  console.error(err)
}

const vlmcsd = Bun.spawnSync([
  `./service/binaries/vlmcsd-${platform()}-${arch()}`,
])

if (vlmcsd.success) {
  console.log('Vlmcsd has started')
}
