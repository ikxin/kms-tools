/**
 * 加密操作模块 — 自定义 AES-128 实现，完全匹配原版 vlmcs C 代码
 * 仅使用 Node.js 内建 crypto 模块处理 SHA256、HMAC-SHA256 和随机数生成
 *
 * 参考原版源码:
 *   - src/crypto.c           (AES 加密/解密核心实现)
 *   - src/crypto_internal.c  (AES S-Box、密钥扩展、块操作)
 *   - src/crypto.h           (AES 常量和接口定义)
 */

import * as crypto from 'crypto'

// ─── 常量定义 (参考 src/crypto.h) ──────────────────────────────────────────

/** AES 块大小: 16 字节 = 128 位 */
export const AES_BLOCK_BYTES = 16
/** AES 密钥大小: 16 字节 = 128 位 (AES-128) */
export const AES_KEY_BYTES = 16
/** V4 密钥大小: 20 字节 (前 16 字节为 AES 密钥，后 4 字节用于 CMAC) */
export const V4_KEY_BYTES = 20

/** AES 块中的 32 位字数 */
const AES_BLOCK_WORDS = AES_BLOCK_BYTES >>> 2

// ─── AES 密钥 (参考 src/crypto.c) ──────────────────────────────────────────

/** V4 协议密钥 (20 字节)，用于 AES-CMAC 计算 */
export const AesKeyV4 = Buffer.from([
  0x05, 0x3d, 0x83, 0x07, 0xf9, 0xe5, 0xf0, 0x88, 0xeb, 0x5e, 0xa6, 0x68, 0x6c,
  0xf0, 0x37, 0xc7, 0xe4, 0xef, 0xd2, 0xd6
])

/** V5 协议密钥 (16 字节)，用于 AES-CBC 加密/解密 */
export const AesKeyV5 = Buffer.from([
  0xcd, 0x7e, 0x79, 0x6f, 0x2a, 0xb2, 0x5d, 0xcb, 0x55, 0xff, 0xc8, 0xef, 0x83,
  0x64, 0xc4, 0x70
])

/** V6 协议密钥 (16 字节)，用于 AES-CBC 加密/解密，密钥扩展时有额外 XOR 修改 */
export const AesKeyV6 = Buffer.from([
  0xa9, 0x4a, 0x41, 0x95, 0xe2, 0x01, 0x43, 0x2d, 0x9b, 0xcb, 0x46, 0x04, 0x05,
  0xd8, 0x4a, 0x21
])

// ─── AES S-Box (参考 src/crypto_internal.c) ────────────────────────────────
// 标准 Rijndael S-Box 替换表，用于 SubBytes 步骤

const SBox: readonly number[] = [
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe,
  0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4,
  0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7,
  0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, 0x04, 0xc7, 0x23, 0xc3,
  0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, 0x09,
  0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3,
  0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe,
  0x39, 0x4a, 0x4c, 0x58, 0xcf, 0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85,
  0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92,
  0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c,
  0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19,
  0x73, 0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14,
  0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2,
  0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5,
  0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08, 0xba, 0x78, 0x25,
  0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
  0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86,
  0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e,
  0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, 0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42,
  0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
]

// ─── AES 逆 S-Box ──────────────────────────────────────────────────────────
// 用于 InvSubBytes 步骤（解密）

const SBoxR: readonly number[] = [
  0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81,
  0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e,
  0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, 0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23,
  0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e, 0x08, 0x2e, 0xa1, 0x66,
  0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25, 0x72,
  0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65,
  0xb6, 0x92, 0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46,
  0x57, 0xa7, 0x8d, 0x9d, 0x84, 0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a,
  0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06, 0xd0, 0x2c, 0x1e, 0x8f, 0xca,
  0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, 0x3a, 0x91,
  0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6,
  0x73, 0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8,
  0x1c, 0x75, 0xdf, 0x6e, 0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f,
  0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b, 0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2,
  0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4, 0x1f, 0xdd, 0xa8,
  0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
  0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93,
  0xc9, 0x9c, 0xef, 0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb,
  0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61, 0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6,
  0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d
]

// ─── 轮常量 (参考 src/crypto_internal.c 中的 AesRcon) ────────────────────────
// 大端序值，在密钥扩展中通过 BE32 进行字节序转换

const RCon: readonly number[] = [
  0x00000000, 0x01000000, 0x02000000, 0x04000000, 0x08000000, 0x10000000,
  0x20000000, 0x40000000, 0x80000000, 0x1b000000, 0x36000000
]

