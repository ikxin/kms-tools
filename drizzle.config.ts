import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',
  out: './service/migrations',
  schema: './service/schema.ts',
  dbCredentials: {
    url: 'sqlite.db',
  },
})
