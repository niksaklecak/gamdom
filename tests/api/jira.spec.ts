import { test, expect, APIResponse } from "@playwright/test";
import JiraApiClient from "@helpers/jiraApiClient"; // Import the new JIRA API client
import { config } from "@/helpers/config";
const PROJECT_KEY = "QA"; // Project key from the assignment

test.describe("JIRA API Basic Connectivity @api", () => {
  test("should connect and get current user details (/myself)", async () => {
    const response: APIResponse = await JiraApiClient.getMyself();
    console.log(`[DEBUG] /myself response status: ${response.status()}`);
    const responseText = await response.text(); // Get text for logging in case of non-JSON
    console.log(
      `[DEBUG] /myself response text: ${responseText.substring(0, 500)}`
    );

    expect(
      response.ok(),
      `Failed to get /myself. Status: ${response.status()}, Response: ${responseText}`
    ).toBe(true);

    // If response is ok, then try to parse JSON
    const userData = await response.json();
    expect(userData).toHaveProperty("accountId");
    expect(userData).toHaveProperty("emailAddress");
    // The email should match the one used for authentication if the token is correct
    expect(userData.emailAddress).toBe("svetoslav.lazarov92@gmail.com");
    console.log(
      `Successfully fetched /myself for user: ${userData.emailAddress}`
    );
  });
});

