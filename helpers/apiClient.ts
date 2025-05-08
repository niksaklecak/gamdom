import { request, APIRequestContext, APIResponse } from "@playwright/test";

export class ApiClient {
  private token: string | null = null;

  constructor(
    private email: string,
    private password: string,
    private authBaseUrl: string = process.env.AUTH_BASE_URL || "",
    private apiBaseUrl: string = process.env.API_BASE_URL || ""
  ) {
    if (!this.authBaseUrl) {
      throw new Error("AUTH_BASE_URL is not defined");
    }
    if (!this.apiBaseUrl) {
      throw new Error("API_BASE_URL is not defined");
    }
  }

  /**
   * Creates a new APIRequestContext for authentication.
   */
  private async createAuthContext(): Promise<APIRequestContext> {
    return request.newContext({
      baseURL: this.authBaseUrl,
      extraHTTPHeaders: { "Content-Type": "application/json" },
    });
  }

  /**
   * Creates a new APIRequestContext for API interactions.
   * Ensures that the user is logged in by checking for a valid token.
   */
  private async createApiContext(): Promise<APIRequestContext> {
    if (!this.token) {
      await this.performLogin();
    }
    return request.newContext({
      baseURL: this.apiBaseUrl,
      extraHTTPHeaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  /**
   * Logs in the user and stores the access token.
   * @throws Error if login fails or accessToken is not returned.
   */
  private async performLogin(): Promise<APIResponse> {
    const passwordLoginQuery = `
      mutation PasswordLogin {
        passwordLogin(email: "${this.email}", password: "${this.password}") {
          accessToken
        }
      }
    `;
    const authContext = await this.createAuthContext();
    const response = await authContext.post("", {
      data: { query: passwordLoginQuery },
    });

    if (!response.ok()) {
      throw new Error(
        `Login failed: ${response.status()} ${response.statusText()}`
      );
    }

    const body = await response.json();
    const accessToken = body.data?.passwordLogin?.accessToken;
    if (!accessToken) {
      throw new Error("No accessToken returned by login mutation");
    }
    this.token = accessToken;

    return response;
  }

  /**
   * Verifies the login functionality.
   * @returns
   * @throws Error if unable to fetch current workspace.
   */
  public async login(): Promise<APIResponse> {
    return await this.performLogin();
  }
}
