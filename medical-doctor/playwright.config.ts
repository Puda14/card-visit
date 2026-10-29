import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser", timeout: 30000, fullyParallel: true,
  use: { baseURL: "http://127.0.0.1:3002", headless: true, launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } },
  webServer: { command: "pnpm dev", url: "http://127.0.0.1:3002", reuseExistingServer: !process.env.CI, timeout: 120000 },
});
