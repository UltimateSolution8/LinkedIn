
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink, Plus } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FindPostsTab from "@/components/dashboard/FindPostsTab";
import FindLeadsTab from "@/components/dashboard/FindLeadsTab";
import SettingsTab from "@/components/dashboard/SettingsTab";
// import SyncStatusTimer from "@/components/dashboard/SyncStatusTimer"; // Hidden for now
import EmptyProjectState from "@/components/dashboard/EmptyProjectState";
import TrialActivationBanner from "@/components/dashboard/TrialActivationBanner";
import { useProject } from "@/contexts/ProjectContext";
import { getCurrentUser } from "@/lib/api/auth";
import BlurredLeads from "@/components/dashboard/BlurredLeads";
import { getPricingPlans, createSubscription, verifySubscriptionPayment, type PricingPlan, RazorpaySubscriptionResponse } from "@/lib/api/pricing";
import { detectUserCurrency } from "@/lib/utils/geolocation";
import { getSubscriptionStatusCached, checkSubscriptionAccess } from "@/lib/utils/subscription";
import PaymentStatusModal from "@/components/pricing/PaymentStatusModal";
import { useEffect } from "react";



export default function DashboardPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"posts" | "leads" | "settings">("posts");
  const { selectedProjectId, setSelectedProjectId, getProjectById, projects, isLoading } = useProject();
  const [postsCount, setPostsCount] = useState(0);
  const [leadsCount, setLeadsCount] = useState(0);

  // Trial banner state
  const [showTrialBanner, setShowTrialBanner] = useState(false);

  // Subscription state
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isProcessingTrial, setIsProcessingTrial] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    status: "success" | "error" | "loading";
    title?: string;
    message?: string;
  }>({
    isOpen: false,
    status: "loading",
  });

  // Check if user is admin
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  const project = selectedProjectId ? getProjectById(selectedProjectId) : null;

  // Plan-based project limit (default 2 for backward compatibility)
  const [maxProjects, setMaxProjects] = useState(2);
  const isCreateButtonDisabled = !isAdmin && projects.length >= maxProjects;

  const getProjectInitial = (projectName: string) => {
    return projectName.charAt(0).toUpperCase();
  };

  const handleCreateProject = () => {
    if (!isCreateButtonDisabled) {
      navigate("/create-project");
    }
  };

  // Check subscription status and fetch plans if needed
  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Admin bypass - no need to check subscription
        if (isAdmin) {
          setHasAccess(true);
          return;
        }

        const hasAccess = await checkSubscriptionAccess();
        setHasAccess(hasAccess);

        // Get plan limits for project cap
        try {
          const subStatus = await getSubscriptionStatusCached();
          if (subStatus?.subscription?.planDetails?.maxProjects) {
            setMaxProjects(subStatus.subscription.planDetails.maxProjects);
          }
        } catch { /* keep default */ }

        if (!hasAccess) {
          const currency = await detectUserCurrency();
          const fetchedPlans = await getPricingPlans(currency);
          setPlans(fetchedPlans);

          // Check if we should show trial banner
          const shouldShowBanner = searchParams.get('showTrialBanner') === 'true';
          if (shouldShowBanner) {
            setShowTrialBanner(true);
            // Remove query param from URL
            searchParams.delete('showTrialBanner');
            setSearchParams(searchParams, { replace: true });
          }
        }
      } catch (err) {
        console.error("Error checking access in Dashboard:", err);
        setHasAccess(false);
      }
    };

    checkAccess();
  }, [isAdmin, searchParams, setSearchParams]);

  const handleChoosePlan = async (plan: PricingPlan, isTrial: boolean) => {
    try {
      // Set processing state based on which button was clicked
      if (isTrial) {
        setIsProcessingTrial(true);
      } else {
        setIsProcessingPayment(true);
      }

      const subResponse = await createSubscription({
        planId: plan.id,
        isTrial
      });

      await initializeRazorpay(subResponse, plan, isTrial);
    } catch (error) {
      console.error("Error initiating payment:", error);
      setPaymentModal({
        isOpen: true,
        status: "error",
        title: isTrial ? "Trial Error" : "Payment Error",
        message: error instanceof Error ? error.message : "Failed to initiate payment.",
      });
      // Reset the appropriate processing state
      if (isTrial) {
        setIsProcessingTrial(false);
      } else {
        setIsProcessingPayment(false);
      }
    }
  };

  const initializeRazorpay = async (subscriptionData: RazorpaySubscriptionResponse, plan: PricingPlan, isTrial: boolean) => {
    console.log(`[DashboardPage] Initializing ${isTrial ? 'trial' : 'standard'} payment`);
    // Load script
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
            setPaymentModal({ isOpen: true, status: "loading", title: "Verifying", message: "Verifying payment..." });
            const verification = await verifySubscriptionPayment({
              razorpaySubscriptionId: response.razorpay_subscription_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verification.success) {
              setPaymentModal({
                isOpen: true,
                status: "success",
                title: "Payment Successful!",
                message: "Your subscription is now active."
              });
              // Refresh access locally
              setHasAccess(true);
              setShowTrialBanner(false); // Hide trial banner
              getSubscriptionStatusCached(true); // Background refresh
            } else {
              setPaymentModal({ isOpen: true, status: "error", title: "Verification Failed", message: "Could not verify payment." });
            }
          } catch (error) {
            setPaymentModal({ isOpen: true, status: "error", title: "Verification Failed", message: "An error occurred." });
          } finally {
            setIsProcessingTrial(false);
            setIsProcessingPayment(false);
          }
        },
        theme: { color: "#9333ea" },
        modal: {
          ondismiss: () => {
            setIsProcessingTrial(false);
            setIsProcessingPayment(false);
            setPaymentModal({ isOpen: false, status: "error" });
          },
        },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    };
  };

  // Show empty state if user has no projects
  if (!isLoading && projects.length === 0) {
    return (
      <div className="flex flex-1 h-full overflow-x-hidden">
        <div className="flex-1 w-full h-full overflow-y-auto">
          <EmptyProjectState />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-full overflow-x-hidden">
      <div className="flex-1 w-full h-full overflow-y-auto">
        <div className="p-4 lg:p-8">
          {/* Mobile Project Selector - Only visible on mobile */}
          <div className="lg:hidden mb-4 -mx-4 px-4 bg-white dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800 pb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Your Projects
              </h2>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
              {isLoading ? (
                <div className="flex-shrink-0 px-4 py-2 text-sm text-neutral-500 dark:text-neutral-400">
                  Loading projects...
                </div>
              ) : projects.length === 0 ? (
                <div className="flex-shrink-0 px-4 py-2 text-sm text-neutral-500 dark:text-neutral-400">
                  No projects yet
                </div>
              ) : (
                <>
                  {projects.map((proj) => {
                    const isActive = proj._id === selectedProjectId;
                    return (
                      <button
                        key={proj._id}
                        onClick={() => setSelectedProjectId(proj._id)}
                        className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isActive
                          ? "bg-teal-100 dark:bg-neutral-800 border border-teal-600/20 dark:border-teal-600/40"
                          : "bg-neutral-50 dark:bg-neutral-800 border border-transparent opacity-60 hover:opacity-100"
                          }`}
                      >
                        <Avatar className="h-6 w-6 flex-shrink-0">
                          <AvatarFallback
                            className={`text-xs font-bold ${isActive
                              ? "bg-teal-600 text-white"
                              : "bg-neutral-200 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-300"
                              }`}
                          >
                            {getProjectInitial(proj.projectName)}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className={`text-sm font-medium whitespace-nowrap ${isActive
                            ? "text-teal-600 dark:text-teal-400"
                            : "text-neutral-950 dark:text-neutral-300"
                            }`}
                        >
                          {proj.projectName}
                        </span>
                      </button>
                    );
                  })}
                  <button
                    onClick={handleCreateProject}
                    disabled={isCreateButtonDisabled}
                    className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isCreateButtonDisabled
                      ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                      : "bg-neutral-100 dark:bg-neutral-800 text-teal-600 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      }`}
                    title={
                      isAdmin
                        ? "Create new project (Admin - Unlimited)"
                        : isCreateButtonDisabled
                          ? `Max ${maxProjects} projects`
                          : "Create new project"
                    }
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Project Header - Hidden on mobile, shown on desktop */}
          {project && (
            <div className="hidden lg:block mb-8 space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-neutral-950 dark:text-white">
                  {project.projectName}
                </h1>
                {project.websiteUrl && (
                  <a
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
              {project.description && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {project.description}
                </p>
              )}
            </div>
          )}

          {/* Timer - Hidden for now */}
          {/* <div className="mb-4 flex justify-center lg:justify-start">
            <SyncStatusTimer />
          </div> */}

          {/* Trial Activation Banner */}
          {showTrialBanner && !hasAccess && plans.length > 0 && (
            <TrialActivationBanner
              plans={plans}
              onChoosePlan={handleChoosePlan}
              onDismiss={() => setShowTrialBanner(false)}
              processingTrial={isProcessingTrial}
              processingPayment={isProcessingPayment}
            />
          )}

          {/* Tabs Navigation */}
          <div className="pb-6 overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
            <div className="flex gap-1 lg:gap-3 p-1 lg:p-2 bg-neutral-100 dark:bg-neutral-800 rounded-full lg:rounded-xl min-w-full lg:w-fit">
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex-1 lg:flex-initial flex items-center justify-center gap-1 lg:gap-2 px-3 lg:px-6 py-2 lg:py-3 rounded-full lg:rounded-lg transition-all duration-300 ease-in-out ${activeTab === "posts"
                  ? "bg-white dark:bg-neutral-900 text-teal-600 shadow-sm"
                  : "bg-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  }`}
              >
                <p className="text-xs lg:text-sm font-bold lg:font-semibold leading-normal tracking-[0.015em]">Find Posts</p>
                {postsCount > 0 && (
                  <Badge className={`text-[10px] lg:text-xs px-1.5 lg:px-2 h-5 ${activeTab === "posts"
                    ? "bg-teal-600 text-white hover:bg-teal-600"
                    : "bg-teal-600/10 dark:bg-teal-600/20 text-teal-600 dark:text-teal-400 hover:bg-teal-600/10"
                    }`}>
                    {postsCount}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => setActiveTab("leads")}
                className={`flex-1 lg:flex-initial flex items-center justify-center gap-1 lg:gap-2 px-3 lg:px-6 py-2 lg:py-3 rounded-full lg:rounded-lg transition-all duration-300 ease-in-out ${activeTab === "leads"
                  ? "bg-white dark:bg-neutral-900 text-teal-600 shadow-sm"
                  : "bg-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  }`}
              >
                <p className="text-xs lg:text-sm font-bold lg:font-semibold leading-normal tracking-[0.015em]">Find Leads</p>
                {leadsCount > 0 && (
                  <Badge className={`text-[10px] lg:text-xs px-1.5 lg:px-2 h-5 ${activeTab === "leads"
                    ? "bg-teal-600 text-white hover:bg-teal-600"
                    : "bg-teal-600/10 dark:bg-teal-600/20 text-teal-600 dark:text-teal-400 hover:bg-teal-600/10"
                    }`}>
                    {leadsCount}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex-1 lg:flex-initial flex items-center justify-center gap-1 lg:gap-2 px-3 lg:px-6 py-2 lg:py-3 rounded-full lg:rounded-lg transition-all duration-300 ease-in-out ${activeTab === "settings"
                  ? "bg-white dark:bg-neutral-900 text-teal-600 shadow-sm"
                  : "bg-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  }`}
              >
                <p className="text-xs lg:text-sm font-bold lg:font-semibold leading-normal tracking-[0.015em]">Settings</p>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {hasAccess === false ? (
            <BlurredLeads
              plans={plans}
              onChoosePlan={handleChoosePlan}
              processing={isProcessingTrial || isProcessingPayment}
            />
          ) : (
            <>
              {activeTab === "posts" && selectedProjectId && (
                <FindPostsTab projectId={selectedProjectId} onCountChange={setPostsCount} />
              )}
              {activeTab === "leads" && selectedProjectId && (
                <FindLeadsTab projectId={selectedProjectId} onCountChange={setLeadsCount} />
              )}
              {activeTab === "settings" && selectedProjectId && (
                <SettingsTab projectId={selectedProjectId} />
              )}
            </>
          )}
        </div>
      </div>

      <PaymentStatusModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ ...paymentModal, isOpen: false })}
        status={paymentModal.status}
        title={paymentModal.title}
        message={paymentModal.message}
        onContinue={() => setPaymentModal({ ...paymentModal, isOpen: false })}
      />
    </div>
  );
}
