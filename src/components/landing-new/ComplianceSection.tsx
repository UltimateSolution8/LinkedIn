// @ts-nocheck
import { motion } from "framer-motion";
import { Shield, Users, CheckCircle2, Heart } from "lucide-react";

const compliancePoints = [
  {
    icon: Shield,
    title: "No mass automation blasting",
    description: "Every response is thoughtful and contextual. We help you engage authentically, not spam communities.",
  },
  {
    icon: Heart,
    title: "Value-first engagement",
    description: "Provide genuine help before promoting. Build trust and authority in your niche communities.",
  },
  {
    icon: Users,
    title: "Community-aligned strategies",
    description: "Respect subreddit rules and community guidelines. Fit naturally into existing conversations.",
  },
  {
    icon: CheckCircle2,
    title: "Platform-respecting workflows",
    description: "Built to work within Reddit's terms of service. Your account stays safe while generating leads.",
  },
];

export const ComplianceSection = () => {
  return (
    <section id="compliance" className="py-16 md:py-24 relative">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Built for Compliance & Long-Term Growth
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Rixly is designed to help you generate leads sustainably without risking your account or reputation.
          </p>
        </motion.div>

        {/* Compliance Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {compliancePoints.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Trust badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Trusted by 50+ companies for sustainable, compliant lead generation
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
