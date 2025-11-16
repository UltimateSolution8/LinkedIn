"use client";

import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import NotificationButton from "@/components/shared/NotificationButton";
import UserProfileDropdown from "@/components/shared/UserProfileDropdown";

export default function CreateProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-neutral-100 dark:bg-neutral-950">
      <div className="flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 md:px-10 py-3 bg-white dark:bg-neutral-950">
          {/* Left Side - Logo */}
          <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
            <div
              className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => router.push("/dashboard")}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">RIXLY</span>
          </div>

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
