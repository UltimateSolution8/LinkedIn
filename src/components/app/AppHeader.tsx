
import { Bell } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import ProjectSwitcher from "./ProjectSwitcher";
import { useState } from "react";
import { getFeedbackStatus } from "@/lib/api/feedback";
import LogoutFeedbackPromptDialog from "./LogoutFeedbackPromptDialog";

export default function AppHeader() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { user: currentUser, logout: authLogout } = useAuth();
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const [processingLogout, setProcessingLogout] = useState(false);

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
  };

  const getUserFullName = () => {
    if (!currentUser) return '';
    return `${currentUser.firstName} ${currentUser.lastName}`.trim();
  };

  const performLogout = async () => {
    setProcessingLogout(true);
    await authLogout();
    navigate("/login", { replace: true });
  };

  const handleLogout = async () => {
    try {
      const status = await getFeedbackStatus();
      if (status.submitted) {
        await performLogout();
        return;
      }
      setShowFeedbackPrompt(true);
    } catch (error) {
      console.warn("[AppHeader] Failed to fetch feedback status, showing prompt by default.", error);
      setShowFeedbackPrompt(true);
    } finally {
      setProcessingLogout(false);
    }
  };

  const handleShareFeedback = () => {
    setShowFeedbackPrompt(false);
    if (projectId) {
      navigate(`/app/${projectId}/feedback`);
      return;
    }
    navigate("/profile");
  };

  const handleLogoutDirectly = async () => {
    setShowFeedbackPrompt(false);
    await performLogout();
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <header className="h-16 flex-shrink-0 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
      {/* Left: Project Switcher */}
      <div className="flex items-center gap-4">
        <ProjectSwitcher />
        {/* TODO: Status badge will be added in Story 001B for extraction progress */}
      </div>

      {/* Right: Notifications + User Dropdown */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/notifications")}
          className="text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg"
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* Divider */}
        <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-800"></div>

        {/* User Dropdown */}
        {currentUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 p-1.5 rounded-lg transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs">
                    {getUserInitials(currentUser.firstName, currentUser.lastName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {getUserFullName()}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                  {currentUser.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/notifications")} className="cursor-pointer">
                Notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <LogoutFeedbackPromptDialog
        open={showFeedbackPrompt}
        onOpenChange={setShowFeedbackPrompt}
        onShareFeedback={handleShareFeedback}
        onLogoutDirectly={handleLogoutDirectly}
        isProcessing={processingLogout}
      />
    </header>
  );
}
