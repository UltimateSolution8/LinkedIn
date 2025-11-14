"use client";

import Logo from "@/components/common/Logo";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full flex-col">
      <header className="flex-shrink-0 border-b border-neutral-200 dark:border-neutral-800 px-10 py-3 bg-white dark:bg-neutral-950">
        <Logo />
      </header>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
