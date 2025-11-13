const RIXLY_API_BASE_URL = process.env.NEXT_PUBLIC_RIXLY_API_BASE_URL;

export interface Post {
  title: string;
  description: string;
  timeCreated: string;
  subreddit: string;
  originalPosterId: string;
  rixlyRating: number;
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
