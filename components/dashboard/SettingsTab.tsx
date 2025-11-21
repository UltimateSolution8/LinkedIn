"use client";

import { Badge } from "@/components/ui/badge";

interface SettingsTabProps {
  projectId: string;
}

export default function SettingsTab({ projectId }: SettingsTabProps) {
  // Mock data - will be replaced with actual API calls later
  const mockData = {
    keywords: [
      "SaaS analytics",
      "customer retention",
      "data visualization",
      "business intelligence",
      "performance metrics",
      "user engagement",
      "conversion tracking",
      "revenue analytics",
    ],
    semantics: [
      "How to improve customer retention in SaaS",
      "Best practices for data visualization",
      "Tracking user engagement metrics",
      "Understanding conversion funnels",
      "Analyzing revenue trends",
      "Dashboard design patterns",
      "KPI monitoring strategies",
      "Customer churn prediction",
    ],
    productDescription:
      "A comprehensive analytics platform designed to help SaaS businesses track, analyze, and optimize their key performance metrics. Our solution provides real-time insights into customer behavior, revenue trends, and user engagement, enabling data-driven decision-making. With intuitive visualizations and customizable dashboards, teams can quickly identify opportunities for growth and improvement.",
  };

  return (
    <div className="flex flex-col pt-6 gap-8 max-w-5xl">
      {/* Product Description Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-950 dark:text-white">
            Product Description
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Generated description of your product
          </p>
        </div>
        <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {mockData.productDescription}
          </p>
        </div>
      </div>

      {/* Keywords Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-950 dark:text-white">Keywords</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Keywords generated during project creation
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {mockData.keywords.map((keyword, index) => (
            <Badge
              key={index}
              className="bg-purple-600/10 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 hover:bg-purple-600/20 text-sm px-3 py-1.5"
            >
              {keyword}
            </Badge>
          ))}
        </div>
      </div>

      {/* Semantics Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-950 dark:text-white">Semantic Queries</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Semantic search queries generated for your project
          </p>
        </div>
        <div className="space-y-3">
          {mockData.semantics.map((semantic, index) => (
            <div
              key={index}
              className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 hover:border-purple-600/50 dark:hover:border-purple-500/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600/10 dark:bg-purple-600/20 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                    {index + 1}
                  </span>
                </div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {semantic}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
