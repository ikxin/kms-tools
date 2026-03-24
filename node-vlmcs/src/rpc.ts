/**
 * DCE-RPC 协议层 — 实现 KMS 激活所需的 DCE-RPC 客户端协议
 *
 * 参考原版源码:
 *   - src/rpc.c  (rpcBindOrAlterClientContext, rpcSendRequest 等)
 *   - src/rpc.h  (RPC_HEADER, RPC_BIND_REQUEST, RPC_RESPONSE 等结构定义)
 */

import * as net from 'net'
import { sendData, recvData } from './network'

// ─── 数据包类型 (参考 src/rpc.h 中的 RPC_PT_* 常量) ────────────────────────

const RPC_PT_REQUEST = 0 // 请求
const RPC_PT_RESPONSE = 2 // 响应
const RPC_PT_FAULT = 3 // 错误
const RPC_PT_BIND_REQ = 11 // 绑定请求
const RPC_PT_BIND_ACK = 12 // 绑定确认
const RPC_PT_ALTERCONTEXT_REQ = 14 // 修改上下文请求
const RPC_PT_ALTERCONTEXT_ACK = 15 // 修改上下文确认

// ─── 数据包标志 ─────────────────────────────────────────────────────────────

const RPC_PF_FIRST = 1 // 分片的第一个包
const RPC_PF_LAST = 2 // 分片的最后一个包
const RPC_PF_MULTIPLEX = 16 // 多路复用

// ─── 绑定确认结果码 (参考 src/rpc.h) ───────────────────────────────────────

const RPC_BIND_ACCEPT = 0 // 接受
const RPC_BIND_NACK = 2 // 拒绝
const RPC_BIND_ACK = 3 // 确认（用于 BTFN 绑定时间特性协商）

// ─── RPC 头部大小 ───────────────────────────────────────────────────────────

/** RPC 头部固定大小: 16 字节 */
const RPC_HEADER_SIZE = 16

// ─── GUID 常量 (原始线路字节，无字节序转换) ─────────────────────────────────

/** NDR32 传输语法 GUID */
const TransferSyntaxNDR32 = Buffer.from([
  0x04, 0x5d, 0x88, 0x8a, 0xeb, 0x1c, 0xc9, 0x11, 0x9f, 0xe8, 0x08, 0x00, 0x2b,
  0x10, 0x48, 0x60
])

/** KMS 接口 UUID */
const InterfaceUuid = Buffer.from([
  0x75, 0x21, 0xc8, 0x51, 0x4e, 0x84, 0x50, 0x47, 0xb0, 0xd8, 0xec, 0x25, 0x55,
  0x55, 0xbc, 0x06
])

/** NDR64 传输语法 GUID */
const TransferSyntaxNDR64 = Buffer.from([
  0x33, 0x05, 0x71, 0x71, 0xba, 0xbe, 0x37, 0x49, 0x83, 0x19, 0xb5, 0xdb, 0xef,
  0x9c, 0xcc, 0x36
])

/** 绑定时间特性协商 GUID (BTFN) */
const BindTimeFeatureNegotiation = Buffer.from([
  0x2c, 0x1c, 0xb7, 0x6c, 0x12, 0x98, 0x40, 0x45, 0x03, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00
])

// ─── 导出接口 ───────────────────────────────────────────────────────────────

/** RPC 已协商的能力标志 */
export interface RpcFlags {
  hasNDR32: boolean // 是否支持 NDR32 传输语法
  hasNDR64: boolean // 是否支持 NDR64 传输语法
  hasBTFN: boolean // 是否支持绑定时间特性协商
}

/** RPC 诊断信息 */
export interface RpcDiag {
  hasRpcDiag: boolean // 是否有 RPC 诊断信息
  hasBTFN: boolean // 服务器是否支持 BTFN
  hasNDR64: boolean // 服务器是否支持 NDR64
}

// ─── 状态 ───────────────────────────────────────────────────────────────────

/** 调用 ID，从 2 开始（与微软实现一致） */
let callId = 2

