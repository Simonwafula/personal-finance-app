import { useEffect, useState } from "react";
import { HiMenu, HiSun, HiMoon, HiX, HiHome, HiCreditCard, HiChartBar, HiTrendingUp, HiCalculator, HiBriefcase, HiTag, HiUser, HiBell, HiBookOpen, HiDocumentReport } from "react-icons/hi";
import Logo from "./Logo";
import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import TimeRangeSelector from "../components/TimeRangeSelector";
import { useTimeRange } from "../contexts/TimeRangeContext";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import Toast from "./Toast";
import NotificationsBell from "./NotificationsBell";
import BlogSidebar from "./BlogSidebar";

function fmtDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function isPresetActive(range: { startDate: string; endDate: string }, days: number) {
  try {
    const s = new Date(range.startDate);
    const e = new Date(range.endDate);
    const diff = Math.round(Math.abs((e.getTime() - s.getTime()) / (24 * 60 * 60 * 1000)));
    // Accept a tolerance of 1 day
    if (days === 365) return Math.abs(diff - 365) <= 1;
    return Math.abs(diff - days) <= 1;
  } catch (e) {
    return false;
  }
}

function applyPresetRange(setRange: (r: { startDate: string; endDate: string }) => void, days: number) {
  const end = new Date();
  const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  setRange({ startDate: fmtDate(start), endDate: fmtDate(end) });
}

