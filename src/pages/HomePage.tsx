// @ts-nocheck
import "@/App.css";
import { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Navbar } from "@/components/landing-new/Navbar";
import { HeroSection } from "@/components/landing-new/HeroSection";
import { CompanyLogos } from "@/components/landing-new/CompanyLogos";
import { ServicesSection } from "@/components/landing-new/ServicesSection";
import { FeaturesSection } from "@/components/landing-new/FeaturesSection";
import { MidCTASection } from "@/components/landing-new/MidCTASection";
import { ResultsSection } from "@/components/landing-new/ResultsSection";
import { ProcessSection } from "@/components/landing-new/ProcessSection";
import { WhyChooseSection } from "@/components/landing-new/WhyChooseSection";
import { CaseStudiesSection } from "@/components/landing-new/CaseStudiesSection";
import { TestimonialsSection } from "@/components/landing-new/TestimonialsSection";
import { FAQSection } from "@/components/landing-new/FAQSection";
import { CTASection } from "@/components/landing-new/CTASection";
import { ResourcesSection } from "@/components/landing-new/ResourcesSection";
import { Footer } from "@/components/landing-new/Footer";
import { ScrollToTop } from "@/components/landing-new/ScrollToTop";
import ExitIntentPlaybookDialog from "@/components/landing-new/ExitIntentPlaybookDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useBackButtonExitIntent } from "@/hooks/useBackButtonExitIntent";

const AnalyticsDashboard = lazy(() => import("@/components/landing-new/AnalyticsDashboard"));
const ROIPage = lazy(() => import("@/components/landing-new/ROIPage").then((mod) => ({ default: mod.ROIPage })));

export default function HomePage() {
  const { user } = useAuth();
  const [view, setView] = useState("landing");
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return false;
  });
  const [showExitIntent, setShowExitIntent] = useState(false);
  const isAnonymousVisitor = !user;

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    window.handleBackToLanding = () => setView("landing");
    const errorHandler = (e: ErrorEvent) => console.error("Caught global error:", e);
    window.addEventListener("error", errorHandler);
    return () => {
      delete window.handleBackToLanding;
      window.removeEventListener("error", errorHandler);
    };
  }, []);

  useBackButtonExitIntent({
    enabled: view === "landing" && isAnonymousVisitor,
    onExitIntent: () => setShowExitIntent(true),
    seenKey: "rixly_exit_intent_back_seen",
  });

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="fixed inset-0 pointer-events-none grain" />
      <ExitIntentPlaybookDialog open={showExitIntent} onOpenChange={setShowExitIntent} />

      <AnimatePresence mode="wait">
        {view === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Navbar isDark={isDark} toggleTheme={toggleTheme} setView={setView} />
            <HeroSection />
            <CompanyLogos />
            <ServicesSection />
            <MidCTASection />
            <FeaturesSection />
            <ResultsSection />
            <ProcessSection />
            <WhyChooseSection />
            <CaseStudiesSection />
            <TestimonialsSection />
            <FAQSection />
            <ResourcesSection />
            <CTASection />
            <Footer />
            <ScrollToTop />
          </motion.div>
        )}

        {view === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense fallback={null}>
              <AnalyticsDashboard onBack={() => setView("landing")} />
            </Suspense>
          </motion.div>
        )}

        {view === "roi" && (
          <motion.div
            key="roi"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense fallback={null}>
              <ROIPage onBack={() => setView("landing")} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