// ─── 工具函数: 写入 RPC 头部 ───────────────────────────────────────────────

/**
 * 写入 RPC 头部 (16 字节)
 * 参考: src/rpc.h 中的 RPC_HEADER 结构
 */
function writeRpcHeader(
  buf: Buffer,
  packetType: number,
  packetFlags: number,
  fragLength: number,
  currentCallId: number
): void {
  buf.writeUInt8(5, 0) // VersionMajor = 5
  buf.writeUInt8(0, 1) // VersionMinor = 0
  buf.writeUInt8(packetType, 2) // PacketType
  buf.writeUInt8(packetFlags, 3) // PacketFlags
  buf.writeUInt32LE(0x00000010, 4) // DataRepresentation: LE, ASCII, IEEE
  buf.writeUInt16LE(fragLength, 8) // FragLength
  buf.writeUInt16LE(0, 10) // AuthLength
  buf.writeUInt32LE(currentCallId, 12) // CallId
}

// ─── 工具函数: 解析 RPC 头部 ───────────────────────────────────────────────

interface RpcHeader {
  versionMajor: number
  versionMinor: number
  packetType: number
  packetFlags: number
  dataRepresentation: number
  fragLength: number
  authLength: number
  callId: number
}

/** 从 Buffer 解析 RPC 头部 */
function parseRpcHeader(buf: Buffer): RpcHeader {
  return {
    versionMajor: buf.readUInt8(0),
    versionMinor: buf.readUInt8(1),
    packetType: buf.readUInt8(2),
    packetFlags: buf.readUInt8(3),
    dataRepresentation: buf.readUInt32LE(4),
    fragLength: buf.readUInt16LE(8),
    authLength: buf.readUInt16LE(10),
    callId: buf.readUInt32LE(12)
  }
}

/** 获取数据包类型的可读名称（用于调试输出） */
function packetTypeName(type: number): string {
  switch (type) {
    case RPC_PT_REQUEST:
      return 'Request'
    case RPC_PT_RESPONSE:
      return 'Response'
    case RPC_PT_FAULT:
      return 'Fault'
    case RPC_PT_BIND_REQ:
      return 'Bind'
    case RPC_PT_BIND_ACK:
      return 'Bind Ack'
    case RPC_PT_ALTERCONTEXT_REQ:
      return 'Alter Context'
    case RPC_PT_ALTERCONTEXT_ACK:
      return 'Alter Context Ack'
    default:
      return `Unknown(${type})`
  }
}

// ─── 构建 Bind/AlterContext 数据包 ──────────────────────────────────────────

interface CtxItem {
  transferSyntax: Buffer // 传输语法 GUID
  syntaxVersion: number // 语法版本
}

/**
 * 构建 Bind 或 AlterContext 数据包
 *
 * 参考: src/rpc.c 中的 rpcBindOrAlterClientContext() 的数据包构建部分
 * 每个上下文项: ContextId(2) + NumTransItems(2) + InterfaceUUID(16) +
 *              InterfaceVerMajor(2) + InterfaceVerMinor(2) + TransferSyntax(16) + SyntaxVersion(4) = 44 字节
 */
