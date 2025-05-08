import { Page, Locator } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
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
    await this.page.goto(targetPath);
  }
}
