const RIXLY_API_BASE_URL = import.meta.env.VITE_RIXLY_API_BASE_URL;

export type FeedbackType = "general" | "feature_request" | "bug_report" | "ui_ux";

export interface FeedbackStatusResponse {
  success: boolean;
  data: {
    submitted: boolean;
    submittedAt: string | null;
  };
}

export interface SubmitFeedbackPayload {
  rating: number;
  feedbackType: FeedbackType;
  comments: string;
}

export async function getFeedbackStatus(): Promise<FeedbackStatusResponse["data"]> {
  const response = await fetch(`${RIXLY_API_BASE_URL}/api/user/feedback`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const responseData = await response.json().catch(() => ({} as FeedbackStatusResponse & { message?: string }));

  if (!response.ok) {
    throw new Error(responseData?.message || "Failed to fetch feedback status");
  }

  return responseData.data;
}

export async function submitFeedback(payload: SubmitFeedbackPayload): Promise<void> {
  const response = await fetch(`${RIXLY_API_BASE_URL}/api/user/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(responseData?.message || responseData?.error || "Failed to submit feedback");
  }
}
