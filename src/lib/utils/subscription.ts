import { getSubscriptionStatus, SubscriptionStatus } from "@/lib/api/subscription";

const SUBSCRIPTION_CACHE_KEY = "subscription_status_cache";
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

interface SubscriptionCache {
  data: SubscriptionStatus;
  timestamp: number;
}

function getCachedSubscriptionStatus(): SubscriptionStatus | null {
  try {
    const cached = sessionStorage.getItem(SUBSCRIPTION_CACHE_KEY);
    if (!cached) return null;

    const cacheData: SubscriptionCache = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid (within 5 minutes)
    if (now - cacheData.timestamp < CACHE_DURATION_MS) {
      return cacheData.data;
    }

    // Cache expired, remove it
    sessionStorage.removeItem(SUBSCRIPTION_CACHE_KEY);
    return null;
  } catch (error) {
    console.error("Error reading subscription cache:", error);
    return null;
  }
}

function cacheSubscriptionStatus(status: SubscriptionStatus): void {
  try {
    const cacheData: SubscriptionCache = {
      data: status,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(SUBSCRIPTION_CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error("Error caching subscription status:", error);
  }
}

export function clearSubscriptionCache(): void {
  try {
    sessionStorage.removeItem(SUBSCRIPTION_CACHE_KEY);
  } catch (error) {
    console.error("Error clearing subscription cache:", error);
  }
}

export async function getSubscriptionStatusCached(forceRefresh: boolean = false): Promise<SubscriptionStatus> {
  // If force refresh requested, clear cache first
  if (forceRefresh) {
    clearSubscriptionCache();
  }

  // Try to get from cache first (unless force refresh)
  if (!forceRefresh) {
    const cached = getCachedSubscriptionStatus();
    if (cached) {
      return cached;
    }
  }

  // Cache miss, expired, or force refresh - fetch from API
  const status = await getSubscriptionStatus();

  // Cache the result
  cacheSubscriptionStatus(status);

  return status;
}

/**
 * Check if user has access to protected features
 * Returns true if user has active subscription or can bypass paywall
 * Uses cached subscription status to avoid repeated API calls
 */
export async function checkSubscriptionAccess(): Promise<boolean> {
  try {
    const status = await getSubscriptionStatusCached();
    // [PROD-KEEP] 'authenticated' is Razorpay's status for a trial that hasn't charged yet.
    // It must be recognized as active access, otherwise users are locked out during their trial.
    return status.hasActiveSubscription ||
      status.subscription?.status === "active" ||
      status.subscription?.status === "authenticated" ||
      status.canBypass;
  } catch (error) {
    console.error("Error checking subscription access:", error);
    // On error, deny access for safety
    return false;
  }
}
