
import { useParams } from "react-router-dom";
import SettingsTab from "@/components/dashboard/SettingsTab";

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

  return (
    <div className="p-4 lg:p-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-950 dark:text-white">
          Settings
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Manage your project configuration
        </p>
      </div>

      {/* Settings Content */}
      {projectId && <SettingsTab projectId={projectId} />}
    </div>
  );
}
