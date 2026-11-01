import { runVlmcs as runNodeVlmcs } from 'node-vlmcs'

export const runVlmcs = ({
  host,
  port = 1688,
  protocol = 6,
  edition = 26,
  verbose = false
}: RunVlmcsParams) => {
  return runNodeVlmcs({
    host,
    port: Number(port),
    protocol: Number(protocol),
    edition: Number(edition),
    verbose
  }) as Promise<RunVlmcsResult>
}
