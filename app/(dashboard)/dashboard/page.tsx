"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import MetricsPanel from "@/components/dashboard/MetricsPanel";
import FindPostsTab from "@/components/dashboard/FindPostsTab";
import FindLeadsTab from "@/components/dashboard/FindLeadsTab";
import { useProject } from "@/contexts/ProjectContext";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"posts" | "leads" | "logs">("posts");
  const { selectedProjectId } = useProject();

  return (
    <div className="flex flex-1 overflow-y-auto">
      <div className="flex-1 p-8">
        {/* Tabs Navigation */}
        <div className="pb-3">
          <div className="flex border-b border-neutral-200 dark:border-neutral-800 gap-8">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex items-center gap-2 border-b-[3px] pb-[13px] pt-4 transition-colors ${
                activeTab === "posts"
                  ? "border-b-purple-600 text-purple-600 dark:text-purple-400"
                  : "border-b-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
              }`}
            >
              <p className="text-sm font-bold leading-normal tracking-[0.015em]">Find Posts</p>
              {activeTab === "posts" && (
                <Badge className="bg-purple-600/10 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 hover:bg-purple-600/10">
                  124
                </Badge>
              )}
            </button>
            <button
              onClick={() => setActiveTab("leads")}
              className={`flex items-center gap-2 border-b-[3px] pb-[13px] pt-4 transition-colors ${
                activeTab === "leads"
                  ? "border-b-purple-600 text-purple-600 dark:text-purple-400"
                  : "border-b-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
              }`}
            >
              <p className="text-sm font-bold leading-normal tracking-[0.015em]">Find Leads</p>
              {activeTab === "leads" && (
                <Badge className="bg-purple-600/10 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 hover:bg-purple-600/10">
                  42
                </Badge>
              )}
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`flex items-center gap-2 border-b-[3px] pb-[13px] pt-4 transition-colors ${
                activeTab === "logs"
                  ? "border-b-purple-600 text-purple-600 dark:text-purple-400"
                  : "border-b-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
              }`}
            >
              <p className="text-sm font-bold leading-normal tracking-[0.015em]">Logs</p>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "posts" && selectedProjectId && <FindPostsTab projectId={selectedProjectId} />}
        {activeTab === "leads" && selectedProjectId && <FindLeadsTab projectId={selectedProjectId} />}
        {activeTab === "logs" && (
          <div className="flex flex-col items-center justify-center pt-20">
            <p className="text-neutral-500 dark:text-neutral-400 text-lg">
              Logs tab coming soon...
            </p>
          </div>
        )}
      </div>

      {/* Metrics Panel */}
      {/* <MetricsPanel /> */}
    </div>
  );
}
