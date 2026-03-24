#!/usr/bin/env node

/**
 * vlmcs 命令行客户端 — KMS 激活请求的主入口
 *
 * 参考原版源码:
 *   - src/vlmcs.c  (main, parseArgs, buildRequest, sendRequest, displayResponse 等)
 *   - src/vlmcs.h  (全局状态变量定义)
 */

import * as net from 'net'
import { KmsData } from './data'
import {
  guidToBuffer,
  stringToGuidLE,
  utf8ToUcs2,
  ucs2ToUtf8,
  unixTimeToFileTime,
  VERSION,
  PID_BUFFER_SIZE,
  WORKSTATION_NAME_BUFFER,
  ResponseResult
} from './types'
import {
  createRequestV4,
  createRequestV6,
  decryptResponseV4,
  decryptResponseV6,
  ParsedResponse
} from './kms'
import { rpcBindClient, rpcSendRequest, RpcFlags, RpcDiag } from './rpc'
import { connectToAddress, isDisconnected } from './network'
import { stringToInt, getArgumentBool } from './helpers'
import { get16RandomBytes } from './crypto'
import {
  logRequestVerbose,
  logResponseVerbose,
  uuid2StringLE,
  printPlatform,
  printCommonFlags,
  printClientFlags
} from './output'

// ─── 常量 (参考 src/vlmcs.c) ────────────────────────────────────────────────
const VLMCS_OPTION_GRAB_INI = 1 // -G 模式（获取 ePID/HwId 数据）
const VLMCS_OPTION_NO_GRAB_INI = 2 // 与 -G 不兼容的选项

// ─── 随机工作站名的 DNS 域名组件 (参考 src/vlmcs.c 中的 DnsNames) ─────────
const DnsNames = {
  first: [
    'www',
    'ftp',
    'kms',
    'hack-me',
    'smtp',
    'ns1',
    'mx1',
    'ns1',
    'pop3',
    'imap',
    'mail',
    'dns',
    'headquarter',
    'we-love',
    '_vlmcs._tcp',
    'ceo-laptop'
  ],
  second: [
    '.microsoft',
    '.apple',
    '.amazon',
    '.samsung',
    '.adobe',
    '.google',
    '.yahoo',
    '.facebook',
    '.ubuntu',
    '.oracle',
    '.borland',
    '.htc',
    '.acer',
    '.windows',
    '.linux',
    '.sony'
  ],
  tld: [
    '.com',
    '.net',
    '.org',
    '.cn',
    '.co.uk',
    '.de',
    '.com.tw',
    '.us',
    '.fr',
    '.it',
    '.me',
    '.info',
    '.biz',
    '.co.jp',
    '.ua',
    '.at',
    '.es',
    '.pro',
    '.by',
    '.ru',
    '.pl',
    '.kr'
  ]
}

const alphanum = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

// ─── 全局状态变量 (参考 src/vlmcs.c 中的全局变量) ────────────────────────────

let verbose = false // -v 详细输出
let vmInfo = false // -m 伪装为虚拟机
let dnsnames = true // 使用 DNS 风格的随机工作站名（-d 可禁用）
let fixedRequests = 0 // -n 固定请求次数
let licenseStatus = 0x02 // -t 许可证状态（默认 OOB grace）
let cmidStr: string | null = null // -c 自定义客户端机器 ID
let cmidPrevStr: string | null = null // -o 自定义前一个客户端机器 ID
let workstationName: string | null = null // -w 自定义工作站名
let bindingExpiration = 43200 // -g 绑定过期时间（分钟）
let remoteAddr = '' // 目标 KMS 服务器地址
let reconnectForEachRequest = false // -T 每次请求重新连接
let addressFamily = 0 // -i IP 协议版本（0=自动, 4=IPv4, 6=IPv6）
let incompatibleOptions = 0 // 选项兼容性跟踪
let fnIniClient: string | null = null // -G 输出文件路径
let activeProductIndex = 0 // 当前选中的产品索引
let nCountPolicy = 0 // 最小客户端计数策略
let appGuid: Buffer = Buffer.alloc(16) // 应用程序 GUID
let kmsGuid: Buffer = Buffer.alloc(16) // KMS 计数 ID
let skuGuid: Buffer = Buffer.alloc(16) // 激活 ID (SKU GUID)
let minorVersion = 0 // 协议次版本号
let majorVersion = 0 // 协议主版本号
let useClientRpcNDR64 = true // -N 是否使用 NDR64
let useClientRpcBTFN = true // -B 是否使用绑定时间特性协商
let useMultiplexedRpc = true // -p 是否使用多路复用 RPC
let rpcFlags: RpcFlags = { hasNDR32: false, hasNDR64: false, hasBTFN: false }
let firstPacketSent = false // 是否已发送第一个数据包

