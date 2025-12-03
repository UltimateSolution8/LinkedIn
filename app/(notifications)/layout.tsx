"use client";

import Logo from "@/components/common/Logo";
import NotificationButton from "@/components/shared/NotificationButton";
import UserProfileDropdown from "@/components/shared/UserProfileDropdown";
import { ProjectProvider } from "@/contexts/ProjectContext";

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProjectProvider>
      <div className="flex h-screen w-full flex-col">
        <header className="flex flex-shrink-0 items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-10 py-3 bg-white dark:bg-neutral-950">
          <Logo />
          <div className="flex items-center gap-4">
            <NotificationButton />
            <UserProfileDropdown />
          </div>
        </header>
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </ProjectProvider>
  );
}
