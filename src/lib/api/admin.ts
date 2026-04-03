const RIXLY_API_BASE_URL = import.meta.env.VITE_RIXLY_API_BASE_URL;

import type { GetLeadsResponse } from './leads';
import type { GetPostsResponse } from './posts';

export interface UserProject {
  projectId: number;
  projectName: string;
  projectUrl: string;
  projectDescription: string;
  status: string;
}

export interface AdminUser {
  userId: number;
  firstName: string;
  lastName: string;
  email?: string;
  role: string;
  createdAt: string;
  paymentBypass: {
    enabled: boolean;
    until: string | null;
  };
  subscription: {
    subscriptionId: string;
    planId: string;
    status: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
  } | null;
  projectCount: number;
  projects: UserProject[];
}

export interface AdminUsersResponse {
  success: boolean;
  data: AdminUser[];
  totalUser: number;
  message?: string;
}

export interface ProjectDetail {
  projectId: number;
  projectName: string;
  projectUrl: string;
  projectDescription: string;
  status: string;
  keywords: string[];
  semanticQueries: string[];
  subreddits: string[];
  postThreshold: number;
  commentThreshold: number;
  postDateRangeDays: number;
  emailNotificationEnabled?: boolean;
  intentMap: {
    ask: string;
    buy: string;
    sell: string;
    noise: string;
  };
  owner: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface ProjectDetailResponse {
  success: boolean;
  data: ProjectDetail;
}

/**
 * Dashboard Stats
 */
export interface AdminDashboardStats {
  projectsBeingScraped: number;
  totalUsers: number;
  jobsRunningNow: number;
  lastUpdated: string;
}

export interface AdminDashboardStatsResponse {
  success: boolean;
  data: AdminDashboardStats;
  message?: string;
}

/**
 * Today's Leads by Project
 */
export interface TodaysLeadsByProject {
  projectId: number;
  projectName: string;
  userId: number;
  userName: string;
  saleLeads: number;
  engagementLeads: number;
  commentSourceLeads: number;
  totalLeadsToday: number;
}

export interface TodaysLeadsByProjectResponse {
  success: boolean;
  data: TodaysLeadsByProject[];
  message?: string;
}

/**
 * Job Run
 */
export interface JobRun {
  jobRunId: number;
  jobType: string; // e.g., 'reddit_scraping', 'processing', 'notification', 'quickrun'
  projectId: number;
  projectName: string;
  userId: number;
  userName: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt: string | null;
  duration: number | null;
  leadsFound: number | null;
  errorMessage: string | null;
  nextScheduledAt: string | null; // When job will run next (for repeatable jobs)
}

export interface JobHistoryResponse {
  success: boolean;
  data: JobRun[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalJobs: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  message?: string;
}

/**
 * Scheduled Job
 */
export interface ScheduledJob {
  jobRunId: number;
  jobType: string;
  projectId: number;
  projectName: string;
  userId: number;
  userName: string;
  nextRunAt: string;
  lastRunAt: string | null;
  isEnabled: boolean;
  isReadyNow: boolean;
}

export interface ScheduledJobsResponse {
  success: boolean;
  data: ScheduledJob[];
  message?: string;
}

/**
 * Active Job
 */
export interface ActiveJob {
  jobRunId: number;
  jobType: string;
  projectId: number;
  projectName: string;
  userId: number;
  userName: string;
  startedAt: string;
  status: 'running';
}

export interface ActiveJobsResponse {
  success: boolean;
  data: ActiveJob[];
  message?: string;
}

/**
 * User List Item
 */
export interface UserListItem {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  projectCount: number;
  activeProjectCount: number;
  disabledProjectCount: number;
  subscriptionStatus: string;
  subscriptionPlan: string | null;
}

export interface UsersListResponse {
  success: boolean;
  data: UserListItem[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalUsers: number;
    totalPages: number;
  };
  message?: string;
}

/**
 * Get detailed information for a specific project (admin only)
 */
export async function getProjectDetail(projectId: number): Promise<ProjectDetail> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const response = await fetch(`${RIXLY_API_BASE_URL}/api/admin/projects/${projectId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const responseData: ProjectDetailResponse = await response.json();

    if (!response.ok) {
      throw new Error(responseData.data?.projectName || "Failed to fetch project details");
    }

    return responseData.data;
  } catch (error) {
    console.error("Error fetching project details:", error);
    throw error;
  }
}

export interface UpdatePaymentBypassRequest {
  userId: number;
  enabled: boolean;
  until?: string; // ISO date string, optional
}

export interface UpdatePaymentBypassResponse {
  success: boolean;
  message: string;
}

export interface SoftDeleteUserResponse {
  success: boolean;
  message: string;
}

/**
 * Update payment bypass for a user (admin only)
 * Enable with end date: { enabled: true, until: "2025-12-31T23:59:59Z" }
 * Disable: { enabled: false }
 */
export async function updatePaymentBypass(data: UpdatePaymentBypassRequest): Promise<UpdatePaymentBypassResponse> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const body: { enabled: boolean; until?: string } = { enabled: data.enabled };
    if (data.until) {
      body.until = data.until;
    }

    const response = await fetch(`${RIXLY_API_BASE_URL}/api/admin/users/${data.userId}/payment-bypass`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const responseData: UpdatePaymentBypassResponse = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to update payment bypass");
    }

    return responseData;
  } catch (error) {
    console.error("Error updating payment bypass:", error);
    throw error;
  }
}

/**
 * Soft-delete user (admin only)
 */
export async function softDeleteUser(userId: number): Promise<SoftDeleteUserResponse> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const response = await fetch(`${RIXLY_API_BASE_URL}/api/admin/users/${userId}/soft-delete`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const responseData: SoftDeleteUserResponse = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to delete user");
    }

    return responseData;
  } catch (error) {
    console.error("Error soft-deleting user:", error);
    throw error;
  }
}

/**
 * Get all users with their projects (admin only)
 */
export async function getAdminUsers(): Promise<AdminUser[]> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const response = await fetch(`${RIXLY_API_BASE_URL}/api/admin/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const responseData: AdminUsersResponse = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to fetch admin users");
    }

