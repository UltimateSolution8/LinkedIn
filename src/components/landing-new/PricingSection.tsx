import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { detectUserCurrency } from "@/lib/utils/geolocation";
import { getPricingPlans, type PricingPlan, createSubscription, verifySubscriptionPayment, type RazorpaySubscriptionResponse } from "@/lib/api/pricing";
import { getSubscriptionStatusCached } from "@/lib/utils/subscription";
import PaymentStatusModal from "@/components/pricing/PaymentStatusModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
// import RequestDemoDialog from "@/components/shared/RequestDemoDialog";

const basePlans = [
  {
    name: "Starter",
    usdPrice: "$39",
    inrPrice: "₹1,999",
    period: "/month",
    description: "Perfect for small teams getting started with lead gen.",
    features: [
      "3 Tracked Competitors",
      "20 Custom Tracked Keywords",
      "100 AI-Guided Reply Suggestions",
      "Weekly New Lead Opportunities",
      "Weekly Competitor Tracking",
      "Monthly SEO Opportunities",
      "Analytics Insight Dashboard",
    ],
    cta: "Buy now",
    popular: false,
  },
  {
    name: "Growth",
    usdPrice: "$79",
    inrPrice: "₹3,999",
    period: "/month",
    description: "For growing teams that need more power and features.",
    features: [
      "6 Tracked Competitors",
      "40 Custom Tracked Keywords",
      "300 AI-Guided Reply Suggestions",
      "Daily New Lead Opportunities",
      "Daily Competitor Tracking",
      "Monthly SEO Opportunities",
      "Analytics Insight Dashboard",
    ],
    cta: "Buy now",
    popular: true,
  },
  {
    name: "Enterprise",
    usdPrice: "Custom",
    inrPrice: "Custom",
    period: "",
    description: "For large teams with advanced needs and compliance.",
    features: [
      "8 Tracked Competitors",
      "60 Custom Tracked Keywords",
      "500 AI-Guided Reply Suggestions",
      "Daily New Lead Opportunities",
      "Daily Competitor Tracking",
      "Monthly SEO Opportunities",
      "Analytics Insight Dashboard",
    ],
    cta: "Book a Demo",
    popular: false,
  },
];

