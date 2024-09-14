import { cors } from '@elysiajs/cors'
import { cron, Patterns } from '@elysiajs/cron'
import { staticPlugin } from '@elysiajs/static'
import { Elysia } from 'elysia'
import { db, runCheck } from './db'
import type { RunVlmcsParams } from './types'
import { runVlmcs } from './utils'
import './vlmcsd'

const app = new Elysia()

app.use(
  staticPlugin({
    assets: 'dist/assets',
    prefix: '/assets',
  }),
)

app.use(cors())

app.use(
  cron({
    name: 'heartbeat',
    pattern: Patterns.everyMinutes(5),
    run: runCheck,
  }),
)

app.get('/*', () => Bun.file('dist/index.html'))

app.post('/api/check', async request => {
  const body = request.body as RunVlmcsParams
  return await runVlmcs(body)
})

app.get('/api/server', async () => {
  return await db.query.server.findMany()
})

app.listen(Bun.env.PORT || 3000)

console.log(`Elysia is running at on port ${app.server?.url} ...`)
