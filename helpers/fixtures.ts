import {
  test as base,
  expect,
  Page,
  Browser,
  BrowserContext,
} from "@playwright/test";
import fs from "fs";
import path from "path";
import { config } from "./config";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";

// Define fixture types
type MyFixtures = {
  authContext: BrowserContext;
  authenticatedPage: Page;
};

const stateName = "state.json";
const stateFile = path.join(__dirname, "..", stateName);

// Define custom fixtures
export const my_test = base.extend<MyFixtures>({
  // Fixture for authenticated BrowserContext
  authContext: async ({ browser }: { browser: Browser }, use) => {
    let context: BrowserContext;

    if (fs.existsSync(stateFile)) {
      // Load context from saved state if file exists
      context = await browser.newContext({ storageState: stateName });
      console.log("Using existing authentication state.");
    } else {
      // Need to login and save state
      console.log("No existing state found, performing login...");
      context = await browser.newContext();
      const page = await context.newPage();
      const loginPage = new LoginPage(page);
      const landingPage = new LandingPage(page);

      await page.goto("/");
      await loginPage.login(config.gamdomUsername, config.gamdomPassword);
      await expect(landingPage.loginIcon).toBeVisible();
      console.log("Login successful, saving state...");
      await context.storageState({ path: stateName });
      await page.close();
      console.log("Authentication state saved.");
    }

    // Use the authenticated context
    await use(context);

    // Clean up context after the test
    await context.close();
  },

  // Fixture for an authenticated page using the authContext
  authenticatedPage: async (
    { authContext }: { authContext: BrowserContext },
    use: (page: Page) => Promise<void>
  ) => {
    const page = await authContext.newPage();
    await use(page);
  },
});

export { expect } from "@playwright/test";
