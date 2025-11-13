const RIXLY_API_BASE_URL = process.env.NEXT_PUBLIC_RIXLY_API_BASE_URL;

export interface Project {
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

  return responseData.projects;
}
