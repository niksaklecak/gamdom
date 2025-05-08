import { test, expect, Page } from "@playwright/test";
import { LoginPage } from "@pages/loginPage";
import { config } from "@helpers/envHandler";
test.describe("Gamdom UI Tests @ui", () => {
  test("should login successfully", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(config.gamdomUsername, config.gamdomPassword);
    await expect(page.getByTestId("PersonIcon")).toBeVisible();
  });
});
