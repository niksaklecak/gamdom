# Gamdom Automation Test Framework

This project contains an automation test framework for the Gamdom QA assignment, covering both UI and API testing.

## Framework Overview

- **Language**: TypeScript
- **Test Runner**: Playwright Test
- **UI Automation**: Playwright for browser automation.
  - **Design Pattern**: Page Object Model (POM) is used for UI tests, located in the `pages` directory.
  - UI tests are located in `tests/ui`.
- **API Automation**: Playwright's API testing capabilities are leveraged, with an Axios-based API client for JIRA interactions.
  - The JIRA API client is in `helpers/jiraApiClient`.
  - API tests are located in `tests/api`.
- **Reporting**: Playwright HTML reporter is configured.
- **Utilities**: Common helper functions can be found in `helpers/utils.ts`.

## Prerequisites

- Node.js (v16 or later recommended)
- npm or yarn

## Installation and Setup

1.  **Clone the repository (if applicable) or download the files.**

2.  **Navigate to the project directory:**

    ```bash
    cd path/to/gamdom-automation-framework
    ```

3.  **Install dependencies:**
    Using npm:

    ```bash
    npm install
    ```

    This command will also run `playwright install --with-deps` (due to the `postinstall` script in `package.json`) to download the necessary browser binaries.

4.  **Environment Variables (Optional but Recommended for JIRA API Token):**
    While the JIRA API token is currently hardcoded in `helpers/jiraApiClient.ts` for simplicity in this assignment, in a real-world scenario, it's highly recommended to manage sensitive data like API tokens using environment variables.
    For example, you could create a `.env` file (and add it to `.gitignore`) with:
    ```
    JIRA_API_TOKEN=your_base64_encoded_jira_token
    ```
    And then modify `helpers/apiClient.ts` to read this token using a library like `dotenv` or `process.env.JIRA_API_TOKEN` (if loaded globally).

## How to Execute the Tests

- **Run all tests (UI and API):**

  ```bash
  npm test
  ```

  or

  ```bash
  npx playwright test
  ```

- **Run only UI tests:**
  (UI tests are tagged with `@ui` in `tests/ui/example.spec.ts`)

  ```bash
  npm run test:ui
  ```

  or

  ```bash
  npx playwright test --grep @ui
  ```

- **Run only API tests:**
  (API tests are tagged with `@api` in `tests/api/jira.spec.ts`)

  ```bash
  npm run test:api
  ```

  or

  ```bash
  npx playwright test --grep @api
  ```

- **Run tests in headed mode (to watch the browser):**

  ```bash
  npx playwright test --headed
  ```

- **Run a specific test file:**

  ```bash
  npx playwright test tests/ui/smoke.spec.ts
  ```

- **View HTML Report:**
  After tests run, the HTML report is generated in the `playwright-report` directory (or `test-results/html` based on exact Playwright version/config if customized beyond default). By default, it is in `playwright-report`.
  ```bash
  npx playwright show-report
  ```

## Project Structure

```
gamdom-automation-framework/
├── tests/
│   ├── ui/                 # UI test specifications
│   │   └── example.spec.ts
│   └── api/                 # API test specifications
│       └── jira.spec.ts
├── pages/                  # Page Object Model classes
│   ├── BasePage.ts
│   └── LoginPage.ts
├── helpers/                # Utility functions and API clients
│   ├── jiraApiClient.ts        # JIRA API client using Axios
│   └── utils.ts
├── playwright.config.ts    # Playwright configuration
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```
