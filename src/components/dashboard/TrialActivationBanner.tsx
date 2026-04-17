import { X, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type PricingPlan } from "@/lib/api/pricing";
import { useAuth } from "@/contexts/AuthContext";
import { PopupButton } from "react-calendly";

interface TrialActivationBannerProps {
  plans: PricingPlan[];
  onChoosePlan: (plan: PricingPlan, isTrial: boolean) => void;
  onDismiss: () => void;
  processingTrial?: boolean;
  processingPayment?: boolean;
}

export default function TrialActivationBanner({
  plans,
  onChoosePlan,
  onDismiss,
  processingTrial = false,
  processingPayment = false
}: TrialActivationBannerProps) {
  const { user } = useAuth();
  const plan = plans[0]; // Use first plan

  if (!plan) return null;

  const features = [
    "Unlimited leads",
    "2 projects",
    "Email alerts"
  ];

  return (
    <div className="relative mb-6 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950/30 dark:to-teal-900/20 border-2 border-teal-200 dark:border-teal-800 overflow-hidden shadow-lg max-h-[40vh]">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-teal-500/[0.03] bg-[size:20px_20px]" />

      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/80 dark:bg-neutral-800/80 hover:bg-white dark:hover:bg-neutral-800 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
      </button>

      <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left side - Content */}
        <div className="flex-1 text-center md:text-left space-y-3">
          {/* Icon and heading */}
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">
              Project Created!
            </h2>
          </div>

          {/* Subheading */}
          <p className="text-neutral-700 dark:text-neutral-300 text-base font-medium">
            Now let's find your first lead
          </p>

          {/* Description */}
          <p className="text-neutral-600 dark:text-neutral-400 text-sm max-w-md">
            Book a demo to learn how to discover high-intent leads on Reddit
          </p>

          {/* Features */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-1.5 text-sm">
                <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - CTAs */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Start Free Trial Button - Commented out per user request */}
          {/* <Button
            onClick={() => onChoosePlan(plan, true)}
            disabled={processingTrial || processingPayment}
            size="lg"
            className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-6 rounded-xl shadow-lg shadow-teal-600/30 hover:shadow-teal-600/40 transition-all text-base"
          >
            {processingTrial ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Start Free Trial
              </>
            )}
          </Button> */}

          <div className="w-full sm:w-auto">
            <PopupButton
              url="https://calendly.com/rixlyleads/30min"
              rootElement={document.getElementById("root")!}
              text="Book Demo"
              className="w-full h-full bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-teal-600/30 hover:shadow-teal-600/40 transition-all text-base flex items-center justify-center"
              prefill={{
                email: user?.email || "",
                name: user ? `${user.firstName} ${user.lastName}` : "",
              }}
            />
          </div>

          <Button
            onClick={() => onChoosePlan(plan, false)}
            disabled={processingTrial || processingPayment}
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-2 border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/50 font-semibold px-8 py-6 rounded-xl text-base"
          >
            {processingPayment ? (
              <>
                <div className="w-4 h-4 border-2 border-teal-700/30 dark:border-teal-300/30 border-t-teal-700 dark:border-t-teal-300 rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Pay Now"
            )}
          </Button>
        </div>
      </div>

      {/* Pricing info */}
      <div className="relative px-6 md:px-8 pb-4 text-center md:text-left">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {plan.currencySymbol}{plan.currentPrice}/month • Cancel anytime
        </p>
      </div>
    </div>
  );
}
