import { $ } from 'bun'
import { arch, platform } from 'os'
import { CronJob } from 'cron'
import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { Elysia } from 'elysia'
import { execFile } from 'child_process'
import { staticPlugin } from '@elysiajs/static'
import * as schema from './schema'
import { cors } from '@elysiajs/cors'

const sqlite = new Database('sqlite.db')
const db = drizzle(sqlite, { schema })

const vlmcsdServers = [
  'kms.03k.org',
  'kms.ikxin.com',
  'kms.loli.best',
  'kms.lolico.moe',
  's1.kms.cx',
]

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
    server: string
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
          server: domain,
          status: err ? false : true,
        })
      },
    )
  })
}

new CronJob(
  '0/20 * * * * *',
  async function () {
    for (const item of vlmcsdServers) {
      const result = await runVlmcs({ domain: item })
      db.insert(schema.logs)
        .values({
          ...result,
          createdAt: Date.now(),
        })
        .run()
    }
  },
  null,
  true,
  'Asia/Shanghai',
)

const app = new Elysia()

app.use(
  staticPlugin({
    assets: 'dist/assets',
    prefix: '/assets',
  }),
)

app.use(cors())

app.get('/*', () => Bun.file('dist/index.html'))

app.get('/api/logs', async () => {
  return await db.query.logs.findMany()
})

app.post('/api/check', async (request) => {
  const body = request.body as RunVlmcsType
  return await runVlmcs(body)
})

app.listen(3000)

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
