
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { LayoutDashboard, Flame, Target, Settings, Plus, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { getSubscriptionStatusCached } from "@/lib/utils/subscription";
import { getUserStatusLabel } from "@/lib/utils/subscriptionLabels";
import { SubscriptionStatus } from "@/lib/api/subscription";
import { useProject } from "@/contexts/ProjectContext";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number;
}

interface AppSidebarProps {
  leadsCount?: number;
  opportunitiesCount?: number;
}

export default function AppSidebar({ leadsCount = 0, opportunitiesCount = 0 }: AppSidebarProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { projects } = useProject();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);

  // Fetch subscription status on mount
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const status = await getSubscriptionStatusCached();
        setSubscriptionStatus(status);
      } catch (error) {
        console.error("Error fetching subscription status:", error);
      }
    };

    fetchSubscription();
  }, []);

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: `/app/${projectId}/dashboard`,
    },
    {
      label: "Hot leads",
      icon: Flame,
      path: `/app/${projectId}/leads`,
      badge: leadsCount,
    },
    {
      label: "Opportunities",
      icon: Target,
      path: `/app/${projectId}/opportunities`,
      badge: opportunitiesCount,
    },
    {
      label: "Playbook",
      icon: BookOpen,
      path: `/app/${projectId}/playbook`,
    },
    {
      label: "Settings",
      icon: Settings,
      path: `/app/${projectId}/settings`,
    },
  ];

  const maxProjects = subscriptionStatus?.subscription?.planDetails?.maxProjects || 2;
  const isAdmin = currentUser?.role === 'admin';
  const isCreateButtonDisabled = !isAdmin && projects.length >= maxProjects;

  const handleNewProject = () => {
    if (!isCreateButtonDisabled) {
      navigate("/create-project");
    }
  };

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
  };

  const getUserFullName = () => {
    if (!currentUser) return '';
    return `${currentUser.firstName} ${currentUser.lastName}`.trim();
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:border-neutral-200 dark:lg:border-neutral-800 lg:bg-white dark:lg:bg-neutral-950">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <img
          src="/logo.png"
          alt="Rixly Logo"
          className="w-8 h-8 object-contain logo-theme-tint"
        />
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">Rixly</h1>
      </div>

      {/* New Project Button */}
      <div className="px-4 mb-6">
        <Button
          onClick={handleNewProject}
          disabled={isCreateButtonDisabled}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition-colors",
            isCreateButtonDisabled
              ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 text-white"
          )}
        >
          <Plus className="h-4 w-4" />
          <span>{isCreateButtonDisabled ? `Max ${maxProjects} projects` : "New project"}</span>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors relative",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                )
              }
            >
              {() => (
                <>
                  <Icon className="h-5 w-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-xs px-2 py-0.5"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile */}
      {currentUser && (
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                {getUserInitials(currentUser.firstName, currentUser.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                {getUserFullName()}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                {getUserStatusLabel(subscriptionStatus)}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
