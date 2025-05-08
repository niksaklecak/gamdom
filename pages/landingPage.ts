import { Page, Locator } from "@playwright/test";
import { BasePage } from "./basePage";

export class LandingPage extends BasePage {
  readonly loginIcon: Locator;
  constructor(page: Page) {
    super(page);
    this.loginIcon = page.getByTestId("PersonIcon");
  }
}
