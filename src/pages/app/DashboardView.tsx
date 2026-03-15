import { useParams } from "react-router-dom";
import { useProject } from "@/contexts/ProjectContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useScanningStatus } from "@/hooks/useScanningStatus";
import EmptyProjectState from "@/components/dashboard/EmptyProjectState";
import ScanningBanner from "@/components/dashboard/ScanningBanner";
import KPICards from "@/components/dashboard/KPICards";
import ScanningProgressSteps from "@/components/dashboard/ScanningProgressSteps";
import WhileYouWait from "@/components/dashboard/WhileYouWait";

/**
 * DashboardView - Stats Dashboard
 *
 * Shows scanning state with progress tracking and onboarding guidance.
 * Displays:
 * - Scanning banner with progress
 * - KPI cards (placeholders during scan)
 * - Onboarding stepper
 * - "While you wait" panel with tips
 */
export default function DashboardView() {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProjectById, projects, isLoading: projectsLoading } = useProject();

  const project = projectId ? getProjectById(projectId) : null;

  // Fetch dashboard data with auto-polling
  const { data: dashboardData, isLoading: dashboardLoading, error } = useDashboardData({
    projectId: projectId || "",
    enabled: !!projectId
  });

  // Fetch scanning status for initial state
  const { data: scanningStatus } = useScanningStatus({
    projectId: projectId || "",
    enabled: !!projectId
  });

  // Show empty state if user has no projects
  if (!projectsLoading && projects.length === 0) {
    return (
      <div className="flex flex-1 h-full overflow-x-hidden">
        <div className="flex-1 w-full h-full overflow-y-auto">
          <EmptyProjectState />
        </div>
      </div>
    );
  }

  // Show loading state
  if (dashboardLoading && !dashboardData) {
    return (
      <div className="p-4 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-neutral-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Error loading dashboard: {error}</p>
        </div>
      </div>
    );
  }

  const isScanning = dashboardData?.scanState === "scanning_empty" || dashboardData?.scanState === "scanning_partial";
  const scanProgress = dashboardData?.scanProgress || 0;

  // Determine if we should show scanning progress steps (initial state)
  const showScanningProgress = scanningStatus &&
    (scanningStatus.stage == 'idle' || scanningStatus.stage === 'validating_subreddits' || scanningStatus.stage === 'scoring_leads');

  return (
    <div className="p-4 lg:p-8">
      {/* Scanning Banner - only show during scanning */}
      {isScanning && dashboardData && (
        <ScanningBanner scanProgress={scanProgress} />
      )}

      {/* KPI Cards */}
      {dashboardData && (
        <KPICards kpis={dashboardData.kpis} isScanning={isScanning} />
      )}

      {/* Main Layout Grid - Scanning Progress Steps + While You Wait */}
      {showScanningProgress && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* LEFT COLUMN: Scanning Progress Steps */}
          <div className="lg:col-span-7">
            <ScanningProgressSteps
              stage={scanningStatus.stage}
              subreddits={scanningStatus.subreddits}
            />
          </div>

          {/* RIGHT COLUMN: While You Wait */}
          <div className="lg:col-span-5">
            <WhileYouWait />
          </div>
        </div>
      )}

      {/* TODO: Add complete state UI components (Top Subreddits & Keywords) */}
      {!showScanningProgress && dashboardData && (
        <div className="mt-8">
          <p className="text-neutral-500 text-center">
            Complete state dashboard coming soon...
          </p>
        </div>
      )}
    </div>
  );
}
