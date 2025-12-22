
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import FindPostsTab from "@/components/dashboard/FindPostsTab";
import FindLeadsTab from "@/components/dashboard/FindLeadsTab";
import SettingsTab from "@/components/dashboard/SettingsTab";
import { useProject } from "@/contexts/ProjectContext";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"posts" | "leads" | "settings">("posts");
  const { selectedProjectId, getProjectById } = useProject();
  const [postsCount, setPostsCount] = useState(0);
  const [leadsCount, setLeadsCount] = useState(0);

  const project = selectedProjectId ? getProjectById(selectedProjectId) : null;

  return (
    <div className="flex flex-1 overflow-y-auto">
      <div className="flex-1 p-8">
        {/* Project Header */}
        {project && (
          <div className="mb-8 space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-neutral-950 dark:text-white">
                {project.projectName}
              </h1>
              {project.websiteUrl && (
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>
            {project.description && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {project.description}
              </p>
            )}
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="pb-6">
          <div className="flex gap-3 p-2 bg-neutral-100 dark:bg-neutral-800 rounded-full w-fit">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ease-in-out ${
                activeTab === "posts"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
            >
              <p className="text-sm font-bold leading-normal tracking-[0.015em]">Find Posts</p>
              {postsCount > 0 && (
                <Badge className={`${
                  activeTab === "posts"
                    ? "bg-white/20 text-white hover:bg-white/20"
                    : "bg-purple-600/10 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 hover:bg-purple-600/10"
                }`}>
                  {postsCount}
                </Badge>
              )}
            </button>
            <button
              onClick={() => setActiveTab("leads")}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ease-in-out ${
                activeTab === "leads"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
            >
              <p className="text-sm font-bold leading-normal tracking-[0.015em]">Find Leads</p>
              {leadsCount > 0 && (
                <Badge className={`${
                  activeTab === "leads"
                    ? "bg-white/20 text-white hover:bg-white/20"
                    : "bg-purple-600/10 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 hover:bg-purple-600/10"
                }`}>
                  {leadsCount}
                </Badge>
              )}
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ease-in-out ${
                activeTab === "settings"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
            >
              <p className="text-sm font-bold leading-normal tracking-[0.015em]">Settings</p>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "posts" && selectedProjectId && (
          <FindPostsTab projectId={selectedProjectId} onCountChange={setPostsCount} />
        )}
        {activeTab === "leads" && selectedProjectId && (
          <FindLeadsTab projectId={selectedProjectId} onCountChange={setLeadsCount} />
        )}
        {activeTab === "settings" && selectedProjectId && (
          <SettingsTab projectId={selectedProjectId} />
        )}
      </div>

      {/* Metrics Panel */}
      {/* <MetricsPanel /> */}
    </div>
  );
}