export default function Layout() {
  const { user, refresh } = useAuth();
  const [open, setOpen] = useState(false);
  const { range, setRange } = useTimeRange();
  const { theme, toggleTheme } = useTheme();
  const [showRangePanel, setShowRangePanel] = useState(false);
  const location = useLocation();
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  // Ensure auth state is refreshed on route changes (fallback if optimistic failed)
  useEffect(() => {
    if (!user) {
      refresh().catch(() => {});
    }
  }, [location.pathname]);

  useEffect(() => {
    console.log('Layout: user state changed:', user);
    console.log('Layout: should render sidebar?', !!user);
    if (user) {
      setWelcomeMessage(`Welcome, ${user.username || user.email}!`);
      setWelcomeVisible(true);
    }
  }, [user]);


  // Show both Login and Sign up buttons only on auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  // OAuth popup events still dispatched; AuthContext listens to authChanged globally.
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

  return (
    <div className="min-h-screen flex bg-[var(--bg-body)] text-[var(--text-main)]">
      <Toast
        message={welcomeMessage}
        visible={welcomeVisible}
        onClose={() => setWelcomeVisible(false)}
      />
      {/* Enhanced Sidebar with Icons and Sections */}
      {user && (
        <aside className="sidebar animate-fade-in relative z-[60]">
          <div className="brand mb-8">
            <div style={{ width: 44, height: 44 }}>
              <Logo width={44} height={44} />
            </div>
            <div>
              <h2 className="text-xl">Mstatili Finance</h2>
              <div className="muted text-xs">Personal Dashboard</div>
            </div>
          </div>
          
          <div className="sidebar-section" aria-label="Primary navigation">
            <div className="sidebar-section-title">Overview</div>
            <nav>
              <NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>
                <HiHome className="nav-icon" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/transactions" className={({isActive}) => isActive ? 'active' : ''}>
                <HiCreditCard className="nav-icon" />
                <span>Transactions</span>
              </NavLink>
              <NavLink to="/accounts" className={({isActive}) => isActive ? 'active' : ''}>
                <HiBriefcase className="nav-icon" />
                <span>Accounts</span>
              </NavLink>
              <NavLink to="/notifications" className={({isActive}) => isActive ? 'active' : ''}>
                <HiBell className="nav-icon" />
                <span>Notifications</span>
              </NavLink>
            </nav>
          </div>

          <div className="sidebar-section" aria-label="Planning navigation">
            <div className="sidebar-section-title">Planning</div>
            <nav>
              <NavLink to="/budgets" className={({isActive}) => isActive ? 'active' : ''}>
                <HiChartBar className="nav-icon" />
                <span>Budgets</span>
              </NavLink>
              <NavLink to="/debt" className={({isActive}) => isActive ? 'active' : ''}>
                <HiCalculator className="nav-icon" />
                <span>Debt Planner</span>
              </NavLink>
              <NavLink to="/subscriptions" className={({isActive}) => isActive ? 'active' : ''}>
                <HiCreditCard className="nav-icon" />
                <span>Subscriptions</span>
              </NavLink>
              <NavLink to="/reports" className={({isActive}) => isActive ? 'active' : ''}>
                <HiDocumentReport className="nav-icon" />
                <span>Reports</span>
              </NavLink>
            </nav>
          </div>

          <div className="sidebar-section" aria-label="Growth navigation">
            <div className="sidebar-section-title">Growth</div>
            <nav aria-label="User navigation">
              <NavLink to="/wealth" className={({isActive}) => isActive ? 'active' : ''} aria-label="Net Worth">
                <HiTrendingUp className="nav-icon" />
                <span>Net Worth</span>
              </NavLink>
              <NavLink to="/savings" className={({isActive}) => isActive ? 'active' : ''} aria-label="Savings Goals">
                <HiTrendingUp className="nav-icon" />
                <span>Savings</span>
              </NavLink>
              <NavLink to="/investments" className={({isActive}) => isActive ? 'active' : ''} aria-label="Investments">
                <HiTrendingUp className="nav-icon" />
                <span>Investments</span>
              </NavLink>
              <NavLink to="/categories" className={({isActive}) => isActive ? 'active' : ''}>
                <HiTag className="nav-icon" />
                <span>Categories</span>
              </NavLink>
              <NavLink to="/blog" className={({isActive}) => isActive ? 'active' : ''}>
                <HiBookOpen className="nav-icon" />
                <span>Financial Tips</span>
              </NavLink>
            </nav>
          </div>

          {/* User Section */}
          <div className="sidebar-section mt-auto pt-6 border-t border-[var(--border-subtle)]">
            <nav>
              <NavLink to="/profile" className={({isActive}) => isActive ? 'active' : ''}>
                <HiUser className="nav-icon" />
                <span>{user.username || user.email}</span>
              </NavLink>
            </nav>
          </div>
        </aside>
      )}

      <div className="flex-1 flex flex-col">
        {/* Enhanced Header with Glassmorphism */}
        <header className="app-header animate-slide-in">
          <div className="flex items-center gap-3 flex-1">
            <button className="mobile-only icon-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu">
              <HiMenu size={20} />
            </button>
            
            <div className="flex items-center gap-3">
              <Link to="/" aria-label="Home" className="hidden md:flex">
                <Logo width={32} height={32} />
              </Link>
              <div className="hidden md:block">
                <h3 className="text-lg font-bold m-0">Finance Dashboard</h3>
                <div className="muted text-xs">Your Financial Command Center</div>
              </div>
            </div>

            {user && (
              <>
                <div className="inline-pill hidden lg:inline-flex">
                  {range.startDate} → {range.endDate}
                </div>
                <div className="hud hidden lg:flex">
                  <button
                    className={`hud-btn ${isPresetActive(range, 7) ? 'active' : ''}`}
                    onClick={() => applyPresetRange(setRange, 7)}
                    aria-label="Last 7 days"
                  >7d</button>
                  <button
                    className={`hud-btn ${isPresetActive(range, 30) ? 'active' : ''}`}
                    onClick={() => applyPresetRange(setRange, 30)}
                    aria-label="Last 30 days"
                  >30d</button>
                  <button
                    className={`hud-btn ${isPresetActive(range, 90) ? 'active' : ''}`}
                    onClick={() => applyPresetRange(setRange, 90)}
                    aria-label="Last 90 days"
                  >90d</button>
                  <button
                    className={`hud-btn ${isPresetActive(range, 365) ? 'active' : ''}`}
                    onClick={() => applyPresetRange(setRange, 365)}
                    aria-label="Last 1 year"
                  >1y</button>
                </div>
              </>
            )}

            {user && (
              <button
                className="icon-btn lg:hidden"
                onClick={() => setShowRangePanel(!showRangePanel)}
                aria-label="Toggle date selector"
              >
                {showRangePanel ? <HiX size={18} /> : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 14H5V9h14v9z" />
                  </svg>
                )}
              </button>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <button
              className="icon-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === 'dark' ? <HiSun size={18} /> : <HiMoon size={18} />}
            </button>

            {user && <NotificationsBell />}

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)] hover:border-[var(--primary-400)] transition-all"
                >
                  <HiUser size={16} />
                  <span className="font-semibold">{user.username || user.email}</span>
                </Link>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    // Clear local state and storage
                    if (window.sessionStorage) sessionStorage.clear();
                    if (window.localStorage) localStorage.clear();
                    // Force full page reload to logout URL
                    window.location.href = '/accounts/logout/';
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {!isAuthPage && (
                  <Link className="btn-secondary" to="/login">
                    Login
                  </Link>
                )}
                <button
                  className="btn-primary flex items-center gap-2"
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
                  title="Sign in with Google"
                >
                  <svg width="16" height="16" viewBox="0 0 46 46" aria-hidden>
                    <path fill="#EA4335" d="M23 9c3 0 5.3 1 7 2.7l5-5C32.8 4.2 28.6 2 23 2 14.8 2 7.9 6.6 4 13l6.2 4.8C12 13.4 17 9 23 9z" />
                    <path fill="#4285F4" d="M46 23c0-1.6-.1-3.1-.3-4.6H23v8.7h12.9c-.6 3.1-2.7 5.7-5.8 7.4l6 4.7C42.1 36.6 46 30.3 46 23z" />
                    <path fill="#FBBC05" d="M10.2 28.2A13.7 13.7 0 0 1 9 23c0-1.6.3-3.1.9-4.4L4 13c-2.9 4.6-4 10-3 15.6L10.2 28.2z" />
                    <path fill="#34A853" d="M23 46c6.2 0 11.5-2 15.3-5.4l-6-4.7C29.9 36.3 26.7 37.8 23 37.8c-6 0-11.1-4.4-12.8-10.2L4 33C7.9 39.4 14.8 44 23 44z" />
                  </svg>
                  <span className="hidden sm:inline">Sign in</span>
                </button>
                {isAuthPage && (
                  <Link className="btn-secondary" to="/signup">
                    Sign up
                  </Link>
                )}
              </>
            )}
          </div>
        </header>

        {/* Collapsible Date Range Selector */}
        {user && (
          <div className={`slide-panel ${showRangePanel ? 'open' : ''} relative z-[20]`}>
            <div className="app-container py-3">
              <TimeRangeSelector />
            </div>
          </div>
        )}

        <main className="app-container animate-fade-in">
          {(() => {
            const shouldShowSidebar = user && 
              location.pathname !== '/dashboard' && 
              !location.pathname.startsWith('/login') && 
              !location.pathname.startsWith('/signup') && 
              location.pathname !== '/';

            return shouldShowSidebar ? (
              <div className="flex gap-6">
                <div className="flex-1 min-w-0">
                  <Outlet />
                </div>
                <aside className="w-80 flex-shrink-0">
                  <div className="sticky top-6">
                    <BlogSidebar />
                  </div>
                </aside>
              </div>
            ) : (
              <Outlet />
            );
          })()}
        </main>
      </div>

      {/* Enhanced Mobile Navigation */}
      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="mobile-nav-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Menu</h3>
              <button onClick={() => setOpen(false)} className="icon-btn" aria-label="Close menu">
                <HiX size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              <NavLink to="/dashboard" onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>
                <HiHome className="nav-icon" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/notifications" onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>
                <HiBell className="nav-icon" />
                <span>Notifications</span>
              </NavLink>
              <NavLink to="/transactions" onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>
                <HiCreditCard className="nav-icon" />
                <span>Transactions</span>
              </NavLink>
              <NavLink to="/accounts" onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>
                <HiBriefcase className="nav-icon" />
                <span>Accounts</span>
              </NavLink>
              <NavLink to="/budgets" onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>
                <HiChartBar className="nav-icon" />
                <span>Budgets</span>
              </NavLink>
              <NavLink to="/debt" onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>
                <HiCalculator className="nav-icon" />
                <span>Debt Planner</span>
              </NavLink>
              <NavLink to="/subscriptions" onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>
                <HiCreditCard className="nav-icon" />
                <span>Subscriptions</span>
              </NavLink>
              <NavLink to="/reports" onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>
                <HiDocumentReport className="nav-icon" />
                <span>Reports</span>
              </NavLink>
              <NavLink to="/wealth" onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>
                <HiTrendingUp className="nav-icon" />
                <span>Net Worth</span>
              </NavLink>
              <NavLink to="/categories" onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>
                <HiTag className="nav-icon" />
                <span>Categories</span>
              </NavLink>
              {user && (
                <NavLink to="/profile" onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>
                  <HiUser className="nav-icon" />
                  <span>Profile</span>
                </NavLink>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
