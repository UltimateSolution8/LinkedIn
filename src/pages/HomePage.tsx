// @ts-nocheck
import "@/App.css";
import { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Navbar } from "@/components/landing-new/Navbar";
import { HeroSection } from "@/components/landing-new/HeroSection";
import { ProblemSection } from "@/components/landing-new/ProblemSection";
import { HowRixlyMergedSection } from "@/components/landing-new/HowRixlyMergedSection";
import { VideoSection } from "@/components/landing-new/VideoSection";
import { FeaturesSection } from "@/components/landing-new/FeaturesSection";
import { UseCasesSection } from "@/components/landing-new/UseCasesSection";
import { ComplianceSection } from "@/components/landing-new/ComplianceSection";
import { ROIComparisonTable } from "@/components/landing-new/ROIComparisonTable";
import { FreeResourceSection } from "@/components/landing-new/FreeResourceSection";
import { TestimonialsSection } from "@/components/landing-new/TestimonialsSection";
import { PricingSection } from "@/components/landing-new/PricingSection";
import { LeadSourcesSection } from "@/components/landing-new/LeadSourcesSection";
import { CTASection } from "@/components/landing-new/CTASection";
import { FAQSection } from "@/components/landing-new/FAQSection";
import { Footer } from "@/components/landing-new/Footer";
import { CompanyLogos } from "@/components/landing-new/CompanyLogos";
import { ScrollToTop } from "@/components/landing-new/ScrollToTop";

const AnalyticsDashboard = lazy(() => import("@/components/landing-new/AnalyticsDashboard"));
const ROIPage = lazy(() => import("@/components/landing-new/ROIPage").then((mod) => ({ default: mod.ROIPage })));

export default function HomePage() {
  const [view, setView] = useState("landing");
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return false;
  });

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    window.handleBackToLanding = () => {
      setView("landing");
    };

    const errorHandler = (e: ErrorEvent) => {
      console.error("Caught global error:", e);
    };

    window.addEventListener("error", errorHandler);

    return () => {
      delete window.handleBackToLanding;
      window.removeEventListener("error", errorHandler);
    };
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="fixed inset-0 pointer-events-none grain" />

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
            <VideoSection />
            <FreeResourceSection />
            <HowRixlyMergedSection />
            <ProblemSection />
            <FeaturesSection />
            <UseCasesSection />
            <ComplianceSection />
            <ROIComparisonTable />
            <LeadSourcesSection />
            <PricingSection />
            <TestimonialsSection />
            <FAQSection />
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
