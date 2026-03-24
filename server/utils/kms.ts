import { runVlmcs as runNodeVlmcs } from 'node-vlmcs'

const defaultMonitorList = [
  'kms.03k.org',
  'kms.343.re',
  'kms.8b5.cn',
  'kms.akams.cn',
  'kms.bige0.com',
  'kms.catqu.com',
  'kms.cgtsoft.com',
  'kms.ddddg.cn',
  'kms.jihuowin.com',
  'kms.kuretru.com',
  'kms.litbear.cn',
  'kms.loli.best',
  'kms.lolico.moe',
  'kms.mc06.net',
  'kms.micaesoft.com',
  'kms.moeclub.org',
  'kms.moerats.com',
  'kms.mrxn.net',
  'kms.qkeke.com',
  'kms.sixyin.com',
  'kms.vmem.top',
  'kms.wxlost.com',
  'kms.zhi.fun',
  'win.kms.pub',
  'windows.kms.app'
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
  verbose = false
}: RunVlmcsParams) => {
  return runNodeVlmcs({
    host,
    port: Number(port),
    protocol: Number(protocol),
    edition: Number(edition),
    verbose
  }) as Promise<RunVlmcsResult>
}
