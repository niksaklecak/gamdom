import { Page, Locator } from "@playwright/test";
import { BasePage } from "./basePage";

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder("Enter your username");
    this.passwordInput = page.getByPlaceholder("Enter your password");
    this.loginButton = page.getByRole("button", { name: "Start Playing" });
  }

  async navigate() {
    await this.page.goto("https://qa-test-playground.teamgamdom.com/");
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
