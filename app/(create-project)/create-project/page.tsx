"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProjectInfoStep, {
  ProjectInfoData,
} from "@/components/create-project/ProjectInfoStep";
import KeywordSetupStep, { Keyword } from "@/components/create-project/KeywordSetupStep";
import SemanticQueriesStep, {
  SemanticQuery,
} from "@/components/create-project/SemanticQueriesStep";

export default function CreateProjectPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [projectInfo, setProjectInfo] = useState<ProjectInfoData | null>(null);
  const [keywords, setKeywords] = useState<Keyword[]>([
    { id: "1", text: '"UI design tools"', isAIGenerated: false },
    { id: "2", text: "Figma", isAIGenerated: false },
    { id: "3", text: "Webflow vs Framer", isAIGenerated: false },
  ]);
  const [semanticQueries, setSemanticQueries] = useState<SemanticQuery[]>([]);

  const totalSteps = 3; // Changed from 4 to 3
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
    // Complete setup - save all data and navigate to dashboard
    console.log("Project completed:", {
      projectInfo,
      keywords,
      semanticQueries,
    });
    router.push("/dashboard");
  };

  const handleStep3Back = () => {
    setCurrentStep(2);
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Create a New Project";
      case 2:
        return "Set Up Your Keywords";
      case 3:
        return ""; // No title for step 3, it has its own heading
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
      default:
        return "";
    }
  };

  return (
    <main className="flex flex-1 justify-center py-8 sm:py-12 md:py-16 px-4">
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
        {currentStep !== 3 && (
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
          />
        )}

        {currentStep === 3 && (
          <SemanticQueriesStep
            onNext={handleStep3Next}
            onBack={handleStep3Back}
            queries={semanticQueries}
            onQueriesChange={setSemanticQueries}
          />
        )}
      </div>
    </main>
  );
}