// ─── 32 位工具函数 (参考 src/crypto_internal.c) ─────────────────────────────

/** 32 位字节序交换（等同于小端系统上的 BE32 宏） */
function be32(v: number): number {
  return (
    (((v & 0xff) << 24) |
      ((v & 0xff00) << 8) |
      ((v >>> 8) & 0xff00) |
      ((v >>> 24) & 0xff)) >>>
    0
  )
}

/** 32 位无符号右旋转 */
function ror32(v: number, n: number): number {
  return ((v << (32 - n)) | (v >>> n)) >>> 0
}

/** 对 DWORD 的每个字节应用 S-Box 替换（本机小端字节序） */
function subDword(v: number): number {
  return (
    (SBox[v & 0xff] |
      (SBox[(v >>> 8) & 0xff] << 8) |
      (SBox[(v >>> 16) & 0xff] << 16) |
      (SBox[(v >>> 24) & 0xff] << 24)) >>>
    0
  )
}

// ─── GF(2^8) 有限域乘法 (参考 src/crypto_internal.c) ───────────────────────
// 在 32 位打包字上执行 GF(2^8) 乘法，用于 MixColumns 步骤

function mul2(w: number): number {
  return (((w & 0x7f7f7f7f) << 1) ^ (((w & 0x80808080) >>> 7) * 0x1b)) >>> 0
}

function mul3(w: number): number {
  return (mul2(w) ^ w) >>> 0
}

function mul4(w: number): number {
  return mul2(mul2(w))
}

function mul8(w: number): number {
  return mul2(mul4(w))
}

function mul9(w: number): number {
  return (mul8(w) ^ w) >>> 0
}

function mulB(w: number): number {
  return (mul8(w) ^ mul3(w)) >>> 0
}

function mulD(w: number): number {
  return (mul8(w) ^ mul4(w) ^ w) >>> 0
}

function mulE(w: number): number {
  return (mul8(w) ^ mul4(w) ^ mul2(w)) >>> 0
}

// ─── AES 块操作 (参考 src/crypto_internal.c) ────────────────────────────────

/** SubBytes: 对块中每个字节执行 S-Box 替换 */
function subBytesBlock(buf: Buffer, off: number): void {
  for (let i = 0; i < AES_BLOCK_BYTES; i++) {
    buf[off + i] = SBox[buf[off + i]]
  }
}

/** InvSubBytes: 对块中每个字节执行逆 S-Box 替换 */
function subBytesRBlock(buf: Buffer, off: number): void {
  for (let i = 0; i < AES_BLOCK_BYTES; i++) {
    buf[off + i] = SBoxR[buf[off + i]]
  }
}

/** ShiftRows: 行移位操作 */
function shiftRowsBlock(buf: Buffer, off: number): void {
  const tmp = Buffer.allocUnsafe(AES_BLOCK_BYTES)
  buf.copy(tmp, 0, off, off + AES_BLOCK_BYTES)
  for (let i = 0; i < AES_BLOCK_BYTES; i++) {
    buf[off + i] = tmp[(i + ((i & 3) << 2)) & 0xf]
  }
}

/** InvShiftRows: 逆行移位操作 */
function shiftRowsRBlock(buf: Buffer, off: number): void {
  const tmp = Buffer.allocUnsafe(AES_BLOCK_BYTES)
  buf.copy(tmp, 0, off, off + AES_BLOCK_BYTES)
  for (let i = 0; i < AES_BLOCK_BYTES; i++) {
    buf[off + i] = tmp[(i - ((i & 3) << 2)) & 0xf]
  }
}

/** MixColumns: 列混合操作（加密方向） */
function mixColumnsBlock(buf: Buffer, off: number): void {
  for (let i = 0; i < AES_BLOCK_WORDS; i++) {
    const byteOff = off + i * 4
    const w = buf.readUInt32LE(byteOff)
    buf.writeUInt32LE(
      (mul2(w) ^ ror32(mul3(w), 8) ^ ror32(w, 16) ^ ror32(w, 24)) >>> 0,
      byteOff
    )
  }
}

/** InvMixColumns: 逆列混合操作（解密方向） */
function mixColumnsRBlock(buf: Buffer, off: number): void {
  for (let i = 0; i < AES_BLOCK_WORDS; i++) {
    const byteOff = off + i * 4
    const w = buf.readUInt32LE(byteOff)
    buf.writeUInt32LE(
      (mulE(w) ^
        ror32(mulB(w), 8) ^
        ror32(mulD(w), 16) ^
        ror32(mul9(w), 24)) >>>
        0,
      byteOff
    )
  }
}

