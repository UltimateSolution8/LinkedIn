import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getCurrentUser, getMe, logout as logoutApi, type User } from "@/lib/api/auth";
import { setUserId } from "@/lib/analytics";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        let currentUser = getCurrentUser();

        // If no user in localStorage, try fetching from server (in case of Google OAuth or cleared storage)
        if (!currentUser) {
          currentUser = await getMe();
          if (currentUser) {
            // Save to localStorage so it's available for next time
            localStorage.setItem("user", JSON.stringify(currentUser));
          }
        }

        setUserState(currentUser);
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        setUserState(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // GA4: Set user_id for per-user tracking
  useEffect(() => {
    const analyticsUserId = user?._id ?? (user?.userId ? String(user.userId) : null);
    if (analyticsUserId) {
      setUserId(analyticsUserId);
    }
  }, [user]);

  // Listen for storage changes (cross-tab logout)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        const currentUser = getCurrentUser();
        setUserState(currentUser);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
  };

  const logout = async () => {
    await logoutApi();
    setUserState(null);
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
