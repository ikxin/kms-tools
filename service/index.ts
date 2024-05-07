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
  const { stdout, exitCode } =
    platform() === 'win32'
      ? await $`netstat -ano | findstr 1688`.nothrow()
      : await $`lsof -i :1688 | grep LISTEN`.nothrow()

  if (exitCode === 0) {
    const lines = stdout.toString().split('\n')
    for (const line of lines) {
      const match = line.match(/\b(\d+)\b/)
      if (match) {
        const pid = match[0]
        platform() === 'win32'
          ? await $`taskkill /F /PID ${pid}`.nothrow()
          : await $`kill -9 ${pid}`.nothrow()
        break
      }
    }
  }
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