/** AddRoundKey: 将轮密钥与块进行异或 */
function addRoundKey(
  buf: Buffer,
  blockOff: number,
  keyBuf: Buffer,
  keyByteOff: number
): void {
  for (let i = 0; i < AES_BLOCK_BYTES; i++) {
    buf[blockOff + i] ^= keyBuf[keyByteOff + i]
  }
}

// ─── 异或块操作 ─────────────────────────────────────────────────────────────

/** 将 inBuf 的 16 字节异或到 outBuf（就地修改 outBuf） */
export function xorBlock(
  inBuf: Buffer,
  outBuf: Buffer,
  inOffset: number = 0,
  outOffset: number = 0
): void {
  for (let i = 0; i < AES_BLOCK_BYTES; i++) {
    outBuf[outOffset + i] ^= inBuf[inOffset + i]
  }
}

// ─── AES 上下文 (参考 src/crypto_internal.c 中的 AES_KEY) ──────────────────

/**
 * AES 加密上下文，包含扩展密钥和轮数
 * 对应原版 AES_KEY 结构体
 */
export class AesCtx {
  /** 扩展密钥（最多 48 个 DWORD = 192 字节） */
  private keyBuf: Buffer
  /** AES 轮数 */
  rounds: number

  constructor() {
    this.keyBuf = Buffer.alloc(48 * 4)
    this.rounds = 0
  }

  /**
   * 初始化 AES 密钥扩展
   * 完全匹配原版 AesInitKey 函数，包括 V6 协议的特殊修改
   *
   * 参考: src/crypto_internal.c 中的 AesInitKey()
   *
   * @param key       原始密钥
   * @param isV6      是否为 V6 协议（需要额外的密钥修改）
   * @param keyBytes  密钥长度（字节）
   */
  initKey(key: Buffer, isV6: boolean, keyBytes: number): void {
    const keyDwords = keyBytes >>> 2
    this.rounds = keyDwords + 6

    // 复制原始密钥到密钥缓冲区
    key.copy(this.keyBuf, 0, 0, keyBytes)

    // 密钥扩展算法
    const totalDwords = (this.rounds + 1) << 2
    for (let i = keyDwords; i < totalDwords; i++) {
      let temp = this.keyBuf.readUInt32LE((i - 1) * 4)

      if (i % keyDwords === 0) {
        const rconIdx = (i / keyDwords) | 0
        temp = be32((subDword(ror32(be32(temp), 24)) ^ RCon[rconIdx]) >>> 0)
      }

      const prev = this.keyBuf.readUInt32LE((i - keyDwords) * 4)
      this.keyBuf.writeUInt32LE((prev ^ temp) >>> 0, i * 4)
    }

    // V6 协议密钥修改: 对扩展密钥的特定字节执行 XOR
    // 这是 vlmcsd 独有的修改，使 V6 协议的加密与标准 AES 不同
    if (isV6) {
      this.keyBuf[4 * 16] ^= 0x73
      this.keyBuf[6 * 16] ^= 0x09
      this.keyBuf[8 * 16] ^= 0xe4
    }
  }

  /**
   * 就地加密单个 16 字节 AES 块
   * 标准 Rijndael 流程: AddRoundKey → SubBytes → ShiftRows → MixColumns
   *
   * 参考: src/crypto_internal.c 中的 AesEncryptBlock()
   */
  encryptBlock(block: Buffer, offset: number = 0): void {
    for (let keyIdx = 0; ; keyIdx += 4) {
      addRoundKey(block, offset, this.keyBuf, keyIdx * 4)
      subBytesBlock(block, offset)
      shiftRowsBlock(block, offset)
      if (keyIdx >= (this.rounds - 1) << 2) break
      mixColumnsBlock(block, offset)
    }
    // 最后一轮 AddRoundKey
    addRoundKey(block, offset, this.keyBuf, this.rounds << 4)
  }

  /**
   * 就地解密单个 16 字节 AES 块
   * 逆 Rijndael 流程: AddRoundKey → InvShiftRows → InvSubBytes → InvMixColumns
   *
   * 参考: src/crypto_internal.c 中的 AesDecryptBlock()
   */
  decryptBlock(block: Buffer, offset: number = 0): void {
    // 初始 AddRoundKey（使用最后一轮密钥）
    addRoundKey(block, offset, this.keyBuf, this.rounds << 4)

    for (let keyIdx = (this.rounds - 1) << 2; ; keyIdx -= 4) {
      shiftRowsRBlock(block, offset)
      subBytesRBlock(block, offset)
      addRoundKey(block, offset, this.keyBuf, keyIdx * 4)
      if (keyIdx === 0) break
      mixColumnsRBlock(block, offset)
    }
  }
}

