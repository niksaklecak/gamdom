import { request, APIRequestContext, APIResponse } from "@playwright/test";
import { config } from "./envHandler";

export class ApiClient {
  private token: string | null = null;
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = config.apiBaseUrl;
    this.token = config.token;
  }
}
