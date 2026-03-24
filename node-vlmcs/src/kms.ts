/**
 * KMS 协议实现 — 处理 V4/V5/V6 请求创建和响应解密
 *
 * 参考原版源码:
 *   - src/kms.c  (CreateRequestV4, CreateRequestV6, DecryptResponseV4, DecryptResponseV6)
 *   - src/kms.h  (REQUEST, RESPONSE, RESPONSE_RESULT 等结构定义)
 */

import {
  AesCtx,
  AES_BLOCK_BYTES,
  AES_KEY_BYTES,
  AesKeyV5,
  AesKeyV6,
  xorBlock,
  aesCmacV4,
  aesEncryptCbc,
  aesDecryptCbc,
  sha256,
  sha256Hmac,
  get16RandomBytes
} from './crypto'

import { PID_BUFFER_SIZE, ResponseResult } from './types'

// 重新导出时间工具函数
export {
  unixTimeToFileTime as getUnixTimeAsFileTime,
  fileTimeToUnixTime
} from './types'

// ─── 协议大小常量 (参考 src/kms.h 中的结构体大小) ──────────────────────────

// REQUEST 结构: Version(4) + VMInfo(4) + LicenseStatus(4) + BindingExpiration(4) +
//               AppID(16) + ActID(16) + KMSID(16) + CMID(16) + N_Policy(4) +
//               ClientTime(8) + CMID_prev(16) + WorkstationName(128) = 236 字节
const REQUEST_SIZE = 236
/** V4 请求大小: REQUEST(236) + AES-CMAC(16) = 252 字节 */
const REQUEST_V4_SIZE = 252
/** V5/V6 请求大小: Version(4) + IV(16) + REQUEST(236) + Pad(4) = 260 字节 */
const REQUEST_V6_SIZE = 260

/** V4 响应中 ePID 前面的字段大小: Version(4) + PIDSize(4) = 8 字节 */
const V4_PRE_EPID_SIZE = 8
/** V4 响应中 ePID 后面的字段大小: CMID(16) + ClientTime(8) + Count(4) + VLActivation(4) + VLRenewal(4) = 36 字节 */
const V4_POST_EPID_SIZE = 36
/** V6 未加密部分大小: Version(4) + IV(16) = 20 字节 */
const V6_UNENCRYPTED_SIZE = 20
/** V6 响应中 ePID 前面的字段大小: V6未加密(20) + ResponseBase.Version(4) + PIDSize(4) = 28 字节 */
const V6_PRE_EPID_SIZE = 28
/** V5 响应中 ePID 后面的额外字段: V4后(36) + RandomXoredIVs(16) + Hash(32) = 84 字节 */
const V5_POST_EPID_SIZE = 84
/** V6 响应中 ePID 后面的额外字段: V5后(84) + HwId(8) + XoredIVs(16) + HMAC(16) = 124 字节 */
const V6_POST_EPID_SIZE = 124
/** V6 解密大小: IV(16) + REQUEST(236) + Pad(4) = 256 字节 */
const V6_DECRYPT_SIZE = 256

const HMAC_SIZE = 16
const HASH_SIZE = 32
const HALF_HASH_SIZE = HASH_SIZE >> 1
/** PID 最大字节数: PID_BUFFER_SIZE * 2 = 128 字节 (UCS-2 编码) */
const KMS_PID_MAX_BYTES = PID_BUFFER_SIZE * 2

// 最大结构体大小（使用完整 PID_BUFFER_SIZE 时）
/** V4 响应最大大小: RESPONSE(172) + MAC(16) = 188 字节 */
const SIZEOF_RESPONSE_V4 = 188
/** V5 响应最大大小: Version(4) + IV(16) + RESPONSE(172) + RandomXoredIVs(16) + Hash(32) = 240 字节 */
const SIZEOF_RESPONSE_V5 = 240
/** V6 响应最大大小: V5(240) + HwId(8) + XoredIVs(16) + HMAC(16) = 280 字节 */
const SIZEOF_RESPONSE_V6 = 280

// V6 时间槽常量（每个时间槽约 4.11 小时）
// 用于 HMAC 计算，参考 src/kms.c 中的 CreateV6Hmac()
const TIME_C1 = 0x00000022816889bdn
const TIME_C2 = 0x000000208cbab5edn
const TIME_C3 = 0x3156cd5ac628477an
const UINT64_MASK = 0xffffffffffffffffn

