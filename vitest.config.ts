import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    environment: "happy-dom",
    setupFiles: ["./src/test-utils/vitest.setup.ts"],
    // Playwright E2E specs viven en e2e/ y usan su propio runner.
    exclude: ["**/node_modules/**", "**/e2e/**"],
    // TZ fija: los snapshots que renderizan fechas (toLocaleString) deben ser
    // deterministas entre la máquina local y el runner de CI (que corre en UTC).
    env: { TZ: "UTC" },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
