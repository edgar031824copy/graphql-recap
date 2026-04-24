import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { fetchMe } from '../api/me.ts';
import { logoutRequest } from '../api/logout.ts';

type AuthUser = { email: string };

type AuthContextType = {
  user: AuthUser | null;
  isInitializing: boolean;  // true while the /me check is in-flight on page load
  login: (email: string) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  // Start as true so the UI doesn't flash "not logged in" before /me responds
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // On every page load, ask the server "who am I?".
    // The browser automatically sends the httpOnly cookie — we never touch it in JS.
    // If the cookie is valid → set the user. If missing or expired → stay null.
    fetchMe()
      .then(({ email }) => setUser({ email }))
      .catch(() => setUser(null))
      .finally(() => setIsInitializing(false));
  }, []);

  const login = (email: string) => setUser({ email });

  const logout = async () => {
    // Tell the server to clear the cookie first, then clear local state
    await logoutRequest();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isInitializing, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