/** 输出错误信息到 stderr */
function errorout(msg: string): void {
  process.stderr.write(msg)
}

/** 解析命令行中的 GUID 参数，无效时退出进程 */
function parseGuidArg(input: string): Buffer {
  if (input.length !== 36) {
    errorout('Fatal: Command line contains an invalid GUID.\n')
    process.exit(22)
  }
  const guid = stringToGuidLE(input)
  if (!guid) {
    errorout('Fatal: Command line contains an invalid GUID.\n')
    process.exit(22)
  }
  return guidToBuffer(guid)
}

/** 显示帮助信息并退出，参考 src/vlmcs.c 中的 usage() */
function showHelp(programName: string): never {
  errorout(
    `vlmcs ${VERSION}\n\n` +
      `Usage: ${programName} [options] [ <host>[:<port>] | .<domain> | - ] [options]\n\n` +
      `Options:\n\n` +
      `  -v Be verbose\n` +
      `  -l <app>\n` +
      `  -4 Force V4 protocol\n` +
      `  -5 Force V5 protocol\n` +
      `  -6 Force V6 protocol\n` +
      `  -i <IpVersion> Use IP protocol (4 or 6)\n` +
      `  -j <file> Load external KMS data file <file>\n` +
      `  -e Show some valid examples\n` +
      `  -x Show valid Apps\n` +
      `  -d no DNS names, use Netbios names (no effect if -w is used)\n` +
      `  -V show version information and exit\n\n` +
      `Advanced options:\n\n` +
      `  -a <AppGUID> Use custom Application GUID\n` +
      `  -s <ActGUID> Use custom Activation Configuration GUID\n` +
      `  -k <KmsGUID> Use custom KMS GUID\n` +
      `  -c <ClientGUID> Use custom Client GUID. Default: Use random\n` +
      `  -o <PreviousClientGUID> Use custom Prevoius Client GUID. Default: ZeroGUID\n` +
      `  -K <ProtocolVersion> Use a specific (possibly invalid) protocol version\n` +
      `  -w <Workstation> Use custom workstation name. Default: Use random\n` +
      `  -r <RequiredClientCount> Fake required clients\n` +
      `  -n <Requests> Fixed # of requests (Default: Enough to charge)\n` +
      `  -m Pretend to be a virtual machine\n` +
      `  -G <file> Get ePID/HwId data and write to <file>. Can't be used with -l, -4, -5, -6, -a, -s, -k, -r and -n\n` +
      `  -T Use a new TCP connection for each request.\n` +
      `  -N <0|1> disable or enable NDR64. Default: 1\n` +
      `  -B <0|1> disable or enable RPC bind time feature negotiation. Default: 1\n` +
      `  -t <LicenseStatus> Use specfic license status (0 <= T <= 6)\n` +
      `  -g <BindingExpiration> Use a specfic binding expiration time in minutes. Default 43200\n` +
      `  -P Ignore priority and weight in DNS SRV records\n` +
      `  -p Don't use multiplexed RPC bind\n` +
      `\n` +
      `<port>:\t\tTCP port name of the KMS to use. Default 1688.\n` +
      `<host>:\t\thost name of the KMS to use. Default 127.0.0.1\n` +
      `.<domain>:\tfind KMS server in <domain> via DNS\n` +
      `<app>:\t\t(Type ${programName} -x to see a list of valid apps)\n\n`
  )
  process.exit(22)
}

