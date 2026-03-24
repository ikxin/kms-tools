import * as net from 'net'
import { KmsData } from './data'
import {
  guidToBuffer,
  stringToGuidLE,
  utf8ToUcs2,
  ucs2ToUtf8,
  unixTimeToFileTime,
  PID_BUFFER_SIZE,
  WORKSTATION_NAME_BUFFER
} from './types'
import {
  createRequestV4,
  createRequestV6,
  decryptResponseV4,
  decryptResponseV6
} from './kms'
import { rpcBindClient, rpcSendRequest } from './rpc'
import { get16RandomBytes } from './crypto'
import { connectToAddress } from './network'
import { logRequestVerbose, logResponseVerbose } from './output'

const DEFAULT_TIMEOUT_MS = 5 * 1000
const NS_PER_MS = 1_000_000

function measureElapsedMs(startNs: bigint): number {
  const elapsedNs = process.hrtime.bigint() - startNs
  return Math.round((Number(elapsedNs) / NS_PER_MS) * 1000) / 1000
}

export interface VlmcsCheckParams {
  host: string
  port?: number
  protocol?: number
  edition?: number
  timeout?: number
  verbose?: boolean
}

export interface VlmcsCheckResult {
  host: string
  content: string
  delay: number
  status: boolean
}

function connectSocket(
  host: string,
  port: number,
  timeout: number
): Promise<net.Socket> {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host, port })

    const cleanup = () => {
      socket.removeAllListeners('connect')
      socket.removeAllListeners('error')
      socket.removeAllListeners('timeout')
    }

    socket.once('connect', () => {
      cleanup()
      socket.pause()
      resolve(socket)
    })

    socket.once('error', err => {
      cleanup()
      socket.destroy()
      reject(err)
    })

    socket.setTimeout(timeout, () => {
      cleanup()
      socket.destroy()
      reject(new Error(`Connection timeout after ${timeout}ms`))
    })
  })
}

function normalizeEdition(edition: number): number {
  const raw = Number(edition)
  if (!Number.isFinite(raw)) return 1
  const normalized = Math.floor(raw)
  if (normalized < 1 || normalized > KmsData.skuItems.length) return 1
  return normalized
}

function normalizeProtocol(
  protocol: number | undefined,
  fallback: number
): number {
  const raw = Number(protocol)
  if (!Number.isFinite(raw)) return fallback
  const normalized = Math.floor(raw)
  if (normalized < 4 || normalized > 6) return fallback
  return normalized
}

