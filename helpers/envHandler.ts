import dotenv from "dotenv";
import path from "path";
import fs from "fs";

const envFilePath = path.resolve(process.cwd(), ".env");

// Check if the .env file exists. If not, throw an error.
if (!fs.existsSync(envFilePath)) {
  throw new Error(
    `FATAL ERROR: .env file not found at ${envFilePath}. Please create one.`
  );
}

// Load the .env file.
dotenv.config({ path: envFilePath });

/**
 * Retrieves an environment variable strictly.
 * @param key The key of the environment variable.
 * @returns The value of the environment variable.
 * @throws Error if the variable is not set in the .env file.
 */
function getEnv(key: string): string {
  const value = process.env[key];

  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set in the .env file.`);
  }
  return value;
}

// Export specific environment variables your application needs.
// All these variables are now expected to be present in your .env file.
export const config = {
  authBaseUrl: getEnv("AUTH_BASE_URL"),
  apiBaseUrl: getEnv("API_BASE_URL"),
  gamdomUsername: getEnv("GAMDOM_USERNAME"),
  gamdomPassword: getEnv("GAMDOM_PASSWORD"),
  jiraApiUrl: getEnv("JIRA_API_URL"),
  jiraBasicAuthToken: getEnv("JIRA_BASIC_AUTH_TOKEN"),
  playwrightBaseUrl: getEnv("PLAYWRIGHT_BASE_URL"),
  nodeEnv: process.env.NODE_ENV || "development",
};
