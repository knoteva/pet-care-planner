import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

for (const path of [".env.local", "../.env.local", ".env"]) {
  config({ path, override: false, quiet: true });
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is missing.");
  console.error("Create pet-care-web/.env.local with DATABASE_URL=your_neon_connection_string");
  process.exit(1);
}

try {
  const sql = neon(databaseUrl);
  const result = await sql`select 1 as ok, current_database() as database_name, current_user as user_name`;
  const row = result[0];

  console.log("Database connection OK");
  console.log(`database: ${row.database_name}`);
  console.log(`user: ${row.user_name}`);
} catch (error) {
  console.error("Database connection failed");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}