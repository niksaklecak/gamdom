import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LandingPage extends BasePage {
  readonly loginIcon: Locator;
  readonly mainMenu: Locator;
  readonly originalsButton: Locator;
  readonly crashButton: Locator;
  readonly diceButton: Locator;
  readonly rouletteButton: Locator;
  readonly hiloButton: Locator;
  readonly crashGame: Locator;
  constructor(page: Page) {
    super(page);
    this.loginIcon = page.getByTestId("PersonIcon");
    this.mainMenu = page.getByRole("button", { name: "" });
    this.originalsButton = page.getByRole("button", {
      name: "Originals",
      exact: true,
    });
    this.crashButton = page.getByRole("link", { name: " Crash" });
    this.diceButton = page.getByRole("link", { name: " Dice" });
    this.rouletteButton = page.getByRole("link", { name: " Roulette" });
    this.hiloButton = page.getByRole("link", { name: " Hilo" });
    this.crashGame = page.getByRole("link", { name: " Crash" });
  }

  async navigate() {
    await this.page.goto("/");
  }
}
