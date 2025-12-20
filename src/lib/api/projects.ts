const RIXLY_API_BASE_URL = import.meta.env.VITE_RIXLY_API_BASE_URL;

export interface Project {
  _id: string;
  projectName: string;
  websiteUrl: string;
  description: string;
  keywords: string[];
  semanticQueries: string[];
}

export interface GetProjectsResponse {
  message: string;
  projects: Project[];
  count: number;
}

export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
}

export interface CreateProjectRequest {
  projectName: string;
  websiteUrl: string;
  description: string;
  keywords: string[];
  semanticQueries: string[];
}

export interface CreateProjectResponse {
  message: string;
  project: Project;
}

export interface GenerateDescriptionRequest {
  applicationUrl: string;
}

export interface GenerateDescriptionResponseData {
  applicationUrl: string;
  description: string;
}

export interface GenerateDescriptionResponse {
  data: GenerateDescriptionResponseData;
}

export interface GenerateKeywordsRequest {
  productDescription: string;
}

export interface GenerateKeywordsResponseData {
  keywords: string[];
  count: number;
}

export interface GenerateKeywordsResponse {
  data: GenerateKeywordsResponseData;
}

export interface GenerateSemanticQueriesRequest {
  productDescription: string;
}

export interface GenerateSemanticQueriesResponseData {
  queries: string[];
  count: number;
}

export interface GenerateSemanticQueriesResponse {
  data: GenerateSemanticQueriesResponseData;
}

export async function getProjects(): Promise<Project[]> {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found. Please login.");
  }

  const response = await fetch(`${RIXLY_API_BASE_URL}/api/projects`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const responseData: GetProjectsResponse = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to fetch projects");
  }

  // Transform API response to match Project interface
  return responseData.projects.map((project: any) => ({
    _id: String(project.id),
    projectName: project.projectName,
    websiteUrl: project.projectUrl,
    description: project.projectDescription,
    keywords: project.keywords || [],
    semanticQueries: project.semanticQueries || [],
  }));
}

export async function createProject(data: CreateProjectRequest): Promise<CreateProjectResponse> {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found. Please login.");
  }

  const response = await fetch(`${RIXLY_API_BASE_URL}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to create project");
  }

  return responseData;
}

export async function generateDescription(data: GenerateDescriptionRequest): Promise<GenerateDescriptionResponse> {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found. Please login.");
  }

  const response = await fetch(`${RIXLY_API_BASE_URL}/api/ai/generate-description`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to generate description");
  }

  return responseData;
}

export async function generateKeywords(data: GenerateKeywordsRequest): Promise<GenerateKeywordsResponse> {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found. Please login.");
  }

  const response = await fetch(`${RIXLY_API_BASE_URL}/api/ai/generate-keywords`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to generate keywords");
  }

  return responseData;
}

export async function generateSemanticQueries(data: GenerateSemanticQueriesRequest): Promise<GenerateSemanticQueriesResponse> {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found. Please login.");
  }

  const response = await fetch(`${RIXLY_API_BASE_URL}/api/ai/generate-semantic-queries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to generate semantic queries");
  }

  return responseData;
}

export async function getAdminProjects(): Promise<Project[]> {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found. Please login.");
  }

  const response = await fetch(`${RIXLY_API_BASE_URL}/api/admin/projects`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const responseData: GetProjectsResponse = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to fetch admin projects");
  }

  // Transform API response to match Project interface
  return responseData.projects.map((project: any) => ({
    _id: String(project.id),
    projectName: project.projectName,
    websiteUrl: project.projectUrl,
    description: project.projectDescription,
    keywords: project.keywords || [],
    semanticQueries: project.semanticQueries || [],
  }));
}

export interface ScrapeRedditResponse {
  message: string;
  status?: string;
}

export async function scrapeReddit(projectId: string): Promise<ScrapeRedditResponse> {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found. Please login.");
  }

  const response = await fetch(`${RIXLY_API_BASE_URL}/api/projects/${projectId}/scrape-reddit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to start Reddit scraping");
  }

  return responseData;
}