/** 显示用法示例 */
function showExamples(programName: string): never {
  process.stdout.write(
    `\nRequest activation for Office 2013 using V4 protocol from 192.168.1.5:1688\n` +
      `\t${programName} -l "Office 2013 Professional" -4 192.168.1.5\n` +
      `\t${programName} -l "Office 2013 Professional" -4 192.168.1.5:1688\n\n` +
      `Request activation for Windows Server 2012 using V4 protocol from localhost:1688\n` +
      `\t${programName} -4 -l "Windows Server 2012" -k 8665cb71-468c-4aa3-a337-cb9bc9d5eaac\n` +
      `\t${programName} -4 -l "Windows Server 2012"\n` +
      `\t${programName} -4 -l "Windows Server 2012" [::1]:1688\n` +
      `\t${programName} -4 -l "Windows Server 2012" 127.0.0.2:1688\n\n` +
      `Send 100,000 requests to localhost:1688\n` +
      `\t${programName} -n 100000\n\n` +
      `Request Activation for Windows 8 from 10.0.0.1:4711 and pretend to be Steve Ballmer\n` +
      `\t${programName} -l "Windows 8 Professional" -w steveb1.redmond.microsoft.com 10.0.0.1:4711\n\n`
  )
  process.exit(0)
}

/** 显示所有可用产品列表（-x 选项），参考 src/vlmcs.c 中的 showProducts() */
function showProducts(): never {
  const cols = process.stdout.columns || 80
  const items = KmsData.skuItems
  let longestString = 0
  for (const item of items) {
    if (item.name.length > longestString) longestString = item.name.length
  }
  const itemsPerLine = Math.max(1, Math.floor(cols / (longestString + 10)))
  const lines = Math.ceil(items.length / itemsPerLine)

  process.stdout.write('You may use these product names or numbers:\n\n')

  for (let i = 0; i < lines; i++) {
    let line = ''
    for (let k = 0; k < itemsPerLine; k++) {
      const index = k * lines + i
      if (index >= items.length) break
      const num = (index + 1).toString().padStart(3, ' ')
      const name = items[index].name
      line += `${num} = ${name}${' '.repeat(longestString + 4 - name.length)}`
    }
    process.stdout.write(line + '\n')
  }
  process.stdout.write('\n')
  process.exit(0)
}

// ─── getopt 风格的参数解析器 (参考 src/vlmcs.c 中的参数处理) ────────────────
interface ParsedOpt {
  opt: string
  arg: string | null
}

function parseArgs(argv: string[]): {
  opts: ParsedOpt[]
  positional: string[]
} {
  const opts: ParsedOpt[] = []
  const positional: string[] = []
  const requiresArg = 'NBijlaskcwrntgGoK'
  let i = 0
  while (i < argv.length) {
    const arg = argv[i]
    if (arg === '--') {
      i++
      positional.push(...argv.slice(i))
      break
    }
    if (arg.startsWith('-') && arg.length > 1 && arg[1] !== '-') {
      const optChar = arg[1]
      if (requiresArg.includes(optChar)) {
        const optArg = arg.length > 2 ? arg.substring(2) : argv[++i]
        opts.push({ opt: optChar, arg: optArg || null })
      } else {
        // May have multiple flags: -v4m etc.
        for (let j = 1; j < arg.length; j++) {
          const c = arg[j]
          if (requiresArg.includes(c)) {
            const optArg = j + 1 < arg.length ? arg.substring(j + 1) : argv[++i]
            opts.push({ opt: c, arg: optArg || null })
            break
          } else {
            opts.push({ opt: c, arg: null })
          }
        }
      }
    } else {
      positional.push(arg)
    }
    i++
  }
  return { opts, positional }
}

/** 根据选中的产品设置默认参数（版本号、计数策略、GUID），参考 src/vlmcs.c */
function setProductDefaults(): void {
  const sku = KmsData.skuItems[activeProductIndex]
  majorVersion = sku.protocolVersion
  nCountPolicy = sku.nCountPolicy
  skuGuid = guidToBuffer(stringToGuidLE(sku.guid)!)
  kmsGuid = guidToBuffer(stringToGuidLE(KmsData.kmsItems[sku.kmsIndex].guid)!)
  appGuid = guidToBuffer(stringToGuidLE(KmsData.appItems[sku.appIndex].guid)!)
}

/**
 * 构建 236 字节的 KMS 请求基础结构
 * 参考: src/vlmcs.c 中的 CreateRequest()
 */
