
import { useParams } from "react-router-dom";
import SettingsTab from "@/components/dashboard/SettingsTab";
import { useProject } from "@/contexts/ProjectContext";

/**
 * SettingsView - Project Settings
 *
 * This view wraps the existing SettingsTab component.
 * Settings include:
 * - Keywords management
 * - Target audience
 * - Value propositions
 * - Email notifications
 */
export default function SettingsView() {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProjectById } = useProject();

  const project = projectId ? getProjectById(projectId) : null;

  return (
    <div className="p-4 lg:p-8">
      {/* Page Header */}
      {project && (
        <div className="mb-8 space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-neutral-950 dark:text-white">
              {project.projectName} Settings
            </h1>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Manage your project configuration and preferences
          </p>
        </div>
      )}

      {/* Settings Content */}
      {projectId && <SettingsTab projectId={projectId} />}
    </div>
  );
}
