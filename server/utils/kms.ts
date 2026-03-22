import { runVlmcs as runNodeVlmcs } from 'node-vlmcs'

const defaultMonitorList = [
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

export const getMonitorList = (() => {
  let cached: string[] | undefined
  return () => {
    if (cached) return cached
    const config = useRuntimeConfig()
    const listStr = (config.monitorList as string) || process.env.MONITOR_LIST
    cached = listStr?.split(',').filter(Boolean) || defaultMonitorList
    return cached
  }
})()

export const runVlmcs = ({
  host,
  port = 1688,
  protocol = 6,
  edition = 26,
  verbose = false,
}: RunVlmcsParams) => {
  return runNodeVlmcs({
    host,
    port: Number(port),
    protocol: Number(protocol),
    edition: Number(edition),
    verbose,
  }) as Promise<RunVlmcsResult>
}
