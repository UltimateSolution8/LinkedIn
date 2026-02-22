import { Badge } from "@/components/ui/badge";

interface JobStatusBadgeProps {
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export default function JobStatusBadge({ status }: JobStatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'running':
        return "bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400";
      case 'completed':
        return "bg-green-600/10 dark:bg-green-600/20 text-green-600 dark:text-green-400";
      case 'failed':
        return "bg-red-600/10 dark:bg-red-600/20 text-red-600 dark:text-red-400";
      case 'pending':
        return "bg-neutral-600/10 dark:bg-neutral-600/20 text-neutral-600 dark:text-neutral-400";
      default:
        return "bg-neutral-600/10 dark:bg-neutral-600/20 text-neutral-600 dark:text-neutral-400";
    }
  };

  const getStatusLabel = () => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Badge className={`${getStatusStyles()} text-xs`}>
      {getStatusLabel()}
    </Badge>
  );
}
