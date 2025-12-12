"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { getCurrentUser } from "@/lib/api/auth";
import { checkSubscriptionAccess } from "@/lib/utils/subscription";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAccess = async () => {
      if (!isMounted) return;
      
      setIsChecking(true);
      setIsAuthorized(false);

      // Check if user is logged in
      const user = getCurrentUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Check subscription access - ALWAYS fetch fresh data from API
      try {
        const hasAccess = await checkSubscriptionAccess();
        
        if (!isMounted) return;
        
        if (!hasAccess) {
          // User doesn't have active subscription - redirect to pricing
          router.push("/pricing");
          return;
        }

        setIsAuthorized(true);
        setIsChecking(false);
      } catch (error) {
        console.error("Error checking access:", error);
        if (!isMounted) return;
        // On error, redirect to pricing for security
        router.push("/pricing");
      }
    };

    // Initial check
    checkAccess();
    
    // Listen for storage changes (user logout/login in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user" || e.key === "accessToken" || e.key === null) {
        // User data changed - re-check access
        checkAccess();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      isMounted = false;
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Checking access...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <ProjectProvider>
      <div className="flex h-screen w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          {children}
        </main>
      </div>
    </ProjectProvider>
  );
}
