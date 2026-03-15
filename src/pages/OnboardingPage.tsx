import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { getCurrentUser, logout } from "@/lib/api/auth";

/**
 * Onboarding page for users with zero projects
 * TODO: This is a placeholder - will be fully implemented in Story 001A
 */
export default function OnboardingPage() {
  const navigate = useNavigate();
  const { projects, isLoading, selectedProjectId } = useProject();
  const currentUser = getCurrentUser();

  // Redirect users with projects to their dashboard
  useEffect(() => {
    if (isLoading) return;

    if (projects.length > 0) {
      // User has projects, redirect to dashboard
      const projectId = selectedProjectId || projects[0]._id;
      navigate(`/app/${projectId}/dashboard`, { replace: true });
    }
  }, [projects, isLoading, selectedProjectId, navigate]);

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
  };

  const getUserFullName = () => {
    if (!currentUser) return '';
    return `${currentUser.firstName} ${currentUser.lastName}`.trim();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  // Show loading while checking projects
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header */}
      <header className="h-16 flex-shrink-0 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md px-4 md:px-8 flex items-center justify-between sticky top-0 z-10">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Rixly Logo" className="w-8" />
          <span className="text-xl font-bold text-neutral-900 dark:text-white">RIXLY</span>
        </div>

        {/* Right: User Dropdown */}
        <div className="flex items-center">
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
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Plus className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
          Create Your First Project
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          Get started with Rixly by creating your first project.
          You'll be able to track leads, identify opportunities, and monitor Reddit activity.
        </p>

        {/* CTA Button */}
        <Button
          onClick={() => navigate("/create-project")}
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Project
        </Button>

        {/* Note */}
        <p className="mt-6 text-xs text-neutral-500 dark:text-neutral-400">
          Note: Full onboarding experience will be available in Story 001A
        </p>
      </div>
      </div>
    </div>
  );
}
