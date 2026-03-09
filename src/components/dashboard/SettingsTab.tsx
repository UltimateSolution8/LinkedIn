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
    refreshProjects();
  };

  return (
    <div className="flex flex-col pt-6 gap-8 max-w-5xl">
      {/* Header with Edit Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-950 dark:text-white">Project Settings</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Manage your project configuration and preferences
          </p>
        </div>
        <Button
          onClick={() => setIsEditModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white"
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
                className="bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600/20 text-sm px-3 py-1.5"
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
                className="bg-red-600/10 dark:bg-red-600/20 text-red-600 dark:text-red-400 hover:bg-red-600/20 text-sm px-3 py-1.5"
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
                className="bg-purple-600/10 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 hover:bg-purple-600/20 text-sm px-3 py-1.5"
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
        <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${project.emailNotifyEnabled ? 'bg-green-500' : 'bg-neutral-400 dark:bg-neutral-600'}`} />
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Email notifications are {project.emailNotifyEnabled ? 'enabled' : 'disabled'}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Settings Modal */}
      <EditProjectSettingsModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        project={project}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
