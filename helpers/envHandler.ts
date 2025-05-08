import dotenv from "dotenv";
import path from "path";
import fs from "fs";

const envFilePath = path.resolve(process.cwd(), ".env");

// Check if the .env file exists. If not, throw an error immediately.
if (!fs.existsSync(envFilePath)) {
  throw new Error(
    `FATAL ERROR: .env file not found at ${envFilePath}. Please create one.`
  );
}

// Load the .env file. This populates process.env with values from .env.
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
    // This error will be thrown if the key is not found in process.env
    throw new Error(
      `Environment variable '${key}' is not set in the .env file.`
    );
  }
  return value;
}

// Define which environment variables are MANDATORY for your application.
// If any of these are not in your .env file, an error will be thrown when this module is loaded.
export const config = {
  // If you need API_BASE_URL, it must be in your .env file.
  // If you don't need it, remove this line.
  apiBaseUrl: getEnv("API_BASE_URL"),
  token: getEnv("TOKEN"),
  jiraApiUrl: getEnv("JIRA_API_URL"),
  jiraBasicAuthToken: getEnv("JIRA_BASIC_AUTH_TOKEN"),

  // These are consistently required based on your setup:
  gamdomUsername: getEnv("GAMDOM_USERNAME"),
  gamdomPassword: getEnv("GAMDOM_PASSWORD"),
  playwrightBaseUrl: getEnv("BASE_URL"), // Mapped from your previous changes

  // NODE_ENV is a common variable, often set externally or defaulting.
  nodeEnv: process.env.NODE_ENV || "development",
};
