"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/common/Logo";
import NotificationButton from "@/components/shared/NotificationButton";
import UserProfileDropdown from "@/components/shared/UserProfileDropdown";
import { getCurrentUser } from "@/lib/api/auth";
import { checkSubscriptionAccess } from "@/lib/utils/subscription";

export default function CreateProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
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
        if (!hasAccess) {
          // User doesn't have active subscription - redirect to pricing
          router.push("/pricing");
          return;
        }

        setIsAuthorized(true);
        setIsChecking(false);
      } catch (error) {
        console.error("Error checking access:", error);
        // On error, redirect to pricing for security
        router.push("/pricing");
      }
    };

    checkAccess();
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
    <div className="relative flex min-h-screen w-full flex-col bg-neutral-100 dark:bg-neutral-950">
      <div className="flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 md:px-10 py-3 bg-white dark:bg-neutral-950">
          {/* Left Side - Logo */}
          <Logo />

          {/* Right Side - Notification & Avatar */}
          <div className="flex flex-1 justify-end items-center gap-4">
            {/* Notification Button */}
            <NotificationButton />

            {/* User Profile Dropdown */}
            <UserProfileDropdown />
          </div>
        </header>

        {/* Main Content */}
        {children}
      </div>
    </div>
  );
}
