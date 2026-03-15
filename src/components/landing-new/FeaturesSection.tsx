// @ts-nocheck
import { motion } from "framer-motion";
import {
  Brain,
  Target,
  Zap,
  BarChart3,
  Shield,
  Plug,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Intent Detection",
    description:
      "Identifies buying signals in Reddit conversations automatically.",
    span: "md:col-span-2",
  },
  {
    icon: Target,
    title: "Subreddit Monitoring",
    description: "Track targeted subreddits and surface high-intent threads.",
    span: "",
  },
  {
    icon: Zap,
    title: "Real-Time Alerts",
    description: "Get notified the moment someone asks for a solution you offer.",
    span: "",
  },
  {
    icon: BarChart3,
    title: "Conversation Analytics",
    description: "Track which threads, subreddits, and replies drive results.",
    span: "",
  },
  {
    icon: Shield,
    title: "Compliance-First",
    description: "Value-first engagement. No spam. No automation abuse.",
    span: "",
  },
];

export const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="py-16 md:py-24 relative"
      data-testid="features-section"
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
            data-testid="features-title"
          >
            Powerful Features for Growth
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to capture, qualify, and convert leads at scale.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`feature-card trace-beam bg-card border border-border/50 rounded-xl p-6 ${feature.span}`}
              data-testid={`feature-card-${index}`}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
