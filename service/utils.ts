import { execFile } from 'child_process'
import { arch, platform } from 'os'
import { RunVlmcsParams, RunVlmcsResult } from './types'

export const runVlmcs = ({
  host,
  port = 1688,
  protocol = 6,
  edition = 26,
}: RunVlmcsParams) => {
  return new Promise<RunVlmcsResult>(resolve => {
    const before = Date.now()
    const vlmcs = execFile(
      `./service/binaries/vlmcs-${platform()}-${arch()}`,
      [`${host}:${port}`, `-${protocol}`, `-l ${edition}`],
      { timeout: 10 * 1000 },
      (err, stdout) => {
        resolve({
          host,
          delay: Date.now() - before,
          content: stdout.trim(),
          status: err ? false : true,
        })
      },
    )

    vlmcs.on('error', () => {
      vlmcs.kill()
    })

    vlmcs.on('close', () => {
      vlmcs.kill()
    })
  })
}
