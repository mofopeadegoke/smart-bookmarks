import { defineConfig, devices } from "@playwright/test";
import { config } from "dotenv";

// override: the test database must win over anything already in the shell or .env.local.
config({ path: ".env.test", override: true, quiet: true });

const PORT = 3100;

export default defineConfig({
  testDir: "e2e",
  // Every test shares one signed-in user and resets their data, so they must not overlap.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  globalSetup: "./e2e/global-setup.ts",
  use: {
    baseURL: `http://localhost:${PORT}`,
    storageState: "e2e/.auth/user.json",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // A production build behaves like the deployed app, and doesn't fight `pnpm dev` over .next/dev.
    command: `pnpm build && pnpm start --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
