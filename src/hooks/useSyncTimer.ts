import { useState, useEffect, useCallback } from 'react';
import { getNextScheduledRun, type NextScheduledRunResponse } from '@/lib/api/projects';

export type SyncState = 'pending' | 'running' | 'overdue' | 'no_projects' | 'no_schedules' | 'error';

export interface SyncTimerData {
  state: SyncState;
  countdown: string; // Simple message like "Next sync in 5 minutes"
  nextExecutionTime: Date | null;
  projectName: string | null;
  message: string;
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
}

export function useSyncTimer(): SyncTimerData {
  const [data, setData] = useState<SyncTimerData>({
    state: 'no_projects',
    countdown: 'Checking sync status...',
    nextExecutionTime: null,
    projectName: null,
    message: 'Loading...',
    lastUpdated: null,
    isLoading: true,
    error: null,
  });

  // Simple message calculation
  const getSimpleMessage = useCallback((targetTime: Date | null, state: SyncState): string => {
    if (!targetTime) return 'No sync scheduled';

    const now = Date.now();
    const diff = targetTime.getTime() - now;

    if (diff <= 0) return 'Sync overdue';

    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return 'New leads expected soon';
    if (minutes < 60) return `New leads expected in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    const hours = Math.floor(minutes / 60);
    return `New leads expected in ${hours} hour${hours > 1 ? 's' : ''}`;
  }, []);

  // Fetch sync status from API (simple)
  const fetchSyncStatus = useCallback(async (isInitialLoad = false) => {
    try {
      const response = await getNextScheduledRun();
      const nextExecutionTime = response.nextRunAt ? new Date(response.nextRunAt) : null;

      setData({
        state: response.status as SyncState,
        countdown: getSimpleMessage(nextExecutionTime, response.status as SyncState),
        nextExecutionTime,
        projectName: response.projectName,
        message: response.message,
        lastUpdated: new Date(),
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Failed to fetch sync status:', error);
      setData(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch sync status',
        isLoading: false,
      }));
    }
  }, [getSimpleMessage]);

  // Simple polling - update every 2 minutes
  useEffect(() => {
    fetchSyncStatus(true); // Initial load

    const interval = setInterval(() => {
      fetchSyncStatus();
    }, 120000); // Update every 2 minutes

    return () => clearInterval(interval);
  }, [fetchSyncStatus]);

  return data;
}