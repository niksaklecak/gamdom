# Gamdom Automation Test Framework

This project contains an automation test framework for the Gamdom QA assignment, covering both UI and API testing.

## Framework Overview

- **Language**: TypeScript
- **Test Runner**: Playwright Test
- **UI Automation**: Playwright for browser automation.
  - **Design Pattern**: Page Object Model (POM) is used for UI tests, located in the `pages` directory.
  - UI tests are located in `tests/ui`.
- **API Automation**: Playwright's API testing capabilities are leveraged, with an Axios-based API client for JIRA interactions.
  - The JIRA API client is in `helpers/apiClient.ts`.
  - API tests are located in `tests/api`.
- **Reporting**: Playwright HTML reporter is configured.
- **Utilities**: Common helper functions can be found in `helpers/testUtils.ts`.

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

    Or using yarn:

    ```bash
    yarn install
    ```

    This command will also run `playwright install --with-deps` (due to the `postinstall` script in `package.json`) to download the necessary browser binaries.

4.  **Environment Variables (Optional but Recommended for JIRA API Token):**
    While the JIRA API token is currently hardcoded in `helpers/apiClient.ts` for simplicity in this assignment, in a real-world scenario, it's highly recommended to manage sensitive data like API tokens using environment variables.
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
  npx playwright test tests/ui/example.spec.ts
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
│   ├── basePage.ts
│   └── loginPage.ts
├── helpers/                # Utility functions and API clients
│   ├── apiClient.ts        # JIRA API client using Axios
│   └── testUtils.ts
├── playwright.config.ts    # Playwright configuration
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## Next Steps for Assignment

1.  **Part 1: Exploratory Analysis** - Complete your exploratory testing of `qa-test-playground.teamgamdom.com` and document the 5 key functional areas.
2.  **Implement UI Test Scenarios**:
    - Update selectors in `pages/loginPage.ts` and other page objects you create to match the actual website elements.
    - Implement the three representative UI test scenarios from Part 1, including the mandatory Originals game betting scenario in `tests/ui/`.
3.  **Refine API Tests**: The current API tests in `tests/api/jira.spec.ts` provide a CRUD workflow. Ensure they meet all requirements for error validation and logical flow.
4.  **Review and Document**: Ensure all code is clean, well-organized, and the `README.md` is complete and clear.
