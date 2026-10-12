import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./db/schema.ts", // where your tables are described
  out: "./drizzle", // where migration files are written
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
