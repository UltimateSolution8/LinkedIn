import { useState, useEffect, useCallback } from 'react';
import { getNextScheduledRun, type NextScheduledRunResponse } from '@/lib/api/projects';

export type SyncState = 'pending' | 'running' | 'overdue' | 'no_projects' | 'no_schedules' | 'error';

export interface SyncTimerData {
  state: SyncState;
  countdown: string; // Simple message like "Next sync in 5 minutes"
  nextExecutionTime: Date | null;
  lastSyncTime: Date | null;
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
    lastSyncTime: null,
    projectName: null,
    message: 'Loading...',
    lastUpdated: null,
    isLoading: true,
    error: null,
  });

  // Simple message calculation
  const getSimpleMessage = useCallback((targetTime: Date | null, lastSyncTime: Date | null, state: SyncState): string => {
    const now = Date.now();

    // If no next run scheduled, show last sync time if available
    if (!targetTime) {
      if (lastSyncTime) {
        const lastSyncDiff = now - lastSyncTime.getTime();
        const lastSyncHours = Math.floor(lastSyncDiff / (1000 * 60 * 60));
        const lastSyncMinutes = Math.floor(lastSyncDiff / (1000 * 60));

        if (lastSyncHours >= 1) {
          return `Last synced ${lastSyncHours} hour${lastSyncHours > 1 ? 's' : ''} ago`;
        } else if (lastSyncMinutes > 0) {
          return `Last synced ${lastSyncMinutes} minute${lastSyncMinutes > 1 ? 's' : ''} ago`;
        } else {
          return 'Last synced recently';
        }
      }
      return 'No sync scheduled';
    }

    const diff = targetTime.getTime() - now;

    // If overdue, show overdue with last sync info
    if (diff <= 0) {
      if (lastSyncTime) {
        const lastSyncDiff = now - lastSyncTime.getTime();
        const lastSyncHours = Math.floor(lastSyncDiff / (1000 * 60 * 60));
        const lastSyncMinutes = Math.floor(lastSyncDiff / (1000 * 60));

        if (lastSyncHours >= 1) {
          return `Sync overdue - last synced ${lastSyncHours} hour${lastSyncHours > 1 ? 's' : ''} ago`;
        } else if (lastSyncMinutes > 0) {
          return `Sync overdue - last synced ${lastSyncMinutes} minute${lastSyncMinutes > 1 ? 's' : ''} ago`;
        } else {
          return 'Sync overdue - last synced recently';
        }
      }
      return 'Sync overdue';
    }

    const minutes = Math.floor(diff / (1000 * 60));

    // If next run is within 1 hour, show countdown
    if (minutes < 60) {
      return `New leads expected in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    }

    // If next run is more than 1 hour away, show last sync time if available
    const hours = Math.floor(minutes / 60);
    if (lastSyncTime) {
      const lastSyncDiff = now - lastSyncTime.getTime();
      const lastSyncHours = Math.floor(lastSyncDiff / (1000 * 60 * 60));

      if (lastSyncHours >= 1) {
        return `Last synced ${lastSyncHours} hour${lastSyncHours > 1 ? 's' : ''} ago`;
      }
    }

    // Default to showing next run time
    return `New leads expected in ${hours} hour${hours > 1 ? 's' : ''}`;
  }, []);

  // Fetch sync status from API (simple)
  const fetchSyncStatus = useCallback(async (isInitialLoad = false) => {
    try {
      const response = await getNextScheduledRun();
      const nextExecutionTime = response.nextRunAt ? new Date(response.nextRunAt) : null;
      const lastSyncTime = response.lastSyncTime ? new Date(response.lastSyncTime) : null;

      setData({
        state: response.status as SyncState,
        countdown: getSimpleMessage(nextExecutionTime, lastSyncTime, response.status as SyncState),
        nextExecutionTime,
        lastSyncTime,
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