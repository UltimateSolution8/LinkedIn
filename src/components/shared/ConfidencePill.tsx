import { cn } from "@/lib/utils";

export interface ConfidencePillProps {
  score?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
};

const getConfidenceColor = (score: number): string => {
  if (score >= 75) return "bg-green-100 text-green-800 border-green-200";
  if (score >= 50) return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-red-100 text-red-800 border-red-200";
};

export function ConfidencePill({ score, size = "md", className }: ConfidencePillProps) {
  if (score === undefined || score === null) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full border bg-gray-100 text-gray-600 border-gray-200 font-medium",
          sizeStyles[size],
          className
        )}
        aria-label="Confidence score not available"
      >
        N/A
      </span>
    );
  }

  const clampedScore = Math.max(0, Math.min(100, score));
  const colorClass = getConfidenceColor(clampedScore);

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border font-medium",
        colorClass,
        sizeStyles[size],
        className
      )}
      role="status"
      aria-label={`Confidence score: ${clampedScore}%`}
      title={`Confidence: ${clampedScore}%`}
    >
      {clampedScore}%
    </span>
  );
}

export default ConfidencePill;
