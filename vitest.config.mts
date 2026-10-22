import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    include: ["**/*.test.ts"],
    exclude: ["node_modules", ".next", "e2e"],
    env: { AI_MODE: "fake" },
  },
});
