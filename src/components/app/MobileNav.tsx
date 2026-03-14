
import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Menu, LayoutDashboard, Flame, Target, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import ProjectSwitcher from "./ProjectSwitcher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number;
}

interface MobileNavProps {
  leadsCount?: number;
  opportunitiesCount?: number;
}

export default function MobileNav({ leadsCount = 0, opportunitiesCount = 0 }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { projectId } = useParams<{ projectId: string }>();

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: `/app/${projectId}/dashboard`,
    },
    {
      label: "Hot Leads",
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
      label: "Settings",
      icon: Settings,
      path: `/app/${projectId}/settings`,
    },
  ];

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="text-neutral-700 dark:text-neutral-300"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
        <div className="flex-1 px-4">
          <ProjectSwitcher />
        </div>
      </div>

      {/* Mobile Drawer */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetHeader className="border-b border-neutral-200 dark:border-neutral-800">
            <SheetTitle className="text-left px-6 py-4">Navigation</SheetTitle>
          </SheetHeader>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
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
        </SheetContent>
      </Sheet>
    </div>
  );
}
