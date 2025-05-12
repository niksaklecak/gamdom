import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HiloPage extends BasePage {
  readonly hiloCanvas: Locator;
  constructor(page: Page) {
    super(page);
    this.hiloCanvas = page.locator("canvas").first();
  }

  async navigate() {
    await this.page.goto("/hilo");
  }

  async loaded() {
    await this.page.waitForURL("**/hilo");
  }
}
