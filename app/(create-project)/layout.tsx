"use client";

import Logo from "@/components/common/Logo";
import NotificationButton from "@/components/shared/NotificationButton";
import UserProfileDropdown from "@/components/shared/UserProfileDropdown";

export default function CreateProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
