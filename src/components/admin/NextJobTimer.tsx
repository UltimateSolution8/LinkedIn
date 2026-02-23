import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface NextJobTimerProps {
  nextRunAt: string | null;
  projectName?: string;
  projectId?: number;
  jobRunId?: number;
  jobType?: string;
  className?: string;
}

export default function NextJobTimer({ nextRunAt, projectName, projectId, jobRunId, jobType, className }: NextJobTimerProps) {
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    if (!nextRunAt) {
      setCountdown("No jobs scheduled");
      return;
    }

    const calculateCountdown = () => {
      const now = new Date().getTime();
      const target = new Date(nextRunAt).getTime();
      const diff = target - now;

      if (diff < 0) {
        setCountdown("Overdue");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setCountdown(`in ${days}d ${hours % 24}h`);
      } else if (hours > 0) {
        setCountdown(`in ${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setCountdown(`in ${minutes}m ${seconds}s`);
      } else {
        setCountdown(`in ${seconds}s`);
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextRunAt]);

  const getStyles = () => {
    if (!nextRunAt) {
      return {
        container: "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700",
        icon: "text-neutral-400 dark:text-neutral-500",
        text: "text-neutral-600 dark:text-neutral-400"
      };
    }

    if (countdown === "Overdue") {
      return {
        container: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
        icon: "text-red-500 dark:text-red-400",
        text: "text-red-700 dark:text-red-300"
      };
    }

    return {
      container: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800",
      icon: "text-blue-500 dark:text-blue-400",
      text: "text-blue-700 dark:text-blue-300"
    };
  };

  const styles = getStyles();

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-md border ${styles.container} ${className || ''}`}
      role="status"
      aria-label="Next job timer"
    >
      <Clock className={`w-4 h-4 ${styles.icon}`} />
      <div className="flex-1">
        <span className={`text-sm font-medium ${styles.text}`}>
          Next job {countdown}
        </span>
        {projectName && (
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {projectName}
          </div>
        )}
        {(projectId || jobRunId || jobType) && (
          <div className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
            {jobRunId && `Job #${jobRunId}`}
            {jobRunId && projectId && ' • '}
            {projectId && `Project #${projectId}`}
            {(jobRunId || projectId) && jobType && ' • '}
            {jobType && jobType.replace('_', ' ')}
          </div>
        )}
      </div>
    </div>
  );
}