// ─── 导出类型 ───────────────────────────────────────────────────────────────

/** 解析后的 KMS 响应，对应 src/kms.h 中的 RESPONSE 结构 */
export interface ParsedResponse {
  majorVer: number // 主版本号
  minorVer: number // 次版本号
  pidSize: number // PID 大小（字节）
  kmsPID: Buffer // KMS ePID (UCS-2 编码)
  cmid: Buffer // 客户端机器 ID (16 字节 GUID)
  clientTime: Buffer // 客户端请求时间 (8 字节 FILETIME)
  count: number // 当前活跃客户端数
  vlActivationInterval: number // 激活间隔（分钟）
  vlRenewalInterval: number // 续期间隔（分钟）
}

// ─── 内部工具函数 ───────────────────────────────────────────────────────────

/**
 * 从 ResponseResult 各字段计算位掩码
 * 参考: src/kms.c 中结果掩码的构建方式
 */
function computeMask(r: ResponseResult): number {
  let mask = 0
  if (r.hashOK) mask |= 1 << 0
  if (r.timeStampOK) mask |= 1 << 1
  if (r.clientMachineIDOK) mask |= 1 << 2
  if (r.versionOK) mask |= 1 << 3
  if (r.ivsOK) mask |= 1 << 4
  if (r.decryptSuccess) mask |= 1 << 5
  if (r.hmacSha256OK) mask |= 1 << 6
  if (r.pidLengthOK) mask |= 1 << 7
  if (r.rpcOK) mask |= 1 << 8
  if (r.ivNotSuspicious) mask |= 1 << 9
  mask |= (r.effectiveResponseSize & 0x1ff) << 14
  mask |= (r.correctResponseSize & 0x1ff) << 23
  return mask >>> 0
}

