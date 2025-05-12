import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  readonly singInButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly startPlayingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.singInButton = page.getByTestId("signin-nav");
    this.usernameInput = page.getByPlaceholder("Enter your username");
    this.passwordInput = page.getByPlaceholder("Enter your password");
    this.startPlayingButton = page.getByTestId("start-playing-login");
  }

  async login(username: string, password: string) {
    await this.singInButton.click();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.startPlayingButton.click();
  }
}
