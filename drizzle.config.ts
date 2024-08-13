import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './service/schema.ts',
  out: './service/migrations',
  dialect: 'mysql',
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      'mysql://root:password@localhost:3306/database',
  },
  verbose: true,
  strict: true,
})
