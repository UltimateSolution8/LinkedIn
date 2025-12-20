
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const metrics = [
  { label: "Leads Found (7 days)", value: "42" },
  { label: "Posts Monitored", value: "1,289" },
  { label: "Engagement Rate", value: "12.5%" },
  { label: "Active Keywords", value: "15" },
];

export default function MetricsPanel() {
  return (
    <aside className="w-80 flex-shrink-0 border-l border-neutral-200 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-950 hidden lg:block">
      <div className="flex items-center justify-between pb-3 pt-1">
        <h2 className="text-neutral-950 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
          Key Metrics
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="p-1 rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-purple-600/10 dark:hover:bg-purple-600/20"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900"
          >
            <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">
              {metric.label}
            </p>
            <p className="text-neutral-950 dark:text-white text-3xl font-bold mt-1">
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
}
