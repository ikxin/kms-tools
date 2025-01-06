import { spawn } from 'child_process'
import { join } from 'path'
import { arch, platform } from 'os'
import { existsSync } from 'fs'

export default defineNitroPlugin(nitro => {
  if (process.env.ENABLE_VLMCSD !== 'true') {
    console.log('Vlmcsd is disabled')
    return
  }

  const vlmcsdPath = join(
    process.cwd(),
    'binaries',
    `vlmcsd-${platform()}-${arch()}`
  )

  if (!existsSync(vlmcsdPath)) {
    console.log('Vlmcsd binary not found')
    return
  }

  const vlmcsd = spawn(vlmcsdPath, ['-D'], { stdio: 'inherit' })

  nitro.hooks.hookOnce('close', () => {
    vlmcsd.removeAllListeners()
    vlmcsd.kill()
  })
})
