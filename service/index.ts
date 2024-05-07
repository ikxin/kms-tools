import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'
import { arch, platform } from 'os'
import { $ } from 'bun'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import { Database } from 'bun:sqlite'
import * as schema from './db/schema'

const sqlite = new Database('sqlite.db')
const db = drizzle(sqlite, { schema })

const app = new Elysia()

app.use(
  staticPlugin({
    assets: 'dist/assets',
    prefix: '/assets',
  }),
)

app.get('/*', () => Bun.file('dist/index.html'))

app.get('/api/record', async () => {
  return await db.query.record.findMany()
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
