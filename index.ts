import { drizzle } from 'drizzle-orm/bun-sqlite'
import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { Database } from 'bun:sqlite'
import * as schema from './db/schema'

const sqlite = new Database('./db/sqlite.db')
const db = drizzle(sqlite, { schema })

migrate(db, { migrationsFolder: './db/drizzle' })
