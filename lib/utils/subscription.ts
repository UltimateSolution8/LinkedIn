import { getSubscriptionStatus } from "@/lib/api/subscription";

/**
 * Check if user has access to protected features
 * Returns true if user has active subscription or can bypass paywall
 */
export async function checkSubscriptionAccess(): Promise<boolean> {
  try {
    const status = await getSubscriptionStatus();
    return  status.subscription?.status === "active" || status.canBypass;
  } catch (error) {
    console.error("Error checking subscription access:", error);
    // On error, deny access for safety
    return false;
  }
}