export const PricingSection = () => {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [apiPlans, setApiPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  // const [requestDemoOpen, setRequestDemoOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    status: "success" | "error" | "loading";
    title?: string;
    message?: string;
  }>({
    isOpen: false,
    status: "loading",
  });

  useEffect(() => {
    let mounted = true;
    const initializePricing = async () => {
      try {
        const detected = await detectUserCurrency();
        if (mounted) setCurrency(detected);

        // Fetch plans from API
        const fetchedPlans = await getPricingPlans(detected);
        if (mounted) setApiPlans(fetchedPlans);
      } catch (error) {
        console.error("Error fetching pricing:", error);
        // Will use fallback basePlans
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void initializePricing();
    return () => {
      mounted = false;
    };
  }, []);

  const formatPrice = (price: number) => {
    if (currency === "INR") {
      // Format INR with Indian number system (e.g., 1,999 or 99,999)
      return new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
      }).format(price);
    }
    // Format USD nicely
    return Number.isInteger(price) ? price.toLocaleString('en-US') : price.toFixed(2);
  };

  const plans = useMemo(() => {
    // If we have API plans, merge them with base plan features
    if (apiPlans.length > 0) {
      // Map API plans to display format, using basePlans for features (first two plans)
      const apiBasedPlans = apiPlans.map((apiPlan, index) => {
        const basePlan = basePlans[index] || basePlans[0]; // fallback to first plan
        return {
          id: apiPlan.id,
          name: apiPlan.name,
          price: `${apiPlan.currencySymbol}${formatPrice(apiPlan.currentPrice)}`,
          period: `/${apiPlan.interval}`,
          description: apiPlan.description || basePlan.description,
          features: basePlan.features, // Keep hardcoded features
          cta: basePlan.cta,
          popular: basePlan.popular,
        };
      });

      // Always add the Enterprise custom plan as the third option
      const enterprisePlan = {
        ...basePlans[2], // Enterprise is always the third plan
        price: currency === "INR" ? basePlans[2].inrPrice : basePlans[2].usdPrice,
      };

      return [...apiBasedPlans, enterprisePlan];
    }

    // Fallback to base plans with currency formatting
    return basePlans.map((plan) => ({
      ...plan,
      id: plan.name.toLowerCase().replace(/\s+/g, '-'),
      price: currency === "INR" ? plan.inrPrice : plan.usdPrice,
    }));
  }, [apiPlans, currency]);

  const showPaymentModal = (status: "success" | "error" | "loading", title?: string, message?: string) => {
    setPaymentModal({ isOpen: true, status, title, message });
  };

  const handleCloseModal = () => {
    setPaymentModal(prev => ({ ...prev, isOpen: false }));
    setProcessingPlanId(null);
  };

  const handleContinueToDashboard = async () => {
    setPaymentModal(prev => ({ ...prev, isOpen: false }));
    try {
      await getSubscriptionStatusCached(true);
    } catch (error) {
      console.error("Error refreshing subscription status:", error);
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    navigate("/dashboard");
  };

  const initializeRazorpayPayment = async (subscriptionData: RazorpaySubscriptionResponse, plan: any) => {
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
              error instanceof Error ? error.message : "Payment verification fail. Please contact support if charged."
            );
          } finally {
            setProcessingPlanId(null);
          }
        },
        theme: {
          color: "#9333ea",
        },
        modal: {
          ondismiss: () => {
            setProcessingPlanId(null);
            showPaymentModal(
              "error",
              "Payment Cancelled",
              "Payment was cancelled. You can try again when you're ready."
            );
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    };
  };

  const handleBuyNow = async (plan: any) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (!plan.id) {
      console.error("No plan ID available to process payment.");
      navigate("/app/onboarding");
      return;
    }

    try {
      setProcessingPlanId(plan.name);

      const status = await getSubscriptionStatusCached(true);
      if (status.hasActiveSubscription) {
        showPaymentModal(
          "error",
          "Subscription Active",
          `You already have an active subscription. Redirecting...`
        );
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
        return;
      }

      if (user && !user.isEmailVerified) {
        navigate("/verify-email-prompt");
        return;
      }

      const subscriptionData = await createSubscription({ planId: plan.id });
      await initializeRazorpayPayment(subscriptionData, plan);
    } catch (error) {
      console.error("Error initiating payment:", error);
      showPaymentModal("error", "Payment Error", error instanceof Error ? error.message : "Failed to initiate payment. Please try again.");
      setProcessingPlanId(null);
    }
  };

  return (
    <section
      id="pricing"
      className="py-16 md:py-24 relative"
      data-testid="pricing-section"
    >
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="font-heading text-4xl md:text-5xl font-semibold tracking-tight mb-4"
            data-testid="pricing-title"
          >
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs.
          </p>
          <div className="mt-5">
            <a
              href="https://calendly.com/rixlyleads/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-primary/20 hover:bg-primary/5 px-4 py-2 text-sm font-medium transition-colors decoration-transparent hover:decoration-transparent"
            >
              Book a Demo
            </a>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20" >
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl border bg-card p-8 ${plan.popular
                  ? "pricing-popular border-primary/50"
                  : "border-border/50"
                  }`}
                data-testid={`pricing-card-${plan.name.toLowerCase()}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4">
                    Most Popular
                  </Badge>
                )}

                <div className="mb-6">
                  <h3 className="font-heading font-semibold text-xl mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <span className="font-heading text-5xl font-bold">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-3">
                  {plan.cta === "Buy now" ? (
                    <Button
                      className={`w-full rounded-full font-medium btn-press ${plan.popular
                        ? "glow-primary glow-primary-hover"
                        : ""
                        }`}
                      variant={plan.popular ? "default" : "outline"}
                      disabled={processingPlanId === plan.name}
                      onClick={() => handleBuyNow(plan)}
                    >
                      {processingPlanId === plan.name ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        plan.cta
                      )}
                    </Button>
                  ) : (
                    <>
                      {/* <Button
                        className={`w-full rounded-full font-medium btn-press`}
                        variant="outline"
                        onClick={() => setRequestDemoOpen(true)}
                      >
                        {plan.cta}
                      </Button> */}
                    </>
                  )}


                  {/* plan.cta === "Buy now" && (
                    <Button
                      className="w-full rounded-full font-medium border-teal-600/30 text-teal-600 hover:bg-teal-600/5"
                      variant="outline"
                      onClick={() => {
                        if (isAuthenticated) {
                          navigate("/app/onboarding?isTrial=true");
                        } else {
                          navigate("/login?isTrial=true");
                        }
                      }}
                    >
                      Start 7-Day Free Trial
                    </Button>
                  ) */}

                  <div className="w-full">
                    <a
                      href="https://calendly.com/rixlyleads/30min"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center rounded-full font-bold border-2 border-primary/20 hover:bg-primary/5 py-2 transition-colors text-primary decoration-transparent hover:decoration-transparent"
                    >
                      Book Demo
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* <RequestDemoDialog
        isOpen={requestDemoOpen}
        onClose={() => setRequestDemoOpen(false)}
      /> */}
      
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
    </section>
  );
};
