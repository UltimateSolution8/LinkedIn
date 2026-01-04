import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Globe, Sparkles, X, Loader2 } from "lucide-react";
import { generateDescription, generateProductInsights } from "@/lib/api/projects";

const projectDetailsSchema = z.object({
  websiteUrl: z.string().url("Please enter a valid URL"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  targetAudience: z.array(z.string()).min(1, "Add at least one target audience segment"),
  valuePropositions: z.array(z.string()).min(1, "Add at least one value proposition"),
});

export type ProjectDetailsData = z.infer<typeof projectDetailsSchema>;

interface ProjectDetailsStepProps {
  onNext: (data: ProjectDetailsData) => void;
  onBack: () => void;
  initialData?: Partial<ProjectDetailsData>;
}

export default function ProjectDetailsStep({
  onNext,
  onBack,
  initialData,
}: ProjectDetailsStepProps) {
  const [targetAudienceInput, setTargetAudienceInput] = useState("");
  const [valuePropositionInput, setValuePropositionInput] = useState("");
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProjectDetailsData>({
    resolver: zodResolver(projectDetailsSchema),
    defaultValues: {
      targetAudience: initialData?.targetAudience || [],
      valuePropositions: initialData?.valuePropositions || [],
      ...initialData,
    },
  });

  const targetAudience = watch("targetAudience") || [];
  const valuePropositions = watch("valuePropositions") || [];
  const websiteUrl = watch("websiteUrl");
  const description = watch("description");

  // Helper function to check if URL is valid
  const isValidUrl = (url: string): boolean => {
    if (!url || url.trim().length === 0) return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleGenerateDescription = async () => {
    if (!websiteUrl) {
      setDescriptionError("Please enter a website URL first");
      return;
    }

    // Validate URL format
    try {
      const url = new URL(websiteUrl);
      if (!url.protocol.startsWith("http")) {
        setDescriptionError("Please enter a valid URL");
        return;
      }
    } catch {
      setDescriptionError("Please enter a valid URL");
      return;
    }

    setIsGeneratingDescription(true);
    setDescriptionError(null);

    try {
      const response = await generateDescription({
        applicationUrl: websiteUrl,
      });
      console.log("Generated description:", response);
      if (response.data.description) {
        setValue("description", response.data.description, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    } catch (error) {
      setDescriptionError(
        error instanceof Error ? error.message : "Failed to generate description"
      );
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleGenerateInsights = async () => {
    if (!description || description.trim().length < 10) {
      setInsightsError("Please enter a product description first (minimum 10 characters)");
      return;
    }

    setIsGeneratingInsights(true);
    setInsightsError(null);

    try {
      const response = await generateProductInsights({
        productDescription: description,
      });
      console.log("Generated insights:", response);

      // Populate target audience from API
      if (response.data.targetAudience && response.data.targetAudience.length > 0) {
        setValue("targetAudience", response.data.targetAudience, {
          shouldValidate: true,
        });
      }

      // Populate value propositions from API
      if (response.data.valuePropositions && response.data.valuePropositions.length > 0) {
        setValue("valuePropositions", response.data.valuePropositions, {
          shouldValidate: true,
        });
      }
    } catch (error) {
      setInsightsError(
        error instanceof Error ? error.message : "Failed to generate product insights"
      );
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const handleAddTargetAudience = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && targetAudienceInput.trim()) {
      e.preventDefault();
      setValue("targetAudience", [...targetAudience, targetAudienceInput.trim()], {
        shouldValidate: true,
      });
      setTargetAudienceInput("");
    }
  };

  const handleRemoveTargetAudience = (index: number) => {
    setValue(
      "targetAudience",
      targetAudience.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  const handleAddValueProposition = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && valuePropositionInput.trim()) {
      e.preventDefault();
      setValue("valuePropositions", [...valuePropositions, valuePropositionInput.trim()], {
        shouldValidate: true,
      });
      setValuePropositionInput("");
    }
  };

  const handleRemoveValueProposition = (index: number) => {
    setValue(
      "valuePropositions",
      valuePropositions.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  return (
    <div className="flex flex-col gap-4 px-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <p className="text-neutral-900 dark:text-white text-3xl sm:text-4xl font-bold tracking-tighter">
          Project Details
        </p>
        <p className="text-neutral-600 dark:text-neutral-400 text-base font-normal leading-normal">
          Provide detailed information so our AI can understand your offering and target the right audience.
        </p>
      </div>

      {/* Form */}
      <div className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
        <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-6 p-6 sm:p-8">
          {/* Project Website URL */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="website-url"
              className="text-neutral-800 dark:text-neutral-200 text-sm font-medium"
            >
              Project Website URL
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Globe className="w-4 h-4 text-neutral-400" />
              </div>
              <Input
                id="website-url"
                type="url"
                placeholder="https://www.yourproject.com"
                {...register("websiteUrl")}
                className="pl-10 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus-visible:ring-purple-600/50 focus-visible:border-purple-600/80"
              />
            </div>
            {errors.websiteUrl && (
              <p className="text-sm text-red-500">{errors.websiteUrl.message}</p>
            )}
          </div>

          {/* Project Description */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <Label
                htmlFor="description"
                className="text-neutral-800 dark:text-neutral-200 text-sm font-medium"
              >
                Project Description
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleGenerateDescription}
                disabled={isGeneratingDescription || !isValidUrl(websiteUrl)}
                className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/20 text-xs h-7 px-2 gap-1 disabled:opacity-50"
              >
                {isGeneratingDescription ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3" />
                    AI Generate
                  </>
                )}
              </Button>
            </div>
            <textarea
              id="description"
              placeholder="Describe your product or service, its key features, and unique value proposition..."
              {...register("description")}
              className="flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-neutral-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-purple-600/50 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:border-purple-600/80 min-h-[120px] placeholder:text-neutral-400 dark:placeholder:text-neutral-600 p-4 text-sm font-normal leading-normal"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
            {descriptionError && (
              <p className="text-sm text-red-500">{descriptionError}</p>
            )}
          </div>

          {/* Common AI Generate Button for Target Audience and Value Propositions */}
          <div className="flex items-center justify-between gap-4 py-2 px-4 bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800 rounded-lg">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                AI-Powered Analysis
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Generate target audience and value propositions from your description
              </p>
            </div>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleGenerateInsights}
              disabled={isGeneratingInsights || !description || description.trim().length < 20}
              className="text-white bg-teal-600 hover:bg-teal-700 text-xs h-8 px-3 gap-1.5 disabled:opacity-50 shadow-sm"
            >
              {isGeneratingInsights ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Generate
                </>
              )}
            </Button>
          </div>
          {insightsError && (
            <p className="text-sm text-red-500 -mt-2">{insightsError}</p>
          )}

          {/* Target Audience */}
          <div className="flex flex-col gap-2">
            <Label className="text-neutral-800 dark:text-neutral-200 text-sm font-medium">
              Target Audience
            </Label>
            <div className="flex flex-col gap-3 p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus-within:ring-2 focus-within:ring-purple-600/50 focus-within:border-purple-600/80 transition-all">
              {/* Display added segments */}
              {targetAudience.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {targetAudience.map((segment, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium border border-neutral-200 dark:border-neutral-700"
                    >
                      {segment}
                      <button
                        type="button"
                        onClick={() => handleRemoveTargetAudience(index)}
                        className="hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {/* Input for new segment */}
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={targetAudienceInput}
                  onChange={(e) => setTargetAudienceInput(e.target.value)}
                  onKeyDown={handleAddTargetAudience}
                  placeholder="Add a segment (e.g., SaaS Founders) - Press Enter"
                  className="border-none shadow-none focus-visible:ring-0 p-0 h-auto text-sm"
                />
              </div>
            </div>
            {errors.targetAudience && (
              <p className="text-sm text-red-500">{errors.targetAudience.message}</p>
            )}
          </div>

          {/* Value Propositions */}
          <div className="flex flex-col gap-2">
            <Label className="text-neutral-800 dark:text-neutral-200 text-sm font-medium">
              Value Propositions
            </Label>
            <div className="flex flex-col gap-3 p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus-within:ring-2 focus-within:ring-purple-600/50 focus-within:border-purple-600/80 transition-all">
              {/* Display added value propositions */}
              {valuePropositions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {valuePropositions.map((valueProposition, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium border border-neutral-200 dark:border-neutral-700"
                    >
                      {valueProposition}
                      <button
                        type="button"
                        onClick={() => handleRemoveValueProposition(index)}
                        className="hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-neutral-400 italic py-1">
                  No value propositions added yet...
                </span>
              )}
              {/* Input for new value proposition */}
              <div className="flex items-center gap-2 border-t border-neutral-100 dark:border-neutral-800 pt-2 mt-1">
                <Input
                  type="text"
                  value={valuePropositionInput}
                  onChange={(e) => setValuePropositionInput(e.target.value)}
                  onKeyDown={handleAddValueProposition}
                  placeholder="Add a value proposition (e.g., Saves 10+ hours weekly) - Press Enter"
                  className="border-none shadow-none focus-visible:ring-0 p-0 h-auto text-sm"
                />
              </div>
            </div>
            {errors.valuePropositions && (
              <p className="text-sm text-red-500">{errors.valuePropositions.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 pt-6 mt-2 border-t border-neutral-200 dark:border-neutral-800">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="min-w-[7rem] border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="min-w-[7rem] bg-purple-600 hover:bg-purple-700 text-white"
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
