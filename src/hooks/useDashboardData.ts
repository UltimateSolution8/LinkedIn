import { useState, useEffect } from "react";
import { getDashboardData, DashboardData } from "@/lib/api/projects";

interface UseDashboardDataOptions {
  projectId: string;
  pollingInterval?: number; // in milliseconds, default 30000 (30 seconds)
  enabled?: boolean; // whether to fetch data, default true
}

interface UseDashboardDataReturn {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch dashboard data with auto-refresh polling
 * Automatically polls every 30 seconds during scanning states
 */
export function useDashboardData({
  projectId,
  pollingInterval = 30000, // 30 seconds
  enabled = true
}: UseDashboardDataOptions): UseDashboardDataReturn {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!enabled || !projectId) return;

    try {
      setError(null);
      const dashboardData = await getDashboardData(projectId);
      setData(dashboardData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch dashboard data";
      setError(errorMessage);
      console.error("[useDashboardData] Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [projectId, enabled]);

  // Polling effect
  useEffect(() => {
    if (!enabled || !data) return;

    // Only poll during scanning states
    const shouldPoll = data.scanState === "scanning_empty" || data.scanState === "scanning_partial";

    if (!shouldPoll) return;

    const intervalId = setInterval(() => {
      fetchData();
    }, pollingInterval);

    return () => clearInterval(intervalId);
  }, [projectId, data?.scanState, pollingInterval, enabled]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  };
}
