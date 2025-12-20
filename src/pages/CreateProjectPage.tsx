
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectInfoStep, {
  ProjectInfoData,
} from "@/components/create-project/ProjectInfoStep";
import KeywordSetupStep, { Keyword } from "@/components/create-project/KeywordSetupStep";
import SemanticQueriesStep, {
  SemanticQuery,
} from "@/components/create-project/SemanticQueriesStep";
import PreviewProjectStep from "@/components/create-project/PreviewProjectStep";
import { createProject } from "@/lib/api/projects";

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [projectInfo, setProjectInfo] = useState<ProjectInfoData | null>(null);
  const [keywords, setKeywords] = useState<Keyword[]>([  ]);
  const [semanticQueries, setSemanticQueries] = useState<SemanticQuery[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleStep1Next = (data: ProjectInfoData) => {
    setProjectInfo(data);
    setCurrentStep(2);
  };

  const handleStep2Next = () => {
    console.log("Keywords:", keywords);
    setCurrentStep(3);
  };

  const handleStep2Back = () => {
    setCurrentStep(1);
  };

  const handleStep3Next = () => {
    console.log("Semantic Queries:", semanticQueries);
    setCurrentStep(4);
  };

  const handleStep3Back = () => {
    setCurrentStep(2);
  };

  const handleStep4Next = async () => {
    // Validate required data
    if (!projectInfo) {
      setError("Project information is missing. Please go back and complete all steps.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Transform data to match API contract
      const projectData = {
        projectName: projectInfo.projectName,
        websiteUrl: projectInfo.companyWebsite,
        description: projectInfo.projectDescription,
        keywords: keywords.map((k) => k.text),
        semanticQueries: semanticQueries.map((q) => q.text),
      };

      // Call the API
      const response = await createProject(projectData);

      console.log("Project created successfully:", response);

      // Navigate to dashboard on success
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
      console.error("Error creating project:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep4Back = () => {
    setCurrentStep(3);
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Create a New Project";
      case 2:
        return "Set Up Your Keywords";
      case 3:
        return ""; // No title for step 3, it has its own heading
      case 4:
        return ""; // No title for step 4, it has its own heading
      default:
        return "Create a New Project";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Start by telling us about your project. This helps our AI find the most relevant leads for you.";
      case 2:
        return "Enter keywords or phrases Rixly should monitor on Reddit. Use our AI to discover related terms.";
      case 3:
        return ""; // No description for step 3
      case 4:
        return ""; // No description for step 4
      default:
        return "";
    }
  };

  const getStepLabel = () => {
    switch (currentStep) {
      case 2:
        return "Keyword Setup";
      case 3:
        return "Semantic Queries";
      case 4:
        return "Preview";
      default:
        return "";
    }
  };

  return (
    <main className="flex flex-1 justify-center py-8 sm:py-12 md:py-16 px-4 relative">
      {/* Close Button - Fixed Position */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate("/dashboard")}
        className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 z-10"
      >
        <X className="w-5 h-5" />
      </Button>

      <div className="flex flex-col w-full max-w-2xl gap-6">
        {/* Progress Indicator */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-6 justify-between">
            <p className="text-neutral-800 dark:text-neutral-200 text-sm font-medium leading-normal">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
          <div className="rounded-full bg-neutral-200 dark:bg-neutral-800 h-2">
            <div
              className="h-2 rounded-full bg-purple-600 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          {getStepLabel() && (
            <p className="text-neutral-500 dark:text-neutral-400 text-sm font-normal leading-normal">
              {getStepLabel()}
            </p>
          )}
        </div>

        {/* Header - Only show for steps 1 and 2 */}
        {currentStep !== 3 && currentStep !== 4 && (
          <div className="flex flex-col gap-2 px-4">
            <p className="text-neutral-900 dark:text-white text-4xl font-bold tracking-tighter">
              {getStepTitle()}
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 text-base font-normal leading-normal">
              {getStepDescription()}
            </p>
          </div>
        )}

        {/* Step Content */}
        {currentStep === 1 && (
          <ProjectInfoStep
            onNext={handleStep1Next}
            onCancel={handleCancel}
            initialData={projectInfo || undefined}
          />
        )}

        {currentStep === 2 && (
          <KeywordSetupStep
            onNext={handleStep2Next}
            onBack={handleStep2Back}
            keywords={keywords}
            onKeywordsChange={setKeywords}
            productDescription={projectInfo?.projectDescription || ""}
          />
        )}

        {currentStep === 3 && (
          <SemanticQueriesStep
            onNext={handleStep3Next}
            onBack={handleStep3Back}
            queries={semanticQueries}
            onQueriesChange={setSemanticQueries}
            productDescription={projectInfo?.projectDescription || ""}
          />
        )}

        {currentStep === 4 && projectInfo && (
          <PreviewProjectStep
            onNext={handleStep4Next}
            onBack={handleStep4Back}
            projectData={{
              projectName: projectInfo.projectName,
              companyWebsite: projectInfo.companyWebsite,
              projectDescription: projectInfo.projectDescription,
              keywords: keywords.map((k) => k.text),
              semanticQueries: semanticQueries.map((q) => q.text),
            }}
            isSubmitting={isSubmitting}
            error={error}
          />
        )}
      </div>
    </main>
  );
}
