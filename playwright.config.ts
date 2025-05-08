import "./helpers/config"; // Load environment variables
import { defineConfig, devices } from "@playwright/test";
import { config } from "./helpers/config"; // Import the config object

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: config.playwrightBaseUrl, // Use value from envHandler
    trace: "on-first-retry",
    headless: true, // Set to false to watch tests run
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  outputDir: "test-results/",
});
