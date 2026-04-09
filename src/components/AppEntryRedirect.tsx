import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProject } from "@/contexts/ProjectContext";

/**
 * Smart entry point for app.userixly.com root (/).
 *
 * Routing logic:
 *  - Unauthenticated          → /login
 *  - Authenticated + projects → /app/:projectId/dashboard  (via DashboardRedirect logic)
 *  - Authenticated + no proj  → /app/onboarding
 */
export default function AppEntryRedirect() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { projects, isLoading: projectsLoading, selectedProjectId } = useProject();

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    if (projectsLoading) return;

    if (projects.length === 0) {
      navigate("/app/onboarding", { replace: true });
    } else {
      const projectId = selectedProjectId || projects[0]._id;
      navigate(`/app/${projectId}/dashboard`, { replace: true });
    }
  }, [authLoading, isAuthenticated, projectsLoading, projects, selectedProjectId, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">Loading...</p>
      </div>
    </div>
  );
}
