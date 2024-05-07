import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'
import { arch, platform } from 'os'
import { $ } from 'bun'

const app = new Elysia()

app.use(
  staticPlugin({
    assets: 'dist/assets',
    prefix: '/assets',
  }),
)

app.get('/*', () => Bun.file('dist/index.html'))

app.listen(3000)

try {
  platform() === 'win32'
    ? await $`taskkill /IM vlmcsd* /F`.nothrow()
    : await $`pkill -f vlmcsd`.nothrow()
} catch (err) {
  console.error(err)
}

console.log(`Elysia is running at on port ${app.server?.url} ...`)

const vlmcsd = Bun.spawnSync([
  `./service/binaries/vlmcsd-${platform()}-${arch()}`,
])

if (vlmcsd.success) {
  console.log('Vlmcsd has started')
}
