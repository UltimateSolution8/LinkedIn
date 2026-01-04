
import { Badge } from "@/components/ui/badge";
import { useProject } from "@/contexts/ProjectContext";
import { Loader2 } from "lucide-react";

interface SettingsTabProps {
  projectId: string;
}

export default function SettingsTab({ projectId }: SettingsTabProps) {
  const { getProjectById } = useProject();
  const project = getProjectById(projectId);

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

  return (
    <div className="flex flex-col pt-6 gap-8 max-w-5xl">
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

    </div>
  );
}
