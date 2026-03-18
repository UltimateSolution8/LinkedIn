import { Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type PricingPlan } from "@/lib/api/pricing";

interface TrialConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  plan: PricingPlan;
  isProcessing?: boolean;
}

export default function TrialConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  plan,
  isProcessing = false
}: TrialConfirmationDialogProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-600" />
            Start Your 3-Day Free Trial
          </DialogTitle>
          <DialogDescription className="text-base text-left mt-2">
            Here's what happens next:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* What you get */}
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-semibold">Full access</span> to all Reddit lead tracking features
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-semibold">A small amount will be held as authorization charge</span> by Razorpay (refunded within 5-7 days)
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-semibold">Cancel anytime</span> within 3 days at no charge
              </div>
            </div>
          </div>

          {/* After trial */}
          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3 border border-neutral-200 dark:border-neutral-700">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              After 3 days, you'll be charged <span className="font-semibold">{plan.currencySymbol}{plan.currentPrice}/month</span> unless you cancel.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
            className="flex-1 sm:flex-initial"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 sm:flex-initial bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Proceed to Payment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
