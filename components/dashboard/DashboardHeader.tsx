"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Settings, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout, getCurrentUser, type User as UserType } from "@/lib/api/auth";

export default function DashboardHeader() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
    router.push("/");
  };

  const getInitials = () => {
    if (!user) return "U";
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

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

      {/* Right Side - Notifications and Avatar */}
      <div className="flex flex-1 justify-end gap-4 items-center">
        {/* Notification Button */}
        <Button
          variant="ghost"
          size="icon"
          className="bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800"
        >
          <Bell className="w-5 h-5" />
        </Button>

        {/* User Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsnPGu5M6nFcPNR0KouOKeLAMoT_QLM3RLfwrXica398NguGKlrBYeLAGStadPyMyrPbTpFaZJtCdnhWnCtzOODPEFWmb60MS4P-ubvXQNWgvTATBFB6wfw0s7TOsIKIYq8Dr3GNzBaS5uV_n99hkhTkE8chwwsjpU265PVObaObAdfH6IKXj2Cct11GiqCzuHcwjpUnZI05lnaQHBpoz2uFJxQKcBn-vLN-A0o_cTN9XCTvyOgUbLxlZ_kHqeZbEPhS92pwRie6PD"
                  alt={user ? `${user.firstName} ${user.lastName}` : "User"}
                />
                <AvatarFallback className="bg-purple-600 text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user ? `${user.firstName} ${user.lastName}` : "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || ""}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/20"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
