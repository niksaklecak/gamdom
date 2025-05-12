import { test, expect, APIResponse } from "@playwright/test";
import { jiraApiClient } from "@helpers/jiraApiClient"; // Import the new JIRA API client
import { config } from "@/helpers/config";

test.describe("JIRA API Basic Connectivity @api", () => {
  test("should connect and get current user details (/myself)", async () => {
    const response: APIResponse = await jiraApiClient.getMyself();

    const userData = await response.json();
    expect(userData).toHaveProperty("accountId");
    expect(userData).toHaveProperty("emailAddress");
    // The email should match the one used for authentication if the token is correct
    expect(userData.emailAddress).toBe("svetoslav.lazarov92@gmail.com");
  });
});

test.describe("JIRA API CRUD Workflow @api", () => {
  test("should create a JIRA issue", async () => {
    const summary = `Test Issue - ${new Date().toISOString()}`;
    const description =
      "This is a test issue created by Playwright for the JIRA API CRUD workflow.";
    const issueType = "Task";

    const response: APIResponse = await jiraApiClient.createIssue(
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

    // Clean up the created issue
    await jiraApiClient.deleteIssue(issueData.key);
    console.log(
      `Created and then deleted JIRA Issue: ${issueData.key} - ${summary}`
    );
  });

  test("should get a JIRA issue", async () => {
    // First create an issue to get
    const summary = `Get Test Issue - ${new Date().toISOString()}`;
    const description =
      "This is a test issue created for testing get operation.";
    const issueType = "Task";

    const createResponse: APIResponse = await jiraApiClient.createIssue(
      config.jiraProjectKey,
      summary,
      description,
      issueType
    );

    expect(
      createResponse.status(),
      `Failed to create issue for get test. Response: ${await createResponse.text()}`
    ).toBe(201);

    const createData = await createResponse.json();
    const issueKey = createData.key;

    const getResponse: APIResponse = await jiraApiClient.getIssue(issueKey);

    expect(
      getResponse.status(),
      `Failed to get issue ${issueKey}. Response: ${await getResponse.text()}`
    ).toBe(200);

    const issueData = await getResponse.json();
    expect(issueData.key).toBe(issueKey);
    expect(issueData.fields.project.key).toBe(config.jiraProjectKey);
    console.log(`Successfully fetched JIRA Issue: ${issueData.key}`);

    // Clean up
    await jiraApiClient.deleteIssue(issueKey);
    console.log(`Deleted JIRA Issue: ${issueKey}`);
  });

  test("should update a JIRA issue", async () => {
    // First create an issue to update
    const summary = `Update Test Issue - ${new Date().toISOString()}`;
    const description =
      "This is a test issue created for testing update operation.";
    const issueType = "Task";

    const createResponse: APIResponse = await jiraApiClient.createIssue(
      config.jiraProjectKey,
      summary,
      description,
      issueType
    );

    expect(
      createResponse.status(),
      `Failed to create issue for update test. Response: ${await createResponse.text()}`
    ).toBe(201);

    const createData = await createResponse.json();
    const issueKey = createData.key;

    // Now update the issue
    const updatedSummary = `Updated Summary - ${issueKey} - ${new Date().toISOString()}`;
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
    };

    const updateResponse: APIResponse = await jiraApiClient.updateIssue(
      issueKey,
      fieldsToUpdate
    );

    // JIRA often returns 204 No Content for successful updates
    expect(
      updateResponse.status(),
      `Failed to update issue ${issueKey}. Response: ${await updateResponse.text()}`
    ).toBe(204);
    console.log(`Successfully updated JIRA Issue: ${issueKey}`);

    // Verify the update by fetching the issue again
    const verifyResponse: APIResponse = await jiraApiClient.getIssue(issueKey);

    expect(
      verifyResponse.ok(),
      `Failed to verify update for issue ${issueKey}. Verify Response: ${await verifyResponse.text()}`
    ).toBe(true);

    const issueData = await verifyResponse.json();
    expect(issueData.fields.summary).toBe(updatedSummary);
    expect(issueData.fields.description.content[0].content[0].text).toBe(
      updatedDescription
    );

    // Clean up
    await jiraApiClient.deleteIssue(issueKey);
    console.log(`Deleted JIRA Issue: ${issueKey}`);
  });

  test("should delete a JIRA issue", async () => {
    // First create an issue to delete
    const summary = `Delete Test Issue - ${new Date().toISOString()}`;
    const description =
      "This is a test issue created for testing delete operation.";
    const issueType = "Task";

    const createResponse: APIResponse = await jiraApiClient.createIssue(
      config.jiraProjectKey,
      summary,
      description,
      issueType
    );

    expect(
      createResponse.status(),
      `Failed to create issue for delete test. Response: ${await createResponse.text()}`
    ).toBe(201);

    const createData = await createResponse.json();
    const issueKey = createData.key;
    console.log(`Created JIRA Issue for delete test: ${issueKey}`);

    // Now delete the issue
    const deleteResponse: APIResponse = await jiraApiClient.deleteIssue(
      issueKey
    );

    // JIRA returns 204 No Content for successful deletions
    expect(
      deleteResponse.status(),
      `Failed to delete issue ${issueKey}. Response: ${await deleteResponse.text()}`
    ).toBe(204);
    console.log(`Successfully deleted JIRA Issue: ${issueKey}`);

    // Verify deletion by trying to get the issue (should be 404)
    const verifyResponse: APIResponse = await jiraApiClient.getIssue(issueKey);

    expect(
      verifyResponse.status(),
      `Issue ${issueKey} still found after deletion.`
    ).toBe(404);
  });
});
