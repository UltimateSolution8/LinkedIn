const RIXLY_API_BASE_URL = import.meta.env.VITE_RIXLY_API_BASE_URL;

export interface LeadCapturePayload {
  name: string;
  email: string;
  mobile?: string;
  companyName?: string;
  websiteUrl?: string;
  source:
    | "playbook_download"
    | "free_subreddits"
    | "linkedin_early_access"
    | "exit_intent_playbook"
    | "blog_newsletter";
  extraDetails?: string;
}

const FORM_TYPE_BY_SOURCE: Record<LeadCapturePayload["source"], string> = {
  playbook_download: "playbook_download",
  free_subreddits: "free_subreddits",
  linkedin_early_access: "linkedin_early_access",
  exit_intent_playbook: "exit_intent_playbook",
  blog_newsletter: "blog_newsletter",
};

function buildAdditionalInsight(payload: LeadCapturePayload): string {
  const parts = [`Source: ${payload.source}`];

  if (payload.companyName?.trim()) {
    parts.push(`Company: ${payload.companyName.trim()}`);
  }

  if (payload.websiteUrl?.trim()) {
    parts.push(`Website: ${payload.websiteUrl.trim()}`);
  }

  if (payload.extraDetails) {
    parts.push(payload.extraDetails);
  }

  return parts.join(" | ");
}

export async function submitLeadCapture(payload: LeadCapturePayload): Promise<void> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  const requestBody = {
    fullName: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.mobile?.trim() || "",
    industry: payload.source,
    additionalInsight: buildAdditionalInsight(payload),
    formType: FORM_TYPE_BY_SOURCE[payload.source],
  };

  const response = await fetch(`${RIXLY_API_BASE_URL}/api/demo/request-sheet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(requestBody),
  });

  if (response.ok) {
    return;
  }

  const responseData = await response.json().catch(() => ({}));
  const primaryErrorMessage = responseData?.message || "Failed to submit form";
  console.error("[LeadCapture] Sheet submission failed, attempting email fallback:", primaryErrorMessage);

  const fallbackResponse = await fetch(`${RIXLY_API_BASE_URL}/api/demo/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(requestBody),
  });

  if (fallbackResponse.ok) {
    return;
  }

  const fallbackData = await fallbackResponse.json().catch(() => ({}));
  throw new Error(fallbackData?.message || primaryErrorMessage || "Failed to submit form");
}
