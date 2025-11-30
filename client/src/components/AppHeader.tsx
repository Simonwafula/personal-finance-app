import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AppHeaderProps {
  pageTitle: string;
  subtitle?: string;
}

export default function AppHeader({ pageTitle, subtitle }: AppHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
      {/* Left: Page Title + Breadcrumb/Description */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900">{pageTitle}</h1>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>

      {/* Right: User Info */}
      <div className="flex items-center gap-3">
        {user && (
          <>
            {/* User Profile Link */}
            <Link
              to="/profile"
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-blue-600 transition-all"
            >
              {/* Avatar Circle with Initials */}
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                {(user.username || user.email)?.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900">
                  {user.username || user.email?.split('@')[0]}
                </div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
            </Link>

            {/* Logout Button */}
            <button
              onClick={() => {
                if (window.sessionStorage) sessionStorage.clear();
                if (window.localStorage) localStorage.clear();
                window.location.href = '/accounts/logout/';
              }}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-all"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
