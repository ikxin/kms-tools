import { env } from 'cloudflare:workers'
import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../database/schema'

type D1Client = Parameters<typeof drizzle>[0]

interface CloudflareEnv {
  DB?: D1Client
}

export const getD1Database = () => {
  const client = (env as CloudflareEnv).DB

  if (!client) {
    throw new Error(
      '缺少 Cloudflare D1 数据库绑定 DB，请检查 wrangler.jsonc 配置。'
    )
  }

  return drizzle(client, { schema })
}

export type KmsDatabase = ReturnType<typeof getD1Database>
