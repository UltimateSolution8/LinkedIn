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
  emailNotifyEnabled?: boolean;
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

export interface UpdateProjectSettingsPayload {
  keywords?: string[];
  targetAudience?: string[];
  valuePropositions?: string[];
  emailNotifyEnabled?: boolean;
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
  targetAudience?: string[];
  valuePropositions?: string[];
}

export interface GenerateKeywordsResponseData {
  keywords: string[];
  keywordsCount: number;
  targetAudience: string[];
  valuePropositions: string[];
}

export interface GenerateKeywordsResponse {
  message: string;
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
    emailNotifyEnabled: project.emailNotifyEnabled ?? false,
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

export interface NextScheduledRunResponse {
  status: 'pending' | 'running' | 'overdue' | 'no_projects' | 'no_schedules' | 'error';
  message: string;
  nextRunAt: string | null;
  lastSyncTime: string | null;
  projectName: string | null;
}

export async function getNextScheduledRun(): Promise<NextScheduledRunResponse> {
  const response = await fetch(`${RIXLY_API_BASE_URL}/api/projects/next-scheduled-run`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to fetch next scheduled run");
  }

  return responseData;
}

export async function updateProjectSettings(
  projectId: string,
  payload: UpdateProjectSettingsPayload
): Promise<void> {
  const response = await fetch(`${RIXLY_API_BASE_URL}/api/projects/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to update project settings");
  }
}

// ===== Dashboard API =====

export type ScanState = "scanning_empty" | "scanning_partial" | "complete";

export interface DashboardKPIs {
  hotLeadCount: number;
  leadsThisWeek: number;
  totalLeads: number;
  postsScanned: number;
}

export interface LeadGrowthDataPoint {
  weekLabel: string;
  count: number;
}

export interface SubredditData {
  subreddit: string;
  count: number;
}

export interface KeywordData {
  keyword: string;
  count: number;
}

export interface HotLead {
  id: number;
  title: string;
  subreddit: string;
  score: number;
  painTags: string[];
  createdAt: string;
}

export interface PainPoint {
  label: string;
  count: number;
}

export interface ActivityFeedItem {
  type: "hot_lead" | "scan_complete" | "scan_progress" | "scan_start";
  message: string;
  createdAt: string;
}

export interface DashboardData {
  scanState: ScanState;
  scanProgress: number;
  kpis: DashboardKPIs;
  leadGrowthChart: LeadGrowthDataPoint[];
  topSubreddits: SubredditData[];
  topKeywords: KeywordData[];
  recentHotLeads: HotLead[];
  trendingPainPoints: PainPoint[];
  activityFeed: ActivityFeedItem[];
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
  message?: string;
}

export async function getDashboardData(projectId: string): Promise<DashboardData> {
  const response = await fetch(`${RIXLY_API_BASE_URL}/api/projects/${projectId}/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const responseData: DashboardResponse = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to fetch dashboard data");
  }

  return responseData.data;
}

// Scanning Status Types
export type ScrapingStage = 'idle' | 'validating_subreddits' | 'scoring_leads' | 'completed' | 'failed';

export interface ScanningStatusData {
  stage: ScrapingStage;
  subreddits: string[];
  subredditCount: number;
}

// Get scanning status for dashboard initial state
export async function getScanningStatus(projectId: string): Promise<ScanningStatusData> {
  const response = await fetch(`${RIXLY_API_BASE_URL}/api/projects/${projectId}/scanning-status`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to fetch scanning status");
  }

  return responseData;
}
