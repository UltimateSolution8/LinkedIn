const RIXLY_API_BASE_URL = import.meta.env.VITE_RIXLY_API_BASE_URL;

export interface Project {
  _id: string;
  projectName: string;
  websiteUrl: string;
  description: string;
  keywords: string[];
  semanticQueries: string[];
  targetAudience?: string[];
  valuePropositions?: string[];
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
  location: string;
  businessType: string;
  websiteUrl: string;
  description: string;
  targetAudience: string[];
  valuePropositions: string[];
  keywords: string[];
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

export interface GenerateProductInsightsRequest {
  productDescription: string;
}

export interface GenerateProductInsightsResponseData {
  targetAudience: string[];
  valuePropositions: string[];
}

export interface GenerateProductInsightsResponse {
  message: string;
  data: GenerateProductInsightsResponseData;
}

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${RIXLY_API_BASE_URL}/api/projects`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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
    targetAudience: project.targetAudience || [],
    valuePropositions: project.valuePropositions || [],
  }));
}

export async function createProject(data: CreateProjectRequest): Promise<CreateProjectResponse> {
  const response = await fetch(`${RIXLY_API_BASE_URL}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to create project");
  }

  return responseData;
}

export async function generateDescription(data: GenerateDescriptionRequest): Promise<GenerateDescriptionResponse> {
  const response = await fetch(`${RIXLY_API_BASE_URL}/api/ai/generate-description`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to generate description");
  }

  return responseData;
}

export async function generateKeywords(data: GenerateKeywordsRequest): Promise<GenerateKeywordsResponse> {
  const response = await fetch(`${RIXLY_API_BASE_URL}/api/ai/generate-keywords`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to generate keywords");
  }

  return responseData;
}

export async function generateSemanticQueries(data: GenerateSemanticQueriesRequest): Promise<GenerateSemanticQueriesResponse> {
  const response = await fetch(`${RIXLY_API_BASE_URL}/api/ai/generate-semantic-queries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to generate semantic queries");
  }

  return responseData;
}

export async function generateProductInsights(data: GenerateProductInsightsRequest): Promise<GenerateProductInsightsResponse> {
  const response = await fetch(`${RIXLY_API_BASE_URL}/api/ai/generate-product-insights`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to generate product insights");
  }

  return responseData;
}

export interface AdminProjectsResponse {
  success: boolean;
  data: Array<{
    projectId: number;
    projectName: string;
    projectUrl: string;
    projectDescription: string;
    status: string;
  }>;
  totalProjects: number;
}

export async function getAdminProjects(): Promise<Project[]> {
  const response = await fetch(`${RIXLY_API_BASE_URL}/api/admin/projects`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const responseData: AdminProjectsResponse = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch admin projects");
  }

  // Transform API response to match Project interface
  return responseData.data.map((project) => ({
    _id: String(project.projectId),
    projectId: project.projectId,
    projectName: project.projectName,
    websiteUrl: project.projectUrl,
    description: project.projectDescription,
    status: project.status,
    keywords: [],
    semanticQueries: [],
  }));
}

export interface ScrapeRedditResponse {
  message: string;
  status?: string;
}

export async function scrapeReddit(projectId: string): Promise<ScrapeRedditResponse> {
  const response = await fetch(`${RIXLY_API_BASE_URL}/api/projects/${projectId}/scrape-reddit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to start Reddit scraping");
  }

  return responseData;
}
