
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
      {/* Settings Content */}
      {projectId && <SettingsTab projectId={projectId} />}
    </div>
  );
}