function buildRequest(): Buffer {
  const buf = Buffer.alloc(260) // Enough for V6 request
  // Version
  buf.writeUInt16LE(minorVersion, 0)
  buf.writeUInt16LE(majorVersion, 2)
  // VMInfo
  buf.writeUInt32LE(vmInfo ? 1 : 0, 4)
  // LicenseStatus
  buf.writeUInt32LE(licenseStatus, 8)
  // BindingExpiration
  buf.writeUInt32LE(bindingExpiration, 12)
  // AppID
  appGuid.copy(buf, 16)
  // ActID (SkuGuid)
  skuGuid.copy(buf, 32)
  // KMSID
  kmsGuid.copy(buf, 48)
  // CMID
  if (cmidStr) {
    const g = parseGuidArg(cmidStr)
    g.copy(buf, 64)
  } else {
    const rnd = get16RandomBytes()
    rnd.copy(buf, 64)
    // Set UUID v4 bits
    buf[64 + 8] = (buf[64 + 8] & 0x3f) | 0x80
    const d3 = buf.readUInt16LE(64 + 6)
    buf.writeUInt16LE((d3 & 0x0fff) | 0x4000, 64 + 6)
  }
  // N_Policy
  buf.writeUInt32LE(nCountPolicy, 80)
  // ClientTime
  const ft = unixTimeToFileTime()
  ft.copy(buf, 84)
  // CMID_prev
  if (cmidPrevStr) {
    const g = parseGuidArg(cmidPrevStr)
    g.copy(buf, 92)
  } else {
    buf.fill(0, 92, 108)
  }
  // WorkstationName
  if (workstationName) {
    const ws = utf8ToUcs2(
      workstationName.substring(0, 63),
      WORKSTATION_NAME_BUFFER
    )
    ws.copy(buf, 108)
  } else if (dnsnames) {
    const first =
      DnsNames.first[Math.floor(Math.random() * DnsNames.first.length)]
    const second =
      DnsNames.second[Math.floor(Math.random() * DnsNames.second.length)]
    const tld = DnsNames.tld[Math.floor(Math.random() * DnsNames.tld.length)]
    const name = first + second + tld
    const ws = utf8ToUcs2(name, WORKSTATION_NAME_BUFFER)
    ws.copy(buf, 108)
  } else {
    const size = Math.floor(Math.random() * 14) + 1
    let name = ''
    for (let i = 0; i < size; i++) {
      name += alphanum[Math.floor(Math.random() * alphanum.length)]
    }
    const ws = utf8ToUcs2(name, WORKSTATION_NAME_BUFFER)
    ws.copy(buf, 108)
  }

  return buf.subarray(0, 236) // REQUEST is 236 bytes
}

/** 建立 TCP 连接并执行 RPC 绑定，参考 src/vlmcs.c 中的连接逻辑 */
async function connectRpc(
  sock: net.Socket | null
): Promise<{ sock: net.Socket }> {
  const s = await connectToAddress(
    remoteAddr,
    addressFamily,
    remoteAddr.startsWith('.') || remoteAddr === '-'
  )
  if (verbose) process.stdout.write('\nPerforming RPC bind ...\n')
  const bindResult = await rpcBindClient(
    s,
    verbose,
    useClientRpcNDR64,
    useClientRpcBTFN,
    useMultiplexedRpc
  )
  if (bindResult.status) {
    errorout('Fatal: Could not bind RPC\n')
    process.exit(bindResult.status)
  }
  rpcFlags = bindResult.rpcFlags
  if (verbose) process.stdout.write('... successful\n')
  return { sock: s }
}

/**
 * 显示 KMS 响应结果，包括各项验证检查
 * 参考: src/vlmcs.c 中的 displayResponse()
 */
