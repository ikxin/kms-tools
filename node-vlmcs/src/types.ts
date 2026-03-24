/**
 * 基础类型定义 — GUID、FILETIME、UCS-2 编码转换
 *
 * 参考原版源码:
 *   - src/types.h    (GUID、FILETIME 等基本类型定义)
 *   - src/helpers.c  (GUID 字符串解析、时间转换)
 *   - src/output.c   (GUID 格式化输出)
 */

// ─── GUID 结构 ──────────────────────────────────────────────────────────────
// 与 C 代码中的 GUID 结构对应: Data1(DWORD) + Data2(WORD) + Data3(WORD) + Data4[8](BYTE)
// 内存中以小端序 (little-endian) 存储，与网络传输格式一致

/** GUID 结构体，对应 src/types.h 中的 GUID 定义 */
export interface GUID {
  data1: number // uint32，小端序
  data2: number // uint16，小端序
  data3: number // uint16，小端序
  data4: Buffer // 8 字节，直接存储
}

/** PID 缓冲区大小（WCHAR 数量），对应 src/types.h 中的 PID_BUFFER_SIZE */
export const PID_BUFFER_SIZE = 64
/** 工作站名缓冲区大小（WCHAR 数量） */
export const WORKSTATION_NAME_BUFFER = 64

// ─── FILETIME 常量 ──────────────────────────────────────────────────────────
// Windows FILETIME: 从 1601-01-01 起的 100 纳秒间隔数（64 位无符号整数）
// Unix 时间戳: 从 1970-01-01 起的秒数

/** FILETIME 纪元 (1601-01-01) 与 Unix 纪元 (1970-01-01) 的差值，单位为 100 纳秒 */
const FILETIME_UNIX_EPOCH_DIFF = 116444736000000000n
/** 每毫秒的 100 纳秒数 */
const HUNDRED_NS_PER_MS = 10000n

// ─── GUID 序列化 ────────────────────────────────────────────────────────────

/** 将 GUID 结构序列化为 16 字节小端序 Buffer，用于网络传输 */
export function guidToBuffer(guid: GUID): Buffer {
  const buf = Buffer.alloc(16)
  buf.writeUInt32LE(guid.data1, 0)
  buf.writeUInt16LE(guid.data2, 4)
  buf.writeUInt16LE(guid.data3, 6)
  guid.data4.copy(buf, 8, 0, 8)
  return buf
}

/**
 * 解析 GUID 字符串为小端序结构
 * 格式: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
 * Data1/Data2/Data3 作为十六进制整数解析（内存中小端存储）
 * Data4 直接从十六进制字符串取字节（不做字节序转换）
 *
 * 参考: src/helpers.c 中的 string2UuidLE()
 */
export function stringToGuidLE(str: string): GUID | null {
  const re =
    /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i
  const m = str.match(re)
  if (!m) return null

  const data1 = parseInt(m[1], 16) >>> 0
  const data2 = parseInt(m[2], 16)
  const data3 = parseInt(m[3], 16)
  const data4 = Buffer.from(m[4] + m[5], 'hex')

  return { data1, data2, data3, data4 }
}

// ─── FILETIME 转换 ──────────────────────────────────────────────────────────

/**
 * 获取当前时间的 FILETIME 表示（8 字节小端序 Buffer）
 * 参考: src/helpers.c 中的 getFileTime()
 */
export function unixTimeToFileTime(): Buffer {
  const nowMs = BigInt(Date.now())
  const ft = nowMs * HUNDRED_NS_PER_MS + FILETIME_UNIX_EPOCH_DIFF
  const buf = Buffer.alloc(8)
  buf.writeBigUInt64LE(ft)
  return buf
}

/**
 * 将 8 字节小端序 FILETIME Buffer 转换为 Unix 时间戳（秒）
 * 参考: src/output.c 中的时间格式化逻辑
 */
export function fileTimeToUnixTime(ft: Buffer): number {
  const val = ft.readBigUInt64LE(0)
  const unixMs = (val - FILETIME_UNIX_EPOCH_DIFF) / HUNDRED_NS_PER_MS
  return Number(unixMs) / 1000
}

// ─── UCS-2 编码转换 ─────────────────────────────────────────────────────────
// KMS 协议中的字符串使用 UCS-2 LE 编码（每个字符 2 字节，小端序）

/**
 * 将 UTF-8 字符串转换为 UCS-2 LE Buffer，固定长度 maxChars * 2 字节
 * 超出部分截断，不足部分填零
 */
export function utf8ToUcs2(str: string, maxChars: number): Buffer {
  const buf = Buffer.alloc(maxChars * 2)
  const truncated = str.slice(0, maxChars)
  const encoded = Buffer.from(truncated, 'utf16le')
  encoded.copy(buf, 0, 0, Math.min(encoded.length, maxChars * 2))
  return buf
}

/**
 * 将 UCS-2 LE Buffer 转换为 UTF-8 字符串，遇到空终止符 (0x0000) 停止
 * 参考: src/output.c 中 ePID 的解码逻辑
 */
export function ucs2ToUtf8(buf: Buffer, maxChars: number): string {
  const limit = Math.min(buf.length, maxChars * 2)
  // 查找空终止符（偶数边界上的两个零字节）
  let end = limit
  for (let i = 0; i < limit; i += 2) {
    if (buf[i] === 0 && buf[i + 1] === 0) {
      end = i
      break
    }
  }
  return buf.subarray(0, end).toString('utf16le')
}

// ─── 版本信息 ───────────────────────────────────────────────────────────────

/** 版本标识字符串，对应原版的 VERSION 宏 */
export const VERSION = 'private build'

// ─── 响应验证结果 ───────────────────────────────────────────────────────────

/**
 * KMS 响应验证结果 — 对应 src/kms.h 中的 RESPONSE_RESULT
 * 每个字段表示一项验证检查是否通过
 */
export interface ResponseResult {
  mask: number // 所有检查结果的位掩码
  hashOK: boolean // 哈希验证通过
  timeStampOK: boolean // 时间戳匹配
  clientMachineIDOK: boolean // 客户端机器 ID 匹配
  versionOK: boolean // 协议版本一致
  ivsOK: boolean // IV（初始化向量）匹配
  decryptSuccess: boolean // 解密成功
  hmacSha256OK: boolean // HMAC-SHA256 验证通过（仅 V6）
  pidLengthOK: boolean // PID 长度有效
  rpcOK: boolean // RPC 返回码为零
  ivNotSuspicious: boolean // IV 非可疑（V6 中请求和响应 IV 应不同）
  effectiveResponseSize: number // 实际响应大小
  correctResponseSize: number // 预期响应大小
}
