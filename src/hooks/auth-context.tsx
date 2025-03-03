import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User } from "@/types/user";
import { registerAuthLogout } from "@/services/api";

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (token: string, refreshToken: string, user: User) => void;
  logout: () => void;
  refreshAuthToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(
    () => !!localStorage.getItem("authToken")
  );

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (token: string, refreshToken: string, user: User) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("currentUser", JSON.stringify(user));
    setAuthenticated(true);
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");
    setAuthenticated(false);
    setCurrentUser(null);
  };

  useEffect(() => {
    registerAuthLogout(logout);
  }, []);

  const refreshAuthToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/login/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      localStorage.setItem("authToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
    } catch (error) {
      logout();
    }
  };

  // Remova o intervalo fixo de refresh
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "authToken") {
        setAuthenticated(!!localStorage.getItem("authToken"));
      }
      if (event.key === "currentUser") {
        const user = localStorage.getItem("currentUser");
        setCurrentUser(user ? JSON.parse(user) : null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshAuthToken();
    }, 14 * 60 * 1000); // Refresh token every 14 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, currentUser, login, logout, refreshAuthToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
