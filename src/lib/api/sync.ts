const RIXLY_API_BASE_URL = import.meta.env.VITE_RIXLY_API_BASE_URL;

export interface SyncJobStatus {
  nextExecutionTime: string | null; // ISO timestamp of next scheduled sync
  status: 'idle' | 'running' | 'scheduled'; // idle = no jobs scheduled/running, running = active sync, scheduled = next sync pending
  activeJobCount: number; // Number of currently running jobs
  scheduledJobCount: number; // Number of jobs scheduled for future execution
  lastUpdated: string; // ISO timestamp of last status check
}

export interface SyncStatusResponse {
  success: boolean;
  data: SyncJobStatus;
  message?: string;
}

export interface NextScheduledRunResponse {
  nextRunAt: string | null;
  lastSyncTime: string | null;
  status: 'pending' | 'running' | 'overdue' | 'no_projects' | 'no_schedules';
  projectName: string | null;
  message: string;
}

/**
 * Fetch the current sync system status and next execution time
 *
 * This endpoint aggregates status from multiple tables:
 * - ScrapingSchedule: For next scheduled sync times (nextRunAt where isEnabled=true)
 * - RixlyJobRun: For currently running jobs (status='running')
 * - ScrapingJob: For individual job statuses
 */
export async function getSyncJobStatus(): Promise<SyncJobStatus> {
  if (!RIXLY_API_BASE_URL) {
    throw new Error(
      "API base URL is not configured. Please set VITE_RIXLY_API_BASE_URL in your .env file."
    );
  }

  try {
    const response = await fetch(`${RIXLY_API_BASE_URL}/api/sync/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const responseData: SyncStatusResponse = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to fetch sync status");
    }

    return responseData.data;
  } catch (error) {
    console.error("Error fetching sync job status:", error);
    throw error;
  }
}

export async function getNextScheduledRun(): Promise<NextScheduledRunResponse> {
  const response = await fetch(`${RIXLY_API_BASE_URL}/api/projects/next-scheduled-run`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to fetch next scheduled run");
  }

  return responseData;
}