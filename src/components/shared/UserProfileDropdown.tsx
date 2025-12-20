
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
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

export default function UserProfileDropdown() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
    navigate("/login");
  };

  const getInitials = () => {
    if (!user) return "U";
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  return (
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
      <DropdownMenuContent className="w-[90vw] max-w-xs" align="end">
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
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
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
  );
}
