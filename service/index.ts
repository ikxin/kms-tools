import { $ } from 'bun'
import { arch, platform } from 'os'
import { CronJob } from 'cron'
import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { Elysia } from 'elysia'
import { execFile } from 'child_process'
import { staticPlugin } from '@elysiajs/static'
import * as schema from './schema'

const sqlite = new Database('sqlite.db')
const db = drizzle(sqlite, { schema })

const vlmcsdServers = [
  'kms.03k.org',
  'kms.ikxin.com',
  'kms.loli.best',
  'kms.lolico.moe',
  's1.kms.cx',
]

const runVlmcs = (server: string) => {
  return new Promise(resolve => {
    const before = Date.now()
    execFile(
      `./service/binaries/vlmcs-${platform()}-${arch()}`,
      [server],
      { timeout: 5 * 1000 },
      (err, stdout) => {
        resolve({
          content: stdout.trim(),
          delay: Date.now() - before,
          server,
          status: err ? false : true,
        })
      }
    )
  })
}

new CronJob(
  '0/20 * * * * *',
  async function () {
    for (const item of vlmcsdServers) {
      const result = await runVlmcs(item)
      console.log(result)
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

app.get('/*', () => Bun.file('dist/index.html'))

app.get('/api/record', async () => {
  return await db.query.logs.findMany()
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
