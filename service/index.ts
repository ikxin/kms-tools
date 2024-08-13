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
  host: string
  port?: number
  app?: number
  protocol?: number
}

const runVlmcs = ({
  host,
  port = 1688,
  app = 26,
  protocol = 6,
}: RunVlmcsType) => {
  return new Promise<{
    content: string
    delay: number
    host: string
    status: boolean
  }>(resolve => {
    const before = Date.now()
    execFile(
      `./service/binaries/vlmcs-${platform()}-${arch()}`,
      [`${host}:${port}`, `-${protocol}`, `-l ${app}`],
      { timeout: 5 * 1000 },
      (err, stdout) => {
        resolve({
          host,
          delay: Date.now() - before,
          content: stdout.trim(),
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
    name: 'check',
    pattern: Patterns.everySenconds(10),
    async run() {
      const servers = await db.query.server.findMany()
      if (Array.isArray(servers) && servers?.length > 0) {
        for (const item of servers) {
          const result = await runVlmcs({
            host: item.host,
            port: item.port,
          })
          await db.insert(schema.logs).values({
            ...result,
            createdAt: new Date(),
          })
        }
      }
    },
  }),
)

app.get('/*', () => Bun.file('dist/index.html'))

app.get('/api/logs', async () => {
  return await db.query.logs.findMany()
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
