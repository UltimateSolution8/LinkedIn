// @ts-nocheck
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const plans = [
  {
    name: "Starter",
    price: "$49",
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
    price: "$149",
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
    price: "Custom",
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
        </motion.div>

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

              <Button
                className={`w-full rounded-full font-medium btn-press ${
                  plan.popular
                    ? "glow-primary glow-primary-hover"
                    : ""
                }`}
                variant={plan.popular ? "default" : "outline"}
                data-testid={`pricing-cta-${plan.name.toLowerCase()}`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