// ─── AES-CBC 加密 (参考 src/crypto.c 中的 AesEncryptCbc) ────────────────────

/**
 * AES-CBC 加密，带 PKCS#7 填充
 * 始终添加 1-16 字节的填充（即使原始数据已对齐也会添加一整块填充）
 *
 * 参考: src/crypto.c 中的 AesEncryptCbc()
 */
export function aesEncryptCbc(
  ctx: AesCtx,
  iv: Buffer | null,
  data: Buffer
): { encrypted: Buffer; totalLen: number } {
  const origLen = data.length
  // 计算 PKCS#7 填充长度: 1 到 16 字节
  const pad = (~origLen & (AES_BLOCK_BYTES - 1)) + 1
  const totalLen = origLen + pad

  const result = Buffer.alloc(totalLen)
  data.copy(result, 0, 0, origLen)
  result.fill(pad, origLen, totalLen)

  // 第一块: 与 IV 异或后加密
  if (iv) xorBlock(iv, result, 0, 0)
  ctx.encryptBlock(result, 0)

  // 后续块: 与前一块密文异或后加密（CBC 模式链接）
  for (let off = AES_BLOCK_BYTES; off < totalLen; off += AES_BLOCK_BYTES) {
    xorBlock(result, result, off - AES_BLOCK_BYTES, off)
    ctx.encryptBlock(result, off)
  }

  return { encrypted: result, totalLen }
}

// ─── AES-CBC 解密 (参考 src/crypto.c 中的 AesDecryptCbc) ────────────────────

/**
 * AES-CBC 就地解密
 * 从最后一块到第一块逆序处理（匹配原版行为）
 *
 * 参考: src/crypto.c 中的 AesDecryptCbc()
 */
export function aesDecryptCbc(
  ctx: AesCtx,
  iv: Buffer | null,
  data: Buffer,
  len: number
): void {
  // 从最后一块到第二块逆序处理
  for (let cc = len - AES_BLOCK_BYTES; cc > 0; cc -= AES_BLOCK_BYTES) {
    ctx.decryptBlock(data, cc)
    xorBlock(data, data, cc - AES_BLOCK_BYTES, cc)
  }

  // 处理第一块
  ctx.decryptBlock(data, 0)
  if (iv) xorBlock(iv, data, 0, 0)
}

// ─── AES-CMAC V4 (参考 src/crypto.c 中的 AesCmacV4) ────────────────────────

/**
 * 计算 V4 协议的 AES-CMAC
 * 使用 one-zero 填充 (0x80 后跟零字节) 和 V4 的 20 字节密钥
 *
 * 参考: src/crypto.c 中的 AesCmacV4()
 */
export function aesCmacV4(message: Buffer, messageSize: number): Buffer {
  const ctx = new AesCtx()
  ctx.initKey(AesKeyV4, false, V4_KEY_BYTES)

  const mac = Buffer.alloc(AES_BLOCK_BYTES)

  // 创建填充消息: 原始数据 + 0x80 + 零填充（到下一个块边界）
  const padded = Buffer.alloc(messageSize + AES_BLOCK_BYTES)
  message.copy(padded, 0, 0, messageSize)
  padded[messageSize] = 0x80

  // 逐块异或并加密，累积 MAC 值
  for (let i = 0; i <= messageSize; i += AES_BLOCK_BYTES) {
    xorBlock(padded, mac, i, 0)
    ctx.encryptBlock(mac, 0)
  }

  return Buffer.from(mac)
}

// ─── SHA-256 哈希 ───────────────────────────────────────────────────────────

/** 计算 SHA-256 哈希（使用 Node.js 内建 crypto） */
export function sha256(data: Buffer): Buffer {
  return crypto.createHash('sha256').update(data).digest()
}

// ─── HMAC-SHA256 ────────────────────────────────────────────────────────────

/** 计算 HMAC-SHA256（使用 Node.js 内建 crypto） */
export function sha256Hmac(key: Buffer, data: Buffer): Buffer {
  return crypto.createHmac('sha256', key).update(data).digest()
}

// ─── 随机数生成 ─────────────────────────────────────────────────────────────

/** 生成 16 字节密码学安全随机数 */
export function get16RandomBytes(): Buffer {
  return crypto.randomBytes(16)
}
