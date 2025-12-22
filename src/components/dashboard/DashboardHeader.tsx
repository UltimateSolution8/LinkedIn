
import NotificationButton from "@/components/shared/NotificationButton";
import UserProfileDropdown from "@/components/shared/UserProfileDropdown";
import Logo from "@/components/common/Logo";

export default function DashboardHeader() {
  return (
    <header className="flex flex-shrink-0 items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-10 py-4 bg-white dark:bg-neutral-950 h-16 shadow-sm">
      {/* Left Side - Logo */}
      <Logo />

      {/* Right Side - Notifications and Avatar */}
      <div className="flex gap-4 items-center">
        <NotificationButton />
        <UserProfileDropdown />
      </div>
    </header>
  );
}