/** 创建空的 ParsedResponse（用于解密失败时的早期返回） */
function emptyParsedResponse(): ParsedResponse {
  return {
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
}

/**
 * 验证 PID 长度
 * 检查: pidSize <= 128，最后一个 WCHAR 为 0，倒数第二个之前的字符都非零
 *
 * 参考: src/kms.c 中的 checkPidLength()
 */
function checkPidLength(data: Buffer, pidSizeOffset: number): boolean {
  const pidSize = data.readUInt32LE(pidSizeOffset)
  if (pidSize > KMS_PID_MAX_BYTES) return false

  const pidOffset = pidSizeOffset + 4
  const numChars = pidSize >>> 1
  if (numChars < 1) return false

  // 最后一个 WCHAR 必须是空终止符
  if (data.readUInt16LE(pidOffset + (numChars - 1) * 2) !== 0) return false

  // 倒数第二个之前的所有 WCHAR 必须非零
  for (let i = 0; i < numChars - 2; i++) {
    if (data.readUInt16LE(pidOffset + i * 2) === 0) return false
  }

  return true
}

/**
 * 从解密后的数据中解析可变大小的响应基本字段
 * 参考: src/kms.c 中的响应解析逻辑
 */
function parseResponseBase(
  data: Buffer,
  verOff: number,
  pidSize: number,
  postEpid: Buffer
): ParsedResponse {
  const clampedPidSize = Math.min(pidSize, KMS_PID_MAX_BYTES)

  return {
    minorVer: data.readUInt16LE(verOff),
    majorVer: data.readUInt16LE(verOff + 2),
    pidSize,
    kmsPID: Buffer.from(data.subarray(verOff + 8, verOff + 8 + clampedPidSize)),
    cmid: Buffer.from(postEpid.subarray(0, 16)),
    clientTime: Buffer.from(postEpid.subarray(16, 24)),
    count: postEpid.readUInt32LE(24),
    vlActivationInterval: postEpid.readUInt32LE(28),
    vlRenewalInterval: postEpid.readUInt32LE(32)
  }
}

/**
 * 计算并写入 V6 HMAC
 * 从响应中读取 ClientTime 来派生基于时间槽的密钥，
 * 然后将 16 字节 HMAC 写入加密区域的末尾
 *
 * 参考: src/kms.c 中的 CreateV6Hmac()
 */
function createV6Hmac(
  encryptStart: Buffer,
  encryptSize: number,
  tolerance: number
): void {
  // ClientTime 位于: 加密区域末尾 - V6_POST_EPID_SIZE + sizeof(CMID)
  const ftOffset = encryptSize - V6_POST_EPID_SIZE + 16
  const clientTime = encryptStart.readBigUInt64LE(ftOffset)

  // 时间槽 ≈ 4.11 小时粒度
  const timeSlot =
    ((clientTime / TIME_C1) * TIME_C2 + TIME_C3 + BigInt(tolerance) * TIME_C1) &
    UINT64_MASK

  const timeSlotBuf = Buffer.alloc(8)
  timeSlotBuf.writeBigUInt64LE(timeSlot)
  const hash = sha256(timeSlotBuf)

  // HMAC 密钥 = SHA256(timeSlot) 的后 16 字节
  const hmacKey = hash.subarray(HALF_HASH_SIZE)
  const hmacData = encryptStart.subarray(0, encryptSize - HMAC_SIZE)
  const hmacResult = sha256Hmac(hmacKey, hmacData)

  // 将 HMAC 结果的后 16 字节写入 HMAC 字段
  hmacResult.copy(
    encryptStart,
    encryptSize - HMAC_SIZE,
    HALF_HASH_SIZE,
    HASH_SIZE
  )
}

// ─── 创建 V4 请求 (参考 src/kms.c 中的 CreateRequestV4) ────────────────────

/**
 * 构建 252 字节的 V4 KMS 请求: REQUEST(236) + AES-CMAC(16)
 */
export function createRequestV4(requestBase: Buffer): Buffer {
  const request = Buffer.alloc(REQUEST_V4_SIZE)
  requestBase.copy(request, 0, 0, REQUEST_SIZE)

  // 计算 AES-CMAC 并附加到请求末尾
  const mac = aesCmacV4(request, REQUEST_SIZE)
  mac.copy(request, REQUEST_SIZE)

  return request
}

// ─── 创建 V5/V6 请求 (参考 src/kms.c 中的 CreateRequestV6) ─────────────────

/**
 * 构建 260 字节的 V5/V6 KMS 请求: Version(4) + IV(16) + 加密的请求(240)
 */
export function createRequestV6(requestBase: Buffer): Buffer {
  const request = Buffer.alloc(REQUEST_V6_SIZE)

  // 外层版本号 = requestBase 版本号
  requestBase.copy(request, 0, 0, 4)

  // 随机 16 字节 IV
  const iv = get16RandomBytes()
  iv.copy(request, 4)

  // 将基础请求复制到加密区域
  requestBase.copy(request, 20, 0, REQUEST_SIZE)

  // 根据主版本号选择密钥（V6 使用 AesKeyV6，V5 使用 AesKeyV5）
  const majorVer = request.readUInt16LE(2)
  const isV6 = majorVer > 5

  const ctx = new AesCtx()
  ctx.initKey(isV6 ? AesKeyV6 : AesKeyV5, isV6, AES_KEY_BYTES)

  // 加密请求（236 字节 → 240 字节，含 PKCS#7 填充）
  const plaintext = Buffer.from(request.subarray(20, 20 + REQUEST_SIZE))
  const { encrypted } = aesEncryptCbc(ctx, iv, plaintext)
  encrypted.copy(request, 20)

  return request
}

// ─── 解密 V4 响应 (参考 src/kms.c 中的 DecryptResponseV4) ──────────────────

/**
 * 解密并验证 V4 KMS 响应
 * 线路格式: Version(4) + PIDSize(4) + PID(变长) + CMID(16) +
 *           ClientTime(8) + Count(4) + Intervals(8) + MAC(16)
 */
export function decryptResponseV4(
  rawResponse: Buffer,
  rawRequest: Buffer
): { result: ResponseResult; response: ParsedResponse } {
  const responseSize = rawResponse.length

  // 确定变长 PID 大小
  const pidSize = rawResponse.readUInt32LE(4)
  const clampedPidSize = Math.min(pidSize, KMS_PID_MAX_BYTES)
  const copySize = V4_PRE_EPID_SIZE + clampedPidSize
  const messageSize = copySize + V4_POST_EPID_SIZE

  // 提取 ePID 后面的区域（CMID、ClientTime、Count、Intervals）
  const postEpid = Buffer.from(
    rawResponse.subarray(copySize, copySize + V4_POST_EPID_SIZE)
  )
  const parsed = parseResponseBase(rawResponse, 0, pidSize, postEpid)

  // 计算 CMAC 并与接收到的 MAC 比较
  const computedMac = aesCmacV4(rawResponse, messageSize)
  const receivedMac = rawResponse.subarray(messageSize, messageSize + 16)

  // 与请求字段进行验证
  const reqVersion = rawRequest.readUInt32LE(0)
  const reqClientTime = rawRequest.subarray(84, 92) // REQUEST.ClientTime
  const reqCMID = rawRequest.subarray(64, 80) // REQUEST.CMID

  const result: ResponseResult = {
    mask: 0,
    hashOK: computedMac.equals(receivedMac),
    timeStampOK: parsed.clientTime.equals(reqClientTime),
    clientMachineIDOK: parsed.cmid.equals(reqCMID),
    versionOK: rawResponse.readUInt32LE(0) === reqVersion,
    ivsOK: true,
    decryptSuccess: true,
    hmacSha256OK: true,
    pidLengthOK: checkPidLength(rawResponse, 4),
    rpcOK: true,
    ivNotSuspicious: true,
    effectiveResponseSize: responseSize,
    correctResponseSize: SIZEOF_RESPONSE_V4 - KMS_PID_MAX_BYTES + pidSize
  }
  result.mask = computeMask(result)

  return { result, response: parsed }
}

// ─── 解密 V5/V6 响应 (参考 src/kms.c 中的 DecryptResponseV6) ───────────────

/**
 * 解密并验证 V5/V6 KMS 响应
 *
 * 线路格式（Version 之后的部分为加密）:
 *   Version(4) + [IV(16) + ResponseBase(变长) + RandomXoredIVs(16) + Hash(32)
 *                 + HwId(8, 仅V6) + XoredIVs(16, 仅V6) + HMAC(16, 仅V6)
 *                 + PKCS填充]
 */
export function decryptResponseV6(
  rawResponse: Buffer,
  rawRequest: Buffer
): { result: ResponseResult; response: ParsedResponse; hwid: Buffer } {
  const totalSize = rawResponse.length
  const hwid = Buffer.alloc(8)

  // 创建可变工作副本（解密是就地操作）
  const response = Buffer.from(rawResponse)
  const request = Buffer.from(rawRequest)

  // 初始假设所有验证通过
  const result: ResponseResult = {
    mask: 0,
    hashOK: true,
    timeStampOK: true,
    clientMachineIDOK: true,
    versionOK: true,
    ivsOK: true,
    decryptSuccess: true,
    hmacSha256OK: true,
    pidLengthOK: true,
    rpcOK: true,
    ivNotSuspicious: true,
    effectiveResponseSize: totalSize,
    correctResponseSize: 0
  }

  // 从外层（未加密）版本字段确定协议版本
  const majorVer = response.readUInt16LE(2)
  const isV6 = majorVer > 5

  // 解密 4 字节 Version 之后的所有内容
  const ctx = new AesCtx()
  ctx.initKey(isV6 ? AesKeyV6 : AesKeyV5, isV6, AES_KEY_BYTES)

  const encryptedLen = totalSize - 4
  aesDecryptCbc(ctx, null, response.subarray(4), encryptedLen)

  // ── 验证 PKCS#7 填充 ──
  const lastByte = response[totalSize - 1]
  if (lastByte === 0 || lastByte > AES_BLOCK_BYTES) {
    result.decryptSuccess = false
    result.mask = computeMask(result)
    return { result, response: emptyParsedResponse(), hwid }
  }
  for (let i = totalSize - lastByte; i < totalSize - 1; i++) {
    if (response[i] !== lastByte) {
      result.decryptSuccess = false
      result.mask = computeMask(result)
      return { result, response: emptyParsedResponse(), hwid }
    }
  }

  // ── 解析解密后的响应 ──
  const pidSize = response.readUInt32LE(V6_PRE_EPID_SIZE - 4) // ResponseBase.PIDSize
  const clampedPidSize = Math.min(pidSize, KMS_PID_MAX_BYTES)
  const copySize1 = V6_PRE_EPID_SIZE + clampedPidSize

  const postEpidSize = isV6 ? V6_POST_EPID_SIZE : V5_POST_EPID_SIZE
  const postEpid = Buffer.from(
    response.subarray(copySize1, copySize1 + postEpidSize)
  )

  const parsed = parseResponseBase(
    response,
    V6_UNENCRYPTED_SIZE,
    pidSize,
    postEpid
  )

  // ── 解密请求的 IV + RequestBase + Pad（用于验证） ──
  aesDecryptCbc(ctx, null, request.subarray(4), V6_DECRYPT_SIZE)

  // ── 版本一致性检查 ──
  const outerReqVersion = request.readUInt32LE(0)
  const innerReqVersion = request.readUInt32LE(20) // RequestBase.Version
  const outerRespVersion = response.readUInt32LE(0)
  const innerRespVersion = response.readUInt32LE(V6_UNENCRYPTED_SIZE) // ResponseBase.Version

  result.versionOK =
    outerReqVersion === innerRespVersion &&
    outerReqVersion === outerRespVersion &&
    outerReqVersion === innerReqVersion

  // ── PID、时间戳、CMID 检查 ──
  result.pidLengthOK = checkPidLength(response, V6_PRE_EPID_SIZE - 4)

  const reqClientTime = request.subarray(20 + 84, 20 + 92) // RequestBase.ClientTime
  result.timeStampOK = parsed.clientTime.equals(reqClientTime)

  const reqCMID = request.subarray(20 + 64, 20 + 80) // RequestBase.CMID
  result.clientMachineIDOK = parsed.cmid.equals(reqCMID)

  // ── 哈希验证 (RandomXoredIVs / Hash) ──
  const decryptedReqIV = Buffer.from(request.subarray(4, 20))
  const randomXoredIVs = postEpid.subarray(
    V4_POST_EPID_SIZE,
    V4_POST_EPID_SIZE + 16
  )
  const receivedHash = postEpid.subarray(
    V4_POST_EPID_SIZE + 16,
    V4_POST_EPID_SIZE + 16 + HASH_SIZE
  )

  // 恢复原始随机字节: random = decryptedReqIV XOR RandomXoredIVs
  const randomKey = Buffer.from(decryptedReqIV)
  xorBlock(randomXoredIVs, randomKey)
  const hashVerify = sha256(randomKey)
  result.hashOK = hashVerify.equals(receivedHash)

  // ── 计算正确的响应大小（不含 PKCS 填充） ──
  const sizeofStruct = isV6 ? SIZEOF_RESPONSE_V6 : SIZEOF_RESPONSE_V5
  result.correctResponseSize = sizeofStruct - KMS_PID_MAX_BYTES + pidSize

  // ── 版本特定验证 ──
  if (isV6) {
    // 提取 HwId
    postEpid.copy(hwid, 0, V5_POST_EPID_SIZE, V5_POST_EPID_SIZE + 8)

    // XoredIVs 必须等于解密后的请求 IV
    const xoredIVs = postEpid.subarray(
      V5_POST_EPID_SIZE + 8,
      V5_POST_EPID_SIZE + 24
    )
    result.ivsOK = decryptedReqIV.equals(xoredIVs)

    // 请求和响应的 IV 应该不同（相同说明是模拟器）
    const responseIV = response.subarray(4, 20)
    result.ivNotSuspicious = !decryptedReqIV.equals(responseIV)

    // 使用 ±1 时间槽容差验证 HMAC
    const savedHmac = Buffer.from(
      postEpid.subarray(V5_POST_EPID_SIZE + 24, V5_POST_EPID_SIZE + 40)
    )
    result.hmacSha256OK = false

    const encryptStart = response.subarray(4)
    const encryptSize = result.correctResponseSize - 4

    for (let tolerance = -1; tolerance <= 1; tolerance++) {
      createV6Hmac(encryptStart, encryptSize, tolerance)
      const computed = encryptStart.subarray(
        encryptSize - HMAC_SIZE,
        encryptSize
      )
      if (savedHmac.equals(computed)) {
        result.hmacSha256OK = true
        break
      }
    }
  } else {
    // V5: 请求和响应的 IV 必须匹配
    const responseIV = response.subarray(4, 20)
    result.ivsOK = decryptedReqIV.equals(responseIV)
    result.hmacSha256OK = true // V5 没有 HMAC
  }

  // 将 PKCS 填充加到 correctResponseSize
  const encPartSize = result.correctResponseSize - 4
  result.correctResponseSize += (~encPartSize & 0xf) + 1

  result.mask = computeMask(result)
  return { result, response: parsed, hwid }
}
