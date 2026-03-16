import { useState, useEffect } from "react";
import { getScanningStatus, ScanningStatusData } from "@/lib/api/projects";
import { getSubscriptionStatusCached } from "@/lib/utils/subscription";
import { SubscriptionStatus } from "@/lib/api/subscription";
import { getCurrentUser } from "@/lib/api/auth";

interface UseScanningStatusOptions {
  projectId: string;
  pollingInterval?: number; // in milliseconds, default 5000 (5 seconds)
  enabled?: boolean; // whether to fetch data, default true
}

interface UseScanningStatusReturn {
  data: ScanningStatusData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  subscriptionStatus: SubscriptionStatus | null;
  hasSubscriptionAccess: boolean;
}

/**
 * Custom hook to fetch scanning status with auto-refresh polling
 * Polls every 5 seconds during active scanning
 * Checks subscription status before fetching scanning data
 */
export function useScanningStatus({
  projectId,
  pollingInterval = 5000, // 5 seconds
  enabled = true
}: UseScanningStatusOptions): UseScanningStatusReturn {
  const [data, setData] = useState<ScanningStatusData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [hasSubscriptionAccess, setHasSubscriptionAccess] = useState<boolean>(false);

  const fetchData = async () => {
    if (!enabled || !projectId) return;

    try {
      setError(null);

      // Only fetch scanning status if user has subscription access
      if (hasSubscriptionAccess) {
        const statusData = await getScanningStatus(projectId);
        setData(statusData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch scanning status";
      setError(errorMessage);
      console.error("[useScanningStatus] Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check subscription status on mount
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        // Admin bypass - no need to check subscription
        const currentUser = getCurrentUser();
        const isAdmin = currentUser?.role === 'admin';

        if (isAdmin) {
          setHasSubscriptionAccess(true);
          return;
        }

        const status = await getSubscriptionStatusCached();
        setSubscriptionStatus(status);

        // Check if user has access: active subscription, trial (authenticated), or can bypass
        const hasAccess = status.hasActiveSubscription ||
          status.subscription?.status === "active" ||
          status.subscription?.status === "authenticated" ||
          status.canBypass;

        setHasSubscriptionAccess(hasAccess);
      } catch (err) {
        console.error("[useScanningStatus] Error checking subscription:", err);
        setHasSubscriptionAccess(false);
      }
    };

    checkSubscription();
  }, []);

  // Initial fetch (only after subscription check)
  useEffect(() => {
    if (subscriptionStatus !== null) {
      fetchData();
    }
  }, [projectId, enabled, hasSubscriptionAccess, subscriptionStatus]);

  // Polling effect
  useEffect(() => {
    if (!enabled || !data) return;

    // Only poll during active scanning stages
    const shouldPoll = data.stage === 'validating_subreddits' || data.stage === 'scoring_leads';

    if (!shouldPoll) return;

    const intervalId = setInterval(() => {
      fetchData();
    }, pollingInterval);

    return () => clearInterval(intervalId);
  }, [projectId, data?.stage, pollingInterval, enabled]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    subscriptionStatus,
    hasSubscriptionAccess
  };
}