function randomWorkstationName(): string {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const size = Math.floor(Math.random() * 12) + 6
  let name = 'KMS-'
  for (let i = 0; i < size; i++) {
    name += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return name.slice(0, 63)
}

function buildRequest({
  protocol,
  edition
}: {
  protocol: number
  edition: number
}): Buffer {
  const sku = KmsData.skuItems[edition - 1]
  const kms = KmsData.kmsItems[sku.kmsIndex]
  const app = KmsData.appItems[sku.appIndex]

  const request = Buffer.alloc(236)
  request.writeUInt16LE(0, 0)
  request.writeUInt16LE(protocol, 2)
  request.writeUInt32LE(0, 4)
  request.writeUInt32LE(0x02, 8)
  request.writeUInt32LE(43200, 12)

  guidToBuffer(stringToGuidLE(app.guid)!).copy(request, 16)
  guidToBuffer(stringToGuidLE(sku.guid)!).copy(request, 32)
  guidToBuffer(stringToGuidLE(kms.guid)!).copy(request, 48)

  const cmid = get16RandomBytes()
  cmid[8] = (cmid[8] & 0x3f) | 0x80
  const d3 = cmid.readUInt16LE(6)
  cmid.writeUInt16LE((d3 & 0x0fff) | 0x4000, 6)
  cmid.copy(request, 64)

  request.writeUInt32LE(sku.nCountPolicy, 80)
  unixTimeToFileTime().copy(request, 84)
  request.fill(0, 92, 108)

  utf8ToUcs2(randomWorkstationName(), WORKSTATION_NAME_BUFFER).copy(
    request,
    108
  )
  return request
}

interface ParsedKmsResult {
  status: boolean
  summary: string
  ePID: string
  hwid: Buffer
  response: any
}

function parseKmsResponse(
  rawResponse: Buffer,
  rawRequest: Buffer
): ParsedKmsResult {
  const responseMajorVersion = rawResponse.readUInt16LE(2)

  if (responseMajorVersion === 4) {
    const { response, result } = decryptResponseV4(rawResponse, rawRequest)
    if (!result.decryptSuccess || !result.hashOK || !result.versionOK) {
      return {
        summary: 'Invalid KMS V4 response',
        status: false,
        ePID: '',
        hwid: Buffer.alloc(8),
        response
      }
    }
    const ePID = ucs2ToUtf8(response.kmsPID, PID_BUFFER_SIZE)
    return {
      summary: ePID,
      status: true,
      ePID,
      hwid: Buffer.alloc(8),
      response
    }
  }

  const { response, result, hwid } = decryptResponseV6(rawResponse, rawRequest)
  if (!result.decryptSuccess || !result.hashOK || !result.versionOK) {
    return {
      summary: 'Invalid KMS V5/V6 response',
      status: false,
      ePID: '',
      hwid,
      response
    }
  }

  const ePID = ucs2ToUtf8(response.kmsPID, PID_BUFFER_SIZE)
  if (response.majorVer > 5) {
    const hwidHex = Array.from(hwid.subarray(0, 8))
      .map(b => b.toString(16).toUpperCase().padStart(2, '0'))
      .join('')
    return {
      summary: `${ePID} (${hwidHex})`,
      status: true,
      ePID,
      hwid,
      response
    }
  }

  return {
    summary: ePID,
    status: true,
    ePID,
    hwid,
    response
  }
}

function chunkToString(chunk: unknown): string {
  if (typeof chunk === 'string') return chunk
  if (Buffer.isBuffer(chunk)) return chunk.toString('utf8')
  return String(chunk)
}

async function captureVerboseOutput<T>(fn: () => Promise<T>): Promise<{
  result: T
  output: string
}> {
  let output = ''

  const originalStdoutWrite = process.stdout.write
  const originalStderrWrite = process.stderr.write
  const originalConsoleLog = console.log
  const originalConsoleError = console.error

  ;(process.stdout.write as any) = ((chunk: unknown, ...args: unknown[]) => {
    output += chunkToString(chunk)
    const callback = args.find(arg => typeof arg === 'function') as
      | ((error?: Error | null) => void)
      | undefined
    callback?.(null)
    return true
  }) as typeof process.stdout.write
  ;(process.stderr.write as any) = ((chunk: unknown, ...args: unknown[]) => {
    output += chunkToString(chunk)
    const callback = args.find(arg => typeof arg === 'function') as
      | ((error?: Error | null) => void)
      | undefined
    callback?.(null)
    return true
  }) as typeof process.stderr.write

  console.log = (...args: unknown[]) => {
    output += `${args.map(chunkToString).join(' ')}\n`
  }

  console.error = (...args: unknown[]) => {
    output += `${args.map(chunkToString).join(' ')}\n`
  }

  try {
    const result = await fn()
    return { result, output: output.trimEnd() }
  } finally {
    process.stdout.write = originalStdoutWrite
    process.stderr.write = originalStderrWrite
    console.log = originalConsoleLog
    console.error = originalConsoleError
  }
}

export async function runVlmcs(
  params: VlmcsCheckParams
): Promise<VlmcsCheckResult> {
  const { host, timeout = DEFAULT_TIMEOUT_MS, verbose = false } = params
  const portRaw = Number(params.port ?? 1688)
  const port = Number.isFinite(portRaw) ? Math.floor(portRaw) : 1688
  const edition = normalizeEdition(Number(params.edition ?? 1))

  const sku = KmsData.skuItems[edition - 1]
  const protocol = normalizeProtocol(params.protocol, sku.protocolVersion)

  let socket: net.Socket | null = null

  const executeCheck = async (): Promise<VlmcsCheckResult> => {
    const startedAtNs = process.hrtime.bigint()
    try {
      const requestBase = buildRequest({ protocol, edition })

      if (verbose) {
        logRequestVerbose(requestBase)
      }

      socket = verbose
        ? await connectToAddress(`${host}:${port}`, 0, false)
        : await connectSocket(host, port, timeout)

      if (verbose) {
        process.stdout.write('\nPerforming RPC bind ...\n')
      }

      const bind = await rpcBindClient(socket, verbose, true, true, true)
      if (bind.status !== 0) {
        return {
          host,
          status: false,
          delay: -1,
          content: `RPC bind failed: ${bind.status}`
        }
      }

      if (verbose) {
        process.stdout.write('... successful\n')
      }

      const request =
        protocol < 5
          ? createRequestV4(requestBase)
          : createRequestV6(requestBase)

      if (verbose) {
        process.stdout.write(
          `Sending activation request (KMS V${protocol}) 1 of 1 `
        )
      }

      const rpcResult = await rpcSendRequest(
        socket,
        request,
        bind.rpcFlags,
        true,
        false
      )

      if (rpcResult.status !== 0 || !rpcResult.kmsResponse) {
        return {
          host,
          status: false,
          delay: -1,
          content: `KMS request failed: 0x${(rpcResult.status >>> 0).toString(16).toUpperCase().padStart(8, '0')}`
        }
      }

      const parsed = parseKmsResponse(rpcResult.kmsResponse, request)

      if (verbose && parsed.status) {
        logResponseVerbose(
          parsed.ePID,
          parsed.hwid,
          parsed.response,
          rpcResult.kmsResponse.length
        )
      }

      return {
        host,
        status: parsed.status,
        delay: parsed.status ? measureElapsedMs(startedAtNs) : -1,
        content: parsed.summary
      }
    } catch (error) {
      return {
        host,
        status: false,
        delay: -1,
        content: error instanceof Error ? error.message : String(error)
      }
    } finally {
      if (socket) {
        socket.destroy()
      }
    }
  }

  if (!verbose) {
    return executeCheck()
  }

  const { result, output } = await captureVerboseOutput(executeCheck)
  return {
    ...result,
    content: output || result.content
  }
}
