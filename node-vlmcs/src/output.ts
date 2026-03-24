/**
 * 详细输出格式化模块 — 处理请求/响应的详细信息显示
 *
 * 参考原版源码:
 *   - src/output.c  (logRequest, logResponse, uuid2StringLE 等输出函数)
 *   - src/output.h  (输出接口定义)
 */

import { KmsData } from './data'
import { ParsedResponse } from './kms'
import { ucs2ToUtf8, fileTimeToUnixTime, VERSION } from './types'

// ─── 许可证状态映射 (参考 src/output.c 中的 StatusText) ─────────────────────

const LICENSE_STATUS: Record<number, string> = {
  0: 'Unlicensed',
  1: 'Licensed (Activated)',
  2: 'OOB grace',
  3: 'OOT grace',
  4: 'NonGenuineGrace',
  5: 'Notification',
  6: 'extended grace'
}

/**
 * 将小端序 GUID Buffer 格式化为标准字符串
 * 格式: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
 *
 * 参考: src/output.c 中的 uuid2StringLE()
 */
export function uuid2StringLE(buf: Buffer, offset = 0): string {
  const d1 = buf.readUInt32LE(offset)
  const d2 = buf.readUInt16LE(offset + 4)
  const d3 = buf.readUInt16LE(offset + 6)
  const d4 = buf.subarray(offset + 8, offset + 16)
  return (
    d1.toString(16).padStart(8, '0') +
    '-' +
    d2.toString(16).padStart(4, '0') +
    '-' +
    d3.toString(16).padStart(4, '0') +
    '-' +
    d4[0].toString(16).padStart(2, '0') +
    d4[1].toString(16).padStart(2, '0') +
    '-' +
    Array.from(d4.subarray(2))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  )
}

/** 在产品列表中按 GUID 查找名称 */
function findNameByGuid(
  guidStr: string,
  list: Array<{ guid: string; name: string }>
): string {
  const found = list.find(item => item.guid === guidStr)
  return found ? found.name : 'Unknown'
}

/**
 * 将 FILETIME 格式化为 UTC 时间字符串
 * 格式: "YYYY-MM-DD HH:MM:SS"
 */
function formatTimestamp(ft: Buffer): string {
  const unixTime = fileTimeToUnixTime(ft)
  const d = new Date(unixTime * 1000)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
}

/**
 * 输出 KMS 请求的详细信息（-v 模式）
 *
 * 参考: src/output.c 中的 logRequest()
 */
export function logRequestVerbose(requestBuf: Buffer): void {
  const majorVer = requestBuf.readUInt16LE(2)
  const minorVer = requestBuf.readUInt16LE(0)
  const vmInfo = requestBuf.readUInt32LE(4)
  const licenseStatus = requestBuf.readUInt32LE(8)
  const bindingExpiration = requestBuf.readUInt32LE(12)
  const appIdStr = uuid2StringLE(requestBuf, 16)
  const skuIdStr = uuid2StringLE(requestBuf, 32)
  const kmsIdStr = uuid2StringLE(requestBuf, 48)
  const cmidStr = uuid2StringLE(requestBuf, 64)
  const nPolicy = requestBuf.readUInt32LE(80)
  const clientTime = requestBuf.subarray(84, 92)
  const cmidPrevStr = uuid2StringLE(requestBuf, 92)
  const wsName = ucs2ToUtf8(requestBuf.subarray(108, 236), 64)

  // 查找产品名称
  const appName = findNameByGuid(appIdStr, KmsData.appItems)
  const skuName = findNameByGuid(skuIdStr, KmsData.skuItems)
  const kmsName = findNameByGuid(kmsIdStr, KmsData.kmsItems)
  const statusStr = LICENSE_STATUS[licenseStatus] || licenseStatus.toString()

  process.stdout.write(
    `\nRequest Parameters\n==================\n\n` +
      `Protocol version                : ${majorVer}.${minorVer}\n` +
      `Client is a virtual machine     : ${vmInfo ? 'Yes' : 'No'}\n` +
      `Licensing status                : ${licenseStatus} (${statusStr})\n` +
      `Remaining time (0 = forever)    : ${bindingExpiration} minutes\n` +
      `Application ID                  : ${appIdStr} (${appName})\n` +
      `SKU ID (aka Activation ID)      : ${skuIdStr} (${skuName})\n` +
      `KMS ID (aka KMS counted ID)     : ${kmsIdStr} (${kmsName})\n` +
      `Client machine ID               : ${cmidStr}\n` +
      `Previous client machine ID      : ${cmidPrevStr}\n` +
      `Client request timestamp (UTC)  : ${formatTimestamp(clientTime)}\n` +
      `Workstation name                : ${wsName}\n` +
      `N count policy (minimum clients): ${nPolicy}\n`
  )
}

/**
 * 输出 KMS 响应的详细信息（-v 模式）
 *
 * 参考: src/output.c 中的 logResponse()
 */
export function logResponseVerbose(
  ePID: string,
  hwid: Buffer,
  response: ParsedResponse,
  effectiveResponseSize: number
): void {
  const cmidStr = uuid2StringLE(response.cmid)
  const timeStr = formatTimestamp(response.clientTime)

  process.stdout.write(
    `\n\nResponse from KMS server\n========================\n\n` +
      `Size of KMS Response            : ${effectiveResponseSize} (0x${effectiveResponseSize.toString(16)})\n` +
      `KMS ePID                        : ${ePID}\n`
  )

  // V6 协议才有 HwId
  if (response.majorVer > 5) {
    const hwidHex = Array.from(hwid.subarray(0, 8))
      .map(b => b.toString(16).padStart(2, '0').toUpperCase())
      .join('')
    process.stdout.write(`KMS HwId                        : ${hwidHex}\n`)
  }

  process.stdout.write(
    `Client machine ID               : ${cmidStr}\n` +
      `Client request timestamp (UTC)  : ${timeStr}\n` +
      `KMS host current active clients : ${response.count}\n` +
      `Renewal interval policy         : ${response.vlRenewalInterval}\n` +
      `Activation interval policy      : ${response.vlActivationInterval}\n\n`
  )
}

/** 输出运行平台信息 */
export function printPlatform(): void {
  process.stdout.write(`Intended platform: Node.js ${process.version}\n`)
}

/** 输出通用编译标志 */
export function printCommonFlags(): void {
  process.stdout.write('Common flags:\n')
}

/** 输出 vlmcs 客户端特有标志 */
export function printClientFlags(): void {
  process.stdout.write('vlmcs flags: DNS_PARSER=OS\n')
}