test.describe("JIRA API CRUD Workflow @api", () => {
  let createdIssueIdOrKey: string | null = null;

  test("should create a JIRA issue", async () => {
    const summary = `Test Issue - ${new Date().toISOString()}`;
    const description =
      "This is a test issue created by Playwright for the JIRA API CRUD workflow.";
    const issueType = "Task";

    const response: APIResponse = await JiraApiClient.createIssue(
      config.jiraProjectKey,
      summary,
      description,
      issueType
    );

    expect(
      response.status(),
      `Failed to create issue. Response: ${await response.text()}`
    ).toBe(201); // 201 Created
    const issueData = await response.json();
    expect(issueData).toHaveProperty("id");
    expect(issueData).toHaveProperty("key");
    expect(issueData.fields.summary).toBe(summary);
    expect(issueData.fields.project.key).toBe(PROJECT_KEY);
    expect(issueData.fields.issuetype.name).toBe(issueType);

    createdIssueIdOrKey = issueData.key; // Save for subsequent tests
    console.log(`Created JIRA Issue: ${createdIssueIdOrKey} - ${summary}`);
  });

  test("should get the created JIRA issue", async () => {
    expect(
      createdIssueIdOrKey,
      "Cannot get issue: createdIssueIdOrKey is null. Ensure createIssue test passed."
    ).not.toBeNull();
    if (!createdIssueIdOrKey) return; // Type guard for safety

    const response: APIResponse = await JiraApiClient.getIssue(
      createdIssueIdOrKey
    );
    expect(
      response.status(),
      `Failed to get issue ${createdIssueIdOrKey}. Response: ${await response.text()}`
    ).toBe(200);
    const issueData = await response.json();
    expect(issueData.key).toBe(createdIssueIdOrKey);
    expect(issueData.fields.project.key).toBe(PROJECT_KEY);
    console.log(`Successfully fetched JIRA Issue: ${issueData.key}`);
  });

  test("should update the JIRA issue", async () => {
    expect(
      createdIssueIdOrKey,
      "Cannot update issue: createdIssueIdOrKey is null. Ensure createIssue test passed."
    ).not.toBeNull();
    if (!createdIssueIdOrKey) return; // Type guard

    const updatedSummary = `Updated Summary - ${createdIssueIdOrKey} - ${new Date().toISOString()}`;
    const updatedDescription =
      "The description has been updated by an automated test.";
    const fieldsToUpdate = {
      summary: updatedSummary,
      description: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: updatedDescription,
              },
            ],
          },
        ],
      },
      // Example: to update priority, you might need its ID
      // priority: { id: "3" } // Assuming "3" is the ID for "Medium" or similar
    };

    const response: APIResponse = await JiraApiClient.updateIssue(
      createdIssueIdOrKey,
      fieldsToUpdate
    );
    // JIRA often returns 204 No Content for successful updates
    expect(
      response.status(),
      `Failed to update issue ${createdIssueIdOrKey}. Response: ${await response.text()}`
    ).toBe(204);
    console.log(`Successfully updated JIRA Issue: ${createdIssueIdOrKey}`);

    // Verify the update by fetching the issue again
    const verifyResponse: APIResponse = await JiraApiClient.getIssue(
      createdIssueIdOrKey
    );
    expect(
      verifyResponse.ok(),
      `Failed to verify update for issue ${createdIssueIdOrKey}. Verify Response: ${await verifyResponse.text()}`
    ).toBe(true);
    const issueData = await verifyResponse.json();
    expect(issueData.fields.summary).toBe(updatedSummary);
    // Note: Comparing rich text description might be complex. Check if necessary or simplify.
    expect(issueData.fields.description.content[0].content[0].text).toBe(
      updatedDescription
    );
  });

  test("should delete the JIRA issue", async () => {
    expect(
      createdIssueIdOrKey,
      "Cannot delete issue: createdIssueIdOrKey is null. Ensure create/get/update tests passed."
    ).not.toBeNull();
    if (!createdIssueIdOrKey) return; // Type guard

    const response: APIResponse = await JiraApiClient.deleteIssue(
      createdIssueIdOrKey
    );
    // JIRA returns 204 No Content for successful deletions
    expect(
      response.status(),
      `Failed to delete issue ${createdIssueIdOrKey}. Response: ${await response.text()}`
    ).toBe(204);
    console.log(`Successfully deleted JIRA Issue: ${createdIssueIdOrKey}`);

    // To prevent trying to delete it again in afterAll if this test passes
    const tempIssueKey = createdIssueIdOrKey;
    createdIssueIdOrKey = null;

    // Optionally, verify deletion by trying to get the issue (should be 404)
    const verifyResponse: APIResponse = await JiraApiClient.getIssue(
      tempIssueKey
    );
    expect(
      verifyResponse.status(),
      `Issue ${tempIssueKey} still found after deletion.`
    ).toBe(404);
  });

  test("should bulk fetch issue details for CRM-6", async () => {
    const issueKeysToFetch = ["CRM-6"];
    const fieldsToRequest = ["summary", "project", "assignee", "status"]; // Added status as an example
    const expandOptions = ["names"];

    const response: APIResponse = await JiraApiClient.bulkFetchIssues(
      issueKeysToFetch,
      fieldsToRequest,
      expandOptions,
      false // fieldsByKeys
    );

    expect(
      response.status(),
      `Failed to bulk fetch issues. Response: ${await response.text()}`
    ).toBe(200);
    const responseData = await response.json();

    // General structure checks
    expect(responseData).toHaveProperty("issues");
    expect(responseData.issues).toBeInstanceOf(Array);
    expect(responseData.issues.length).toBeGreaterThanOrEqual(1); // Expecting at least CRM-6
    expect(responseData).toHaveProperty("names");

    // Find the CRM-6 issue in the response
    const crm6Issue = responseData.issues.find(
      (issue: any) => issue.key === "CRM-6"
    );
    expect(
      crm6Issue,
      "CRM-6 issue not found in bulk fetch response"
    ).toBeDefined();

    if (crm6Issue) {
      console.log(`Bulk fetched CRM-6: ${JSON.stringify(crm6Issue, null, 2)}`);
      // Specific assertions for CRM-6 based on cURL output and requested fields
      expect(crm6Issue.key).toBe("CRM-6");
      expect(crm6Issue.id).toBe("10005"); // From your cURL output
      expect(crm6Issue.fields).toHaveProperty("summary");
      expect(crm6Issue.fields.summary).toContain(
        "(Sample) Log Customer Interactions"
      );
      expect(crm6Issue.fields).toHaveProperty("project");
      expect(crm6Issue.fields.project.key).toBe("CRM");
      expect(crm6Issue.fields.project.name).toBe(
        "Customer Relationship Management System"
      );
      expect(crm6Issue.fields).toHaveProperty("assignee"); // Will be null as per cURL output
      expect(crm6Issue.fields.assignee).toBeNull();
      expect(crm6Issue.fields).toHaveProperty("status"); // Check for status if requested
      // expect(crm6Issue.fields.status.name).toBe("To Do"); // Example: Replace "To Do" with actual status name
    }

    // Check the "names" expansion
    expect(responseData.names.summary).toBe("Summary");
    expect(responseData.names.project).toBe("Project");
    expect(responseData.names.assignee).toBe("Assignee");
  });

  // Clean up in case a test fails before deleting the issue
  test.afterAll(async () => {
    if (createdIssueIdOrKey) {
      console.warn(
        `Performing afterAll cleanup: Deleting JIRA issue ${createdIssueIdOrKey}`
      );
      try {
        const response = await JiraApiClient.deleteIssue(createdIssueIdOrKey);
        if (response.status() === 204) {
          console.log(
            `Successfully cleaned up JIRA Issue: ${createdIssueIdOrKey}`
          );
        } else {
          console.error(
            `Failed to clean up JIRA issue ${createdIssueIdOrKey}. Status: ${response.status()}, Response: ${await response.text()}`
          );
        }
      } catch (error: any) {
        console.error(
          `Error during afterAll cleanup for JIRA issue ${createdIssueIdOrKey}:`,
          error.message
        );
      }
    }
    // Dispose the JiraApiClient context if it implemented a dispose method and you want to ensure cleanup
    // await JiraApiClient.dispose(); // Uncomment if you have a dispose method in the client
  });
});
