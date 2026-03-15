import { SubscriptionStatus } from "@/lib/api/subscription";

/**
 * Get a human-readable label for the user's subscription status
 * @param subscriptionStatus - The subscription status object
 * @returns A user-friendly label (e.g., "Trial User", "Pro User", "Free User")
 */
export function getUserStatusLabel(subscriptionStatus: SubscriptionStatus | null): string {
  if (!subscriptionStatus) {
    return "Free User";
  }

  // Check if user can bypass (whitelisted/admin)
  if (subscriptionStatus.canBypass) {
    return "Premium User";
  }

  // Check if user is in trial (status === 'authenticated' means trial)
  if (subscriptionStatus.subscription?.status === "authenticated" || subscriptionStatus.isTrial) {
    return "Trial User";
  }

  // Check if user has active subscription
  if (subscriptionStatus.subscription?.status === "active" || subscriptionStatus.hasActiveSubscription) {
    return "Pro User";
  }

  // Default to free user
  return "Free User";
}

/**
 * Get a detailed status description with plan information
 * @param subscriptionStatus - The subscription status object
 * @returns A detailed description (e.g., "Pro Plan (Active)", "Trial - 2 days left")
 */
export function getDetailedStatusLabel(subscriptionStatus: SubscriptionStatus | null): string {
  if (!subscriptionStatus) {
    return "No active subscription";
  }

  // Check if user can bypass
  if (subscriptionStatus.canBypass) {
    return "Premium Access (Whitelisted)";
  }

  const subscription = subscriptionStatus.subscription;

  if (!subscription) {
    return "No active subscription";
  }

  const planName = subscription.planDetails?.name || "Unknown Plan";
  const status = subscription.status;

  // Trial status
  if (status === "authenticated" || subscriptionStatus.isTrial) {
    if (subscriptionStatus.trialEndsAt) {
      const daysLeft = Math.ceil(
        (new Date(subscriptionStatus.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return `${planName} (Trial - ${daysLeft} ${daysLeft === 1 ? "day" : "days"} left)`;
    }
    return `${planName} (Trial)`;
  }

  // Active subscription
  if (status === "active") {
    return `${planName} (Active)`;
  }

  // Pending verification
  if (status === "created") {
    return `${planName} (Pending Verification)`;
  }

  // Cancelled
  if (subscription.cancelAtPeriodEnd) {
    return `${planName} (Cancelled - Active until ${new Date(subscription.currentPeriodEnd).toLocaleDateString()})`;
  }

  return `${planName} (${status})`;
}

/**
 * Get a badge variant color based on subscription status
 * @param subscriptionStatus - The subscription status object
 * @returns A color variant for badge styling
 */
export function getStatusBadgeVariant(subscriptionStatus: SubscriptionStatus | null): "default" | "success" | "warning" | "error" {
  if (!subscriptionStatus) {
    return "default";
  }

  if (subscriptionStatus.canBypass) {
    return "success";
  }

  const status = subscriptionStatus.subscription?.status;

  if (status === "active" || status === "authenticated") {
    return "success";
  }

  if (status === "created") {
    return "warning";
  }

  return "default";
}
