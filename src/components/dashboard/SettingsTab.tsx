import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProject } from "@/contexts/ProjectContext";
import { Pencil, Loader2 } from "lucide-react";
import EditProjectSettingsModal from "./EditProjectSettingsModal";

interface SettingsTabProps {
  projectId: string;
}

export default function SettingsTab({ projectId }: SettingsTabProps) {
  const { getProjectById, refreshProjects } = useProject();
  const project = getProjectById(projectId);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!project) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <p>Loading project settings...</p>
        </div>
      </div>
    );
  }

  const { keywords = [], targetAudience = [], valuePropositions = [] } = project;

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSaveSuccess(true);
    
    // Defer the background refresh until AFTER the success message disappears
    // This prevents the page 'reload' flicker from interrupting the UI feedback
    setTimeout(() => {
      setSaveSuccess(false);
      refreshProjects();
    }, 3000); // Wait 3 seconds, then hide and refresh
  };

  const formatLastUpdated = (dateString?: string) => {
    if (!dateString) return "No updates yet";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(dateString));
  };

  return (
    <div className="flex flex-col pt-6 gap-8 pb-12">
      {saveSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-lg flex items-center justify-between border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-sm">Settings saved successfully</p>
              <p className="text-xs opacity-90">Your changes are now live and active.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header with Edit Button */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-neutral-950 dark:text-white">Configure Project</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            General settings and descriptions
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Last saved: <span className="font-medium text-neutral-600 dark:text-neutral-300">{formatLastUpdated(project.updatedAt)}</span>
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setIsEditModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white z-10"
        >
          <Pencil className="w-4 h-4 mr-2" />
          Edit Settings
        </Button>
      </div>

      {/* Target Audience Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-950 dark:text-white">Target Audience</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Your ideal customer segments and personas
          </p>
        </div>
        {targetAudience.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {targetAudience.map((audience, index) => (
              <Badge
                key={index}
                className="bg-primary/10 text-primary hover:bg-primary/20 border-none text-sm px-3 py-1.5 transition-colors"
              >
                {audience}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
              No target audience defined
            </p>
          </div>
        )}
      </div>

      {/* Value Propositions Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-950 dark:text-white">Value Propositions</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Key benefits and solutions your product offers
          </p>
        </div>
        {valuePropositions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {valuePropositions.map((valueProposition, index) => (
              <Badge
                key={index}
                className="bg-primary/10 text-primary hover:bg-primary/20 border-none text-sm px-3 py-1.5 transition-colors"
              >
                {valueProposition}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
              No value propositions defined
            </p>
          </div>
        )}
      </div>

      {/* Keywords Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-950 dark:text-white">Keywords</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Keywords for tracking relevant posts
          </p>
        </div>
        {keywords.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <Badge
                key={index}
                className="bg-primary/10 text-primary hover:bg-primary/20 border-none text-sm px-3 py-1.5 transition-colors"
              >
                {keyword}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
              No keywords available
            </p>
          </div>
        )}
      </div>

      {/* Email Notifications Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-950 dark:text-white">Email Notifications</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Receive alerts when new leads are discovered
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${project.emailNotifyEnabled ? 'bg-primary animate-pulse shadow-[0_0_8px_rgba(14,124,110,0.5)]' : 'bg-neutral-400 dark:bg-neutral-600'}`} />
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Email notifications are {project.emailNotifyEnabled ? 'enabled' : 'disabled'}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Settings Modal */}
      {isEditModalOpen && (
        <EditProjectSettingsModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          project={project}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
