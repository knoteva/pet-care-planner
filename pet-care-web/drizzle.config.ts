import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

for (const path of [".env.local", "../.env.local", ".env"]) {
  config({ path, override: false, quiet: true });
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  strict: true,
  verbose: true,
});