    return responseData.data;
  } catch (error) {
    console.error("Error fetching admin users:", error);
    throw error;
  }
}

/**
 * Get Reddit leads for a specific project (admin only)
 */
export async function getAdminProjectLeads(
  userId: number,
  projectId: number,
  page: number = 1,
  limit: number = 10,
  source?: string,
  sortBy?: string
): Promise<GetLeadsResponse> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (source) {
      params.append("source", source);
    }

    if (sortBy) {
      params.append("sortBy", sortBy);
    }

    const response = await fetch(
      `${RIXLY_API_BASE_URL}/api/admin/users/${userId}/projects/${projectId}/reddit-leads?${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const responseData: GetLeadsResponse = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to fetch project leads");
    }

    return responseData;
  } catch (error) {
    console.error("Error fetching admin project leads:", error);
    throw error;
  }
}

/**
 * Get Reddit posts for a specific project (admin only)
 */
export async function getAdminProjectPosts(
  userId: number,
  projectId: number,
  page: number = 1,
  limit: number = 10,
  sortBy?: string
): Promise<GetPostsResponse> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (sortBy) {
      params.append("sortBy", sortBy);
    }

    const response = await fetch(
      `${RIXLY_API_BASE_URL}/api/admin/users/${userId}/projects/${projectId}/reddit-posts?${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const responseData: GetPostsResponse = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to fetch project posts");
    }

    return responseData;
  } catch (error) {
    console.error("Error fetching admin project posts:", error);
    throw error;
  }
}

/**
 * Update project configuration (admin only)
 */
export interface UpdateProjectConfigPayload {
  keywords?: string[];
  semanticQueries?: string[];
  subreddits?: string[];
  postThreshold?: number;
  commentThreshold?: number;
  postDateRangeDays?: number;
  emailNotificationEnabled?: boolean;
}

