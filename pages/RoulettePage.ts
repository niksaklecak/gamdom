import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class RoulettePage extends BasePage {
  readonly rouletteCanvas: Locator;
  constructor(page: Page) {
    super(page);
    this.rouletteCanvas = page.locator("canvas").first();
  }

  async navigate() {
    await this.page.goto("/roulette");
  }

  async loaded() {
    await this.page.waitForURL("**/roulette");
  }
}
