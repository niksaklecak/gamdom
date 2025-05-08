import { APIRequestContext, request, APIResponse } from "@playwright/test";
import { config } from "./config";

class JiraApiClient {
  private async createAuthContext(): Promise<APIRequestContext> {
    return request.newContext({
      baseURL: config.jiraApiUrl,
      extraHTTPHeaders: {
        "Content-Type": "application/json",
        Authorization: `Basic ${config.jiraBasicAuthToken}`,
      },
    });
  }

  /**
   * Creates a JIRA issue.
   * @param projectKey The key of the project (e.g., "QA").
   * @param summary The summary of the issue.
   * @param description The description of the issue (can be simple text or Atlassian Document Format).
   * @param issueTypeName The name of the issue type (e.g., "Task", "Bug"). Defaults to "Task".
   * @param optionalFields An object containing any additional fields to set for the issue. These will be merged into the `fields` payload.
   *                       Example: { assignee: { id: "..." }, labels: ["test", "critical"], priority: { name: "High" } }
   * @returns Promise<APIResponse>
   */
  async createIssue(
    projectKey: string,
    summary: string,
    description: string,
    issueTypeName: string = "Task",
    optionalFields?: object
  ): Promise<APIResponse> {
    const api = await this.createAuthContext();

    const baseFields = {
      project: {
        key: projectKey,
      },
      summary: summary,
      description: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: description,
              },
            ],
          },
        ],
      },
      issuetype: {
        name: issueTypeName,
      },
    };

    const payload = {
      fields: {
        ...baseFields,
        ...optionalFields,
      },
    };

    return api.post("/issue", { data: payload });
  }

  /**
   * Gets a JIRA issue by its ID or key.
   * @param issueIdOrKey The ID or key of the issue.
   * @returns Promise<APIResponse>
   */
  async getIssue(issueIdOrKey: string): Promise<APIResponse> {
    const api = await this.createAuthContext();
    return api.get(`/issue/${issueIdOrKey}`);
  }

  /**
   * Updates a JIRA issue.
   * @param issueIdOrKey The ID or key of the issue to update.
   * @param fieldsToUpdate An object containing the fields to update.
   *                       Example: { summary: "New summary", priority: { name: "High" } }
   *                       Refer to JIRA API docs for field formats.
   * @returns Promise<APIResponse>
   */
  async updateIssue(
    issueIdOrKey: string,
    fieldsToUpdate: object
  ): Promise<APIResponse> {
    const api = await this.createAuthContext();
    const payload = {
      fields: fieldsToUpdate,
    };
    return api.put(`/issue/${issueIdOrKey}`, { data: payload });
  }

  /**
   * Deletes a JIRA issue.
   * @param issueIdOrKey The ID or key of the issue to delete.
   * @returns Promise<APIResponse>
   */
  async deleteIssue(issueIdOrKey: string): Promise<APIResponse> {
    const api = await this.createAuthContext();
    return api.delete(`/issue/${issueIdOrKey}`);
  }

  /**
   * Fetches details for multiple JIRA issues in bulk.
   * @param issueIdsOrKeys An array of issue IDs or keys (e.g., ["CRM-6", "QA-1"]).
   * @param fields An optional array of field names to return for each issue (e.g., ["summary", "status"]).
   * @param expand An optional array of entities to expand (e.g., ["names", "renderedFields"]).
   * @returns Promise<APIResponse>
   */
  async bulkFetchIssues(
    issueIdsOrKeys: string[],
    fields?: string[],
    expand?: string[],
    fieldsByKeys?: boolean,
    properties?: string[] // JIRA API docs show this, though your example had it empty
  ): Promise<APIResponse> {
    const api = await this.createAuthContext();
    const payload: { [key: string]: any } = {
      issueIdsOrKeys: issueIdsOrKeys,
    };
    if (fields && fields.length > 0) {
      payload.fields = fields;
    }
    if (expand && expand.length > 0) {
      payload.expand = expand;
    }
    if (fieldsByKeys !== undefined) {
      payload.fieldsByKeys = fieldsByKeys;
    }
    if (properties && properties.length > 0) {
      payload.properties = properties;
    }

    return api.post("/issue/bulkfetch", { data: payload });
  }

  /**
   * Gets details for the currently authenticated user.
   * @returns Promise<APIResponse>
   */
  async getMyself(): Promise<APIResponse> {
    const api = await this.createAuthContext();
    return api.get("/myself"); // Ensure this is GET
  }
}

export default new JiraApiClient();
