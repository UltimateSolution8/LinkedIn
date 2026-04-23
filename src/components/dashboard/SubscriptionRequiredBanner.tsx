import { AlertCircle, TrendingUp, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import { PopupButton } from "react-calendly";

interface SubscriptionRequiredBannerProps {
  plans: PricingPlan[];
  onChoosePlan: (plan: PricingPlan, isTrial: boolean) => void;
  processingTrial?: boolean;
  processingPayment?: boolean;
}

export default function SubscriptionRequiredBanner({
  plans,
  onChoosePlan,
  processingTrial = false,
  processingPayment = false
}: SubscriptionRequiredBannerProps) {
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const plan = plans[selectedPlanIndex] || plans[0];
  // const [showTrialDialog, setShowTrialDialog] = useState(false);

  if (!plan) return null;

  /* const handleTrialClick = () => {
    setShowTrialDialog(true);
  };

  const handleTrialConfirm = () => {
    onChoosePlan(plan, true);
  }; */

  const missedOpportunities = [
    { icon: Users, text: "Qualified leads ready to engage" },
    { icon: TrendingUp, text: "High-intent customers searching now" },
    { icon: Clock, text: "Real-time insights from Reddit" }
  ];

  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-red-950/20 border-2 border-orange-300 dark:border-orange-700 overflow-hidden shadow-xl">
      {/* Animated background decoration */}
      <div className="absolute inset-0 bg-grid-orange-500/[0.05] bg-[size:20px_20px] animate-pulse" />

      {/* Urgent indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />

      <div className="relative p-8 md:p-10">
        {/* Alert Icon and Heading */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-neutral-950 dark:text-white mb-2">
              You're Missing Out on Qualified Leads!
            </h2>
            <p className="text-lg text-neutral-700 dark:text-neutral-300 font-medium">
              Activate now to unlock your audience insights and start finding customers
            </p>
          </div>
        </div>

        {/* What you're missing */}
        <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-sm rounded-xl p-6 mb-6 border border-orange-200 dark:border-orange-800">
          <h3 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-4">
            What You're Missing Right Now:
          </h3>
          <div className="space-y-3">
            {missedOpportunities.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Selector */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-3">
            Select Your Plan:
          </p>
          <div className="flex bg-orange-100/50 dark:bg-orange-800/10 p-1.5 rounded-xl w-fit border border-orange-200 dark:border-orange-900/50">
            {plans.slice(0, 2).map((p, index) => {
              const isSelected = selectedPlanIndex === index;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlanIndex(index)}
                  className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    isSelected 
                      ? "bg-white dark:bg-neutral-800 text-orange-600 dark:text-orange-400 shadow-sm"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          {/* Start 7-Day Free Trial Button - Commented out per user request */}
          {/* <Button
            onClick={handleTrialClick}
            disabled={processingTrial || processingPayment}
            size="lg"
            className="w-full sm:flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold px-8 py-7 rounded-xl shadow-xl shadow-orange-600/40 hover:shadow-orange-600/60 transition-all text-lg"
          >
            {processingTrial ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Start 7-Day Free Trial
              </>
            )}
          </Button> */}

          <div className="w-full sm:flex-1">
            <a
              href="https://calendly.com/rixlyleads/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-orange-600/40 hover:shadow-orange-600/60 transition-all text-lg flex items-center justify-center decoration-transparent hover:decoration-transparent"
            >
              Book Demo
            </a>
          </div>

          <Button
            onClick={() => onChoosePlan(plan, false)}
            disabled={processingTrial || processingPayment}
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-2 border-orange-400 dark:border-orange-600 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-950/50 font-semibold px-8 py-7 rounded-xl text-lg"
          >
            {processingPayment ? (
              <>
                <div className="w-5 h-5 border-2 border-orange-700/30 dark:border-orange-300/30 border-t-orange-700 dark:border-t-orange-300 rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Buy Now"
            )}
          </Button>
        </div>

        {/* Pricing info */}
        <div className="text-center sm:text-left" >
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            <span className="font-semibold text-orange-700 dark:text-orange-400">
              Limited time offer:
            </span>{" "}
            {plan.currencySymbol}{plan.currentPrice}/month • Cancel anytime
          </p>
        </div>
      </div>

      {/* Trial Confirmation Dialog - Removed as trial button is replaced by Book Demo */}
      {/* <TrialConfirmationDialog
        open={showTrialDialog}
        onOpenChange={setShowTrialDialog}
        onConfirm={handleTrialConfirm}
        plan={plan}
        isProcessing={processingTrial}
      /> */}
    </div>
  );
}
