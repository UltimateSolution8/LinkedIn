
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const projectSchema = z.object({
  projectName: z.string().min(3, "Project name must be at least 3 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  businessType: z.enum(["saas", "product", "other"]).refine((val) => val !== undefined, {
    message: "Please select a business type",
  }),
  businessTypeOther: z.string().optional(),
}).refine(
  (data) => {
    if (data.businessType === "other") {
      return data.businessTypeOther && data.businessTypeOther.trim().length > 0;
    }
    return true;
  },
  {
    message: "Please specify the type of your business",
    path: ["businessTypeOther"],
  }
);

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

  const businessType = watch("businessType");

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

        {/* Primary Operating Location */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="location"
            className="text-neutral-800 dark:text-neutral-200 text-sm font-medium"
          >
            Primary Operating Location
          </Label>
          <Input
            id="location"
            type="text"
            placeholder="e.g., San Francisco, CA or United States"
            {...register("location")}
            className="border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus-visible:ring-purple-600/50 focus-visible:border-purple-600/80"
          />
          {errors.location && (
            <p className="text-sm text-red-500">{errors.location.message}</p>
          )}
        </div>

        {/* Type of Business */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="business-type"
            className="text-neutral-800 dark:text-neutral-200 text-sm font-medium"
          >
            Type of Business
          </Label>
          <Select
            value={businessType}
            onValueChange={(value) => setValue("businessType", value as "saas" | "product" | "other", { shouldValidate: true })}
          >
            <SelectTrigger
              id="business-type"
              className="border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:ring-purple-600/50 focus:border-purple-600/80"
            >
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="saas">SaaS</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.businessType && (
            <p className="text-sm text-red-500">{errors.businessType.message}</p>
          )}
        </div>

        {/* Other Business Type (Conditional) */}
        {businessType === "other" && (
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="business-type-other"
              className="text-neutral-800 dark:text-neutral-200 text-sm font-medium"
            >
              Please specify
            </Label>
            <Input
              id="business-type-other"
              type="text"
              placeholder="Describe your business type"
              {...register("businessTypeOther")}
              className="border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus-visible:ring-purple-600/50 focus-visible:border-purple-600/80"
            />
            {errors.businessTypeOther && (
              <p className="text-sm text-red-500">{errors.businessTypeOther.message}</p>
            )}
          </div>
        )}

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
