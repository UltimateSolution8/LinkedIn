import { useState, useEffect } from 'react';

const RIXLY_API_BASE_URL = import.meta.env.VITE_RIXLY_API_BASE_URL;

interface SubredditStat {
  subreddit: string;
  totalLeads: number;
  salesLeads: number;
  engagementLeads: number;
  postsFetched: number;
  subscribers: number;
}

interface KeywordStat {
  keyword: string;
  totalLeads: number;
  salesLeads: number;
  engagementLeads: number;
}

interface ProjectStats {
  topSubreddits: SubredditStat[];
  topKeywords: KeywordStat[];
}

interface UseProjectStatsReturn {
  stats: ProjectStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch project statistics (top subreddits and keywords)
 * Only fetches when enabled=true (e.g., when QuickRun is completed)
 *
 * @param projectId - Project ID
 * @param enabled - Whether to fetch stats (default: true)
 * @returns Project stats, loading state, error, and refetch function
 */
export function useProjectStats(
  projectId: string | undefined,
  enabled: boolean = true
): UseProjectStatsReturn {
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!projectId || !enabled) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${RIXLY_API_BASE_URL}/api/projects/${projectId}/stats`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch stats' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('[useProjectStats] Error fetching stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [projectId, enabled]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
}
