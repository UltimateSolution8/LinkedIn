"use client";

import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardHeader() {
  return (
    <header className="flex flex-shrink-0 items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-10 py-3 bg-white dark:bg-neutral-950">
      {/* Left Side - Title */}
      <div className="flex items-center gap-4 text-neutral-950 dark:text-white">
        <div className="w-6 h-6 text-purple-600">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
          </svg>
        </div>
        <h2 className="text-neutral-950 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
          Dashboard
        </h2>
      </div>

      {/* Right Side - Search, Notifications, Settings, Avatar */}
      <div className="flex flex-1 justify-end gap-4 items-center">
        {/* Search Bar */}
       {/* <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <Input
            type="text"
            placeholder="Search posts..."
            className="pl-10 bg-neutral-100 dark:bg-neutral-900 border-none focus-visible:ring-purple-600/50"
          />
        </div> */}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800"
          >
            <Bell className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* User Avatar */}
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
  );
}
