const RIXLY_API_BASE_URL = process.env.NEXT_PUBLIC_RIXLY_API_BASE_URL;

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
  inviteMessage: string;
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

export async function getPosts(
  projectId: string,
  page: number = 1,
  limit: number = 10
): Promise<GetPostsResponse> {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found. Please login.");
  }

  const response = await fetch(
    `${RIXLY_API_BASE_URL}/api/projects/${projectId}/reddit-posts?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
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
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found. Please login.");
  }

  const response = await fetch(
    `${RIXLY_API_BASE_URL}/api/ai/invite-messages/${leadId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
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
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found. Please login.");
  }

  const response = await fetch(
    `${RIXLY_API_BASE_URL}/api/ai/generate-invite-message`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
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
