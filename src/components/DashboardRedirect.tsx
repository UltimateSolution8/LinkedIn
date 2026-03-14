
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProject } from "@/contexts/ProjectContext";

/**
 * Redirects old /dashboard route to new /app/:projectId/dashboard structure
 * for backward compatibility
 */
export default function DashboardRedirect() {
  const navigate = useNavigate();
  const { projects, isLoading, selectedProjectId } = useProject();

  useEffect(() => {
    if (isLoading) return;

    if (projects.length === 0) {
      // No projects → redirect to onboarding
      navigate("/app/onboarding", { replace: true });
    } else {
      // Use selectedProjectId (which includes lastAccessedProject logic) or first project
      const projectId = selectedProjectId || projects[0]._id;
      navigate(`/app/${projectId}/dashboard`, { replace: true });
    }
  }, [projects, isLoading, selectedProjectId, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">Redirecting...</p>
      </div>
    </div>
  );
}
