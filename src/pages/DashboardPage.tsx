
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FindPostsTab from "@/components/dashboard/FindPostsTab";
import FindLeadsTab from "@/components/dashboard/FindLeadsTab";
import SettingsTab from "@/components/dashboard/SettingsTab";
import { useProject } from "@/contexts/ProjectContext";

const MAX_PROJECTS = 2;

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"posts" | "leads" | "settings">("posts");
  const { selectedProjectId, setSelectedProjectId, getProjectById, projects, isLoading } = useProject();
  const [postsCount, setPostsCount] = useState(0);
  const [leadsCount, setLeadsCount] = useState(0);

  const project = selectedProjectId ? getProjectById(selectedProjectId) : null;
  const isCreateButtonDisabled = projects.length >= MAX_PROJECTS;

  const getProjectInitial = (projectName: string) => {
    return projectName.charAt(0).toUpperCase();
  };

  const handleCreateProject = () => {
    if (!isCreateButtonDisabled) {
      navigate("/create-project");
    }
  };

  return (
    <div className="flex flex-1 h-full overflow-x-hidden">
      <div className="flex-1 w-full h-full overflow-y-auto">
        <div className="p-4 lg:p-8">
        {/* Mobile Project Selector - Only visible on mobile */}
        <div className="lg:hidden mb-4 -mx-4 px-4 bg-white dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Your Projects
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
            {isLoading ? (
              <div className="flex-shrink-0 px-4 py-2 text-sm text-neutral-500 dark:text-neutral-400">
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="flex-shrink-0 px-4 py-2 text-sm text-neutral-500 dark:text-neutral-400">
                No projects yet
              </div>
            ) : (
              <>
                {projects.map((proj) => {
                  const isActive = proj._id === selectedProjectId;
                  return (
                    <button
                      key={proj._id}
                      onClick={() => setSelectedProjectId(proj._id)}
                      className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                        isActive
                          ? "bg-purple-100 dark:bg-neutral-800 border border-purple-600/20 dark:border-purple-600/40"
                          : "bg-neutral-50 dark:bg-neutral-800 border border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Avatar className="h-6 w-6 flex-shrink-0">
                        <AvatarFallback
                          className={`text-xs font-bold ${
                            isActive
                              ? "bg-purple-600 text-white"
                              : "bg-neutral-200 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-300"
                          }`}
                        >
                          {getProjectInitial(proj.projectName)}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={`text-sm font-medium whitespace-nowrap ${
                          isActive
                            ? "text-purple-600 dark:text-purple-400"
                            : "text-neutral-950 dark:text-neutral-300"
                        }`}
                      >
                        {proj.projectName}
                      </span>
                    </button>
                  );
                })}
                <button
                  onClick={handleCreateProject}
                  disabled={isCreateButtonDisabled}
                  className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                    isCreateButtonDisabled
                      ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                      : "bg-neutral-100 dark:bg-neutral-800 text-purple-600 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  }`}
                  title={isCreateButtonDisabled ? `Max ${MAX_PROJECTS} projects` : "Create new project"}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Project Header - Hidden on mobile, shown on desktop */}
        {project && (
          <div className="hidden lg:block mb-8 space-y-3">
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
        <div className="pb-6 overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
          <div className="flex gap-1 lg:gap-3 p-1 lg:p-2 bg-neutral-100 dark:bg-neutral-800 rounded-full lg:rounded-xl min-w-full lg:w-fit">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex-1 lg:flex-initial flex items-center justify-center gap-1 lg:gap-2 px-3 lg:px-6 py-2 lg:py-3 rounded-full lg:rounded-lg transition-all duration-300 ease-in-out ${
                activeTab === "posts"
                  ? "bg-white dark:bg-neutral-900 text-purple-600 shadow-sm"
                  : "bg-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
            >
              <p className="text-xs lg:text-sm font-bold lg:font-semibold leading-normal tracking-[0.015em]">Find Posts</p>
              {postsCount > 0 && (
                <Badge className={`text-[10px] lg:text-xs px-1.5 lg:px-2 h-5 ${
                  activeTab === "posts"
                    ? "bg-purple-600 text-white hover:bg-purple-600"
                    : "bg-purple-600/10 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 hover:bg-purple-600/10"
                }`}>
                  {postsCount}
                </Badge>
              )}
            </button>
            <button
              onClick={() => setActiveTab("leads")}
              className={`flex-1 lg:flex-initial flex items-center justify-center gap-1 lg:gap-2 px-3 lg:px-6 py-2 lg:py-3 rounded-full lg:rounded-lg transition-all duration-300 ease-in-out ${
                activeTab === "leads"
                  ? "bg-white dark:bg-neutral-900 text-purple-600 shadow-sm"
                  : "bg-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
            >
              <p className="text-xs lg:text-sm font-bold lg:font-semibold leading-normal tracking-[0.015em]">Find Leads</p>
              {leadsCount > 0 && (
                <Badge className={`text-[10px] lg:text-xs px-1.5 lg:px-2 h-5 ${
                  activeTab === "leads"
                    ? "bg-purple-600 text-white hover:bg-purple-600"
                    : "bg-purple-600/10 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 hover:bg-purple-600/10"
                }`}>
                  {leadsCount}
                </Badge>
              )}
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex-1 lg:flex-initial flex items-center justify-center gap-1 lg:gap-2 px-3 lg:px-6 py-2 lg:py-3 rounded-full lg:rounded-lg transition-all duration-300 ease-in-out ${
                activeTab === "settings"
                  ? "bg-white dark:bg-neutral-900 text-purple-600 shadow-sm"
                  : "bg-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
            >
              <p className="text-xs lg:text-sm font-bold lg:font-semibold leading-normal tracking-[0.015em]">Settings</p>
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
      </div>

      {/* Metrics Panel */}
      {/* <MetricsPanel /> */}
    </div>
  );
}
