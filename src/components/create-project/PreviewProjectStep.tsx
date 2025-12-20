
import { Globe, FileText, Tag, Network } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PreviewProjectData {
  projectName: string;
  companyWebsite: string;
  projectDescription: string;
  keywords: string[];
  semanticQueries: string[];
}

interface PreviewProjectStepProps {
  onNext: () => void;
  onBack: () => void;
  projectData: PreviewProjectData;
  isSubmitting?: boolean;
  error?: string | null;
}

export default function PreviewProjectStep({
  onNext,
  onBack,
  projectData,
  isSubmitting = false,
  error = null,
}: PreviewProjectStepProps) {
  return (
    <div className="flex flex-col gap-8 rounded-xl bg-white dark:bg-neutral-950 p-6 sm:p-8 md:p-10 shadow-sm border border-neutral-200/50 dark:border-neutral-800">
      {/* Page Heading */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-950 dark:text-white">
          Preview Your Project
        </h1>
        <p className="mt-2 text-base text-neutral-600 dark:text-neutral-400">
          Please review your project details before creating it.
        </p>
      </div>

      {/* Project Details Section */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
          Project Details
        </h2>
        <div className="space-y-6">
          {/* Project Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <label className="font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
              <FileText className="w-4 h-4 text-neutral-400" />
              Project Name
            </label>
            <div className="sm:col-span-2">
              <p className="text-neutral-800 dark:text-neutral-200 font-medium">
                {projectData.projectName}
              </p>
            </div>
          </div>

          <hr className="border-neutral-200 dark:border-neutral-800" />

          {/* Company Website */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <label className="font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
              <Globe className="w-4 h-4 text-neutral-400" />
              Company Website
            </label>
            <div className="sm:col-span-2">
              <a
                href={projectData.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-purple-600 hover:underline"
              >
                <span>{projectData.companyWebsite}</span>
                <span className="text-sm">↗</span>
              </a>
            </div>
          </div>

          <hr className="border-neutral-200 dark:border-neutral-800" />

          {/* Description */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <label className="font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-2 pt-1 sm:pt-0">
              <FileText className="w-4 h-4 text-neutral-400" />
              Description
            </label>
            <div className="sm:col-span-2">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {projectData.projectDescription}
              </p>
            </div>
          </div>

          <hr className="border-neutral-200 dark:border-neutral-800" />

          {/* Keywords */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <label className="font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-2 pt-1 sm:pt-0">
              <Tag className="w-4 h-4 text-neutral-400" />
              Keywords
            </label>
            <div className="sm:col-span-2 h-32 overflow-y-auto rounded-md bg-neutral-50 dark:bg-neutral-900/50 p-3">
              {projectData.keywords.length === 0 ? (
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                  No keywords added
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {projectData.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <hr className="border-neutral-200 dark:border-neutral-800" />

          {/* Semantic Queries */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <label className="font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-2 pt-1 sm:pt-0">
              <Network className="w-4 h-4 text-neutral-400" />
              Semantic Queries
            </label>
            <div className="sm:col-span-2 h-32 overflow-y-auto rounded-md bg-neutral-50 dark:bg-neutral-900/50 p-2">
              {projectData.semanticQueries.length === 0 ? (
                <p className="text-neutral-500 dark:text-neutral-400 text-sm p-2">
                  No semantic queries added
                </p>
              ) : (
                <ul className="space-y-2">
                  {projectData.semanticQueries.map((query, index) => (
                    <li
                      key={index}
                      className="bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 text-sm font-medium px-3 py-2 rounded-md"
                    >
                      {query}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* What Happens Next Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
          What happens next?
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 mb-6">
          Once you create your project, here's what we'll do for you
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold rounded-full">
              1
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">
                Create your project
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                We'll set up your project with all the details you provided
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold rounded-full">
              2
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">
                Start monitoring Reddit
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                We'll begin tracking Reddit posts that match your keywords
              </p>
            </div>
          </div>
          
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="w-full sm:w-auto border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
        >
          Previous
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20"
        >
          {isSubmitting ? "Creating Project..." : "Create Project"}
        </Button>
      </div>
    </div>
  );
}
