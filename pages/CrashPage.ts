import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CrashPage extends BasePage {
  readonly crashCanvas: Locator;
  constructor(page: Page) {
    super(page);
    this.crashCanvas = page.locator("canvas").first();
  }

  async navigate() {
    await this.page.goto("/crash");
  }

  async loaded() {
    await this.page.waitForURL("**/crash");
  }
}
