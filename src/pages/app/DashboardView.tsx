import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useScanningStatus } from "@/hooks/useScanningStatus";
import { useProjectStats } from "@/hooks/useProjectStats";
import EmptyProjectState from "@/components/dashboard/EmptyProjectState";
import ScanningBanner from "@/components/dashboard/ScanningBanner";
import SubscriptionRequiredBanner from "@/components/dashboard/SubscriptionRequiredBanner";
import KPICards from "@/components/dashboard/KPICards";
import ScanningProgressSteps from "@/components/dashboard/ScanningProgressSteps";
import WhileYouWait from "@/components/dashboard/WhileYouWait";
import SubredditPerformanceChart from "@/components/dashboard/SubredditPerformanceChart";
import KeywordPerformanceChart from "@/components/dashboard/KeywordPerformanceChart";
import { getPricingPlans, type PricingPlan, createSubscription as createPricingSubscription, verifySubscriptionPayment, RazorpaySubscriptionResponse } from "@/lib/api/pricing";
import { detectUserCurrency } from "@/lib/utils/geolocation";
import { getSubscriptionStatusCached } from "@/lib/utils/subscription";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDashboardSiteTour } from "@/hooks/useDashboardSiteTour";
import DashboardSiteTour from "@/components/tour/DashboardSiteTour";

/**
 * DashboardView - Stats Dashboard
 *
 * Shows scanning state with progress tracking and onboarding guidance.
 * Displays:
 * - Scanning banner with progress
 * - KPI cards (placeholders during scan)
 * - Onboarding stepper
 * - "While you wait" panel with tips
 * - Subscription banner if no active subscription/trial
 */