function buildBindPacket(
  packetType: number,
  packetFlags: number,
  currentCallId: number,
  ctxItems: CtxItem[]
): Buffer {
  const ctxItemSize = 44
  // 绑定体: MaxXmitFrag(2) + MaxRecvFrag(2) + AssocGroup(4) + NumCtxItems(4) + 上下文项数组
  const bindBodySize = 2 + 2 + 4 + 4 + ctxItems.length * ctxItemSize
  const totalSize = RPC_HEADER_SIZE + bindBodySize
  const buf = Buffer.alloc(totalSize)

  writeRpcHeader(buf, packetType, packetFlags, totalSize, currentCallId)

  let offset = RPC_HEADER_SIZE
  buf.writeUInt16LE(5840, offset) // MaxXmitFrag
  buf.writeUInt16LE(5840, offset + 2) // MaxRecvFrag
  buf.writeUInt32LE(0, offset + 4) // AssocGroup
  buf.writeUInt32LE(ctxItems.length, offset + 8) // NumCtxItems
  offset += 12

  for (let i = 0; i < ctxItems.length; i++) {
    buf.writeUInt16LE(i, offset) // ContextId
    buf.writeUInt16LE(1, offset + 2) // NumTransItems
    InterfaceUuid.copy(buf, offset + 4) // InterfaceUUID
    buf.writeUInt16LE(1, offset + 20) // InterfaceVerMajor
    buf.writeUInt16LE(0, offset + 22) // InterfaceVerMinor
    ctxItems[i].transferSyntax.copy(buf, offset + 24) // TransferSyntax
    buf.writeUInt32LE(ctxItems[i].syntaxVersion, offset + 40) // SyntaxVersion
    offset += ctxItemSize
  }

  return buf
}

// ─── 解析绑定响应 ───────────────────────────────────────────────────────────

interface BindResult {
  ackResult: number // 确认结果码
  ackReason: number // 确认原因
  transferSyntax: Buffer // 传输语法
  syntaxVersion: number // 语法版本
}

/**
 * 解析 Bind/AlterContext 响应体
 * 参考: src/rpc.h 中的 RPC_BIND_RESPONSE 结构
 */
function parseBindResponse(
  body: Buffer,
  verbose: boolean
): { results: BindResult[]; maxRecvFrag: number } {
  let offset = 0

  const maxXmitFrag = body.readUInt16LE(offset)
  const maxRecvFrag = body.readUInt16LE(offset + 2)
  const assocGroup = body.readUInt32LE(offset + 4)
  offset += 8

  const secondaryAddressLength = body.readUInt16LE(offset)
  offset += 2

  if (verbose) {
    console.log(
      `  Max Xmit/Recv Frag: ${maxXmitFrag}/${maxRecvFrag}, AssocGroup: 0x${assocGroup.toString(16).padStart(8, '0')}`
    )
    console.log(`  Secondary Address Length: ${secondaryAddressLength}`)
  }

  // 跳过二级地址和对齐填充到 4 字节边界
  offset += secondaryAddressLength
  const totalOff = offset
  offset += (4 - (totalOff % 4)) % 4

  const numResults = body.readUInt32LE(offset)
  offset += 4

  if (verbose) {
    console.log(`  Num Results: ${numResults}`)
  }

  const results: BindResult[] = []
  for (let i = 0; i < numResults; i++) {
    const ackResult = body.readUInt16LE(offset)
    const ackReason = body.readUInt16LE(offset + 2)
    const transferSyntax = Buffer.from(body.subarray(offset + 4, offset + 20))
    const syntaxVersion = body.readUInt32LE(offset + 20)
    offset += 24

    if (verbose) {
      const resultStr =
        ackResult === RPC_BIND_ACCEPT
          ? 'Accept'
          : ackResult === RPC_BIND_NACK
            ? 'Nack'
            : ackResult === RPC_BIND_ACK
              ? 'Ack'
              : `Unknown(0x${ackResult.toString(16)})`
      console.log(
        `  Result[${i}]: ${resultStr} (reason: 0x${ackReason.toString(16)})`
      )
    }

    results.push({ ackResult, ackReason, transferSyntax, syntaxVersion })
  }

  return { results, maxRecvFrag }
}

// ─── 绑定/修改上下文 ───────────────────────────────────────────────────────

/**
 * 执行单次 Bind 或 AlterContext 交换并处理响应
 *
 * 参考: src/rpc.c 中的 rpcBindOrAlterClientContext()
 */
