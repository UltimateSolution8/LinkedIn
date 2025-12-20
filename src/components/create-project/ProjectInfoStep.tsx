
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { generateDescription } from "@/lib/api/projects";

const projectSchema = z.object({
  projectName: z.string().min(3, "Project name must be at least 3 characters"),
  companyWebsite: z.string().url("Please enter a valid URL"),
  projectDescription: z
    .string()
    .min(20, "Description must be at least 20 characters"),
});

export type ProjectInfoData = z.infer<typeof projectSchema>;

interface ProjectInfoStepProps {
  onNext: (data: ProjectInfoData) => void;
  onCancel: () => void;
  initialData?: Partial<ProjectInfoData>;
}

export default function ProjectInfoStep({
  onNext,
  onCancel,
  initialData,
}: ProjectInfoStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProjectInfoData>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData,
  });

  const companyWebsite = watch("companyWebsite");
  const projectDescription = watch("projectDescription");

  const handleGenerateDescription = async () => {
    if (!companyWebsite) {
      setGenerationError("Please enter a company website first");
      return;
    }

    try {
      const url = new URL(companyWebsite);
      if (!url.protocol.startsWith("http")) {
        setGenerationError("Please enter a valid URL");
        return;
      }
    } catch {
      setGenerationError("Please enter a valid URL");
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await generateDescription({
        applicationUrl: companyWebsite,
      });
      console.log("Data:",response);
      if (response.data.description) {
        setValue("projectDescription", response.data.description, {
          shouldValidate: true,
          shouldDirty: true
        });
      }
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : "Failed to generate description"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
      <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-6 p-6 sm:p-8">
        {/* Project Name */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="project-name"
            className="text-neutral-800 dark:text-neutral-200 text-sm font-medium"
          >
            Project Name
          </Label>
          <Input
            id="project-name"
            type="text"
            placeholder="e.g., Q1 Marketing Campaign"
            {...register("projectName")}
            className="border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus-visible:ring-purple-600/50 focus-visible:border-purple-600/80"
          />
          {errors.projectName && (
            <p className="text-sm text-red-500">{errors.projectName.message}</p>
          )}
        </div>

        {/* Company Website */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="company-website"
            className="text-neutral-800 dark:text-neutral-200 text-sm font-medium"
          >
            Company Website
          </Label>
          <Input
            id="company-website"
            type="url"
            placeholder="e.g., https://www.yourcompany.com"
            {...register("companyWebsite")}
            className="border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus-visible:ring-purple-600/50 focus-visible:border-purple-600/80"
          />
          {errors.companyWebsite && (
            <p className="text-sm text-red-500">{errors.companyWebsite.message}</p>
          )}
        </div>

        {/* Project Description */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="project-description"
              className="text-neutral-800 dark:text-neutral-200 text-sm font-medium"
            >
              Project Description
            </Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleGenerateDescription}
              disabled={isGenerating || !companyWebsite}
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/20 text-xs h-7 px-2 gap-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3" />
                  Generate with AI
                </>
              )}
            </Button>
          </div>
          <textarea
            id="project-description"
            placeholder="Describe what you're looking for, what your company does, and who your target customers are..."
            value={projectDescription || ""}
            onChange={(e) => setValue("projectDescription", e.target.value, { shouldValidate: true, shouldDirty: true })}
            className="flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-neutral-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-purple-600/50 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:border-purple-600/80 min-h-[120px] placeholder:text-neutral-400 dark:placeholder:text-neutral-600 p-4 text-sm font-normal leading-normal"
          />
          {errors.projectDescription && (
            <p className="text-sm text-red-500">{errors.projectDescription.message}</p>
          )}
          {generationError && (
            <p className="text-sm text-red-500">{generationError}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="min-w-[8rem] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="min-w-[8rem] bg-purple-600 hover:bg-purple-700 text-white"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
}
