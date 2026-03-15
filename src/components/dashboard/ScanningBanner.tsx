
interface ScanningBannerProps {
  scanProgress: number; // 0-100
}

export default function ScanningBanner({ scanProgress }: ScanningBannerProps) {
  // Calculate ETA based on progress
  // Assuming 20-40 minutes for full scan, estimate based on current progress
  const calculateETA = (progress: number): string => {
    if (progress >= 100) return "Complete!";
    if (progress === 0) return "20–40 minutes";

    const totalMinutes = 30; // average time
    const remainingMinutes = Math.ceil((totalMinutes * (100 - progress)) / 100);

    if (remainingMinutes < 1) return "Less than a minute";
    if (remainingMinutes === 1) return "~1 minute";
    return `~${remainingMinutes} minutes`;
  };

  const eta = calculateETA(scanProgress);

  return (
    <div className="bg-white border border-teal-100 rounded-xl p-4 md:p-6 shadow-sm overflow-hidden relative mb-6 md:mb-8">
      <div className="flex items-start gap-3 md:gap-4">
        {/* Pulsing Status Dot */}
        <div className="mt-1.5 flex h-3 w-3 relative shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-base md:text-lg font-semibold text-neutral-800">
            Scanning Reddit for leads...{" "}
            <span className="text-neutral-500 font-normal text-sm md:text-base block md:inline mt-1 md:mt-0">
              {eta === "Complete!" ? "Almost there!" : `this takes ${eta}`}
            </span>
          </h2>
          <p className="text-neutral-500 text-xs md:text-sm mt-2 md:mt-1 max-w-2xl leading-relaxed">
            Rixly is processing your subreddits and keywords. You can safely leave this page — leads will be waiting when you return.
          </p>

          {/* Progress Bar Container */}
          <div className="mt-4 md:mt-6 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(scanProgress, 100)}%` }}
            />
          </div>

          {/* Progress Percentage */}
          <div className="mt-2 flex justify-between text-xs text-neutral-500">
            <span>Progress: {Math.round(scanProgress)}%</span>
            {eta !== "Complete!" && <span className="text-right">{eta} remaining</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
