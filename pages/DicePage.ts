import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class DicePage extends BasePage {
  readonly diceCanvas: Locator;
  readonly rollDiceBtn: Locator;
  readonly resultWrapper: Locator;
  constructor(page: Page) {
    super(page);
    this.diceCanvas = page.locator("canvas").first();
    this.rollDiceBtn = page.getByTestId("rollDiceBtn");
    this.resultWrapper = page.locator(
      ".GameArea-styled__ResultWrapper-sc-4c8cf97d-5"
    );
  }

  async navigate() {
    await this.page.goto("/dice");
  }

  async loaded() {
    await this.page.waitForURL("**/dice");
  }
}
