
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useProject } from "@/contexts/ProjectContext";
import { getCurrentUser } from "@/lib/api/auth";

// Maximum number of projects a user can create
const MAX_PROJECTS = 2;

export default function Sidebar() {
  const navigate = useNavigate();
  const { selectedProjectId, setSelectedProjectId, projects, isLoading, error } = useProject();

  // Check if user is admin
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  // Disable create button when user has reached the maximum project limit (unless they're an admin)
  const isCreateButtonDisabled = !isAdmin && projects.length >= MAX_PROJECTS;

  const handleCreateProject = () => {
    // Only navigate if user hasn't reached the project limit
    if (!isCreateButtonDisabled) {
      navigate("/create-project");
    }
  };

  const getProjectInitial = (projectName: string) => {
    return projectName.charAt(0).toUpperCase();
  };

  return (
    <aside className="flex w-64 flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950" style={{ height: 'calc(100vh - 64px)' }}>
      <div className="flex h-full flex-col p-4">
        {/* Projects List - Scrollable */}
        <div className="flex-1 overflow-y-auto mb-4">
          <div className="flex flex-col gap-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Loading projects...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-8 px-2">
                <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-2">
                <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
                  No projects yet. Create your first project!
                </p>
              </div>
            ) : (
              projects.map((project) => {
                const isActive = project._id === selectedProjectId;

                return (
                  <div
                    key={project._id}
                    onClick={() => setSelectedProjectId(project._id)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      isActive
                        ? "bg-teal-600/10 dark:bg-teal-600/20"
                        : "hover:bg-teal-600/10 dark:hover:bg-teal-600/20"
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback
                        className={`text-xs font-semibold ${
                          isActive
                            ? "bg-teal-600 text-white"
                            : "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                        }`}
                      >
                        {getProjectInitial(project.projectName)}
                      </AvatarFallback>
                    </Avatar>
                    <p
                      className={`text-sm font-medium leading-normal truncate ${
                        isActive
                          ? "text-neutral-950 dark:text-white"
                          : "text-neutral-950 dark:text-neutral-300"
                      }`}
                    >
                      {project.projectName}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Create New Project Button - Fixed at bottom */}
        <div className="flex-shrink-0">
          <Button
            onClick={handleCreateProject}
            disabled={isCreateButtonDisabled}
            title={
              isAdmin
                ? "Create a new project (Admin - Unlimited)"
                : isCreateButtonDisabled
                  ? `You can create a maximum of ${MAX_PROJECTS} projects`
                  : "Create a new project"
            }
            className={`w-full gap-2 ${
              isCreateButtonDisabled
                ? "bg-neutral-400 hover:bg-neutral-400 text-neutral-600 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700 text-white"
            }`}
          >
            <Plus className="w-5 h-5" />
            <span className="truncate">
              {isCreateButtonDisabled ? `Max ${MAX_PROJECTS} Projects` : "Create New Project"}
            </span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
