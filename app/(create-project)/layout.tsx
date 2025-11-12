"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
            <div className="w-6 h-6 text-purple-600">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  clipRule="evenodd"
                  d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </svg>
            </div>
            <h2 className="text-neutral-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              Rixly
            </h2>
          </div>

          {/* Right Side - Notification & Avatar */}
          <div className="flex flex-1 justify-end items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700"
            >
              <Bell className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
            </Button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBsnPGu5M6nFcPNR0KouOKeLAMoT_QLM3RLfwrXica398NguGKlrBYeLAGStadPyMyrPbTpFaZJtCdnhWnCtzOODPEFWmb60MS4P-ubvXQNWgvTATBFB6wfw0s7TOsIKIYq8Dr3GNzBaS5uV_n99hkhTkE8chwwsjpU265PVObaObAdfH6IKXj2Cct11GiqCzuHcwjpUnZI05lnaQHBpoz2uFJxQKcBn-vLN-A0o_cTN9XCTvyOgUbLxlZ_kHqeZbEPhS92pwRie6PD")`
              }}
              role="img"
              aria-label="User avatar"
            />
          </div>
        </header>

        {/* Main Content */}
        {children}
      </div>
    </div>
  );
}
