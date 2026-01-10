const RIXLY_API_BASE_URL = import.meta.env.VITE_RIXLY_API_BASE_URL;

export interface Lead {
  source: "comment" | "post";
  leadId: number;
  isViewed: boolean;
  // Comment-specific fields
  commentUrl?: string;
  commentText?: string;
  commentId?: number;
  redditCommentId?: string;
  author?: string;
  confidenceScore?: number;
  createdUtc?: string;
  leadType?: string;
  // Post-specific fields
  originalPosterId?: string;
  postCreatedAt: string;
  postUrl: string;
  redditId?: string;
  // Common fields
  relevanceRating: number;
  userVote: string | null;
  postId: number;
  subreddit: string;
  title: string;
}

export interface LeadsPaginationInfo {
  currentPage: number;
  pageSize: number;
  totalLeads: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetLeadsResponse {
  message: string;
  data: Lead[];
  pagination: LeadsPaginationInfo;
}

export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
}

export interface GenerateResponseData {
  message: string;
}

export interface GenerateResponseResponse {
  message: string;
  data: GenerateResponseData;
}

export interface InviteMessage {
  messageId: string;
  message: string;
  tone: string;
  createdAt: string;  
}

export interface InviteMessagesData {
  leadId: string;
  messages: InviteMessage[];
  totalMessages: number;
  remainingAttempts: number;
}

export interface InviteMessagesResponse {
  message: string;
  data: InviteMessagesData;
}

export async function getLeads(
  projectId: string,
  page: number = 1,
  limit: number = 10
): Promise<GetLeadsResponse> {
  const response = await fetch(
    `${RIXLY_API_BASE_URL}/api/projects/${projectId}/reddit-leads?source=all&page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to fetch leads");
  }

  return responseData;
}

export async function getInviteMessages(
  leadId: string
): Promise<InviteMessagesResponse> {
  const response = await fetch(
    `${RIXLY_API_BASE_URL}/api/ai/invite-messages/${leadId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to fetch invite messages");
  }

  return responseData;
}

export async function generateLeadResponse(
  leadId: string,
  tone: "friendly" | "professional" | "casual" = "friendly",
  length: "short" | "medium" = "medium"
): Promise<GenerateResponseResponse> {
  const response = await fetch(
    `${RIXLY_API_BASE_URL}/api/ai/generate-invite-message`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        leadId,
        tone,
        length,
      }),
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to generate response");
  }

  return responseData;
}
