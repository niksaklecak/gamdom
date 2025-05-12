import { APIRequestContext, request, APIResponse } from "@playwright/test";
import { config } from "./config";

class JiraApiClient {
  private async createApiContext(): Promise<APIRequestContext> {
    return request.newContext({
      baseURL: config.jiraBaseUrl,
      extraHTTPHeaders: {
        Accept: "application/json",
        Authorization: `Basic ${config.jiraBasicAuthToken}`,
        "X-Atlassian-Token": "no-check",
        "User-Agent": "PlaywrightAPI/1.0",
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
    const api = await this.createApiContext();

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

    return api.post("/rest/api/3/issue", {
      data: payload,
      headers: {
        "Content-Type": "application/json",
        "X-Atlassian-Token": "no-check",
        "User-Agent": "PlaywrightAPI/1.0",
      },
    });
  }

  /**
   * Gets a JIRA issue by its ID or key.
   * @param issueIdOrKey The ID or key of the issue.
   * @returns Promise<APIResponse>
   */
  async getIssue(issueIdOrKey: string): Promise<APIResponse> {
    const api = await this.createApiContext();
    return api.get(`/rest/api/3/issue/${issueIdOrKey}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Atlassian-Token": "no-check",
        "User-Agent": "PlaywrightAPI/1.0",
      },
    });
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
    const api = await this.createApiContext();
    const payload = {
      fields: fieldsToUpdate,
    };
    return api.put(`/rest/api/3/issue/${issueIdOrKey}`, {
      data: payload,
      headers: {
        "Content-Type": "application/json",
        "X-Atlassian-Token": "no-check",
        "User-Agent": "PlaywrightAPI/1.0",
      },
    });
  }

  /**
   * Deletes a JIRA issue.
   * @param issueIdOrKey The ID or key of the issue to delete.
   * @returns Promise<APIResponse>
   */
  async deleteIssue(issueIdOrKey: string): Promise<APIResponse> {
    const api = await this.createApiContext();
    return api.delete(`/rest/api/3/issue/${issueIdOrKey}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Atlassian-Token": "no-check",
        "User-Agent": "PlaywrightAPI/1.0",
      },
    });
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
    const api = await this.createApiContext();
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

    return api.post("/rest/api/3/issue/bulkfetch", {
      data: payload,
      headers: {
        "Content-Type": "application/json",
        "X-Atlassian-Token": "no-check",
        "User-Agent": "PlaywrightAPI/1.0",
      },
    });
  }

  /**
   * Gets details for the currently authenticated user.
   * @returns Promise<APIResponse>
   */
  async getMyself(): Promise<APIResponse> {
    const api = await this.createApiContext();
    return api.get("/rest/api/3/myself", {
      headers: {
        "Content-Type": "application/json",
        "X-Atlassian-Token": "no-check",
        "User-Agent": "PlaywrightAPI/1.0",
      },
    });
  }
}

export const jiraApiClient = new JiraApiClient();
