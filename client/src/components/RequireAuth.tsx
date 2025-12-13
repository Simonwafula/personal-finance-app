import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { ReactElement } from 'react';

export default function RequireAuth({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="app-container py-16 text-center animate-fade-in" role="status" aria-live="polite">
        <div className="loading-spinner mx-auto mb-4" />
        <div className="text-sm text-[var(--text-muted)]">Authenticating…</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
