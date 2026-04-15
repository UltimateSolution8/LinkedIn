const RIXLY_API_BASE_URL = import.meta.env.VITE_RIXLY_API_BASE_URL;

export interface Post {
  postId: string;
  leadId: string;
  title: string;
  description: string;
  timeCreated: string;
  subreddit: string;
  originalPosterId: string;
  rixlyRating: number;
  url: string;
  leadType: "SALES" | "ENGAGEMENT";
  mainPainpoint?: string;
  matchReason?: string;
  // Lead status fields
  status: "NEW" | "IN_PROGRESS" | "FOLLOW_UP_SCHEDULED" | "CONVERTED" | "NOT_INTERESTED" | "DUPLICATE" | "DONE";
  followUpAt?: string;
  notes?: string;
  statusReason?: string;
  assignedTo?: string;
  updatedAt?: string;
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalPosts: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetPostsResponse {
  message: string;
  data: Post[];
  pagination: PaginationInfo;
}

export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
}

export interface PostComment {
  commentId: string;
  message: string;
  tone: string;
  length: string;
  createdAt: string;
}

export interface PostCommentsData {
  leadId: string;
  messages: PostComment[];
  totalMessages: number;
  remainingAttempts: number;
}

export interface PostCommentsResponse {
  message: string;
  data: PostCommentsData;
}

export interface GenerateCommentResponse {
  message: string;
  data: {
    message: string;
    messageType: string;
    remainingAttempts: number;
  };
}

export interface UpdateLeadStatusRequest {
  status: "NEW" | "IN_PROGRESS" | "FOLLOW_UP_SCHEDULED" | "CONVERTED" | "NOT_INTERESTED" | "DUPLICATE" | "DONE";
  followUpAt?: string;
  notes?: string;
  statusReason?: string;
  assignedTo?: string;
}

export interface UpdateLeadStatusResponse {
  success: boolean;
  message: string;
  data: Post;
}

export async function getPosts(
  projectId: string,
  page: number = 1,
  limit: number = 10,
  sortBy?: "hotness" | "comments" | "date" | "status" | "subreddit" | "score",
  sortOrder?: "asc" | "desc"
): Promise<GetPostsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (sortBy) params.append('sort_by', sortBy);
  if (sortOrder) params.append('sort_order', sortOrder);

  const response = await fetch(
    `${RIXLY_API_BASE_URL}/api/projects/${projectId}/reddit-posts?${params.toString()}`,
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
    throw new Error(responseData.message || "Failed to fetch posts");
  }

  return responseData;
}

export async function getGeneratedComments(
  leadId: string
): Promise<PostCommentsResponse> {
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
    throw new Error(responseData.message || "Failed to fetch generated comments");
  }

  return responseData;
}

export async function generatePostComment(
  leadId: string,
  tone: "friendly" | "professional" | "casual" = "friendly",
  length: "short" | "medium" = "medium"
): Promise<GenerateCommentResponse> {
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
        messageType: "comment",
        tone,
        length,
      }),
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to generate comment");
  }

  return responseData;
}

export async function updateLeadStatus(
  leadId: string,
  statusUpdate: UpdateLeadStatusRequest
): Promise<UpdateLeadStatusResponse> {
  const response = await fetch(
    `${RIXLY_API_BASE_URL}/api/leads/${leadId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(statusUpdate),
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to update lead status");
  }

  return responseData;
}

export async function rateMatch(
  leadId: string,
  rating: number
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(
    `${RIXLY_API_BASE_URL}/api/leads/${leadId}/rating`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ rating }),
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to submit rating");
  }

  return responseData;
}
