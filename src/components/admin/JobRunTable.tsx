import { JobRun } from "@/lib/api/admin";
import JobStatusBadge from "./JobStatusBadge";
import { Badge } from "@/components/ui/badge";

interface JobRunTableProps {
  jobs: JobRun[];
  compact?: boolean;
}

export default function JobRunTable({ jobs, compact = false }: JobRunTableProps) {
  const formatDuration = (milliseconds: number | null) => {
    if (!milliseconds) return '-';
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getJobTypeLabel = (jobType: string) => {
    switch (jobType) {
      case 'reddit_scraping':
        return 'Reddit Scraping';
      case 'processing':
        return 'Processing';
      case 'notification':
        return 'Notification';
      case 'quickrun':
        return 'Quick Run';
      default:
        // Capitalize first letter and replace underscores with spaces
        return jobType.split('_').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
        No jobs found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-800">
            {!compact && (
              <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Job ID
              </th>
            )}
            <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Type
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Project
            </th>
            {!compact && (
              <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                User
              </th>
            )}
            <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Status
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Started
            </th>
            {!compact && (
              <>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Duration
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Leads
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Next Run
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr
              key={job.jobRunId}
              className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900"
            >
              {!compact && (
                <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-400">
                  #{job.jobRunId}
                </td>
              )}
              <td className="py-3 px-4">
                <Badge variant="outline" className="text-xs">
                  {getJobTypeLabel(job.jobType)}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <div className="font-medium text-neutral-950 dark:text-white text-sm">
                  {job.projectName}
                </div>
              </td>
              {!compact && (
                <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-400">
                  {job.userName}
                </td>
              )}
              <td className="py-3 px-4">
                <JobStatusBadge status={job.status} />
              </td>
              <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-400">
                {formatTime(job.startedAt)}
              </td>
              {!compact && (
                <>
                  <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-400">
                    {formatDuration(job.duration)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {job.leadsFound !== null ? (
                      <span className="font-semibold text-neutral-950 dark:text-white">
                        {job.leadsFound}
                      </span>
                    ) : (
                      <span className="text-neutral-400 dark:text-neutral-600">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-400">
                    {job.nextScheduledAt ? (
                      formatTime(job.nextScheduledAt)
                    ) : (
                      <span className="text-neutral-400 dark:text-neutral-600">Not scheduled</span>
                    )}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {jobs.some(job => job.errorMessage) && (
        <div className="mt-4 space-y-2">
          {jobs.filter(job => job.errorMessage).map(job => (
            <div
              key={job.jobRunId}
              className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
            >
              <div className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">
                Job #{job.jobRunId} Error:
              </div>
              <div className="text-xs text-red-600 dark:text-red-400">
                {job.errorMessage}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
