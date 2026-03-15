// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MessageCircle, TrendingUp, Sparkles, Users, Target, Zap, Handshake, Building } from "lucide-react";

// Sample Data
const stepsData = [
  {
    id: 1,
    icon: Search,
    title: "Monitor",
    description: "AI tracks high-intent conversations across targeted subreddits in real-time.",
    color: "#FF6B4A",
  },
  {
    id: 2,
    icon: MessageCircle,
    title: "Engage",
    description: "Get contextual reply suggestions that feel authentic and platform-native.",
    color: "#FF8F75",
  },
  {
    id: 3,
    icon: TrendingUp,
    title: "Convert",
    description: "Turn conversations into demo-ready leads with tracked links and CRM sync.",
    color: "#FF6B4A",
  },
];

const statsData = [
  { value: "400+", label: "High-intent conversations identified", icon: Search },
  { value: "6+", label: "Deals closed in 30 days (case study)", icon: Handshake },
  { value: "15+", label: "Used globally across industries", icon: Building },
  { value: "3×", label: "Faster lead discovery", icon: TrendingUp },
];

// Animated counter hook
function useCountUp(end, duration = 2000) {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const numericValue = parseInt(end.replace(/\D/g, ""));
          
          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(numericValue * easeOut));
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref: countRef };
}

function StatCard({ stat, index }) {
  const { count, ref } = useCountUp(stat.value, 2000);
  const suffix = stat.value.replace(/[0-9]/g, "");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
      <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center hover:border-primary/30 transition-all duration-300">
        <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-primary/10 flex items-center justify-center">
          <stat.icon className="w-5 h-5 text-primary" />
        </div>
        <div className="font-heading text-2xl font-bold text-foreground">
          {count}{suffix}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
      </div>
    </motion.div>
  );
}

export function HowRixlyMergedSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stepsData.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section 
      id="how-it-works" 
      className="py-16 lg:py-24 relative overflow-hidden"
      aria-label="How Rixly Works"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* LEFT COLUMN - Stats & Trust */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-full"
          >
            <div className="h-full min-h-[520px] bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 relative overflow-hidden">
              {/* Background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col">
                {/* Header */}
                <div className="mb-8">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                    <Sparkles className="w-3 h-3" />
                    Teams Use Us to Scale
                  </span>
                  <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Trusted by Growth Teams
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Join thousands of SaaS companies, agencies, and Founders accelerating their growth.
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 flex-1">
                  {statsData.map((stat, index) => (
                    <StatCard key={stat.label} stat={stat} index={index} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN - Staircase Funnel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-full"
          >
            <div 
              className="relative h-full min-h-[520px] bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 overflow-hidden flex flex-col"
            >
              {/* Background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />

              {/* Title */}
              <div className="relative z-10 mb-6">
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                  How Rixly Works 💡
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Three steps to grow your business
                </p>
              </div>

              {/* Arrow Background - curved growth arrow */}
              <div className="absolute bottom-16 right-8 w-40 h-24 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-full blur-xl"></div>
              <svg className="absolute bottom-20 right-12 w-16 h-16 text-green-500 z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>

              {/* Staircase Steps Container - reversed (Step 1 at bottom, moving up) */}
              <div className="relative z-10 flex flex-col items-start gap-4 mt-2">

                {/* Step 3 - Top */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-card/80 backdrop-blur-sm border border-border/50 p-4 rounded-xl shadow-lg w-[300px] ml-20 hover:scale-105 transition-transform duration-300 hover:shadow-xl hover:border-primary/30"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                    <h4 className="font-semibold text-lg text-foreground">Step 3 — Convert</h4>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Turn conversations into demo-ready leads with CRM sync.
                  </p>
                </motion.div>

                {/* Step 2 - Middle */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-card/80 backdrop-blur-sm border border-border/50 p-4 rounded-xl shadow-lg w-[300px] ml-10 hover:scale-105 transition-transform duration-300 hover:shadow-xl hover:border-primary/30"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-primary" />
                    </div>
                    <h4 className="font-semibold text-lg text-foreground">Step 2 — Engage</h4>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    AI suggests contextual replies aligned with platform rules.
                  </p>
                </motion.div>

                {/* Step 1 - Bottom */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-card/80 backdrop-blur-sm border border-border/50 p-4 rounded-xl shadow-lg w-[300px] hover:scale-105 transition-transform duration-300 hover:shadow-xl hover:border-primary/30"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Search className="w-4 h-4 text-primary" />
                    </div>
                    <h4 className="font-semibold text-lg text-foreground">Step 1 — Monitor</h4>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Track high-intent conversations across targeted subreddits.
                  </p>
                </motion.div>

              </div>

              {/* Business person illustration - top left of top step */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute top-32 left-8 z-20"
              >
                <svg className="w-16 h-16 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4" fill="currentColor" />
                  <path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HowRixlyMergedSection;
