const RIXLY_API_BASE_URL = import.meta.env.VITE_RIXLY_API_BASE_URL;

export interface LeadCapturePayload {
  name: string;
  email: string;
  mobile: string;
  companyName: string;
  source:
    | "playbook_download"
    | "free_subreddits"
    | "linkedin_early_access"
    | "exit_intent_playbook"
    | "blog_newsletter";
  extraDetails?: string;
}

function buildAdditionalInsight(payload: LeadCapturePayload): string {
  const parts = [
    `Source: ${payload.source}`,
    `Company: ${payload.companyName}`,
  ];

  if (payload.extraDetails) {
    parts.push(payload.extraDetails);
  }

  return parts.join(" | ");
}

export async function submitLeadCapture(payload: LeadCapturePayload): Promise<void> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  const response = await fetch(`${RIXLY_API_BASE_URL}/api/demo/request-sheet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      fullName: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.mobile.trim(),
      industry: payload.source,
      additionalInsight: buildAdditionalInsight(payload),
    }),
  });

  const responseData = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(responseData?.message || "Failed to submit form");
  }
}

