
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPricingPlans, createSubscription, verifySubscriptionPayment, type PricingPlan, RazorpaySubscriptionResponse } from "@/lib/api/pricing";
import PaymentStatusModal from "@/components/pricing/PaymentStatusModal";
import AuthDialog from "@/components/pricing/AuthDialog";
// import RequestDemoDialog from "@/components/shared/RequestDemoDialog";
import { detectUserCurrency } from "@/lib/utils/geolocation";
import { getSubscriptionStatusCached } from "@/lib/utils/subscription";
import { type SubscriptionStatus } from "@/lib/api/subscription";
import { getCurrentUser, logout } from "@/lib/api/auth";
import PricingCard from "@/components/pricing/PricingCard";
import { useCalendlyEventListener } from "react-calendly";

// Declare Razorpay types for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function AuthPricingPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  // const [requestDemoDialogOpen, setRequestDemoDialogOpen] = useState(false);
  const [selectedPlan, _setSelectedPlan] = useState<PricingPlan | null>(null);
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    status: "success" | "error" | "loading";
    title?: string;
    message?: string;
  }>({
    isOpen: false,
    status: "loading",
  });

  // Listen to booking events
  useCalendlyEventListener({
    onEventScheduled: (e) => {
      console.log("Calendly Event Scheduled (Auth):", e.data.payload);
      // Backend webhook will handle persistence
    },
  });

  // Check email verification and subscription status on mount
  useEffect(() => {
    const checkUserAccess = async () => {
      try {
        setCheckingSubscription(true);
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
          // Check if email is verified first
          const currentUser = getCurrentUser();
          if (currentUser && !currentUser.isEmailVerified) {
            navigate("/verify-email-prompt");
            return;
          }

          // Then check subscription status
          const status = await getSubscriptionStatusCached();
          setSubscriptionStatus(status);

          // [PROD-KEEP] Automatic redirect if user already has access (Avoids double-subscribing)
          if (status.hasActiveSubscription) {
            navigate("/dashboard");
          }
        }
      } catch (error) {
        console.error("Error checking user access:", error);
      } finally {
        setCheckingSubscription(false);
      }
    };

    checkUserAccess();
  }, [navigate]);

  // Auto-detect currency and fetch pricing plans on mount
  useEffect(() => {
    const initializePricing = async () => {
      try {
        setLoading(true);
        const detectedCurrency = await detectUserCurrency();
        console.log("Detected Currency:", detectedCurrency);
        const fetchedPlans = await getPricingPlans(detectedCurrency);
        setPlans(fetchedPlans);
      } catch (error) {
        console.error("Error fetching pricing plans:", error);
        setPlans(getDefaultPlans("INR"));
      } finally {
        setLoading(false);
      }
    };

    initializePricing();
  }, []); // Run once on mount

  const handleChoosePlan = async (plan: PricingPlan, isTrial: boolean = false) => {
    try {
      setProcessing(true);

      // Check if email is verified
      const currentUser = getCurrentUser();
      if (currentUser && !currentUser.isEmailVerified) {
        navigate("/verify-email-prompt");
        return;
      }

      // Create subscription (with trial flag if applicable)
      const subscriptionData = await createSubscription({
        planId: plan.id,
        isTrial
      });

      // Initialize Razorpay checkout
      await initializeRazorpayPayment(subscriptionData, plan, isTrial);
    } catch (error) {
      console.error("Error initiating payment:", error);
      setPaymentModal({
        isOpen: true,
        status: "error",
        title: isTrial ? "Trial Error" : "Payment Error",
        message: error instanceof Error ? error.message : "Failed to initiate payment. Please try again.",
      });
      setProcessing(false);
    }
  };

  const handleAuthSuccess = async () => {
    // Close the auth dialog
    setAuthDialogOpen(false);

    // If there's a selected plan, proceed with payment
    if (selectedPlan) {
      try {
        setProcessing(true);

        // Check if email is verified
        const currentUser = getCurrentUser();
        if (currentUser && !currentUser.isEmailVerified) {
          navigate("/verify-email-prompt");
          return;
        }

        // Create subscription
        const subscriptionData = await createSubscription({
          planId: selectedPlan.id
        });

        // Initialize Razorpay checkout
        await initializeRazorpayPayment(subscriptionData, selectedPlan, false);
      } catch (error) {
        console.error("Error initiating payment:", error);
        setPaymentModal({
          isOpen: true,
          status: "error",
          title: "Payment Error",
          message: error instanceof Error ? error.message : "Failed to initiate payment. Please try again.",
        });
        setProcessing(false);
      }
    }
  };

  const handleCloseModal = () => {
    setPaymentModal({ ...paymentModal, isOpen: false });
    setProcessing(false);
  };

  const handleContinueToDashboard = async () => {
    setPaymentModal({ ...paymentModal, isOpen: false });
    // Force refresh subscription status to get latest data after payment
    try {
      await getSubscriptionStatusCached(true);
    } catch (error) {
      console.error("Error refreshing subscription status:", error);
    }
    // Small delay to ensure subscription is fully saved and cached
    await new Promise(resolve => setTimeout(resolve, 500));
    navigate("/dashboard");
  };

  const initializeRazorpayPayment = async (subscriptionData: RazorpaySubscriptionResponse, plan: PricingPlan, isTrial: boolean = false) => {
    console.log(`[AuthPricingPage] Initializing ${isTrial ? 'trial' : 'standard'} payment for plan: ${plan.id}`);

    // [PROD-CODE] In production, delete the entire block below to enable real Razorpay.

    // [PROD-REMOVE] LOCAL DEVELOPMENT BYPASS. 
    // if (subscriptionData.subscription.vendorSubscriptionId.startsWith('sub_MOCK_')) {
    //   console.log('[AuthPricingPage] Detected MOCK subscription, bypassing Razorpay modal...');
    //   showPaymentModal(
    //     "success",
    //     "Trial Started!",
    //     "Your mock trial has been activated for local testing."
    //   );
    //   return;
    // }

    // Load Razorpay script dynamically
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
            showPaymentModal("loading", "Verifying Payment", "Please wait while we verify your payment...");
            const verification = await verifySubscriptionPayment({
              razorpaySubscriptionId: response.razorpay_subscription_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verification.success) {
              showPaymentModal(
                "success",
                "Payment Successful!",
                "Your subscription is now active. Welcome to Rixly!"
              );
              // Don't auto-redirect - let user click the button
              // This ensures subscription is fully saved before redirect
            } else {
              showPaymentModal(
                "error",
                "Payment Verification Failed",
                "We couldn't verify your payment. Please contact support if you've been charged."
              );
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            showPaymentModal(
              "error",
              "Payment Verification Failed",
              error instanceof Error
                ? error.message
                : "Payment verification failed. Please contact support if you've been charged."
            );
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          // You can prefill user details if available
        },
        theme: {
          color: "#9333ea",
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            // Show error modal if user closes without completing payment
            showPaymentModal(
              "error",
              "Payment Cancelled",
              "Payment was cancelled. You can try again when you're ready."
            );
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    };
  };

  const showPaymentModal = (status: "success" | "error" | "loading", title?: string, message?: string) => {
    setPaymentModal({
      isOpen: true,
      status,
      title,
      message,
    });
  };

  const handleCheckStatus = async () => {
    setIsCheckingStatus(true);
    try {
      // Force refresh subscription status from API (bypass cache)
      const status = await getSubscriptionStatusCached(true);
      setSubscriptionStatus(status);

      // If subscription is now active, redirect to dashboard
      if (status.hasActiveSubscription) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error checking subscription status:", error);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Fallback default plans if API is not available
  const getDefaultPlans = (currency: "USD" | "INR"): PricingPlan[] => {
    if (currency === "USD") {
      return [
        {
          id: "business-growth",
          name: "Business Growth",
          currentPrice: 39,
          originalPrice: 79,
          currency: "USD",
          currencySymbol: "$",
          interval: "month",
          intervalCount: 1,
          features: [
            "Introductory Offer for Limited Period",
            "Flat 67% off",
            "UNLIMITED *100* Posts to view",
            "UNLIMITED *50* keyword matches",
            "UNLIMITED *15* keywords monitored",
            "UNLIMITED *100* relevancy checks",
            "2 projects",
            "Daily email notifications",
            "Chat & email support",
            "Detailed Basic reports",
          ],
          highlightNumber: 2,
          highlightLabel: "Users",
          isIntroductory: true,
          buttonText: "Choose Plan",
        },
      ];
    } else {
      return [
        {
          id: "business-growth",
          name: "Business Growth",
          currentPrice: 1999,
          originalPrice: 3999,
          currency: "INR",
          currencySymbol: "₹",
          interval: "month",
          intervalCount: 1,
          features: [
            "Introductory Offer for Limited Period",
            "Flat 67% off",
            "UNLIMITED *100* Posts to view",
            "UNLIMITED *50* keyword matches",
            "UNLIMITED *15* keywords monitored",
            "UNLIMITED *100* relevancy checks",
            "2 projects",
            "Daily email notifications",
            "Chat & email support",
            "Detailed Basic reports",
          ],
          highlightNumber: 1,
          highlightLabel: "Users",
          isIntroductory: true,
          buttonText: "Choose Plan",
        },
      ];
    }
  };

  // Show loading state while checking subscription
  if (checkingSubscription) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  // Show pending verification message if subscription is pending
  if (subscriptionStatus?.subscription?.status === "created") {
    return (
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Payment Verification</h1>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8">
                <div className="flex flex-col items-center text-center gap-6">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      Payment Verification in Progress
                    </h2>
                    <p className="text-blue-800 dark:text-blue-200 text-base max-w-lg">
                      Your payment is currently being verified by our payment processor. This typically takes a few minutes but may take up to 24 hours in some cases.
                    </p>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      You will receive an email confirmation once your subscription is activated. Please check back shortly or visit your profile page for updates.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-4">
                    <Button
                      onClick={() => navigate("/profile")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                    >
                      View Profile
                    </Button>
                    <Button
                      onClick={() => navigate("/dashboard")}
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2"
                    >
                      Go to Dashboard
                    </Button>
                  </div>

                  <div className="w-full mt-4">
                    <Button
                      onClick={handleCheckStatus}
                      disabled={isCheckingStatus}
                      variant="outline"
                      className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2"
                    >
                      {isCheckingStatus ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Checking Status...
                        </>
                      ) : (
                        "Check Payment Status"
                      )}
                    </Button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800 w-full">
                    <p className="text-blue-600 dark:text-blue-400 text-sm">
                      Need help? Contact our support team at{" "}
                      <a href="mailto:support@rixly.com" className="font-semibold underline">
                        support@rixly.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Logout Button - Top Right */}
        <div className="flex justify-end mb-6">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Pricing</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose a plan that fits your needs and start growing your business with Rixly today.
          </p>
        </div>

        {/* Pricing Cards - Centered since there's only one plan */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="max-w-md w-full">
              {plans.map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  onChoosePlan={(isTrial) => handleChoosePlan(plan, isTrial)}
                  processing={processing}
                />
              ))}
            </div>
          </div>
        )}

        {/* Payment Status Modal */}
        <PaymentStatusModal
          isOpen={paymentModal.isOpen}
          onClose={handleCloseModal}
          status={paymentModal.status}
          title={paymentModal.title}
          message={paymentModal.message}
          onContinue={
            paymentModal.status === "success"
              ? handleContinueToDashboard
              : undefined
          }
        />

        {/* Auth Dialog */}
        <AuthDialog
          isOpen={authDialogOpen}
          onClose={() => setAuthDialogOpen(false)}
          onAuthSuccess={handleAuthSuccess}
          defaultView="login"
        />

        {/* Request Demo Dialog */}
        {/* <RequestDemoDialog
          isOpen={requestDemoDialogOpen}
          onClose={() => setRequestDemoDialogOpen(false)}
        /> */}
      </div>
    </div>
  );
}
