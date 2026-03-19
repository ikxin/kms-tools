/**
 * TCP 网络层 — 处理 TCP 连接、DNS 解析和数据收发
 *
 * 参考原版源码:
 *   - src/network.c  (connectToAddress, getSocketList 等连接管理)
 *   - src/network.h  (网络接口定义)
 */

import * as net from 'net';
import * as dns from 'dns';
import { parseAddress } from './helpers';

/** 连接超时时间（毫秒），与原版 SO_RCVTIMEO/SO_SNDTIMEO 设置一致 */
const CONNECT_TIMEOUT_MS = 10_000;

/**
 * 带超时的 TCP 连接
 * 连接成功后暂停 socket，防止在附加数据监听器之前丢失数据
 */
function connectWithTimeout(host: string, port: number, family?: number): Promise<net.Socket> {
  return new Promise<net.Socket>((resolve, reject) => {
    const sock = new net.Socket();
    let settled = false;

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        sock.destroy();
        reject(new Error('Timed out'));
      }
    }, CONNECT_TIMEOUT_MS);

    sock.once('error', (err: Error) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        sock.destroy();
        reject(new Error(err.message));
      }
    });

    sock.connect({ host, port, family }, () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        // 暂停 socket，防止在附加数据监听器之前丢失数据
        sock.pause();
        resolve(sock);
      }
    });
  });
}

/**
 * 连接到指定地址
 * 支持 "host:port"、"[ipv6]:port" 等格式
 * 会尝试 DNS 解析返回的所有地址（模拟原版 getaddrinfo 遍历行为）
 *
 * 参考: src/network.c 中的 connectToAddress()
 *
 * @param addr           地址字符串
 * @param addressFamily  0=自动, 4=仅IPv4, 6=仅IPv6
 * @param showHostName   是否在连接消息中显示主机名（仅影响输出格式）
 */
export async function connectToAddress(
  addr: string,
  addressFamily: number,
  showHostName: boolean
): Promise<net.Socket> {
  const { host, port } = parseAddress(addr);
  const portNum = parseInt(port, 10);

  if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
    throw new Error(`Invalid port: ${port}`);
  }

  // 判断是否为 IP 字面量地址
  const isIPv4Literal = net.isIPv4(host);
  const isIPv6Literal = net.isIPv6(host);
  const isLiteral = isIPv4Literal || isIPv6Literal;

  let family: number | undefined;

  if (addressFamily === 4) {
    family = 4;
  } else if (addressFamily === 6) {
    family = 6;
  }

  // 地址族兼容性检查
  if (isIPv4Literal && addressFamily === 6) {
    throw new Error(`IPv4 address ${host} cannot be used with IPv6-only mode`);
  }
  if (isIPv6Literal && addressFamily === 4) {
    throw new Error(`IPv6 address ${host} cannot be used with IPv4-only mode`);
  }

  // 构建要尝试的地址列表
  interface AddrEntry { address: string; family: number }
  let targets: AddrEntry[];

  if (isLiteral) {
    // IP 字面量，直接使用
    targets = [{ address: host, family: isIPv4Literal ? 4 : 6 }];
  } else {
    // 主机名，通过 DNS 解析（可能返回多个地址）
    targets = await new Promise<AddrEntry[]>((resolve, reject) => {
      dns.lookup(host, { family: family || 0, all: true }, (err, addresses) => {
        if (err) {
          reject(new Error(`${host}: ${err.message}`));
        } else if ((addresses as dns.LookupAddress[]).length === 0) {
          reject(new Error(`${host}: No address associated with hostname`));
        } else {
          resolve(addresses as dns.LookupAddress[]);
        }
      });
    });
  }

  // 按顺序尝试每个地址（模拟原版 getaddrinfo 遍历行为）
  for (let i = 0; i < targets.length; i++) {
    const connectHost = targets[i].address;
    const addrFamily = targets[i].family;

    // 输出连接信息（匹配原版格式）
    if (showHostName && !isLiteral) {
      process.stdout.write(`Connecting to ${host} (${connectHost}) ... `);
    } else {
      process.stdout.write(`Connecting to ${connectHost}:${port} ... `);
    }

    try {
      const sock = await connectWithTimeout(connectHost, portNum, addrFamily);
      process.stdout.write('successful\n');
      return sock;
    } catch (err: any) {
      process.stderr.write(`${connectHost}:${port}: ${err.message}\n`);
      if (i === targets.length - 1) {
        throw new Error('Could not connect to any KMS server');
      }
    }
  }
  throw new Error('Could not connect to any KMS server');
}

/**
 * 发送所有字节到 socket，等待写缓冲区排空
 * 参考: src/network.c 中的 _send()
 */
export function sendData(sock: net.Socket, data: Buffer): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const ok = sock.write(data, (err) => {
      if (err) reject(err);
      else if (ok) resolve();
    });
    if (!ok) {
      sock.once('drain', () => resolve());
    }
  });
}

/**
 * 从 socket 精确接收 size 字节
 * 缓冲传入数据直到收集到请求的数量，多余的字节会被推回 socket
 *
 * 参考: src/network.c 中的 _recv()
 */
export function recvData(sock: net.Socket, size: number): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    if (size === 0) {
      resolve(Buffer.alloc(0));
      return;
    }

    const chunks: Buffer[] = [];
    let received = 0;

    const cleanup = () => {
      sock.removeListener('data', onData);
      sock.removeListener('error', onError);
      sock.removeListener('close', onClose);
      sock.removeListener('end', onEnd);
    };

    const onData = (chunk: Buffer) => {
      chunks.push(chunk);
      received += chunk.length;
      if (received >= size) {
        cleanup();
        sock.pause();  // 暂停接收，防止数据丢失
        const full = Buffer.concat(chunks);
        const result = full.subarray(0, size);
        // 将多余的字节推回 socket 的读取缓冲区
        if (full.length > size) {
          sock.unshift(full.subarray(size));
        }
        resolve(Buffer.from(result));
      }
    };

    const onError = (err: Error) => {
      cleanup();
      reject(err);
    };

    const onClose = () => {
      cleanup();
      reject(new Error(`Socket closed after receiving ${received} of ${size} bytes`));
    };

    const onEnd = () => {
      cleanup();
      reject(new Error(`Socket ended after receiving ${received} of ${size} bytes`));
    };

    sock.on('data', onData);
    sock.once('error', onError);
    sock.once('close', onClose);
    sock.once('end', onEnd);

    // 恢复 socket 以开始接收数据
    sock.resume();
  });
}

/**
 * 检查 socket 是否已断开连接
 */
export function isDisconnected(sock: net.Socket): boolean {
  return sock.destroyed || !sock.writable;
}
