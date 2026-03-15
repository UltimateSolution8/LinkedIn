// @ts-nocheck
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Minus } from "lucide-react";

const channels = [
  {
    name: "Cold Email",
    cost: "Medium",
    intent: "Low",
    competition: "High",
    costLevel: "medium",
    intentLevel: "low",
    competitionLevel: "high",
  },
  {
    name: "LinkedIn Ads",
    cost: "High",
    intent: "Medium",
    competition: "High",
    costLevel: "high",
    intentLevel: "medium",
    competitionLevel: "high",
  },
  {
    name: "Meta Ads",
    cost: "High",
    intent: "Medium",
    competition: "High",
    costLevel: "high",
    intentLevel: "medium",
    competitionLevel: "high",
  },
  {
    name: "Rixly Leads",
    cost: "Low",
    intent: "High",
    competition: "Low",
    costLevel: "low",
    intentLevel: "high",
    competitionLevel: "low",
    highlight: true,
  },
];

const getLevelColor = (level) => {
  switch (level) {
    case "low":
      return "text-green-500";
    case "medium":
      return "text-yellow-500";
    case "high":
      return "text-red-500";
    default:
      return "text-muted-foreground";
  }
};

const getLevelIcon = (level) => {
  switch (level) {
    case "low":
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case "medium":
      return <Minus className="w-4 h-4 text-yellow-500" />;
    case "high":
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return null;
  }
};

// Intent-specific colors: High=green (good), Low=red (bad), Medium=yellow (neutral)
const getIntentColor = (level) => {
  switch (level) {
    case "high":
      return "text-green-500";
    case "medium":
      return "text-yellow-500";
    case "low":
      return "text-red-500";
    default:
      return "text-muted-foreground";
  }
};

const getIntentIcon = (level) => {
  switch (level) {
    case "high":
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case "medium":
      return <Minus className="w-4 h-4 text-yellow-500" />;
    case "low":
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return null;
  }
};

export const ROIComparisonTable = () => {
  return (
    <section id="roi-comparison" className="py-16 md:py-20 relative">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Why Rixly leads convert better
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compare lead generation channels and see why social conversations outperform traditional methods.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card border border-border/50 rounded-2xl overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-2 p-4 md:p-6 bg-muted/30 border-b border-border">
            <div className="font-heading font-semibold text-lg">Channel</div>
            <div className="font-heading font-semibold text-lg text-center">Cost</div>
            <div className="font-heading font-semibold text-lg text-center">Intent</div>
            <div className="font-heading font-semibold text-lg text-center">Competition</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {channels.map((channel, index) => (
              <motion.div
                key={channel.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`grid grid-cols-4 gap-2 p-4 md:p-6 ${channel.highlight ? 'bg-primary/5' : ''}`}
              >
                <div className="font-medium flex items-center">
                  {channel.name}
                  {channel.highlight && (
                    <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Best Choice
                    </span>
                  )}
                </div>
                <div className={`flex items-center justify-center ${getLevelColor(channel.costLevel)}`}>
                  {getLevelIcon(channel.costLevel)}
                  <span className="ml-2">{channel.cost}</span>
                </div>
                <div className={`flex items-center justify-center ${getIntentColor(channel.intentLevel)}`}>
                  {getIntentIcon(channel.intentLevel)}
                  <span className="ml-2">{channel.intent}</span>
                </div>
                <div className={`flex items-center justify-center ${getLevelColor(channel.competitionLevel)}`}>
                  {getLevelIcon(channel.competitionLevel)}
                  <span className="ml-2">{channel.competition}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 text-center text-sm text-muted-foreground"
        >
          * Based on average B2B lead generation benchmarks across industries
        </motion.p>
      </div>
    </section>
  );
};
