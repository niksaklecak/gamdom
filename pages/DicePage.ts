import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class DicePage extends BasePage {
  readonly diceCanvas: Locator;
  constructor(page: Page) {
    super(page);
    this.diceCanvas = page.locator("canvas").first();
  }

  async navigate() {
    await this.page.goto("/dice");
  }

  async loaded() {
    await this.page.waitForURL("**/dice");
  }
}
