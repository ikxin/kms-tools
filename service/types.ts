export interface RunVlmcsParams {
  host: string
  port?: number
  app?: number
  protocol?: number
}

export interface RunVlmcsResult {
  host: string
  content: string
  delay: number
  status: boolean
}
