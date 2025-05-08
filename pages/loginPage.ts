import { Page, Locator } from "@playwright/test";
import { BasePage } from "./basePage";

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator(".error-message");
  }

  /**
   * Navigates to a specific endpoint or to the base URL if no endpoint is provided.
   * @param endpoint Optional path to navigate to (e.g., '/login', '/profile').
   *                 If not provided, navigates to the base URL ('/').
   */
  async navigate(endpoint?: string) {
    const targetPath = endpoint
      ? endpoint.startsWith("/")
        ? endpoint
        : `/${endpoint}`
      : "/";
    await super.navigate(targetPath);
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
