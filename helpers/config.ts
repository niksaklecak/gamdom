import dotenv from "dotenv";
import path from "path";
import fs from "fs";

const envFilePath = path.resolve(process.cwd(), ".env");
if (!fs.existsSync(envFilePath)) {
  throw new Error(
    `FATAL ERROR: .env file not found at ${envFilePath}. Please create one.`
  );
}

dotenv.config({ path: envFilePath });

/**
 * Retrieves an environment variable strictly.
 * @param key The key of the environment variable.
 * @returns The value of the environment variable.
 * @throws Error if the variable is not set in process.env (e.g., not in the .env file).
 */
function getEnv(key: string): string {
  const value = process.env[key];

  if (value === undefined) {
    throw new Error(
      `Environment variable '${key}' is not set in the .env file.`
    );
  }
  return value;
}

export const config = {
  jiraApiUrl: getEnv("JIRA_API_URL"),
  jiraBasicAuthToken: getEnv("JIRA_BASIC_AUTH_TOKEN"),
  jiraProjectKey: getEnv("JIRA_API_PROJECT_KEY"),
  jiraUsername: getEnv("JIRA_API_USERNAME"),
  jiraToken: getEnv("JIRA_API_TOKEN"),
  gamdomUsername: getEnv("GAMDOM_USERNAME"),
  gamdomPassword: getEnv("GAMDOM_PASSWORD"),
  playwrightBaseUrl: getEnv("BASE_URL"),
  nodeEnv: process.env.NODE_ENV || "development",
};
