
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

/**
 * Onboarding page for users with zero projects
 * TODO: This is a placeholder - will be fully implemented in Story 001A
 */
export default function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-900 p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Plus className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
          Create Your First Project
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          Get started with Rixly by creating your first project.
          You'll be able to track leads, identify opportunities, and monitor Reddit activity.
        </p>

        {/* CTA Button */}
        <Button
          onClick={() => navigate("/create-project")}
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Project
        </Button>

        {/* Note */}
        <p className="mt-6 text-xs text-neutral-500 dark:text-neutral-400">
          Note: Full onboarding experience will be available in Story 001A
        </p>
      </div>
    </div>
  );
}
