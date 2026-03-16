
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProject } from "@/contexts/ProjectContext";

interface ProjectRouteGuardProps {
  children: React.ReactNode;
}

export default function ProjectRouteGuard({ children }: ProjectRouteGuardProps) {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, isLoading, setSelectedProjectId, getProjectById } = useProject();

  useEffect(() => {
    // Wait for projects to load
    if (isLoading) return;

    // Check if projectId in URL is valid
    if (projectId) {
      const project = getProjectById(projectId);

      if (!project) {
        // Invalid projectId → redirect to first available project
        console.warn(`Invalid projectId: ${projectId}, redirecting to first project`);

        if (projects.length === 0) {
          navigate("/app/onboarding", { replace: true });
          return;
        }

        const firstProjectId = projects[0]._id;
        navigate(`/app/${firstProjectId}/dashboard`, { replace: true });
        return;
      }

      // Valid projectId → sync with context
      setSelectedProjectId(projectId);
    } else {
      // No projectId in URL → redirect to first project
      if (projects.length === 0) {
        navigate("/app/onboarding", { replace: true });
        return;
      }

      const firstProjectId = projects[0]._id;
      navigate(`/app/${firstProjectId}/dashboard`, { replace: true });
    }
  }, [projectId, projects, isLoading, navigate, setSelectedProjectId, getProjectById]);

  // Show loading state while projects are being fetched
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  // Render children only after validation
  return <>{children}</>;
}
