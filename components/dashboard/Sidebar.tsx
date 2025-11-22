"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useProject } from "@/contexts/ProjectContext";
import Logo from "@/components/common/Logo";

export default function Sidebar() {
  const router = useRouter();
  const { selectedProjectId, setSelectedProjectId, projects, isLoading, error } = useProject();

  const handleCreateProject = () => {
    router.push("/create-project");
  };

  const getProjectInitial = (projectName: string) => {
    return projectName.charAt(0).toUpperCase();
  };

  return (
    <aside className="flex w-64 flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      <div className="flex h-full flex-col justify-between p-4">
        <div className="flex flex-col gap-4">
          {/* Logo Section */}
          <Logo />

          {/* Projects List */}
          <div className="flex flex-col gap-2 mt-4">
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
                        ? "bg-purple-600/10 dark:bg-purple-600/20"
                        : "hover:bg-purple-600/10 dark:hover:bg-purple-600/20"
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback
                        className={`text-xs font-semibold ${
                          isActive
                            ? "bg-purple-600 text-white"
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

        {/* Create New Project Button */}
        <Button
          onClick={handleCreateProject}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="truncate">Create New Project</span>
        </Button>
      </div>
    </aside>
  );
}
