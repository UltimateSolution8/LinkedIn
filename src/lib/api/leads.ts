const RIXLY_API_BASE_URL = import.meta.env.VITE_RIXLY_API_BASE_URL;

export type LeadSource = "comment" | "post";
export type LeadListType = "hot" | "opportunity";
export type LeadSort = "score" | "date" | "subreddit";
export type ReplyTone = "friendly" | "professional" | "casual";

export interface Lead {
  id: number;
  leadId: number;
  source: LeadSource;
  type?: string;
  score?: number;
  confidenceScore?: number;
  isStarred?: boolean;
  isFollowUp?: boolean;
  followUpAt?: string;
  status?: string;
  userRating?: number;
  painTags?: string[];
  body?: string;

  isViewed: boolean;
  createdAt?: string;

  // Comment-specific fields
  commentUrl?: string;
  commentText?: string;
  commentId?: number;
  redditCommentId?: string;
  author?: string;
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

  // AI-generated fields
  mainPainpoint?: string;
  matchReason?: string;
}

export interface LeadsPaginationInfo {
  currentPage: number;
  pageSize: number;
  totalLeads: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface LeadCounts {
  hot: number;
  opportunity: number;
  total: number;
}

export interface GetLeadsResponse {
  message: string;
  data: Lead[];
  pagination: LeadsPaginationInfo;
  availablePainTags?: string[];
  scanState?: string;
  counts?: LeadCounts;
  meta?: {
    availablePainTags?: string[];
    scanState?: string;
    leadsFound?: number;
    counts?: LeadCounts;
  };
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

export interface GetLeadsOptions {
  page?: number;
  limit?: number;
  type?: LeadListType;
  painTags?: string[];
  starred?: boolean;
  followUp?: boolean;
  sort?: LeadSort;
  source?: "post" | "comment" | "all";
  createdAfter?: string;
  createdBefore?: string;
}

export interface LeadDetailsResponse {
  success: boolean;
  data: {
    lead: {
      id: number;
      title: string;
      subreddit: string;
      author: string;
      score: number;
      type: string;
      status: string;
      isStarred: boolean;
      followUpAt: string | null;
      createdAt: string;
      postUrl: string | null;
      sourceType: string;
      originalPost: {
        body: string;
        postedAt: string | null;
        redditPostId: string | null;
      };
      comment: {
        body: string;
        permalink: string | null;
      } | null;
    };
    topComments: Array<{
      commentId: number;
      author: string;
      body: string;
      score: number;
      permalink: string | null;
      createdAt: string;
    }>;
    analysisDetails: {
      painPoint: string;
      whyPicked: string;
      howToHelp: string[];
      confidenceScore: number;
      intentStrength?: string | null;
      buyerSignal?: string | null;
      urgency?: string | null;
      solutionFit?: string | null;
      icpMatch?: string | null;
    };
    replyStyle: {
      id: number;
      tone: string;
      replyText: string | null;
      createdAt: string;
    } | null;
  };
}

export interface SaveReplyStyleRequest {
  tone?: ReplyTone;
  replyText?: string;
}

export interface ScanStatusResponse {
  scanState: "scanning_empty" | "scanning_partial" | "complete";
  scanProgress: number;
  etaMinutes: number | null;
  newLeadsSince: number;
  leadsFound: number;
  lastUpdated: string;
}

function buildLegacyOptions(
  pageOrOptions: number | GetLeadsOptions,
  limit: number,
  sortBy?: "date" | "relevance",
  sortOrder?: "asc" | "desc"
): GetLeadsOptions {
  if (typeof pageOrOptions === "object") {
    return {
      page: pageOrOptions.page ?? 1,
      limit: pageOrOptions.limit ?? 20,
      type: pageOrOptions.type,
      painTags: pageOrOptions.painTags ?? [],
      starred: pageOrOptions.starred,
      followUp: pageOrOptions.followUp,
      sort: pageOrOptions.sort,
      source: pageOrOptions.source ?? "all",
      createdAfter: pageOrOptions.createdAfter,
      createdBefore: pageOrOptions.createdBefore,
    };
  }

  const options: GetLeadsOptions = {
    page: pageOrOptions,
    limit,
    source: "all",
  };

  if (sortBy === "relevance") {
    options.sort = "score";
  } else if (sortBy === "date") {
    options.sort = "date";
  }

  if (sortOrder === "asc" && options.sort === "date") {
    options.sort = "date";
  }

  return options;
}

async function parseApiResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || fallbackMessage);
  }
  return responseData as T;
}

