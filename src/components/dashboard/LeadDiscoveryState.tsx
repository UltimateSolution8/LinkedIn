import { RefreshCw, Sparkles, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeadDiscoveryStateProps {
  type: "posts" | "leads";
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export default function LeadDiscoveryState({
  type,
  onRefresh,
  isRefreshing = false
}: LeadDiscoveryStateProps) {
  const title = type === "posts" ? "Finding Posts" : "Finding Leads";
  const description = type === "posts"
    ? "We're scanning Reddit for high-intent posts that match your project"
    : "We're discovering leads from Reddit conversations matching your keywords";

  return (
    <div className="flex flex-col items-center justify-center py-8 lg:py-16 px-6 min-h-[400px]">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/50 border-2 border-teal-300 dark:border-teal-700 flex items-center justify-center">
            <Search className="w-8 h-8 text-teal-600 dark:text-teal-400" />
          </div>
        </div>

        {/* Heading */}
        <div>
          <h2 className="text-2xl font-bold text-neutral-950 dark:text-white mb-2">
            <span className="inline-flex items-center gap-2">
              {title}
              <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </span>
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed">
            {description}
          </p>
        </div>

        {/* Status */}
        <div className="bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            This may take a few minutes. We'll notify you when your results are ready.
          </p>
        </div>

        {/* Refresh Button */}
        <div className="pt-2">
          <Button
            onClick={onRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="lg"
            className="inline-flex items-center gap-2 border-2 border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/50 font-medium px-6 py-5"
          >
            {isRefreshing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Refresh Now
              </>
            )}
          </Button>
        </div>

        {/* Tips */}
        <div className="pt-4 space-y-2">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            💡 Tip: We'll continue scanning in the background. Check back later or wait for an email notification.
          </p>
        </div>
      </div>
    </div>
  );
}
