const RIXLY_API_BASE_URL = import.meta.env.VITE_RIXLY_API_BASE_URL;

export interface Notification {
  id: number;
  userId: number;
  projectId: number;
  type: string;
  title: string;
  message: string;
  metadata?: {
    projectId?: number;
    leadsFound?: number;
    salesLeads?: number;
    projectName?: string;
    engagementLeads?: number;
    [key: string]: any;
  };
  isRead: boolean;
  createdAt: string;
  project?: {
    id: number;
    projectName: string;
  };
}

export interface UnreadNotificationsResponse {
  message: string;
  data: UnreadNotificationInfo;
}

export interface UnreadNotificationInfo {
  unreadCount: number;
  recentNotifications: Notification[];
}

export interface AllNotificationsResponse {
  success: boolean;
  data: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
}

export async function getUnreadNotifications(): Promise<UnreadNotificationInfo> {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found. Please login.");
  }

  const response = await fetch(`${RIXLY_API_BASE_URL}/api/notifications/unread-count`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const responseData = await response.json();

  if (!response.ok && responseData && responseData.data) {
    throw new Error(responseData.message || "Failed to fetch notifications");
  }

  return responseData.data;
}

export async function getAllNotifications(): Promise<Notification[]> {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found. Please login.");
  }

  const response = await fetch(`${RIXLY_API_BASE_URL}/api/notifications`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const responseData: AllNotificationsResponse = await response.json();

  if (!response.ok || !responseData.success) {
    throw new Error("Failed to fetch all notifications");
  }

  return responseData.data;
}

export async function markAllAsRead(): Promise<void> {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found. Please login.");
  }

  const response = await fetch(`${RIXLY_API_BASE_URL}/api/notifications/mark-all-read`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to mark notifications as read");
  }
}
