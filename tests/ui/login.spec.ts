import { test, expect, Page } from "@playwright/test";
import { LoginPage } from "../../pages/loginPage";
import { config } from "../../helpers/config";
import { LandingPage } from "../../pages/landingPage";
test.describe("Gamdom UI Tests @ui", () => {
  test("should login successfully", async ({ page }) => {
    const landingPage = new LandingPage(page);
    const loginPage = new LoginPage(page);
    await loginPage.page.goto("/");
    await loginPage.login(config.gamdomUsername, config.gamdomPassword);
    await expect(landingPage.loginIcon).toBeVisible();
  });
});
