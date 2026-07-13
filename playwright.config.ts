import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright: capa 2 de regresión visual (screenshots pixel) para las rutas
 * críticas de metas. Ver `.claude/engineering/testing.md`.
 *
 * - Los specs NO pegan al backend .NET ni requieren login real: interceptan la
 *   API con `page.route` y siembran el store de auth en localStorage.
 * - `webServer` levanta la app en modo producción antes de correr.
 * - Las baseline se generan en el Docker oficial de Playwright para que
 *   coincidan con el runner de CI (mismo font-rendering). Ver README de e2e.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  // Nombre de baseline estable e independiente del SO local: todas las
  // referencias se etiquetan "-linux" (generadas en Docker/CI).
  snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{arg}-linux{ext}",
  use: {
    baseURL: "http://localhost:3000",
    // NEXT_PUBLIC_API_URL vacío en build ⇒ el cliente pega a rutas relativas
    // (/api/v1/...) del mismo origen, que interceptamos con page.route.
    trace: "on-first-retry",
  },
  expect: {
    // Tolerancia mínima para antialiasing residual entre corridas en el mismo SO.
    toHaveScreenshot: { maxDiffPixelRatio: 0.01 },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
