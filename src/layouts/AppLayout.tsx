
import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/app/AppSidebar";
import AppHeader from "@/components/app/AppHeader";
import MobileNav from "@/components/app/MobileNav";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getLeadCounts } from "@/lib/api/leads";
import AcquisitionSurveyDialog from "@/components/onboarding/AcquisitionSurveyDialog";
import { usePostVerificationOnboarding } from "@/hooks/usePostVerificationOnboarding";

export interface AppLayoutOutletContext {
  refreshLeadCounts: () => Promise<void>;
}

export default function AppLayout() {
  const { projectId } = useParams<{ projectId: string }>();
  const [leadsCount, setLeadsCount] = useState(0);
  const [opportunitiesCount, setOpportunitiesCount] = useState(0);
  const { isOpen, isSubmitting, handleSubmit, setIsOpen } = usePostVerificationOnboarding();

  const refreshLeadCounts = useCallback(async () => {
    if (!projectId) {
      setLeadsCount(0);
      setOpportunitiesCount(0);
      return;
    }

    try {
      const counts = await getLeadCounts(projectId);
      setLeadsCount(counts.hot);
      setOpportunitiesCount(counts.opportunity);
    } catch (error) {
      console.error("Failed to fetch lead badge counts:", error);
    }
  }, [projectId]);

  useEffect(() => {
    void refreshLeadCounts();
    const intervalId = window.setInterval(() => {
      void refreshLeadCounts();
    }, 30_000);

    return () => window.clearInterval(intervalId);
  }, [refreshLeadCounts]);

  const outletContext: AppLayoutOutletContext = {
    refreshLeadCounts,
  };

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Desktop Sidebar */}
      <AppSidebar leadsCount={leadsCount} opportunitiesCount={opportunitiesCount} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile Navigation (visible only on mobile) */}
        <MobileNav leadsCount={leadsCount} opportunitiesCount={opportunitiesCount} />

        {/* Top Header (visible only on desktop) */}
        <div className="hidden lg:block">
          <AppHeader />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet context={outletContext} />
        </main>
      </div>

      <AcquisitionSurveyDialog
        open={isOpen}
        onOpenChange={(nextOpen) => {
          if (nextOpen) setIsOpen(true);
        }}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
