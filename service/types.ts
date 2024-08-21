export type RunVlmcsParams = {
  host: string
  port?: number
  app?: number
  protocol?: number
}

export type RunVlmcsResult = {
  host: string
  content: string
  delay: number
  status: boolean
}
