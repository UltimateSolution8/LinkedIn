interface SubredditData {
  subreddit: string;
  totalLeads: number;
  salesLeads: number;
  engagementLeads: number;
  postsFetched: number;
  subscribers: number;
}

interface SubredditPerformanceChartProps {
  data: SubredditData[];
}

export default function SubredditPerformanceChart({ data }: SubredditPerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-neutral-500 text-sm">
        No subreddit data available yet
      </div>
    );
  }

  // Find max value for consistent bar width scaling
  const maxLeads = Math.max(...data.map(item => item.totalLeads));

  // Format subreddit name with r/ prefix if not already present
  const formatSubredditName = (name: string) => {
    return name.startsWith('r/') ? name : `r/${name}`;
  };

  // Get Reddit URL for subreddit
  const getSubredditUrl = (name: string) => {
    const cleanName = name.replace('r/', '');
    return `https://www.reddit.com/r/${cleanName}`;
  };

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const percentage = (item.totalLeads / maxLeads) * 100;
        const subredditName = formatSubredditName(item.subreddit);
        const subredditUrl = getSubredditUrl(item.subreddit);

        return (
          <div key={index} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <a
                href={subredditUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:underline transition-colors"
              >
                {subredditName}
              </a>
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
