
import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/app/AppSidebar";
import AppHeader from "@/components/app/AppHeader";
import MobileNav from "@/components/app/MobileNav";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function AppLayout() {
  const { projectId } = useParams<{ projectId: string }>();
  const [leadsCount, setLeadsCount] = useState(0);
  const [opportunitiesCount, setOpportunitiesCount] = useState(0);

  // TODO: Fetch badge counts from API
  // This is a placeholder - in Story 002 this will be replaced with actual API calls
  useEffect(() => {
    if (projectId) {
      // Placeholder - will be replaced with actual API call in Story 002
      // For now, using dummy data
      setLeadsCount(0);
      setOpportunitiesCount(0);
    }
  }, [projectId]);

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
          <Outlet />
        </main>
      </div>
    </div>
  );
}