export default function DashboardView() {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, isLoading: projectsLoading } = useProject();
  const {
    shouldAutoPrompt,
    markPromptSeen,
    markNotNow,
    markDontShowAgain,
    markTourDismissed,
    markTourCompleted,
  } = useDashboardSiteTour();

  // Fetch dashboard data with auto-polling
  const { data: dashboardData, isLoading: dashboardLoading, error } = useDashboardData({
    projectId: projectId || "",
    enabled: !!projectId
  });

  // Fetch scanning status for initial state
  const {
    data: scanningStatus,
    hasSubscriptionAccess
  } = useScanningStatus({
    projectId: projectId || "",
    enabled: !!projectId
  });

  // State for pricing plans and payment processing
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [processingTrial, setProcessingTrial] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [isTourPromptOpen, setIsTourPromptOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Fetch project stats (only when scanning is completed)
  const isCompleted = scanningStatus?.stage === 'completed';
  const { stats: projectStats, isLoading: statsLoading } = useProjectStats(
    projectId,
    isCompleted
  );

  // Fetch pricing plans if user doesn't have subscription access
  useEffect(() => {
    const fetchPlans = async () => {
      if (hasSubscriptionAccess === false) {
        try {
          const currency = await detectUserCurrency();
          const fetchedPlans = await getPricingPlans(currency);
          setPricingPlans(fetchedPlans);
        } catch (err) {
          console.error("Error fetching pricing plans:", err);
        }
      }
    };

    fetchPlans();
  }, [hasSubscriptionAccess]);

  useEffect(() => {
    if (shouldAutoPrompt) {
      setIsTourPromptOpen(true);
    }
  }, [shouldAutoPrompt]);

  const handleChoosePlan = async (plan: PricingPlan, isTrial: boolean) => {
    try {
      if (isTrial) {
        setProcessingTrial(true);
      } else {
        setProcessingPayment(true);
      }

      const subResponse = await createPricingSubscription({
        planId: plan.id,
        isTrial
      });

      await initializeRazorpay(subResponse, plan);
    } catch (error) {
      console.error("Error initiating payment:", error);
      if (isTrial) {
        setProcessingTrial(false);
      } else {
        setProcessingPayment(false);
      }
    }
  };

  const initializeRazorpay = async (subscriptionData: RazorpaySubscriptionResponse, plan: PricingPlan) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const options = {
        key: subscriptionData.keyId,
        name: "Rixly",
        description: `Payment for ${plan.name} plan`,
        subscription_id: subscriptionData.subscription.vendorSubscriptionId,
        handler: async (response: any) => {
          try {
            await verifySubscriptionPayment({
              razorpaySubscriptionId: response.razorpay_subscription_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            // Refresh subscription status
            await getSubscriptionStatusCached(true);
            // Reload the page to reflect new subscription status
            window.location.reload();
          } catch (error) {
            console.error("Payment verification failed:", error);
          } finally {
            setProcessingTrial(false);
            setProcessingPayment(false);
          }
        },
        theme: { color: "#9333ea" },
        modal: {
          ondismiss: () => {
            setProcessingTrial(false);
            setProcessingPayment(false);
          },
        },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    };
  };

  const startTour = () => {
    markPromptSeen();
    setIsTourPromptOpen(false);
    setIsTourOpen(true);
  };

  const handleTourClose = (completed: boolean) => {
    setIsTourOpen(false);
    if (completed) {
      markTourCompleted();
    } else {
      markTourDismissed();
    }
  };

  // Show empty state if user has no projects
  if (!projectsLoading && projects.length === 0) {
    return (
      <div className="flex flex-1 h-full overflow-x-hidden">
        <div className="flex-1 w-full h-full overflow-y-auto">
          <EmptyProjectState />
        </div>
      </div>
    );
  }

  // Show loading state
  if (dashboardLoading && !dashboardData) {
    return (
      <div className="p-4 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-neutral-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Error loading dashboard: {error}</p>
        </div>
      </div>
    );
  }

  const isScanning = dashboardData?.scanState === "scanning_empty" || dashboardData?.scanState === "scanning_partial";
  const scanProgress = dashboardData?.scanProgress || 0;

  // Determine if we should show scanning progress steps (initial state)
  const showScanningProgress = scanningStatus &&
    (scanningStatus.stage == 'idle' || scanningStatus.stage === 'validating_subreddits' || scanningStatus.stage === 'scoring_leads');

  // Show subscription banner if no access
  if (!hasSubscriptionAccess && pricingPlans.length > 0) {
    return (
      <div className="p-4 lg:p-8">
        <SubscriptionRequiredBanner
          plans={pricingPlans}
          onChoosePlan={handleChoosePlan}
          processingTrial={processingTrial}
          processingPayment={processingPayment}
        />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <div
        data-tour="dashboard"
        className="mb-6 p-4 lg:p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl lg:text-2xl font-semibold text-neutral-900 dark:text-white">Dashboard overview</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Track performance and move quickly across key workflows.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" className="rounded-lg" data-tour="leads">
              <Link to={`/app/${projectId}/leads`}>Leads</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-lg" data-tour="opportunities">
              <Link to={`/app/${projectId}/opportunities`}>Opportunities</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-lg" data-tour="settings">
              <Link to={`/app/${projectId}/settings`}>Settings</Link>
            </Button>
            <Button onClick={startTour} className="rounded-lg bg-primary hover:bg-primary/90 text-white">
              Take a site tour
            </Button>
          </div>
        </div>
      </div>

      {/* Scanning Banner - only show during scanning */}
      {isScanning && dashboardData && (
        <ScanningBanner scanProgress={scanProgress} />
      )}

      {/* KPI Cards */}
      {dashboardData && (
        <KPICards kpis={dashboardData.kpis} isScanning={isScanning} />
      )}

      {/* Main Layout Grid - Scanning Progress Steps + While You Wait */}
      {showScanningProgress && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* LEFT COLUMN: Scanning Progress Steps */}
          <div className="lg:col-span-7">
            <ScanningProgressSteps
              stage={scanningStatus.stage}
              subreddits={scanningStatus.subreddits}
            />
          </div>

          {/* RIGHT COLUMN: While You Wait */}
          <div className="lg:col-span-5">
            <WhileYouWait />
          </div>
        </div>
      )}

      {/* Top Subreddits & Keywords - Show when scanning is completed */}
      {isCompleted && !showScanningProgress && (
        <div className="mt-8">
          {statsLoading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-neutral-500 text-sm">Loading analytics...</p>
            </div>
          ) : projectStats ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Subreddits */}
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Top Subreddits
                </h3>
                <SubredditPerformanceChart data={projectStats.topSubreddits} />
              </div>

              {/* Top Keywords */}
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Top Keywords
                </h3>
                <KeywordPerformanceChart data={projectStats.topKeywords} />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32">
              <p className="text-neutral-500 text-sm">No analytics data available yet</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={isTourPromptOpen} onOpenChange={setIsTourPromptOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Quick dashboard tour</DialogTitle>
            <DialogDescription>
              See a short walkthrough of Dashboard, Leads, Opportunities, and Settings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                markDontShowAgain();
                setIsTourPromptOpen(false);
              }}
            >
              Don&apos;t show again
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                markNotNow();
                setIsTourPromptOpen(false);
              }}
            >
              Not now
            </Button>
            <Button onClick={startTour} className="bg-primary hover:bg-primary/90 text-white">
              Take a site tour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DashboardSiteTour isOpen={isTourOpen} onClose={handleTourClose} />
    </div>
  );
}
