const RIXLY_API_BASE_URL = import.meta.env.VITE_RIXLY_API_BASE_URL;

export interface SubscriptionStatus {
  hasAccess: boolean;
  canBypass: boolean;
  subscription: {
    id: string;
    planId: string;
    status: string;
    startsAt: string;
    expiresAt: string | null;
    amount: number;
    currency: string;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: string;
    planDetails: {
      name: string;
      amount: number;
      currency: string;
      interval: string;
    };
  } | null;
}

export interface SubscriptionDetails {
  canBypass: boolean;
  activeSubscription: {
    id: number;
    planId: string;
    planName: string;
    status: string;
    startsAt: string;
    expiresAt: string | null;
    amount: number;
    currency: string;
    cancelledAt: string | null;
  } | null;
  latestSubscription: {
    id: number;
    planId: string;
    planName: string;
    status: string;
    startsAt: string;
    expiresAt: string | null;
    amount: number;
    currency: string;
    cancelledAt: string | null;
  } | null;
}

/**
 * Get current user's subscription status
 */
export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found. Please login.");
  }

  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set NEXT_PUBLIC_RIXLY_API_BASE_URL in your .env.local file."
    );
  }

  try {
    const response = await fetch(`${RIXLY_API_BASE_URL}/api/subscriptions/current`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to get subscription status");
    }

    return responseData;
  } catch (error) {
    console.error("Error getting subscription status:", error);
    throw error;
  }
}

/**
 * Get detailed subscription information for profile page
 */
export async function getSubscriptionDetails(): Promise<SubscriptionDetails> {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found. Please login.");
  }

  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set NEXT_PUBLIC_RIXLY_API_BASE_URL in your .env.local file."
    );
  }

  try {
    const response = await fetch(`${RIXLY_API_BASE_URL}/api/subscription/details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to get subscription details");
    }

    return responseData;
  } catch (error) {
    console.error("Error getting subscription details:", error);
    throw error;
  }
}

/**
 * Cancel user's active subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<{ message: string }> {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found. Please login.");
  }

  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set NEXT_PUBLIC_RIXLY_API_BASE_URL in your .env.local file."
    );
  }

  try {
    const response = await fetch(`${RIXLY_API_BASE_URL}/api/subscriptions/${subscriptionId}/cancel`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to cancel subscription");
    }

    return responseData;
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    throw error;
  }
}
