import type { Config } from "drizzle-kit";

export default {
  out: "./service/db/migrations",
  schema: "./service/db/schema.ts",
  driver: "better-sqlite",
  dbCredentials: {
    url: "sqlite.db",
  },
} satisfies Config;
