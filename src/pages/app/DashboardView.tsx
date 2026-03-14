
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProject } from "@/contexts/ProjectContext";
import FindPostsTab from "@/components/dashboard/FindPostsTab";
import EmptyProjectState from "@/components/dashboard/EmptyProjectState";
import { ExternalLink } from "lucide-react";

/**
 * DashboardView - Stats Dashboard
 *
 * This is a temporary view that wraps the existing FindPostsTab.
 * In Story 002, this will be replaced with the new stats dashboard showing:
 * - KPI cards (Total Matches, Hot Leads, Opportunities, Avg Confidence)
 * - Lead growth chart
 * - Top subreddits
 * - Pain tags distribution
 * - Recent activity feed
 */
export default function DashboardView() {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProjectById, projects, isLoading } = useProject();
  const [_postsCount, setPostsCount] = useState(0);

  const project = projectId ? getProjectById(projectId) : null;

  // Show empty state if user has no projects
  if (!isLoading && projects.length === 0) {
    return (
      <div className="flex flex-1 h-full overflow-x-hidden">
        <div className="flex-1 w-full h-full overflow-y-auto">
          <EmptyProjectState />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
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
                className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-colors"
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

      {/* Temporary: Show existing Find Posts Tab */}
      {/* TODO: Replace with new stats dashboard in Story 002 */}
      {projectId && (
        <FindPostsTab projectId={projectId} onCountChange={setPostsCount} />
      )}
    </div>
  );
}
