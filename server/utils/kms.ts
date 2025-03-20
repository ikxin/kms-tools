import { execFile } from 'child_process'
import { arch, platform } from 'os'

export const monitorList = process.env.MONITOR_LIST?.split(',') || [
  'kms.8b5.cn',
  'kms.org.cn',
  'win.freekms.cn',
  'kms.akams.cn',
  'kms.bige0.com',
  'win.kms.pub',
  'windows.kms.app',
  'kms.zhi.fun',
  'kms.03k.org',
  'kms.chs.ink',
  'kms.cgtsoft.com',
  'kms.loli.best',
  'kms.litbear.cn',
  'kms.343.re',
  'kms.sixyin.com',
  'kms.vmem.top',
  'kms.wxlost.com',
  'kms.digiboy.ir',
]

export const runVlmcs = ({
  host,
  port = 1688,
  protocol = 6,
  edition = 26,
}: RunVlmcsParams) => {
  return new Promise<RunVlmcsResult>((resolve, reject) => {
    const before = Date.now()
    const vlmcs = execFile(
      `./binaries/vlmcs-${platform()}-${arch()}`,
      [`${host}:${port}`, `-${protocol}`, `-l ${edition}`],
      { timeout: 5 * 1000 },
      (err, stdout) => {
        resolve({
          host,
          delay: err ? -1 : Date.now() - before,
          content: stdout.trim(),
          status: err ? false : true,
        })
      },
    )

    vlmcs.on('error', err => {
      reject(err)
    })

    vlmcs.on('close', () => {
      vlmcs.removeAllListeners()
      vlmcs.kill()
    })
  })
}