function displayResponse(
  result: ResponseResult,
  response: ParsedResponse,
  hwid: Buffer
): void {
  if (!result.rpcOK) errorout('\n\x07ERROR: Non-Zero RPC result code.\n')
  if (!result.decryptSuccess)
    errorout('\n\x07ERROR: Decryption of V5/V6 response failed.\n')
  if (!result.ivsOK)
    errorout(
      '\n\x07ERROR: AES CBC initialization vectors (IVs) of request and response do not match.\n'
    )
  if (!result.pidLengthOK)
    errorout('\n\x07ERROR: The length of the PID is not valid.\n')
  if (!result.hashOK)
    errorout('\n\x07ERROR: Computed hash does not match hash in response.\n')
  if (!result.clientMachineIDOK)
    errorout(
      '\n\x07ERROR: Client machine GUIDs of request and response do not match.\n'
    )
  if (!result.timeStampOK)
    errorout('\n\x07ERROR: Time stamps of request and response do not match.\n')
  if (!result.versionOK)
    errorout(
      '\n\x07ERROR: Protocol versions of request and response do not match.\n'
    )
  if (!result.hmacSha256OK)
    errorout(
      '\n\x07ERROR: Keyed-Hash Message Authentication Code (HMAC) is incorrect.\n'
    )
  if (!result.ivNotSuspicious)
    errorout(
      '\nWARNING: The KMS server is an emulator because the response uses an IV following KMSv5 rules in KMSv6 protocol.\n'
    )

  if (result.effectiveResponseSize !== result.correctResponseSize) {
    errorout(
      `\n\x07WARNING: Size of RPC payload (KMS Message) should be ${result.correctResponseSize} but is ${result.effectiveResponseSize}.`
    )
  }

  // Check RPC level
  if (!rpcFlags.hasNDR32)
    errorout("\nWARNING: Server's RPC protocol does not support NDR32.\n")
  if (
    useClientRpcBTFN &&
    useClientRpcNDR64 &&
    rpcFlags.hasNDR64 &&
    !rpcFlags.hasBTFN
  )
    errorout("\nWARNING: Server's RPC protocol has NDR64 but no BTFN.\n")

  if (!result.decryptSuccess) return

  const ePID = ucs2ToUtf8(response.kmsPID, PID_BUFFER_SIZE)

  if (!verbose) {
    process.stdout.write(` -> ${ePID}`)
    if (response.majorVer > 5) {
      const hwidHex = Array.from(hwid.subarray(0, 8))
        .map(b => b.toString(16).toUpperCase().padStart(2, '0'))
        .join('')
      process.stdout.write(` (${hwidHex})`)
    }
    process.stdout.write('\n')
  } else {
    logResponseVerbose(ePID, hwid, response, result.effectiveResponseSize)
  }
}

/**
 * 发送激活请求并处理响应
 * 根据协议版本选择 V4 或 V5/V6 加密方式
 * 参考: src/vlmcs.c 中的 SendActivationRequest()
 */
async function sendActivationRequest(
  sock: net.Socket,
  requestBase: Buffer
): Promise<{
  status: number
  response: ParsedResponse
  result: ResponseResult
  hwid: Buffer
}> {
  let request: Buffer
  const majorVer = requestBase.readUInt16LE(2)

  if (majorVer < 5) {
    request = createRequestV4(requestBase)
  } else {
    request = createRequestV6(requestBase)
  }

  const rpcResult = await rpcSendRequest(
    sock,
    request,
    rpcFlags,
    useClientRpcNDR64,
    firstPacketSent
  )

  if (rpcResult.status === 0 && rpcResult.kmsResponse) {
    const rawResponse = rpcResult.kmsResponse
    const responseMajorVer = rawResponse.readUInt16LE(2)

    let response: ParsedResponse
    let result: ResponseResult
    let hwid = Buffer.alloc(8)

    if (responseMajorVer === 4) {
      const v4Result = decryptResponseV4(rawResponse, request)
      response = v4Result.response
      result = v4Result.result
    } else {
      const v6Result = decryptResponseV6(rawResponse, request)
      response = v6Result.response
      result = v6Result.result
      hwid = Buffer.from(v6Result.hwid)
    }

    result.rpcOK = true
    firstPacketSent = true
    return { status: 0, response, result, hwid }
  }

  firstPacketSent = true
  const emptyResult: ResponseResult = {
    mask: 0,
    hashOK: false,
    timeStampOK: false,
    clientMachineIDOK: false,
    versionOK: false,
    ivsOK: false,
    decryptSuccess: false,
    hmacSha256OK: false,
    pidLengthOK: false,
    rpcOK: false,
    ivNotSuspicious: false,
    effectiveResponseSize: 0,
    correctResponseSize: 0
  }
  const emptyResponse: ParsedResponse = {
    majorVer: 0,
    minorVer: 0,
    pidSize: 0,
    kmsPID: Buffer.alloc(0),
    cmid: Buffer.alloc(16),
    clientTime: Buffer.alloc(8),
    count: 0,
    vlActivationInterval: 0,
    vlRenewalInterval: 0
  }
  return {
    status: rpcResult.status,
    response: emptyResponse,
    result: emptyResult,
    hwid: Buffer.alloc(8)
  }
}

