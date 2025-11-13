const RIXLY_API_BASE_URL = process.env.NEXT_PUBLIC_RIXLY_API_BASE_URL;

export interface Lead {
  redditId: string;
  relevanceRating: number;
  reason: string;
  sourceCommentId: string | null;
  userVote: string | null;
  postId: string;
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

export async function getLeads(
  projectId: string,
  page: number = 1,
  limit: number = 10
): Promise<GetLeadsResponse> {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found. Please login.");
  }

  const response = await fetch(
    `${RIXLY_API_BASE_URL}/api/projects/${projectId}/reddit-leads?page=${page}&limit=${limit}`,
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
    throw new Error(responseData.message || "Failed to fetch leads");
  }

  return responseData;
}
