import { DashboardKPIs } from "@/lib/api/projects";
import { Flame, TrendingUp, Users, Radar } from "lucide-react";

export type DashboardMetricKey = "hot_leads" | "this_week" | "total_leads" | "posts_scanned";

interface KPICardsProps {
  kpis: DashboardKPIs;
  isScanning: boolean; // Show placeholder "—" when scanning_empty
  onCardClick?: (metric: DashboardMetricKey) => void;
}

export default function KPICards({ kpis, isScanning, onCardClick }: KPICardsProps) {
  const cards = [
    {
      key: "hot_leads" as const,
      label: "Hot Leads",
      value: kpis.hotLeadCount,
      subtitle: kpis.hotLeadCount > 0 ? "Action Required" : null,
      icon: Flame,
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500",
      valueColor: "text-orange-500"
    },
    {
      key: "this_week" as const,
      label: "This Week",
      value: kpis.leadsThisWeek,
      subtitle: kpis.leadsThisWeek > 0 ? "+12% vs last" : null,
      icon: TrendingUp,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      valueColor: "text-neutral-800 dark:text-white"
    },
    {
      key: "total_leads" as const,
      label: "Total Leads",
      value: kpis.totalLeads,
      subtitle: "Lifetime growth",
      icon: Users,
      iconBg: "bg-teal-400/10",
      iconColor: "text-teal-400",
      valueColor: "text-neutral-800 dark:text-white"
    },
    {
      key: "posts_scanned" as const,
      label: "Posts Scanned",
      value: kpis.postsScanned,
      subtitle: kpis.postsScanned > 0 ? "And counting..." : null,
      icon: Radar,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      valueColor: "text-primary",
      showBadge: true
    }
  ];

  return (
    <>
      {/* Mobile: Horizontal Scroll */}
      <section className="mb-6 md:hidden">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-bold text-neutral-800 dark:text-white">Performance Overview</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <button
                type="button"
                key={index}
                onClick={() => onCardClick?.(card.key)}
                className="min-w-[160px] flex-1 text-left bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-teal-200/20 dark:border-neutral-800 shadow-sm hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center ${card.iconColor} mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Value */}
                {isScanning && !card.showBadge ? (
                  <p className="text-2xl font-bold text-neutral-300 dark:text-neutral-700">—</p>
                ) : (
                  <p className={`text-2xl font-bold ${card.valueColor}`}>
                    {card.value.toLocaleString()}
                  </p>
                )}

                {/* Label */}
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mt-1">
                  {card.label}
                </p>

                {/* Subtitle */}
                {card.subtitle && !isScanning && (
                  <p className={`text-[10px] mt-1 font-semibold ${
                    card.label === "Hot Leads" ? "text-orange-500/80" :
                    card.label === "This Week" ? "text-green-600" :
                    card.label === "Posts Scanned" ? "text-primary/80 italic" :
                    "text-neutral-400"
                  }`}>
                    {card.subtitle}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Desktop: Grid Layout */}
      <section className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <button
              type="button"
              key={index}
              onClick={() => onCardClick?.(card.key)}
              className="text-left bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-lg ${card.iconBg} flex items-center justify-center ${card.iconColor} mb-4`}>
                <Icon className="w-6 h-6" />
              </div>

              {/* Value */}
              {isScanning && !card.showBadge ? (
                <p className="text-3xl font-bold text-neutral-300 dark:text-neutral-700">—</p>
              ) : (
                <p className={`text-3xl font-bold ${card.valueColor}`}>
                  {card.value.toLocaleString()}
                </p>
              )}

              {/* Label */}
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mt-2">
                {card.label}
              </p>

              {/* Subtitle */}
              {card.subtitle && !isScanning && (
                <p className={`text-xs mt-1 font-semibold ${
                  card.label === "Hot Leads" ? "text-orange-500/80" :
                  card.label === "This Week" ? "text-green-600" :
                  card.label === "Posts Scanned" ? "text-primary/80" :
                  "text-neutral-400"
                }`}>
                  {card.subtitle}
                </p>
              )}
            </button>
          );
        })}
      </section>
    </>
  );
}
