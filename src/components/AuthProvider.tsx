/**
 * SwarSaarthi — Global Authentication Context Provider
 *
 * Requirements addressed:
 * 1. When the application loads, if and only if a pre-existing token exists in localStorage,
 *    an API call to GET /api/auth/me is made to verify the session.
 * 2. If the API check fails (401 Unauthorized, token expired, invalid token, user deleted),
 *    an automatic logout is performed (token removed, state reset).
 * 3. If no token exists in localStorage, NO API call is made.
 * 4. Exposes user, isLoggedIn, isLoading, login, logout, and checkAuth to the entire app.
 */

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  authApi,
  type User,
} from "@/lib/api";

interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (token: string, user?: User) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  checkAuth: async () => false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    const token = getAuthToken();

    // Only call authentication API if token exists in localStorage
    if (!token) {
      setUser(null);
      setIsLoggedIn(false);
      setIsLoading(false);
      return false;
    }

    try {
      const currentUser = await authApi.getMe();
      setUser(currentUser);
      setIsLoggedIn(true);
      setIsLoading(false);
      return true;
    } catch (err) {
      console.warn("Stored auth token is invalid or expired. Performing logout.", err);
      removeAuthToken();
      setUser(null);
      setIsLoggedIn(false);
      setIsLoading(false);
      return false;
    }
  }, []);

  const login = useCallback(
    (token: string, newUser?: User) => {
      setAuthToken(token);
      if (newUser) {
        setUser(newUser);
        setIsLoggedIn(true);
        setIsLoading(false);
      } else {
        checkAuth();
      }
    },
    [checkAuth]
  );

  const logout = useCallback(() => {
    removeAuthToken();
    setUser(null);
    setIsLoggedIn(false);
    setIsLoading(false);
  }, []);

  // When app opens, verify auth ONLY if token exists in localStorage
  useEffect(() => {
    checkAuth();

    // Listen for cross-tab storage changes (login/logout in other tabs)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "swarsaarthi_token") {
        if (!e.newValue) {
          setUser(null);
          setIsLoggedIn(false);
          setIsLoading(false);
        } else {
          checkAuth();
        }
      }
    };

    // Listen for custom auth events within the same tab
    const handleAuthChanged = () => {
      const token = getAuthToken();
      if (!token) {
        setUser(null);
        setIsLoggedIn(false);
        setIsLoading(false);
      } else {
        checkAuth();
      }
    };

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("swarsaarthi_auth_changed", handleAuthChanged);
    window.addEventListener("swarsaarthi_unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("swarsaarthi_auth_changed", handleAuthChanged);
      window.removeEventListener("swarsaarthi_unauthorized", handleUnauthorized);
    };
  }, [checkAuth, logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoggedIn,
      isLoading,
      login,
      logout,
      checkAuth,
    }),
    [user, isLoggedIn, isLoading, login, logout, checkAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