async function rpcBindOrAlterContext(
  sock: net.Socket,
  packetType: number,
  verbose: boolean,
  useClientRpcNDR64: boolean,
  useClientRpcBTFN: boolean,
  useMultiplexedRpc: boolean,
  rpcFlags: RpcFlags,
  rpcDiag: RpcDiag
): Promise<number> {
  // AlterContext 只发送 NDR32；Bind 发送 NDR32 + 可选 NDR64 + BTFN
  const isBind = packetType === RPC_PT_BIND_REQ
  const ctxItems: CtxItem[] = [
    { transferSyntax: TransferSyntaxNDR32, syntaxVersion: 2 }
  ]

  let ctxNDR64 = -1
  let ctxBTFN = -1

  if (isBind && useClientRpcNDR64) {
    ctxNDR64 = ctxItems.length
    ctxItems.push({ transferSyntax: TransferSyntaxNDR64, syntaxVersion: 1 })
  }

  if (isBind && useClientRpcBTFN) {
    ctxBTFN = ctxItems.length
    ctxItems.push({
      transferSyntax: BindTimeFeatureNegotiation,
      syntaxVersion: 1
    })
  }

  const packetFlags =
    RPC_PF_FIRST | RPC_PF_LAST | (useMultiplexedRpc ? RPC_PF_MULTIPLEX : 0)
  const currentCallId = callId++
  const bindPacket = buildBindPacket(
    packetType,
    packetFlags,
    currentCallId,
    ctxItems
  )

  await sendData(sock, bindPacket)

  // 接收响应头
  const headerBuf = await recvData(sock, RPC_HEADER_SIZE)
  const header = parseRpcHeader(headerBuf)

  if (verbose) {
    console.log(
      `Received RPC ${packetTypeName(header.packetType)} (FragLength=${header.fragLength}, CallId=${header.callId})`
    )
  }

  const expectedAckType = isBind ? RPC_PT_BIND_ACK : RPC_PT_ALTERCONTEXT_ACK

  if (
    header.packetType === RPC_PT_FAULT ||
    header.packetType !== expectedAckType
  ) {
    const bodySize = header.fragLength - RPC_HEADER_SIZE
    if (bodySize > 0) await recvData(sock, bodySize)
    return 1
  }

  // 读取响应体
  const bodySize = header.fragLength - RPC_HEADER_SIZE
  const body = await recvData(sock, bodySize)
  const { results } = parseBindResponse(body, verbose)

  // 处理每个上下文项的结果
  for (let i = 0; i < results.length; i++) {
    const result = results[i]

    if (i === ctxBTFN) {
      // BTFN 上下文：结果码为 RPC_BIND_ACK(3) 表示支持
      if (result.ackResult === RPC_BIND_ACK) {
        rpcFlags.hasBTFN = true
        rpcDiag.hasBTFN = true
        if (verbose) process.stdout.write('... BTFN ')
      }
      continue
    }

    if (result.ackResult === RPC_BIND_NACK) {
      continue // 被拒绝，跳过
    }

    if (result.ackResult === RPC_BIND_ACCEPT) {
      if (i === ctxNDR64) {
        rpcFlags.hasNDR64 = true
        rpcDiag.hasNDR64 = true
        if (verbose) process.stdout.write('... NDR64 ')
      } else if (i === 0) {
        rpcFlags.hasNDR32 = true
        if (verbose) process.stdout.write('... NDR32 ')
      }
    }
  }

  return 0
}

/**
 * 执行 RPC 绑定协商
 *
 * 始终请求 NDR32 传输语法。根据参数可选请求 NDR64 和绑定时间特性协商 (BTFN)。
 * 如果 NDR32 未被接受，发送 AlterContext 单独协商 NDR32。
 *
 * 参考: src/rpc.c 中的 rpcBindClient()
 */
