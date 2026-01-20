import React, { memo } from 'react';
import { useSyncTimer } from '@/hooks/useSyncTimer';
import { Clock, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SyncStatusTimerProps {
  className?: string;
}

/**
 * SyncStatusTimer - Shows when new leads are expected
 *
 * Features:
 * - Displays time remaining until next scheduled lead generation
 * - Updates every 2 minutes (not real-time for performance)
 * - Shows different states: pending, running, overdue
 * - Responsive design - visible on all screen sizes
 * - Accessible with ARIA labels
 */
const SyncStatusTimer = memo(function SyncStatusTimer({ className }: SyncStatusTimerProps) {
  const { countdown, isLoading, error } = useSyncTimer();

  // Error state
  if (error) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
          className
        )}
      >
        <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Sync status unavailable
        </span>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
          className
        )}
      >
        <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Checking sync status...
        </span>
      </div>
    );
  }

  // Simple display with the countdown message
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800",
        className
      )}
      role="status"
      aria-label="Sync status timer"
    >
      <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400" />
      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
        {countdown.replace('Next sync in', 'New leads expected in')}
      </span>
    </div>
  );
});

SyncStatusTimer.displayName = 'SyncStatusTimer';

export default SyncStatusTimer;