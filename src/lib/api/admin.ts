import { handleApiResponse } from "./api-utils";

const RIXLY_API_BASE_URL = import.meta.env.VITE_RIXLY_API_BASE_URL;

import type { GetLeadsResponse } from './leads';

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

    await handleApiResponse(response);

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

    await handleApiResponse(response);

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

    await handleApiResponse(response);

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

    await handleApiResponse(response);

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

    await handleApiResponse(response);

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
