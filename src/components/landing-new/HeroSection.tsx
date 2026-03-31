// @ts-nocheck
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PopupButton } from "react-calendly";
import { getCurrentUser } from "@/lib/api/auth";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const stats = [
    { icon: Users, value: "10K+", label: "Active Users" },
    { icon: TrendingUp, value: "3x", label: "More Leads" },
    { icon: Sparkles, value: "95%", label: "Accuracy" },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-16 ribbon-container"
      data-testid="hero-section"
    >
      {/* Background glow and subtle waves */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 opacity-[0.25] dark:opacity-[0.12] pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/40 blur-[100px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-primary/30 blur-[80px]" />
      </div>

      {/* Animated Ribbons */}
      <div className="ribbon top-[-10%] left-[-10%]" />
      <div className="ribbon top-[20%] left-[-20%] [animation-delay:-5s]" />
      <div className="ribbon top-[50%] left-[-15%] [animation-delay:-10s]" />

      {/* Animated Ripples */}
      <div className="ripple top-[20%] left-[10%] w-[400px] h-[400px]" />
      <div className="ripple bottom-[10%] right-[5%] w-[300px] h-[300px] [animation-delay:-4s]" />

      {/* Abstract wave-like overlay (simplified) */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle at 10% 20%, var(--primary-light), transparent 40%)` }} />

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-heading text-4xl md:text-6xl font-bold tracking-tight mb-2 leading-[1.1] text-foreground mt-8"
              data-testid="hero-title"
            >
              Turn Social Conversations Into <span className="text-primary">Qualified Leads</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="font-heading text-xl md:text-2xl font-bold text-foreground mb-6"
            >
              Before your competitor does.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed"
              data-testid="hero-description"
            >
              Find high-intent buyers on Reddit with AI-powered monitoring. Rixly surfaces real conversations and helps you convert them into qualified leads.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <div className="flex flex-wrap gap-4 mb-4 relative z-10">
                {/* <div className="relative inline-block overflow-hidden rounded-full">
                  <Button
                    size="lg"
                    className="rounded-full font-medium text-lg px-8 glow-primary glow-primary-hover btn-press bg-primary-gradient border-none text-white shadow-[0_10px_30px_rgba(30,134,141,0.3)]"
                    data-testid="hero-get-started"
                    onClick={() => {
                      if (isAuthenticated) {
                        navigate("/app/onboarding");
                      } else {
                        navigate("/login");
                      }
                    }}
                  >
                    Start Finding Leads
                  </Button>
                </div> */}
                <PopupButton
                  url="https://calendly.com/rixlyleads/30min"
                  rootElement={document.getElementById("root")!}
                  text="Start Finding Leads"
                  className="rounded-full font-medium text-lg px-8 py-3 glow-primary glow-primary-hover btn-press bg-primary-gradient border-none text-white shadow-[0_10px_30px_rgba(30,134,141,0.3)]"
                  data-testid="hero-get-started"
                  prefill={{
                    email: getCurrentUser()?.email || "",
                    name: getCurrentUser() ? `${getCurrentUser()?.firstName} ${getCurrentUser()?.lastName}` : "",
                  }}
                />
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full font-medium text-lg px-8 btn-press border-primary/20 hover:bg-primary/5 shadow-sm"
                  data-testid="hero-book-demo"
                  onClick={() => document.getElementById("video")?.scrollIntoView({ behavior: "smooth" })}
                >
                  See How It Works
                </Button>
              </div>
              <p className="text-sm text-muted-foreground/60 mb-8 italic">
                No spam. No scraping abuse. Built for long-term growth.
              </p>
              {/* Light shades below buttons */}
              <div className="absolute -bottom-8 left-0 right-0 h-16 bg-primary/10 blur-[60px] pointer-events-none opacity-50" />
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <div className="relative perspective-1000">
              <motion.div
                initial={{ rotateY: 15, rotateX: 5 }}
                animate={{ rotateY: 0, rotateX: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl trace-beam"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="bg-card p-6 rounded-[20px] shadow-[0_20px_50px_rgba(15,23,42,0.1)] border border-border backdrop-blur-md bg-card/90">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-primary/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-primary/20" />
                    </div>
                    <Badge variant="success" className="font-medium">
                      Live Processing
                    </Badge>
                  </div>

                  {/* Mock dashboard content */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="font-heading font-bold text-xl text-foreground">Lead Dashboard</div>
                      <div className="text-xs text-muted-foreground font-medium">Updated 2m ago</div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: "New Leads", value: "247", color: "var(--teal-600)" },
                        { label: "Qualified", value: "189", color: "var(--teal-500)" },
                        { label: "Converted", value: "72", color: "var(--teal-400)" },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="bg-muted/30 border border-border rounded-xl p-3 text-center"
                        >
                          <div className="font-heading font-bold text-xl mb-0.5" style={{ color: item.color }}>
                            {item.value}
                          </div>
                          <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mock chart */}
                    <div className="bg-muted/20 border border-border rounded-xl p-4 h-44 flex items-end gap-2 relative overflow-hidden">
                      <div className="absolute top-3 left-4 text-[10px] font-bold text-[#94A3B8] uppercase">Conversion Velocity</div>
                      {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map(
                        (height, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ delay: 0.8 + i * 0.05, duration: 0.3 }}
                            className="flex-1 bg-primary-gradient rounded-t-sm"
                            style={{ opacity: 0.3 + (i / 12) * 0.7 }}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Floating notification */}
                <motion.div
                  initial={{ opacity: 0, y: 20, x: 20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ delay: 1.2 }}
                  className="absolute bottom-6 left-12 -rotate-3 bg-card border border-border rounded-lg p-3 shadow-lg z-20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">New Lead!</div>
                      <div className="text-xs text-muted-foreground">
                        Score: 92/100
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
