interface KeywordData {
  keyword: string;
  totalLeads: number;
  salesLeads: number;
  engagementLeads: number;
}

interface KeywordPerformanceChartProps {
  data: KeywordData[];
}

export default function KeywordPerformanceChart({ data }: KeywordPerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-neutral-500 text-sm">
        No keyword data available yet
      </div>
    );
  }

  // Find max value for consistent bar width scaling
  const maxLeads = Math.max(...data.map(item => item.totalLeads));

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const percentage = (item.totalLeads / maxLeads) * 100;

        return (
          <div key={index} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-neutral-900 dark:text-white">
                {item.keyword}
              </span>
              <span className="text-neutral-600 dark:text-neutral-400 font-medium">
                {item.totalLeads}
              </span>
            </div>
            <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 dark:bg-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