export async function rpcBindClient(
  sock: net.Socket,
  verbose: boolean,
  useClientRpcNDR64: boolean,
  useClientRpcBTFN: boolean,
  useMultiplexedRpc: boolean
): Promise<{ status: number; rpcDiag: RpcDiag; rpcFlags: RpcFlags }> {
  const rpcFlags: RpcFlags = {
    hasNDR32: false,
    hasNDR64: false,
    hasBTFN: false
  }
  const rpcDiag: RpcDiag = {
    hasRpcDiag: false,
    hasBTFN: false,
    hasNDR64: false
  }

  // 第一步: 发送 Bind 请求
  let status = await rpcBindOrAlterContext(
    sock,
    RPC_PT_BIND_REQ,
    verbose,
    useClientRpcNDR64,
    useClientRpcBTFN,
    useMultiplexedRpc,
    rpcFlags,
    rpcDiag
  )

  if (status) return { status, rpcDiag, rpcFlags }

  // 第二步: 如果 NDR32 未被接受，发送 AlterContext 单独协商
  if (!rpcFlags.hasNDR32) {
    status = await rpcBindOrAlterContext(
      sock,
      RPC_PT_ALTERCONTEXT_REQ,
      verbose,
      false,
      false,
      useMultiplexedRpc,
      rpcFlags,
      rpcDiag
    )
    if (status) return { status, rpcDiag, rpcFlags }
  }

  if (!rpcFlags.hasNDR32 && !rpcFlags.hasNDR64) {
    process.stderr.write(
      '\nFatal: Could neither negotiate NDR32 nor NDR64 with the RPC server\n'
    )
    return { status: 1, rpcDiag, rpcFlags }
  }

  rpcDiag.hasRpcDiag = true

  if (verbose) {
    process.stdout.write('\n')
  }

  return { status: 0, rpcDiag, rpcFlags }
}

// ─── 发送 RPC 请求 (参考 src/rpc.c 中的 rpcSendRequest) ────────────────────

/**
 * 通过已建立的 RPC 连接发送 KMS 请求并接收响应
 *
 * 当服务器支持 NDR64 且不是第一个包时使用 NDR64 编码，否则回退到 NDR32。
 *
 * 参考: src/rpc.c 中的 rpcSendRequest()
 */
