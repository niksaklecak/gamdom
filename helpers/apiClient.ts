import { request, APIRequestContext, APIResponse } from "@playwright/test";

export class ApiClient {
  private token: string | null = null;

  constructor(
    private email: string,
    private password: string,
    private authBaseUrl: string = process.env.AUTH_BASE_URL || "",
    private apiBaseUrl: string = process.env.API_BASE_URL || ""
  ) {
    if (!this.authBaseUrl) {
      throw new Error("AUTH_BASE_URL is not defined");
    }
    if (!this.apiBaseUrl) {
      throw new Error("API_BASE_URL is not defined");
    }
  }

  /**
   * Creates a new APIRequestContext for authentication.
   */
  private async createAuthContext(): Promise<APIRequestContext> {
    return request.newContext({
      baseURL: this.authBaseUrl,
      extraHTTPHeaders: { "Content-Type": "application/json" },
    });
  }

  /**
   * Creates a new APIRequestContext for API interactions.
   * Ensures that the user is logged in by checking for a valid token.
   */
  private async createApiContext(): Promise<APIRequestContext> {
    if (!this.token) {
      await this.performLogin();
    }
    return request.newContext({
      baseURL: this.apiBaseUrl,
      extraHTTPHeaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  /**
   * Logs in the user and stores the access token.
   * @throws Error if login fails or accessToken is not returned.
   */
  private async performLogin(): Promise<APIResponse> {
    const passwordLoginQuery = `
      mutation PasswordLogin {
        passwordLogin(email: "${this.email}", password: "${this.password}") {
          accessToken
        }
      }
    `;
    const authContext = await this.createAuthContext();
    const response = await authContext.post("", {
      data: { query: passwordLoginQuery },
    });

    if (!response.ok()) {
      throw new Error(
        `Login failed: ${response.status()} ${response.statusText()}`
      );
    }

    const body = await response.json();
    const accessToken = body.data?.passwordLogin?.accessToken;
    if (!accessToken) {
      throw new Error("No accessToken returned by login mutation");
    }
    this.token = accessToken;

    return response;
  }

  /**
   * Verifies the login functionality.
   * @returns
   * @throws Error if unable to fetch current workspace.
   */
  public async login(): Promise<APIResponse> {
    return await this.performLogin();
  }

  /**
   * Retrieves the current workspace.
   * @returns APIResponse containing the current workspace data.
   */
  public async getCurrentWorkspace(): Promise<APIResponse> {
    const query = `
      query {
        currentWorkspace {
          id
          name
          icon
          permissionScopes
          owner {
            email
            name
          }
        }
      }
    `;
    const apiContext = await this.createApiContext();
    return apiContext.post("", { data: { query } });
  }

  /**
   * Checks if the user has access to a workspace.
   * @returns APIResponse containing the access status.
   */
  public async hasAccessToAWorkspace(): Promise<APIResponse> {
    const query = `
      query hasAccessToAWorkspace {
        hasAccessToAWorkspace
      }
    `;
    const apiContext = await this.createApiContext();
    return apiContext.post("", { data: { query } });
  }

  /**
   * Retrieves recently modified files.
   * @returns APIResponse containing the list of recently modified files.
   */
  public async getRecentlyModifiedFiles(): Promise<APIResponse> {
    const query = `
      query getRecentlyModifiedFiles {
        filesRecentlyModified(fileType: CreatorFile, count: 10, filterByCurrentUserModifications: true) {
          id
          backgroundColor
          name
          updatedAt
          fileObject {
            thumbnails {
              png {
                medium {
                  url
                }
              }
            }
          }
        }
      }
    `;
    const apiContext = await this.createApiContext();
    return apiContext.post("", { data: { query } });
  }

  /**
   * Sets up the initial workspace.
   * @returns APIResponse containing the setup workspace details.
   */
  public async setupInitialWorkspace(): Promise<APIResponse> {
    const mutation = `
      mutation setupInitialWorkspace {
        setupInitialWorkspace {
          id
          name
          icon
          features {
            slug
            isEnabled
            max
          }
          hasOwnership
          createdAt
          subscription {
            plan {
              planPosition
            }
          }
        }
      }
    `;
    const apiContext = await this.createApiContext();
    return apiContext.post("", { data: { query: mutation } });
  }

  /**
   * Retrieves all workspaces.
   * @returns APIResponse containing the list of workspaces.
   */
  public async getWorkspaces(): Promise<APIResponse> {
    const query = `
      query {
        workspaces {
          id
          name
          icon
          features {
            slug
            isEnabled
            max
          }
          hasOwnership
          createdAt
          subscription {
            plan {
              planPosition
            }
          }
        }
      }
    `;
    const apiContext = await this.createApiContext();
    return apiContext.post("", { data: { query } });
  }

  /**
   * Retrieves the draft project for a workspace.
   * @param workspaceId - The ID of the workspace.
   * @returns APIResponse containing the draft project details.
   */
  public async workspaceDraftProject(
    workspaceId: string
  ): Promise<APIResponse> {
    const query = `
      query workspaceDraftProject {
        workspaceDraftProject(workspaceId: ${workspaceId}) {
          id
          isPrivate
          isSystem
          slug
          title
          workspaceId
          filesCount
        }
    `;
    const apiContext = await this.createApiContext();
    return apiContext.post("", { data: { query, variables: { workspaceId } } });
  }

  public async hasAccessToWorkspace(): Promise<APIResponse> {
    const query = `
      query hasAccessToAWorkspace {
        hasAccessToAWorkspace
      }
    `;
    const apiContext = await this.createApiContext();
    return apiContext.post("", { data: { query } });
  }

  public async getViewer(): Promise<APIResponse> {
    const query = `
      query {
        viewer {
          id
          email
          name
          avatarUrl
          country
          userSegments {
            title
          }
        }
      }
    `;
    const apiContext = await this.createApiContext();
    return apiContext.post("", { data: { query } });
  }

  public async setupNewUser(): Promise<void> {
    const hasAccessToWorkspaceResponse = await this.hasAccessToWorkspace();
    const hasAccessToWorkspaceData = await hasAccessToWorkspaceResponse.json();
    const hasAccessToWorkspaceValue = hasAccessToWorkspaceData.data; //true

    const recentlyModifiedFilesResponse = await this.getRecentlyModifiedFiles();
    const recentlyModifiedFilesData =
      await recentlyModifiedFilesResponse.json();
    const filesRecentlyModifiedValue =
      recentlyModifiedFilesData.data.filesRecentlyModified; //0

    const setupInitialWorkspaceResponse = await this.setupInitialWorkspace();
    const setupInitialWorkspaceData =
      await setupInitialWorkspaceResponse.json();
    const initialWorkspaceId =
      setupInitialWorkspaceData.data.setupInitialWorkspace.id;

    const workspacesResponse = await this.getWorkspaces();
    const workspacesData = await workspacesResponse.json();
    // const firstWorkspaceIdValue = workspacesData.data.workspaces[0].id;

    const workspaceDraftProjectResponse = await this.workspaceDraftProject(
      initialWorkspaceId
    );
    const workspaceDraftProjectData =
      await workspaceDraftProjectResponse.json();
    // const workspaceDraftProjectIdValue = workspaceDraftProjectData.data.workspaceDraftProject.id;

    const currentWorkspaceResponse = await this.getCurrentWorkspace();
    const currentWorkspaceData = await currentWorkspaceResponse.json();
    const currentWorkspaceId = currentWorkspaceData.data.currentWorkspace.id;
  }
}
