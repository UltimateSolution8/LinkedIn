// @ts-nocheck
import { motion } from "framer-motion";
import { MessageCircle, XCircle, TrendingUp, Check, ArrowRight, CheckCircle } from "lucide-react";

export const ProblemSection = () => {
  return (
    <section id="problem" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-muted/30" />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Cold outreach is saturated. <span className="text-primary">Social conversations are not.</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Buyers openly discuss problems on Social media every day. Most companies never see those conversations — or see them too late.
            <br />
            <span className="font-bold text-foreground">Rixly surfaces them in real time.</span>
          </p>
        </motion.div>

        {/* Visual comparison */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          {/* Cold Outreach */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card border border-border/50 rounded-2xl p-6 w-full md:w-[420px] shadow-md"
          >
            <h3 className="font-heading font-semibold text-xl mb-6 text-center">
              Cold Outreach
            </h3>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <XCircle className="text-red-500 w-5 h-5 mt-1 flex-shrink-0" />
                Low response rates (1-3%)
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="text-red-500 w-5 h-5 mt-1 flex-shrink-0" />
                Buyers ignore cold messages
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="text-red-500 w-5 h-5 mt-1 flex-shrink-0" />
                High unsubscribe rates
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="text-red-500 w-5 h-5 mt-1 flex-shrink-0" />
                No warm introduction
              </li>
            </ul>
          </motion.div>

          {/* Arrow */}
          <div className="hidden md:block">
            <ArrowRight className="w-8 h-8 text-muted-foreground" />
          </div>

          {/* Rixly */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card border border-primary/50 rounded-2xl p-6 w-full md:w-[420px] shadow-md relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
            <h3 className="font-heading font-semibold text-xl mb-6 text-center relative z-10">
              Rixly
            </h3>
            <ul className="space-y-4 text-muted-foreground relative z-10">
              <li className="flex items-start gap-3">
                <CheckCircle className="text-primary w-5 h-5 mt-1 flex-shrink-0" />
                High-intent conversations
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-primary w-5 h-5 mt-1 flex-shrink-0" />
                Buyers actively seeking solutions
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-primary w-5 h-5 mt-1 flex-shrink-0" />
                Value-first engagement
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-primary w-5 h-5 mt-1 flex-shrink-0" />
                Build trust before selling
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
