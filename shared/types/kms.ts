export interface RunVlmcsParams {
  host: string
  port?: number
  protocol?: number
  edition?: number
  verbose?: boolean
}

export interface RunVlmcsResult {
  host: string
  content: string
  delay: number
  status: boolean
}