/** 显示请求错误信息，参考 src/vlmcs.c 中的错误处理 */
function displayRequestError(
  status: number,
  currentRequest: number,
  totalRequests: number
): void {
  errorout(
    `\nError 0x${(status >>> 0).toString(16).toUpperCase().padStart(8, '0')} while sending request ${currentRequest} of ${totalRequests}\n`
  )
  switch (status) {
    case 0xc004f042:
      errorout(
        'The KMS server has declined to activate the requested product\n'
      )
      break
    case 0x8007000d:
      errorout(
        'The KMS host you are using is unable to handle your product. It only supports legacy versions\n'
      )
      break
    case 0xc004f06c:
      errorout('The time stamp differs too much from the KMS server time\n')
      break
    case 0xc004d104:
      errorout('The security processor reported that invalid data was used\n')
      break
    case 1:
      errorout('An RPC protocol error has occured\n')
      break
  }
}

/** 主函数 — 解析命令行参数并执行激活请求，参考 src/vlmcs.c 中的 main() */
async function main(): Promise<void> {
  const argv = process.argv.slice(2)
  const programName = 'vlmcs'
  const { opts, positional } = parseArgs(argv)

  // Pass 0: handle -j
  for (const o of opts) {
    if (o.opt === 'j') {
      // External data file - not fully implemented, just accept
    }
  }

  // Determine host
  let useDefaultHost = true
  if (positional.length > 0) {
    remoteAddr = positional[0]
    useDefaultHost = false
  }

  // Pass 1: handle -l
  for (const o of opts) {
    if (o.opt === 'l' && o.arg) {
      const num = stringToInt(o.arg, 1, KmsData.skuItems.length)
      if (num !== null) {
        activeProductIndex = num - 1
      } else {
        const idx = KmsData.skuItems.findIndex(
          s => s.name.toLowerCase() === o.arg!.toLowerCase()
        )
        if (idx < 0) {
          errorout(
            `Invalid client application. "${o.arg}" is not valid for -l.\n\n`
          )
          showProducts()
        }
        activeProductIndex = idx
      }
      incompatibleOptions |= VLMCS_OPTION_NO_GRAB_INI
    }
  }

  setProductDefaults()

  // Pass 2: handle all other options
  for (const o of opts) {
    switch (o.opt) {
      case 'h':
      case '?':
        showHelp(programName)
      case 'e':
        showExamples(programName)
      case 'x':
        showProducts()
      case 'V':
        process.stdout.write(
          `vlmcs ${VERSION} ${process.arch === 'x64' ? '64' : '32'}-bit\n`
        )
        printPlatform()
        printCommonFlags()
        printClientFlags()
        process.exit(0)
      case 'v':
        verbose = true
        break
      case 'm':
        vmInfo = true
        break
      case 'd':
        dnsnames = false
        break
      case 'T':
        reconnectForEachRequest = true
        break
      case 'P':
        break // DNS SRV 优先级（未实现，仅接受参数）
      case 'p':
        useMultiplexedRpc = false
        break
      case '4':
      case '5':
      case '6':
        incompatibleOptions |= VLMCS_OPTION_NO_GRAB_INI
        majorVersion = parseInt(o.opt)
        minorVersion = 0
        break
      case 'N':
        if (o.arg) {
          const r = getArgumentBool(o.arg)
          if (r === null) showHelp(programName)
          useClientRpcNDR64 = r!
        }
        break
      case 'B':
        if (o.arg) {
          const r = getArgumentBool(o.arg)
          if (r === null) showHelp(programName)
          useClientRpcBTFN = r!
        }
        break
      case 'i':
        if (o.arg) {
          const v = parseInt(o.arg)
          if (v === 4) addressFamily = 4
          else if (v === 6) addressFamily = 6
          else {
            errorout('IPv5 does not exist.\n')
            process.exit(22)
          }
        }
        break
      case 'n':
        incompatibleOptions |= VLMCS_OPTION_NO_GRAB_INI
        if (o.arg) fixedRequests = parseInt(o.arg) || 1
        break
      case 'r':
        incompatibleOptions |= VLMCS_OPTION_NO_GRAB_INI
        if (o.arg) nCountPolicy = parseInt(o.arg) || 0
        break
      case 'c':
        if (!fixedRequests) fixedRequests = 1
        cmidStr = o.arg
        break
      case 'o':
        cmidPrevStr = o.arg
        break
      case 'a':
        incompatibleOptions |= VLMCS_OPTION_NO_GRAB_INI
        if (o.arg) appGuid = parseGuidArg(o.arg)
        break
      case 's':
        incompatibleOptions |= VLMCS_OPTION_NO_GRAB_INI
        if (o.arg) skuGuid = parseGuidArg(o.arg)
        break
      case 'k':
        incompatibleOptions |= VLMCS_OPTION_NO_GRAB_INI
        if (o.arg) kmsGuid = parseGuidArg(o.arg)
        break
      case 'K':
        if (o.arg) {
          const parts = o.arg.split('.')
          if (parts.length !== 2) {
            errorout('Fatal: Protocol version must be in the format #.#\n')
            process.exit(22)
          }
          majorVersion = parseInt(parts[0]) || 0
          minorVersion = parseInt(parts[1]) || 0
        }
        break
      case 'w':
        workstationName = o.arg
        if (workstationName && workstationName.length > 63) {
          errorout(
            `\x07WARNING! Truncating workstation name to 63 characters (${workstationName}).\n`
          )
        }
        break
      case 't':
        if (o.arg) {
          licenseStatus = parseInt(o.arg) || 0
          if (licenseStatus > 6)
            errorout(
              'Warning: Correct license status is 0 <= license status <= 6.\n'
            )
        }
        break
      case 'g':
        if (o.arg) bindingExpiration = parseInt(o.arg) || 0
        break
      case 'G':
        incompatibleOptions |= VLMCS_OPTION_GRAB_INI
        fnIniClient = o.arg
        break
      case 'l':
      case 'j':
        break // Already handled
    }
  }

  if (
    (incompatibleOptions &
      (VLMCS_OPTION_NO_GRAB_INI | VLMCS_OPTION_GRAB_INI)) ===
    (VLMCS_OPTION_NO_GRAB_INI | VLMCS_OPTION_GRAB_INI)
  ) {
    showHelp(programName)
  }

  if (useDefaultHost) {
    remoteAddr = addressFamily === 6 ? '[::1]' : '127.0.0.1'
  }

  try {
    if (fnIniClient !== null) {
      await grabServerData()
    } else {
      await runNormalMode()
    }
  } catch (err: any) {
    errorout(`Fatal: ${err.message || err}\n`)
    process.exit(1)
  }
}

