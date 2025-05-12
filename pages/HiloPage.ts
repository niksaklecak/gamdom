import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HiloPage extends BasePage {
  readonly hiloHiLoBetButtons: Locator;
  constructor(page: Page) {
    super(page);
    this.hiloHiLoBetButtons = page.getByTestId("hiloHiLoBetButtons");
  }

  async navigate() {
    await this.page.goto("/hilo");
  }

  async loaded() {
    await this.page.waitForURL("**/hilo");
  }
}
