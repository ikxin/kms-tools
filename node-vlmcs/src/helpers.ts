/**
 * 命令行参数解析工具函数
 *
 * 参考原版源码:
 *   - src/helpers.c  (parseAddress, getSocketList 等网络地址解析)
 *   - src/vlmcs.c    (命令行参数解析逻辑)
 */

/**
 * 解析地址字符串，支持以下格式:
 *   - "host:port"    — IPv4 地址或主机名加端口
 *   - "[ipv6]:port"  — IPv6 方括号表示法加端口
 *   - "host"         — 不带端口，默认 1688
 *   - "::1"          — 裸 IPv6 地址（不带端口）
 *
 * 参考: src/network.c 中 getSocketList() 的地址解析逻辑
 */
export function parseAddress(addr: string): { host: string; port: string } {
  const defaultPort = '1688';

  // IPv6 方括号表示法: [::1]:port 或 [::1]
  if (addr.startsWith('[')) {
    const closeBracket = addr.indexOf(']');
    if (closeBracket === -1) {
      return { host: addr, port: defaultPort };
    }
    const host = addr.slice(1, closeBracket);
    const rest = addr.slice(closeBracket + 1);
    if (rest.startsWith(':') && rest.length > 1) {
      return { host, port: rest.slice(1) };
    }
    return { host, port: defaultPort };
  }

  // 如果包含多个冒号，说明是裸 IPv6 地址（无端口）
  const firstColon = addr.indexOf(':');
  if (firstColon !== -1 && addr.indexOf(':', firstColon + 1) !== -1) {
    return { host: addr, port: defaultPort };
  }

  // IPv4 或主机名，可选 :port
  if (firstColon !== -1) {
    return { host: addr.slice(0, firstColon), port: addr.slice(firstColon + 1) };
  }

  return { host: addr, port: defaultPort };
}

/**
 * 解析十进制整数字符串，验证范围 [min, max]
 * 无效或超出范围返回 null
 */
export function stringToInt(str: string, min: number, max: number): number | null {
  if (!/^-?\d+$/.test(str)) return null;
  const val = parseInt(str, 10);
  if (!Number.isFinite(val) || val < min || val > max) return null;
  return val;
}

/**
 * 解析布尔参数: "1" → true, "0" → false, 其他 → null
 * 参考: src/vlmcs.c 中 getArgumentBool() 的实现
 */
export function getArgumentBool(arg: string): boolean | null {
  if (arg === '1') return true;
  if (arg === '0') return false;
  return null;
}
