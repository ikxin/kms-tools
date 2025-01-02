import { execFile } from "child_process";
import { arch, platform } from "os";

export const monitorList = process.env.MONITOR_LIST?.split(",") || [
  "kms.8b5.cn",
  "kms.wxlost.com",
  "kms.03k.org",
  "kms.sixyin.com",
  "kms.343.re",
  "kms.vmem.top",
  "kms.zhi.fun",
  "kms.loli.best",
];

export const runVlmcs = ({
  host,
  port = 1688,
  protocol = 6,
  edition = 26,
}: RunVlmcsParams) => {
  return new Promise<RunVlmcsResult>((resolve, reject) => {
    const before = Date.now();
    const vlmcs = execFile(
      `./binaries/vlmcs-${platform()}-${arch()}`,
      [`${host}:${port}`, `-${protocol}`, `-l ${edition}`],
      { timeout: 10 * 1000 },
      (err, stdout) => {
        resolve({
          host,
          delay: Date.now() - before,
          content: stdout.trim(),
          status: err ? false : true,
        });
      }
    );

    vlmcs.on("error", (err) => {
      reject(err);
    });

    vlmcs.on("close", () => {
      vlmcs.removeAllListeners();
      vlmcs.kill();
    });
  });
};
