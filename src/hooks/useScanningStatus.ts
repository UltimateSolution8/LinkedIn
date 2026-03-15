import { useState, useEffect } from "react";
import { getScanningStatus, ScanningStatusData } from "@/lib/api/projects";

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
}

/**
 * Custom hook to fetch scanning status with auto-refresh polling
 * Polls every 5 seconds during active scanning
 */
export function useScanningStatus({
  projectId,
  pollingInterval = 5000, // 5 seconds
  enabled = true
}: UseScanningStatusOptions): UseScanningStatusReturn {
  const [data, setData] = useState<ScanningStatusData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!enabled || !projectId) return;

    try {
      setError(null);
      const statusData = await getScanningStatus(projectId);
      setData(statusData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch scanning status";
      setError(errorMessage);
      console.error("[useScanningStatus] Error fetching data:", err);
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
    refetch: fetchData
  };
}
