import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface ProductDescriptionWarningDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
  descriptionLength: number;
  minLength: number;
}

export default function ProductDescriptionWarningDialog({
  isOpen,
  onOpenChange,
  onContinue,
  descriptionLength,
  minLength,
}: ProductDescriptionWarningDialogProps) {
  const isTooShort = descriptionLength < minLength;

  const handleContinue = () => {
    onContinue();
    onOpenChange(false);
  };

  const handleReview = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                isTooShort
                  ? "bg-amber-100 dark:bg-amber-900/20"
                  : "bg-blue-100 dark:bg-blue-900/20"
              }`}
            >
              {isTooShort ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-left text-lg">
                {isTooShort
                  ? "Let's Improve Your Product Description"
                  : "Please Verify Your Product Description"}
              </DialogTitle>
              <DialogDescription className="text-left mt-1.5">
                {isTooShort
                  ? "A detailed description helps us find better leads"
                  : "Ensure accuracy before generating insights"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {isTooShort ? (
            <>
              {/* Too Short Warning */}
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">
                  Your product description is currently{" "}
                  <span className="font-semibold text-amber-700 dark:text-amber-400">
                    too brief ({descriptionLength} characters)
                  </span>
                  .
                </p>
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  A detailed description is <strong>crucial for accurate lead discovery</strong>.
                  The better we understand your product, the more relevant leads we can find for
                  you.
                </p>
              </div>

              {/* Suggestions */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  Please add more details about:
                </p>
                <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 dark:text-purple-400 mt-0.5">•</span>
                    <span>What specific services or products do you offer?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 dark:text-purple-400 mt-0.5">•</span>
                    <span>Who are your primary customers or users?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 dark:text-purple-400 mt-0.5">•</span>
                    <span>What problems does your solution solve?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 dark:text-purple-400 mt-0.5">•</span>
                    <span>What makes your offering unique?</span>
                  </li>
                </ul>
              </div>

              {/* Minimum Length Recommendation */}
              <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-3">
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    Recommendation:
                  </span>{" "}
                  Aim for at least {minLength} characters for best results. Currently:{" "}
                  {descriptionLength}/{minLength}
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Adequate Length but Verification Needed */}
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">
                  Before we generate insights, please take a moment to review your product
                  description.
                </p>
                <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-md p-3 mt-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Important:</strong> Our AI-generated descriptions may not be 100%
                    accurate. The quality of lead discovery directly depends on how accurately your
                    description represents your product.
                  </p>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  Make sure your description clearly explains:
                </p>
                <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                    <span>What you offer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                    <span>Who you serve</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                    <span>Your unique value</span>
                  </li>
                </ul>
              </div>

              {/* Character Count Display */}
              <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-3">
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Your current description ({descriptionLength} characters) will be used to find
                  relevant leads.
                </p>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="sm:space-x-2">
          <Button
            variant="outline"
            onClick={handleReview}
            className="border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            {isTooShort ? "Add More Details" : "Review & Improve"}
          </Button>
          <Button
            onClick={handleContinue}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Continue with AI Generation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
