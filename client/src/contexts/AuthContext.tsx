import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { fetchCurrentUser, type CurrentUser } from '../api/auth';

interface AuthContextValue {
  user: CurrentUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logoutLocal: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const u = await fetchCurrentUser();
      setUser(u);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Listen for global authChanged events
  useEffect(() => {
    function handler(e: Event) {
      // Support optimistic user injection via CustomEvent detail
      if (e instanceof CustomEvent && e.detail) {
        setUser(e.detail as CurrentUser);
        setLoading(false);
      } else {
        load();
      }
    }
    window.addEventListener('authChanged', handler as EventListener);
    return () => window.removeEventListener('authChanged', handler as EventListener);
  }, [load]);

  const refresh = async () => { await load(); };
  const logoutLocal = () => { setUser(null); };

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logoutLocal }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
