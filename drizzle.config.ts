// import type { Config } from "drizzle-kit";

// export default {
//   schema: "./src/db/schema/*",
//   out: "./drizzle",
//   driver: "mysql2",
//   dbCredentials: {},
// } satisfies Config;
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
});
