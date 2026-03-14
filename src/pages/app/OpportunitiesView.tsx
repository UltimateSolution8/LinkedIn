
import { Target } from "lucide-react";

/**
 * OpportunitiesView - Engagement Opportunities
 *
 * This is a placeholder view.
 * In Stories 008-011, this will show "Engagement -> Opportunity" leads:
 * - Medium-intent prospects for nurturing
 * - Filter and action capabilities similar to Hot Leads
 * - Separate badge count in sidebar
 */
export default function OpportunitiesView() {

  return (
    <div className="p-4 lg:p-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-950 dark:text-white">
          Opportunities
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Engagement opportunities for nurturing
        </p>
      </div>

      {/* Placeholder Content */}
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/20 rounded-full flex items-center justify-center mb-4">
          <Target className="w-8 h-8 text-teal-600 dark:text-teal-500" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Opportunities View
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center max-w-md">
          This view will be implemented in Stories 008-011. It will show engagement opportunities
          (medium-intent leads) with filtering and action capabilities.
        </p>
      </div>
    </div>
  );
}
