
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import NotificationButton from "@/components/shared/NotificationButton";
import UserProfileDropdown from "@/components/shared/UserProfileDropdown";

export default function DashboardHeader() {
  const navigate = useNavigate();

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
        <NotificationButton />

        {/* User Profile Dropdown */}
        <UserProfileDropdown />
      </div>
    </header>
  );
}
