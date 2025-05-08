import "./helpers/config"; // Load environment variables
import { defineConfig, devices } from "@playwright/test";
import { config } from "./helpers/config";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  timeout: 10000,
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: process.env.BASE_URL,
    trace: "on-first-retry",
    headless: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    viewport: { width: 1920, height: 720 },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  outputDir: "test-results/",
});
