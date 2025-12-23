
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Zap, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getPricingPlans, createSubscription, verifySubscriptionPayment, type PricingPlan, RazorpaySubscriptionResponse } from "@/lib/api/pricing";
import PaymentStatusModal from "@/components/pricing/PaymentStatusModal";
import AuthDialog from "@/components/pricing/AuthDialog";
import RequestDemoDialog from "@/components/shared/RequestDemoDialog";
import { detectUserCurrency } from "@/lib/utils/geolocation";
import { getSubscriptionStatusCached } from "@/lib/utils/subscription";
import { type SubscriptionStatus } from "@/lib/api/subscription";
import { getCurrentUser } from "@/lib/api/auth";

// Declare Razorpay types for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    status: "success" | "error" | "loading";
    title?: string;
    message?: string;
  }>({
    isOpen: false,
    status: "loading",
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

  const handleChoosePlan = async (plan: PricingPlan) => {
    try {
      // Check if user is logged in
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        // Save the selected plan and open auth dialog
        setSelectedPlan(plan);
        setAuthDialogOpen(true);
        return;
      }

      setProcessing(true);

      // Create subscription
      const subscriptionData = await createSubscription({
        planId: plan.id
      });

      // Initialize Razorpay checkout
      await initializeRazorpayPayment(subscriptionData, plan);
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
        await initializeRazorpayPayment(subscriptionData, selectedPlan);
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

  const initializeRazorpayPayment = async (orderData: RazorpaySubscriptionResponse, plan: PricingPlan) => {
    // Load Razorpay script dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const options = {
        key: orderData.keyId,
        name: "Rixly",
        description: `Payment for ${plan.name} plan`,
        subscription_id: orderData.subscription.vendorSubscriptionId,
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

  // Fallback default plans if API is not available
  const getDefaultPlans = (currency: "USD" | "INR"): PricingPlan[] => {
    if (currency === "USD") {
      return [
        {
          id: "business-growth",
          name: "Business Growth",
          currentPrice: 16.99,
          originalPrice: 50,
          currency: "USD",
          currencySymbol: "$",
          features: [
            "Introductory Offer for Limited Period",
            "UNLIMITED Posts to view",
            "UNLIMITED keyword matches",
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
          currentPrice: 1499,
          originalPrice: 4100,
          currency: "INR",
          currencySymbol: "₹",
          features: [
            "Introductory Offer for Limited Period",
            "UNLIMITED Posts to view",
            "UNLIMITED keyword matches",
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
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
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
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="max-w-md w-full">
              {plans.map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  onChoosePlan={() => handleChoosePlan(plan)}
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
        <RequestDemoDialog
          isOpen={requestDemoDialogOpen}
          onClose={() => setRequestDemoDialogOpen(false)}
        />
      </div>
    </div>
  );
}

interface PricingCardProps {
  plan: PricingPlan;
  onChoosePlan: () => void;
  processing?: boolean;
}

function PricingCard({ plan, onChoosePlan, processing = false }: PricingCardProps) {
  return (
    <Card className="relative w-full max-w-md bg-white border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Purple Accent Header */}
      <div className="h-2 bg-gradient-to-r from-purple-600 to-purple-700"></div>

      <CardHeader className="p-4 sm:p-6 pb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>

        {/* Pricing Section */}
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-4xl sm:text-5xl font-bold text-gray-900">
            {plan.currencySymbol}
            {plan.currentPrice.toLocaleString(undefined, {
              minimumFractionDigits: plan.currency === "USD" ? 2 : 0,
              maximumFractionDigits: plan.currency === "USD" ? 2 : 0,
            })}
          </span>
          {plan.originalPrice && (
            <div className="flex items-center gap-2">
              <span className="text-lg text-gray-400 line-through">
                {plan.currencySymbol}
                {plan.originalPrice.toLocaleString()}
              </span>
              <Clock className="w-4 h-4 text-orange-500" />
            </div>
          )}
        </div>

        {/* Highlight Feature */}
        {plan.highlightNumber && (
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <Zap className="w-5 h-5 text-purple-600" />
            <span className="font-semibold">{plan.highlightNumber}</span>
            <span className="text-sm">{plan.highlightLabel}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {/* Features List */}
        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          onClick={onChoosePlan}
          disabled={processing}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 sm:py-6 rounded-xl text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            plan.buttonText || "Choose Plan"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
