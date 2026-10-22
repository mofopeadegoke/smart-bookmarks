import { mkdir, writeFile } from "node:fs/promises";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { testUtils } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as schema from "@/db/schema";
import { connect, E2E_USER } from "./db";

export default async function globalSetup() {
  const { pool, db } = connect();

  // pg reports a stopped database as a bare AggregateError, which doesn't say what to do.
  await pool.query("select 1").catch((err) => {
    throw new Error("Can't reach the test database. Start it with `pnpm db:test:up`.", { cause: err });
  });

  await migrate(db, { migrationsFolder: "drizzle" });

  // A separate auth instance with testUtils, so the real app never ships a way to skip GitHub.
  const testAuth = betterAuth({
    database: drizzleAdapter(db, { provider: "pg", schema }),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [testUtils()],
  });
  const { test } = await testAuth.$context;

  await db.delete(schema.user).where(eq(schema.user.id, E2E_USER.id));
  await test.saveUser(test.createUser(E2E_USER));
  const cookies = await test.getCookies({ userId: E2E_USER.id, domain: "localhost" });

  await mkdir("e2e/.auth", { recursive: true });
  await writeFile("e2e/.auth/user.json", JSON.stringify({ cookies, origins: [] }, null, 2));

  await pool.end();
}