/** 普通激活模式 — 发送一个或多个激活请求，参考 src/vlmcs.c */
async function runNormalMode(): Promise<void> {
  let sock: net.Socket | null = null
  let requests = 0
  let requestsToGo = nCountPolicy === 1 ? 1 : nCountPolicy - 1
  let firstRequestSentLocal = false

  while (requestsToGo > 0) {
    const requestBase = buildRequest()

    if (verbose) logRequestVerbose(requestBase)

    if (!sock) {
      const conn = await connectRpc(null)
      sock = conn.sock
    } else {
      const disconnected = isDisconnected(sock)
      if (disconnected) {
        errorout(
          '\nWarning: Server closed RPC connection (probably non-multitasked KMS emulator)\n'
        )
      }
      if (reconnectForEachRequest || disconnected) {
        sock.destroy()
        const conn = await connectRpc(null)
        sock = conn.sock
      }
    }

    process.stdout.write(`Sending activation request (KMS V${majorVersion}) `)

    const { status, response, result, hwid } = await sendActivationRequest(
      sock,
      requestBase
    )

    if (fixedRequests) requestsToGo = fixedRequests - requests - 1

    if (status) {
      displayRequestError(status, requests + 1, requestsToGo + requests + 1)
      if (!fixedRequests) requestsToGo = 0
    } else {
      if (!fixedRequests) {
        if (
          firstRequestSentLocal &&
          nCountPolicy - response.count >= requestsToGo
        ) {
          errorout(
            "\nThe KMS server does not increment it's active clients. Aborting...\n"
          )
          requestsToGo = 0
        } else {
          requestsToGo = nCountPolicy - response.count
          if (requestsToGo < 0) requestsToGo = 0
        }
      }

      process.stdout.write(`${requests + 1} of ${requestsToGo + requests + 1} `)
      displayResponse(result, response, hwid)
      firstRequestSentLocal = true
    }

    requests++
  }

  if (sock) sock.destroy()
}

