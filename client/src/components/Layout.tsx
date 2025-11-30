import { useEffect, useState } from "react";
import { HiMenu, HiSun, HiMoon, HiX, HiHome, HiCreditCard, HiChartBar, HiTrendingUp, HiCalculator, HiBriefcase, HiUser, HiBell, HiBookOpen } from "react-icons/hi";
import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import Toast from "./Toast";
import NotificationsBell from "./NotificationsBell";
import Logo from "./Logo";
import { useTimeRange } from "../contexts/TimeRangeContext";

export default function Layout() {
  const { user, refresh } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const { range } = useTimeRange();
  
  // Ensure auth state is refreshed on route changes
  useEffect(() => {
    if (!user) {
      refresh().catch(() => {});
    }
  }, [location.pathname, user, refresh]);

  const welcomeMessage = user ? `Welcome, ${user.username || user.email}!` : "";

  useEffect(() => {
    if (user && welcomeMessage) {
      const timer = setTimeout(() => setWelcomeVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [user, welcomeMessage]);

  // Show both Login and Sign up buttons only on auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  // OAuth popup events
  useEffect(() => {
    function onOAuthMessage(e: MessageEvent) {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === 'oauth' && e.data.success) {
        window.dispatchEvent(new Event('authChanged'));
      }
    }
    window.addEventListener('message', onOAuthMessage);
    return () => window.removeEventListener('message', onOAuthMessage);
  }, []);

  // For authenticated users, use app layout with persistent sidebar
  if (user) {
    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const rangeLabel = `${formatDate(range.startDate)} – ${formatDate(range.endDate)}`;

    return (
      <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
        <Toast
          message={welcomeMessage}
          visible={welcomeVisible}
          onClose={() => setWelcomeVisible(false)}
        />
        
        {/* Desktop Sidebar - always visible on large screens */}
        <aside className="hidden lg:flex lg:flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Mstatili Finance</span>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Overview</h3>
              <div className="space-y-1">
                <NavLink to="/dashboard" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                  <HiHome className="w-5 h-5" />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="/transactions" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                  <HiCreditCard className="w-5 h-5" />
                  <span>Transactions</span>
                </NavLink>
                <NavLink to="/accounts" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                  <HiBriefcase className="w-5 h-5" />
                  <span>Accounts</span>
                </NavLink>
                <NavLink to="/notifications" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                  <HiBell className="w-5 h-5" />
                  <span>Notifications</span>
                </NavLink>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Planning</h3>
              <div className="space-y-1">
                <NavLink to="/budgets" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                  <HiChartBar className="w-5 h-5" />
                  <span>Budgets</span>
                </NavLink>
                <NavLink to="/debt" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                  <HiCalculator className="w-5 h-5" />
                  <span>Debt Planner</span>
                </NavLink>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Growth</h3>
              <div className="space-y-1">
                <NavLink to="/wealth" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                  <HiTrendingUp className="w-5 h-5" />
                  <span>Net Worth</span>
                </NavLink>
                <NavLink to="/savings" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                  <HiTrendingUp className="w-5 h-5" />
                  <span>Savings</span>
                </NavLink>
                <NavLink to="/blog" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                  <HiBookOpen className="w-5 h-5" />
                  <span>Financial Tips</span>
                </NavLink>
              </div>
            </div>
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <NavLink to="/profile" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
              <HiUser className="w-5 h-5" />
              <span>Profile</span>
            </NavLink>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm px-4 py-3 flex items-center justify-between">
            <button 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors lg:hidden" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <HiMenu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            
            <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">{rangeLabel}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <HiSun className="w-5 h-5 text-gray-700 dark:text-gray-300" /> : <HiMoon className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
              </button>
              <NotificationsBell />
              <div className="hidden lg:flex items-center gap-2 text-sm">
                <span className="text-gray-700 dark:text-gray-300 font-medium">{user.username || user.email}</span>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-xl flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Logo />
                  <span className="font-semibold text-gray-900 dark:text-white">Menu</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <HiX className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
              
              <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Overview</h3>
                  <div className="space-y-1">
                    <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                      <HiHome className="w-5 h-5" />
                      <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/transactions" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                      <HiCreditCard className="w-5 h-5" />
                      <span>Transactions</span>
                    </NavLink>
                    <NavLink to="/accounts" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                      <HiBriefcase className="w-5 h-5" />
                      <span>Accounts</span>
                    </NavLink>
                    <NavLink to="/notifications" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                      <HiBell className="w-5 h-5" />
                      <span>Notifications</span>
                    </NavLink>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Planning</h3>
                  <div className="space-y-1">
                    <NavLink to="/budgets" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                      <HiChartBar className="w-5 h-5" />
                      <span>Budgets</span>
                    </NavLink>
                    <NavLink to="/debt" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                      <HiCalculator className="w-5 h-5" />
                      <span>Debt Planner</span>
                    </NavLink>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Growth</h3>
                  <div className="space-y-1">
                    <NavLink to="/wealth" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                      <HiTrendingUp className="w-5 h-5" />
                      <span>Net Worth</span>
                    </NavLink>
                    <NavLink to="/savings" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                      <HiTrendingUp className="w-5 h-5" />
                      <span>Savings</span>
                    </NavLink>
                    <NavLink to="/blog" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                      <HiBookOpen className="w-5 h-5" />
                      <span>Financial Tips</span>
                    </NavLink>
                  </div>
                </div>
              </nav>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                  <HiUser className="w-5 h-5" />
                  <span>Profile</span>
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // For non-authenticated users, simple layout
  return (
    <div className="min-h-screen bg-gray-100">
      <Toast
        message={welcomeMessage}
        visible={welcomeVisible}
        onClose={() => setWelcomeVisible(false)}
      />
      
      {/* Simple header for auth pages */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold text-gray-900">
            Mstatili Finance
          </Link>
          
          <div className="flex items-center gap-3">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <HiSun className="w-5 h-5 text-gray-700" /> : <HiMoon className="w-5 h-5 text-gray-700" />}
            </button>
            
            {!isAuthPage && (
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                Login
              </Link>
            )}
            
            <button
              onClick={() => {
                try {
                  const callback = `${window.location.origin}/oauth-callback`;
                  const url = `/accounts/google/login/?process=login&next=${encodeURIComponent(callback)}`;
                  const popup = window.open(url, 'oauth_google', 'width=600,height=700');
                  if (popup) popup.focus();
                } catch (err) {
                  console.error('OAuth popup failed', err);
                  window.location.href = '/accounts/google/login/';
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 46 46">
                <path fill="#EA4335" d="M23 9c3 0 5.3 1 7 2.7l5-5C32.8 4.2 28.6 2 23 2 14.8 2 7.9 6.6 4 13l6.2 4.8C12 13.4 17 9 23 9z" />
                <path fill="#4285F4" d="M46 23c0-1.6-.1-3.1-.3-4.6H23v8.7h12.9c-.6 3.1-2.7 5.7-5.8 7.4l6 4.7C42.1 36.6 46 30.3 46 23z" />
                <path fill="#FBBC05" d="M10.2 28.2A13.7 13.7 0 0 1 9 23c0-1.6.3-3.1.9-4.4L4 13c-2.9 4.6-4 10-3 15.6L10.2 28.2z" />
                <path fill="#34A853" d="M23 46c6.2 0 11.5-2 15.3-5.4l-6-4.7C29.9 36.3 26.7 37.8 23 37.8c-6 0-11.1-4.4-12.8-10.2L4 33C7.9 39.4 14.8 44 23 44z" />
              </svg>
              Sign in
            </button>
            
            {isAuthPage && (
              <Link to="/signup" className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                Sign up
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