export async function getLeads(
  projectId: string,
  pageOrOptions: number | GetLeadsOptions = 1,
  limit: number = 10,
  sortBy?: "date" | "relevance",
  sortOrder?: "asc" | "desc"
): Promise<GetLeadsResponse> {
  const options = buildLegacyOptions(pageOrOptions, limit, sortBy, sortOrder);

  const params = new URLSearchParams({
    source: options.source ?? "all",
    page: String(options.page ?? 1),
    limit: String(options.limit ?? 20),
  });

  if (options.type) params.set("type", options.type);
  if (options.sort) params.set("sort", options.sort);
  if (options.painTags && options.painTags.length > 0) {
    params.set("painTags", options.painTags.join(","));
  }
  if (typeof options.starred === "boolean") {
    params.set("starred", String(options.starred));
  }
  if (typeof options.followUp === "boolean") {
    params.set("followUp", String(options.followUp));
  }
  if (options.createdAfter) {
    params.set("createdAfter", options.createdAfter);
  }
  if (options.createdBefore) {
    params.set("createdBefore", options.createdBefore);
  }

  const response = await fetch(
    `${RIXLY_API_BASE_URL}/api/projects/${projectId}/reddit-leads?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  return parseApiResponse<GetLeadsResponse>(response, "Failed to fetch leads");
}

export async function getLeadCounts(projectId: string): Promise<LeadCounts> {
  const response = await getLeads(projectId, {
    page: 1,
    limit: 1,
    type: "hot",
    source: "all",
  });

  return response.counts ?? response.meta?.counts ?? { hot: 0, opportunity: 0, total: 0 };
}

export async function getLeadDetails(leadId: string): Promise<LeadDetailsResponse> {
  const response = await fetch(`${RIXLY_API_BASE_URL}/api/leads/${leadId}/details`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return parseApiResponse<LeadDetailsResponse>(response, "Failed to fetch lead details");
}

export async function patchLeadStar(leadId: string, isStarred: boolean): Promise<{ success: boolean }> {
  const response = await fetch(`${RIXLY_API_BASE_URL}/api/leads/${leadId}/star`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ isStarred }),
  });

  return parseApiResponse<{ success: boolean }>(response, "Failed to update star status");
}

export async function patchLeadFollowUp(leadId: string, followUpAt: string | null): Promise<{ success: boolean }> {
  const response = await fetch(`${RIXLY_API_BASE_URL}/api/leads/${leadId}/follow-up`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ followUpAt }),
  });

  return parseApiResponse<{ success: boolean }>(response, "Failed to update follow-up");
}

export async function patchLeadStatus(
  leadId: string,
  payload: {
    status: string;
    followUpAt?: string;
    notes?: string;
    statusReason?: string;
  }
): Promise<{ success: boolean }> {
  const response = await fetch(`${RIXLY_API_BASE_URL}/api/leads/${leadId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return parseApiResponse<{ success: boolean }>(response, "Failed to update lead status");
}

export async function saveReplyStyle(leadId: string, payload: SaveReplyStyleRequest): Promise<{ success: boolean }> {
  const response = await fetch(`${RIXLY_API_BASE_URL}/api/leads/${leadId}/reply-style`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return parseApiResponse<{ success: boolean }>(response, "Failed to save reply style");
}

export async function getScanStatus(projectId: string, since?: string): Promise<ScanStatusResponse> {
  const params = new URLSearchParams();
  if (since) params.set("since", since);

  const response = await fetch(
    `${RIXLY_API_BASE_URL}/api/projects/${projectId}/scan-status${params.size ? `?${params.toString()}` : ""}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  return parseApiResponse<ScanStatusResponse>(response, "Failed to fetch scan status");
}

export async function startScan(projectId: string): Promise<{ message: string }> {
  const response = await fetch(`${RIXLY_API_BASE_URL}/api/projects/${projectId}/scan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return parseApiResponse<{ message: string }>(response, "Failed to start scan");
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

  return parseApiResponse<InviteMessagesResponse>(response, "Failed to fetch invite messages");
}

export async function generateLeadResponse(
  leadId: string,
  tone: ReplyTone = "friendly",
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

  return parseApiResponse<GenerateResponseResponse>(response, "Failed to generate response");
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

  return parseApiResponse<{ success: boolean; message: string }>(response, "Failed to submit rating");
}