export async function updateAdminProjectConfig(
  projectId: number,
  payload: UpdateProjectConfigPayload
): Promise<ProjectDetail> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const response = await fetch(
      `${RIXLY_API_BASE_URL}/api/admin/projects/${projectId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to update project configuration");
    }

    return responseData.data;
  } catch (error) {
    console.error("Error updating project configuration:", error);
    throw error;
  }
}

/**
 * Response type for project disable/enable operations
 */
export interface ProjectStatusResponse {
  success: boolean;
  message: string;
  data: {
    projectId: number;
    status: string;
  };
}

/**
 * Response type for bulk user projects disable/enable operations
 */
export interface BulkProjectStatusResponse {
  success: boolean;
  message: string;
  data: {
    userId: number;
    disabledProjectCount?: number;
    enabledProjectCount?: number;
    projectIds: number[];
  };
}

/**
 * Disable a single project (admin only)
 */
export async function disableProject(projectId: number): Promise<ProjectStatusResponse> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const response = await fetch(
      `${RIXLY_API_BASE_URL}/api/projects/${projectId}/disable`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const responseData: ProjectStatusResponse = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to disable project");
    }

    return responseData;
  } catch (error) {
    console.error("Error disabling project:", error);
    throw error;
  }
}

/**
 * Enable a single project (admin only)
 */
export async function enableProject(projectId: number): Promise<ProjectStatusResponse> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const response = await fetch(
      `${RIXLY_API_BASE_URL}/api/projects/${projectId}/enable`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const responseData: ProjectStatusResponse = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to enable project");
    }

    return responseData;
  } catch (error) {
    console.error("Error enabling project:", error);
    throw error;
  }
}

/**
 * Disable all projects for a user (admin only)
 */
export async function disableAllUserProjects(userId: number): Promise<BulkProjectStatusResponse> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const response = await fetch(
      `${RIXLY_API_BASE_URL}/api/projects/users/${userId}/disable-all`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const responseData: BulkProjectStatusResponse = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to disable all user projects");
    }

    return responseData;
  } catch (error) {
    console.error("Error disabling all user projects:", error);
    throw error;
  }
}

/**
 * Enable all projects for a user (admin only)
 */
export async function enableAllUserProjects(userId: number): Promise<BulkProjectStatusResponse> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const response = await fetch(
      `${RIXLY_API_BASE_URL}/api/projects/users/${userId}/enable-all`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const responseData: BulkProjectStatusResponse = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to enable all user projects");
    }

    return responseData;
  } catch (error) {
    console.error("Error enabling all user projects:", error);
    throw error;
  }
}

/**
 * Get admin dashboard stats
 */
export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const response = await fetch(`${RIXLY_API_BASE_URL}/api/admin/stats/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const responseData: AdminDashboardStatsResponse = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to fetch dashboard stats");
    }

    return responseData.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
}

/**
 * Get today's leads breakdown by project
 */
export async function getTodaysLeadsByProject(): Promise<TodaysLeadsByProject[]> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const response = await fetch(`${RIXLY_API_BASE_URL}/api/admin/leads/today-by-project`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const responseData: TodaysLeadsByProjectResponse = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to fetch today's leads");
    }

    return responseData.data;
  } catch (error) {
    console.error("Error fetching today's leads:", error);
    throw error;
  }
}

/**
 * Get active jobs
 */
export async function getActiveJobs(): Promise<ActiveJob[]> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const response = await fetch(`${RIXLY_API_BASE_URL}/api/admin/jobs/active`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const responseData: ActiveJobsResponse = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to fetch active jobs");
    }

    return responseData.data;
  } catch (error) {
    console.error("Error fetching active jobs:", error);
    throw error;
  }
}

/**
 * Get scheduled jobs
 */
export async function getScheduledJobs(): Promise<ScheduledJob[]> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const response = await fetch(`${RIXLY_API_BASE_URL}/api/admin/jobs/scheduled`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const responseData: ScheduledJobsResponse = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to fetch scheduled jobs");
    }

    return responseData.data;
  } catch (error) {
    console.error("Error fetching scheduled jobs:", error);
    throw error;
  }
}