export async function rpcSendRequest(
  sock: net.Socket,
  kmsRequest: Buffer,
  rpcFlags: RpcFlags,
  useClientRpcNDR64: boolean,
  firstPacketSent: boolean
): Promise<{
  status: number
  kmsResponse: Buffer | null
  responseSize: number
}> {
  const requestSize = kmsRequest.length
  const useNDR64 = useClientRpcNDR64 && rpcFlags.hasNDR64 && firstPacketSent

  let requestBody: Buffer
  if (useNDR64) {
    // NDR64 格式: AllocHint(4) + ContextId(2) + Opnum(2) + DataLength(8) + DataSizeIs(8) + Data
    const bodySize = 4 + 2 + 2 + 8 + 8 + requestSize
    requestBody = Buffer.alloc(bodySize)
    let offset = 0
    requestBody.writeUInt32LE(requestSize + 16, offset) // AllocHint
    offset += 4
    requestBody.writeUInt16LE(1, offset) // ContextId (NDR64 = 1)
    offset += 2
    requestBody.writeUInt16LE(0, offset) // Opnum
    offset += 2
    requestBody.writeBigUInt64LE(BigInt(requestSize), offset) // Ndr64.DataLength
    offset += 8
    requestBody.writeBigUInt64LE(BigInt(requestSize), offset) // Ndr64.DataSizeIs
    offset += 8
    kmsRequest.copy(requestBody, offset)
  } else {
    // NDR32 格式: AllocHint(4) + ContextId(2) + Opnum(2) + DataLength(4) + DataSizeIs(4) + Data
    const bodySize = 4 + 2 + 2 + 4 + 4 + requestSize
    requestBody = Buffer.alloc(bodySize)
    let offset = 0
    requestBody.writeUInt32LE(requestSize + 8, offset) // AllocHint
    offset += 4
    requestBody.writeUInt16LE(0, offset) // ContextId (NDR32 = 0)
    offset += 2
    requestBody.writeUInt16LE(0, offset) // Opnum
    offset += 2
    requestBody.writeUInt32LE(requestSize, offset) // Ndr.DataLength
    offset += 4
    requestBody.writeUInt32LE(requestSize, offset) // Ndr.DataSizeIs
    offset += 4
    kmsRequest.copy(requestBody, offset)
  }

  const totalSize = RPC_HEADER_SIZE + requestBody.length
  const packet = Buffer.alloc(totalSize)
  const currentCallId = callId++
  writeRpcHeader(
    packet,
    RPC_PT_REQUEST,
    RPC_PF_FIRST | RPC_PF_LAST,
    totalSize,
    currentCallId
  )
  requestBody.copy(packet, RPC_HEADER_SIZE)

  await sendData(sock, packet)

  // ── 接收响应 ──────────────────────────────────────────────────────────

  const headerBuf = await recvData(sock, RPC_HEADER_SIZE)
  const header = parseRpcHeader(headerBuf)

  // 处理 Fault 响应
  if (header.packetType === RPC_PT_FAULT) {
    const bodySize = header.fragLength - RPC_HEADER_SIZE
    if (bodySize >= 4) {
      const faultBody = await recvData(sock, bodySize)
      const faultStatus = faultBody.readUInt32LE(0)
      return { status: faultStatus || 1, kmsResponse: null, responseSize: 0 }
    }
    if (bodySize > 0) await recvData(sock, bodySize)
    return { status: 1, kmsResponse: null, responseSize: 0 }
  }

  // 验证响应类型
  if (header.packetType !== RPC_PT_RESPONSE) {
    const bodySize = header.fragLength - RPC_HEADER_SIZE
    if (bodySize > 0) await recvData(sock, bodySize)
    return { status: 1, kmsResponse: null, responseSize: 0 }
  }

  // 读取完整响应体
  const bodySize = header.fragLength - RPC_HEADER_SIZE
  const body = await recvData(sock, bodySize)

  // 解析 NDR 响应头
  // 参考: src/rpc.h 中的 RPC_RESPONSE / RPC_RESPONSE64 结构
  let offset = 0
  const allocHint = body.readUInt32LE(offset) // AllocHint
  offset += 4
  const contextId = body.readUInt16LE(offset) // ContextId
  offset += 2
  const cancelCount = body.readUInt8(offset) // CancelCount
  offset += 1
  offset += 1 // Pad1

  const responseUsesNDR64 = contextId === 1

  let dataLength: number
  let dataSizeMax: bigint | number
  let dataSizeIs: bigint | number

  if (responseUsesNDR64) {
    // NDR64 响应: DataLength(8) + DataSizeMax(8) + DataSizeIs(8)
    dataLength = Number(body.readBigUInt64LE(offset))
    offset += 8
    dataSizeMax = body.readBigUInt64LE(offset)
    offset += 8
    dataSizeIs = body.readBigUInt64LE(offset)
    offset += 8
  } else {
    // NDR32 响应: DataLength(4) + DataSizeMax(4) + DataSizeIs(4)
    dataLength = body.readUInt32LE(offset)
    offset += 4
    dataSizeMax = body.readUInt32LE(offset)
    offset += 4
    dataSizeIs = body.readUInt32LE(offset)
    offset += 4
  }

  // 如果 dataSizeMax 为 0，说明 RPC 调用返回了错误状态
  if (dataSizeMax === 0 || dataSizeMax === 0n) {
    const errorStatus = Number(dataSizeIs)
    return { status: errorStatus || 1, kmsResponse: null, responseSize: 0 }
  }

  if (dataLength <= 0 || offset + dataLength > body.length) {
    return { status: 1, kmsResponse: null, responseSize: 0 }
  }

  // 提取 KMS 响应数据
  const kmsResponse = Buffer.from(body.subarray(offset, offset + dataLength))
  offset += dataLength

  // 4 字节对齐填充
  const padBytes = (4 - (dataLength % 4)) % 4
  offset += padBytes

  // 读取 ReturnCode (HRESULT)
  let returnCode = 0
  if (offset + 4 <= body.length) {
    returnCode = body.readUInt32LE(offset)
  }

  if (returnCode !== 0) {
    return { status: returnCode, kmsResponse, responseSize: dataLength }
  }

  return { status: 0, kmsResponse, responseSize: dataLength }
}
