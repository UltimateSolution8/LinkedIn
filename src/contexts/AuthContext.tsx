import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getMe, logout as logoutApi, type User } from "@/lib/api/auth";
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

  // Initialize authentication state on mount by always fetching from the server.
  // This ensures server-side fields like redditConnected are always fresh and
  // avoids stale localStorage data from a previous session.
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await getMe();
        if (currentUser) {
          localStorage.setItem("user", JSON.stringify(currentUser));
        } else {
          localStorage.removeItem("user");
        }
        setUserState(currentUser);
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        localStorage.removeItem("user");
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

  // Listen for storage changes (cross-tab logout/login)
  // Re-fetch from server to ensure we have fresh data, not stale localStorage.
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user" || e.key === null) {
        getMe().then((freshUser) => {
          setUserState(freshUser);
        }).catch(() => {
          setUserState(null);
        });
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
