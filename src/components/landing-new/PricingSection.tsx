import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { detectUserCurrency } from "@/lib/utils/geolocation";
import { getPricingPlans, type PricingPlan } from "@/lib/api/pricing";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
// import RequestDemoDialog from "@/components/shared/RequestDemoDialog";
import { PopupButton } from "react-calendly";
import { getCurrentUser } from "@/lib/api/auth";

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
  const { isAuthenticated } = useAuth();

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
      price: currency === "INR" ? plan.inrPrice : plan.usdPrice,
    }));
  }, [apiPlans, currency]);

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
            <PopupButton
              url="https://calendly.com/rixlyleads/30min"
              rootElement={document.getElementById("root")!}
              text="Book a Demo"
              className="rounded-full border border-primary/20 hover:bg-primary/5 px-4 py-2 text-sm font-medium transition-colors"
              prefill={{
                email: getCurrentUser()?.email || "",
                name: getCurrentUser() ? `${getCurrentUser()?.firstName} ${getCurrentUser()?.lastName}` : "",
              }}
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
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
                className={`relative rounded-2xl border bg-card p-8 ${
                  plan.popular
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
                    onClick={() => {
                      if (isAuthenticated) {
                        navigate("/app/onboarding");
                      } else {
                        navigate("/login");
                      }
                    }}
                  >
                    {plan.cta}
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
                    {/* <PopupButton
                      url="https://calendly.com/rixlyleads/30min"
                      rootElement={document.getElementById("root")!}
                      text="Book a Demo"
                      className={`w-full rounded-full font-medium btn-press py-2 border-2 border-primary/20 hover:bg-primary/5 transition-colors`}
                      prefill={{
                        email: getCurrentUser()?.email || "",
                        name: getCurrentUser() ? `${getCurrentUser()?.firstName} ${getCurrentUser()?.lastName}` : "",
                      }}
                    /> */}
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
                  <PopupButton
                    url="https://calendly.com/rixlyleads/30min"
                    rootElement={document.getElementById("root")!}
                    text="Book Demo"
                    className="w-full rounded-full font-bold border-2 border-primary/20 hover:bg-primary/5 py-2 transition-colors text-primary"
                    prefill={{
                      email: getCurrentUser()?.email || "",
                      name: getCurrentUser() ? `${getCurrentUser()?.firstName} ${getCurrentUser()?.lastName}` : "",
                    }}
                  />
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
    </section>
  );
};
