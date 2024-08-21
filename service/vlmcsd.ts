import { $ } from 'bun'
import { arch, platform } from 'os'

const startVlmcsd = async () => {
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
}

if (Bun.env.ENABLE_VLMCSD === 'true') {
  startVlmcsd()
} else {
  console.log('Vlmcsd is disabled')
}
