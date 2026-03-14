
import { useProject } from "@/contexts/ProjectContext";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/lib/api/auth";

const MAX_PROJECTS = 2;

export default function ProjectSwitcher() {
  const navigate = useNavigate();
  const { selectedProjectId, setSelectedProjectId, getProjectById, projects } = useProject();
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  const selectedProject = selectedProjectId ? getProjectById(selectedProjectId) : null;
  const isCreateButtonDisabled = !isAdmin && projects.length >= MAX_PROJECTS;

  const getProjectInitial = (projectName: string) => {
    return projectName.charAt(0).toUpperCase();
  };

  const handleProjectSwitch = (projectId: string) => {
    setSelectedProjectId(projectId);
    // Navigate to the dashboard view for the new project
    navigate(`/app/${projectId}/dashboard`);
  };

  const handleCreateProject = () => {
    if (!isCreateButtonDisabled) {
      navigate("/create-project");
    }
  };

  if (!selectedProject) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between gap-2 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="h-6 w-6 shrink-0">
              <AvatarFallback className="bg-teal-600 text-white text-xs">
                {getProjectInitial(selectedProject.projectName)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {selectedProject.projectName}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-neutral-500 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[240px]">
        {projects.map((project) => (
          <DropdownMenuItem
            key={project._id}
            onClick={() => handleProjectSwitch(project._id)}
            className="gap-2 cursor-pointer"
          >
            <Avatar className="h-6 w-6 shrink-0">
              <AvatarFallback className="bg-teal-600 text-white text-xs">
                {getProjectInitial(project.projectName)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate flex-1">{project.projectName}</span>
            {project._id === selectedProjectId && (
              <CheckIcon className="h-4 w-4 text-teal-600" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleCreateProject}
          disabled={isCreateButtonDisabled}
          className={cn(
            "gap-2 cursor-pointer",
            isCreateButtonDisabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="h-6 w-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
            <Plus className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
          </div>
          <span className="text-neutral-700 dark:text-neutral-300">Create Project</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
