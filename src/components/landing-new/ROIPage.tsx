// @ts-nocheck
import { motion } from "framer-motion";
import { ArrowLeft, TrendingDown, DollarSign, Clock, BarChart3, Users, Target, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export const ROIPage = ({ onBack }) => {
  const channelComparison = [
    {
      channel: "Cold Email",
      cost: "$500-2000/mo",
      intent: "Low-Medium",
      competition: "Very High",
      conversion: "1-3%",
      responseTime: "24-48 hours",
      bestFor: "Bulk outreach",
    },
    {
      channel: "Google Ads",
      cost: "$2000-10000/mo",
      intent: "High",
      competition: "Extremely High",
      conversion: "3-8%",
      responseTime: "Immediate",
      bestFor: "Bottom of funnel",
    },
    {
      channel: "Meta Ads",
      cost: "$1500-8000/mo",
      intent: "Medium",
      competition: "Extremely High",
      conversion: "2-5%",
      responseTime: "Immediate",
      bestFor: "Brand awareness",
    },
    {
      channel: "LinkedIn Ads",
      cost: "$3000-15000/mo",
      intent: "Medium-High",
      competition: "Very High",
      conversion: "3-6%",
      responseTime: "Immediate",
      bestFor: "B2B decision makers",
    },
    {
      channel: "Rixly (Reddit/LinkedIn)",
      cost: "$299-999/mo",
      intent: "Very High",
      competition: "Low",
      conversion: "8-15%",
      responseTime: "Real-time",
      bestFor: "High-intent leads",
      isHighlighted: true,
    },
  ];

  const savingsData = [
    {
      metric: "Time to First Lead",
      traditional: "2-4 weeks",
      rixly: "24-48 hours",
      savings: "90%",
    },
    {
      metric: "Cost per Lead",
      traditional: "$150-500",
      rixly: "$25-75",
      savings: "85%",
    },
    {
      metric: "Lead Quality Score",
      traditional: "35/100",
      rixly: "85/100",
      savings: "143%",
    },
    {
      metric: "Weekly Research Hours",
      traditional: "15-20 hrs",
      rixly: "2-3 hrs",
      savings: "85%",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/10 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10 pt-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Landing
        </motion.button>

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-2 text-sm border-primary/30 bg-primary/5">
            <TrendingDown className="w-4 h-4 mr-2 text-primary" />
            ROI Calculator
          </Badge>
          <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight mb-6">
            How Rixly <span className="text-primary">Saves You Time & Money</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how Rixly compares to traditional marketing channels and why leading companies are making the switch.
          </p>
        </motion.div>

        {/* Savings Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {savingsData.map((item, index) => (
            <motion.div
              key={item.metric}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-card border border-border rounded-2xl p-6 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                {index === 0 ? <Clock className="w-6 h-6 text-primary" /> :
                 index === 1 ? <DollarSign className="w-6 h-6 text-primary" /> :
                 index === 2 ? <Target className="w-6 h-6 text-primary" /> :
                 <Users className="w-6 h-6 text-primary" />}
              </div>
              <h3 className="font-heading font-bold text-lg mb-2">{item.metric}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Traditional:</span>
                  <span className="line-through text-muted-foreground/60">{item.traditional}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary font-medium">With Rixly:</span>
                  <span className="text-primary font-bold">{item.rixly}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <span className="text-2xl font-bold text-green-500">{item.savings}</span>
                <span className="text-sm text-muted-foreground ml-1">savings</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Channel Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Channel Comparison
            </h2>
            <p className="text-muted-foreground">
              Compare cost, intent, and competition across marketing channels
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-heading font-bold">Channel</th>
                  <th className="text-left p-4 font-heading font-bold">Monthly Cost</th>
                  <th className="text-left p-4 font-heading font-bold">Buyer Intent</th>
                  <th className="text-left p-4 font-heading font-bold">Competition</th>
                  <th className="text-left p-4 font-heading font-bold">Conversion</th>
                  <th className="text-left p-4 font-heading font-bold">Response Time</th>
                </tr>
              </thead>
              <tbody>
                {channelComparison.map((channel, index) => (
                  <motion.tr
                    key={channel.channel}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`border-b border-border/50 ${channel.isHighlighted ? 'bg-primary/5' : ''}`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {channel.isHighlighted && (
                          <Badge className="bg-primary text-white">Best Value</Badge>
                        )}
                        <span className={`font-medium ${channel.isHighlighted ? 'text-primary' : ''}`}>
                          {channel.channel}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`font-medium ${channel.isHighlighted ? 'text-green-500' : ''}`}>
                        {channel.cost}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant={channel.intent.includes("High") ? "default" : "outline"}>
                        {channel.intent}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className={channel.competition.includes("Low") ? 'text-green-500' : 'text-muted-foreground'}>
                        {channel.competition}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`font-medium ${channel.isHighlighted ? 'text-green-500' : ''}`}>
                        {channel.conversion}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {channel.responseTime}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Key Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-4">Real-Time Intelligence</h3>
            <p className="text-muted-foreground">
              Get instant alerts when potential buyers discuss problems you solve. No more waiting for trade shows or inbound leads.
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-4">Higher Conversion Rates</h3>
            <p className="text-muted-foreground">
              Reach buyers actively researching solutions. Our users see 8-15% conversion rates vs. 1-3% with cold outreach.
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center mx-auto mb-6">
              <DollarSign className="w-8 h-8 text-teal-500" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-4">80% Lower Costs</h3>
            <p className="text-muted-foreground">
              Stop wasting budget on ads that target the wrong audience. Rixly helps you reach exactly who needs your solution.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center pb-16"
        >
          <h2 className="font-heading text-3xl font-bold mb-6">
            Ready to Start Saving?
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="rounded-full font-medium text-lg px-8 glow-primary glow-primary-hover btn-press"
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full font-medium text-lg px-8"
              onClick={() => document.getElementById("video")?.scrollIntoView({ behavior: "smooth" })}
            >
              See How It Works
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
