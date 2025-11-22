"use client";

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

  const { keywords = [], semanticQueries = [], description = "" } = project;

  return (
    <div className="flex flex-col pt-6 gap-8 max-w-5xl">
      {/* Product Description Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-950 dark:text-white">
            Product Description
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Description of your product
          </p>
        </div>
        {description ? (
          <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {description}
            </p>
          </div>
        ) : (
          <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
              No description available
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

      {/* Semantic Queries Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-950 dark:text-white">Semantic Queries</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Semantic search queries for finding relevant content
          </p>
        </div>
        {semanticQueries.length > 0 ? (
          <div className="space-y-3">
            {semanticQueries.map((semantic, index) => (
              <div
                key={index}
                className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 hover:border-purple-600/50 dark:hover:border-purple-500/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600/10 dark:bg-purple-600/20 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {semantic}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
              No semantic queries available
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
