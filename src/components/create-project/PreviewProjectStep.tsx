
import { MapPin, FileText, Tag, Briefcase, Globe, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PreviewProjectData {
  projectName: string;
  location: string;
  businessType: string;
  websiteUrl: string;
  description: string;
  targetAudience: string[];
  valuePropositions: string[];
  keywords: string[];
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

          {/* Primary Operating Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <label className="font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-neutral-400" />
              Primary Operating Location
            </label>
            <div className="sm:col-span-2">
              <p className="text-neutral-800 dark:text-neutral-200 font-medium">
                {projectData.location}
              </p>
            </div>
          </div>

          <hr className="border-neutral-200 dark:border-neutral-800" />

          {/* Type of Business */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <label className="font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-neutral-400" />
              Type of Business
            </label>
            <div className="sm:col-span-2">
              <p className="text-neutral-800 dark:text-neutral-200 font-medium capitalize">
                {projectData.businessType}
              </p>
            </div>
          </div>

          <hr className="border-neutral-200 dark:border-neutral-800" />

          {/* Project Website URL */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <label className="font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
              <Globe className="w-4 h-4 text-neutral-400" />
              Website URL
            </label>
            <div className="sm:col-span-2">
              <a
                href={projectData.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-teal-600 hover:underline break-all"
              >
                <span>{projectData.websiteUrl}</span>
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
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm">
                {projectData.description}
              </p>
            </div>
          </div>

          <hr className="border-neutral-200 dark:border-neutral-800" />

          {/* Target Audience */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <label className="font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-2 pt-1 sm:pt-0">
              <Users className="w-4 h-4 text-neutral-400" />
              Target Audience
            </label>
            <div className="sm:col-span-2">
              {projectData.targetAudience.length === 0 ? (
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                  No target audience added
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {projectData.targetAudience.map((audience, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {audience}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <hr className="border-neutral-200 dark:border-neutral-800" />

          {/* Value Propositions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <label className="font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-2 pt-1 sm:pt-0">
              <AlertCircle className="w-4 h-4 text-neutral-400" />
              Value Propositions
            </label>
            <div className="sm:col-span-2">
              {projectData.valuePropositions.length === 0 ? (
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                  No value propositions added
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {projectData.valuePropositions.map((valueProposition, index) => (
                    <span
                      key={index}
                      className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {valueProposition}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <hr className="border-neutral-200 dark:border-neutral-800" />

          {/* Keywords */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <label className="font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-2 pt-1 sm:pt-0">
              <Tag className="w-4 h-4 text-neutral-400" />
              Keywords
            </label>
            <div className="sm:col-span-2 max-h-32 overflow-y-auto rounded-md bg-neutral-50 dark:bg-neutral-900/50 p-3">
              {projectData.keywords.length === 0 ? (
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                  No keywords added
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {projectData.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
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
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-bold rounded-full">
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
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-bold rounded-full">
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
          className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20"
        >
          {isSubmitting ? "Creating Project..." : "Create Project"}
        </Button>
      </div>
    </div>
  );
}