/** -G 模式 — 获取服务器所有 CSVLK 组的 ePID/HwId 数据，参考 src/vlmcs.c 中的 grabServerData() */
async function grabServerData(): Promise<void> {
  let sock: net.Socket | null = null
  let currentMajorVer = 6
  const fs = await import('fs')
  const lines: string[] = []

  for (let i = 0; i < KmsData.csvlkData.length && currentMajorVer > 3; i++) {
    // Find a KMS item with this EPid index
    let kmsIdx = -1
    for (let j = 0; j < KmsData.kmsItems.length; j++) {
      if (KmsData.kmsItems[j].ePidIndex === i) {
        kmsIdx = j
        break
      }
    }
    if (kmsIdx < 0) {
      lines.push('')
      continue
    }

    // Find a SKU item with this kms index
    let skuIdx = -1
    for (let j = KmsData.skuItems.length - 1; j >= 0; j--) {
      if (KmsData.skuItems[j].kmsIndex === kmsIdx) {
        skuIdx = j
        break
      }
    }
    if (skuIdx < 0) {
      lines.push('')
      continue
    }

    const sku = KmsData.skuItems[skuIdx]
    activeProductIndex = skuIdx
    nCountPolicy = sku.nCountPolicy
    skuGuid = guidToBuffer(stringToGuidLE(sku.guid)!)
    kmsGuid = guidToBuffer(stringToGuidLE(KmsData.kmsItems[sku.kmsIndex].guid)!)
    appGuid = guidToBuffer(stringToGuidLE(KmsData.appItems[sku.appIndex].guid)!)
    majorVersion = currentMajorVer
    minorVersion = 0

    const requestBase = buildRequest()
    if (verbose) logRequestVerbose(requestBase)

    if (!sock) {
      const conn = await connectRpc(null)
      sock = conn.sock
    }

    process.stdout.write(`Sending activation request (KMS V${majorVersion}) `)

    try {
      const { status, response, result, hwid } = await sendActivationRequest(
        sock,
        requestBase
      )
      const ePidGroup = KmsData.csvlkData[i].ePidGroup
      process.stdout.write(`${ePidGroup.padEnd(11)}`)

      if (status) {
        displayRequestError(status, i + 1, KmsData.csvlkData.length)
        if (status === 1) break
        if ((status & 0xf0000000) === 0x80000000) {
          currentMajorVer--
          i--
        }
        lines.push('')
        continue
      }

      process.stdout.write(
        `${i + 7 - currentMajorVer} of ${KmsData.csvlkData.length + 6 - currentMajorVer}`
      )
      displayResponse(result, response, hwid)

      const ePID = ucs2ToUtf8(response.kmsPID, PID_BUFFER_SIZE)
      let line = `${ePidGroup} = ${ePID}`
      if (response.majorVer > 5) {
        const hwidHex = Array.from(hwid.subarray(0, 8))
          .map(b => b.toString(16).padStart(2, '0').toUpperCase())
          .join(' ')
        line += ` / ${hwidHex}`
      }
      lines.push(line)
    } catch (err: any) {
      errorout(`\nError: ${err.message}\n`)
      lines.push('')
    }
  }

  // Write output
  if (fnIniClient === '-') {
    process.stdout.write('\n')
    for (const line of lines) {
      if (line) process.stdout.write(line + '\n')
    }
  } else if (fnIniClient) {
    const content = lines.filter(l => l).join('\n') + '\n'
    fs.writeFileSync(fnIniClient, content)
    process.stdout.write(`\nCreating ${fnIniClient}\n`)
  }

  if (sock) sock.destroy()
}

main().catch(err => {
  errorout(`Fatal: ${err.message || err}\n`)
  process.exit(1)
})