/**
 * Get job history with pagination and optional filters
 */
export async function getJobHistory(
  page: number = 1,
  limit: number = 20,
  filters?: {
    status?: 'pending' | 'running' | 'completed' | 'failed';
    jobType?: string; // e.g., 'reddit_scraping', 'processing', 'notification', 'quickrun'
    projectId?: number;
  }
): Promise<JobHistoryResponse> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters?.status) {
      params.append("status", filters.status);
    }

    if (filters?.jobType) {
      params.append("jobType", filters.jobType);
    }

    if (filters?.projectId) {
      params.append("projectId", filters.projectId.toString());
    }

    const response = await fetch(
      `${RIXLY_API_BASE_URL}/api/admin/jobs/history?${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const responseData: JobHistoryResponse = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to fetch job history");
    }

    return responseData;
  } catch (error) {
    console.error("Error fetching job history:", error);
    throw error;
  }
}

/**
 * Get users list with pagination
 */
export async function getUsersList(
  page: number = 1,
  limit: number = 50
): Promise<UsersListResponse> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(
      `${RIXLY_API_BASE_URL}/api/admin/users/list?${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const responseData: UsersListResponse = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to fetch users list");
    }

    return responseData;
  } catch (error) {
    console.error("Error fetching users list:", error);
    throw error;
  }
}

/**
 * Projects Breakdown - Compact Version
 */
export interface ProjectJob {
  jobId: number;
  jobType: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  postsAnalyzed: number;
  createdAt: string;
  lastRunAt: string | null;
  nextScheduledAt: string | null;
}

export interface ProjectBreakdownItem {
  projectId: number;
  projectName: string;
  owner: {
    userId: number;
    name: string;
    email: string;
  };
  totalLeads: number;
  salesLeads: number;
  engagementLeads: number;
  commentSources: number;
  subredditsMonitored: number;
  jobs: ProjectJob[];
}

export interface ProjectsBreakdownResponse {
  success: boolean;
  data: ProjectBreakdownItem[];
}

/**
 * Stop Job Response
 */
export interface StopJobResponse {
  success: boolean;
  message: string;
  data: {
    jobRunId: number;
    status: string;
  };
}

/**
 * Get projects breakdown with job details (admin only)
 */
export async function getProjectsBreakdown(): Promise<ProjectBreakdownItem[]> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const response = await fetch(
      `${RIXLY_API_BASE_URL}/api/admin/stats/projects-breakdown`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const responseData: ProjectsBreakdownResponse = await response.json();

    if (!response.ok) {
      throw new Error("Failed to fetch projects breakdown");
    }

    return responseData.data;
  } catch (error) {
    console.error("Error fetching projects breakdown:", error);
    throw error;
  }
}

/**
 * Create a new job run for a project (admin only)
 */
export interface CreateJobRunResponse {
  message: string;
  jobRun: {
    id: number;
    projectId: number;
    jobType: string;
    status: string;
    isActive: boolean;
    createdAt: string;
  };
}

export async function createJobRun(
  projectId: number,
  jobType: string
): Promise<CreateJobRunResponse> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const response = await fetch(
      `${RIXLY_API_BASE_URL}/api/admin/projects/${projectId}/job-runs`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ jobType }),
      }
    );

    const responseData: CreateJobRunResponse = await response.json();

    if (!response.ok) {
      throw new Error(
        (responseData as unknown as { message?: string }).message ||
          "Failed to create job run"
      );
    }

    return responseData;
  } catch (error) {
    console.error("Error creating job run:", error);
    throw error;
  }
}

/**
 * Stop a running job (admin only)
 */
export async function stopJob(jobRunId: number): Promise<StopJobResponse> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const response = await fetch(
      `${RIXLY_API_BASE_URL}/api/admin/jobs/${jobRunId}/stop`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const responseData: StopJobResponse = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to stop job");
    }

    return responseData;
  } catch (error) {
    console.error("Error stopping job:", error);
    throw error;
  }
}
