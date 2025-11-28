import { useEffect, useState } from "react";
import { HiMenu, HiSun, HiMoon, HiX } from "react-icons/hi";
import Logo from "./Logo";
import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import TimeRangeSelector from "../components/TimeRangeSelector";
import { useTimeRange } from "../contexts/TimeRangeContext";
import { useTheme } from "../contexts/ThemeContext";
import { fetchCurrentUser, type CurrentUser } from "../api/auth";

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
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [open, setOpen] = useState(false);
  const { range, setRange } = useTimeRange();
  const { theme, toggleTheme } = useTheme();
  const [showRangePanel, setShowRangePanel] = useState(false);
  const location = useLocation();

  // Show both Login and Sign up buttons only on auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  useEffect(() => {
    async function loadUser() {
      try {
        const u = await fetchCurrentUser();
        setUser(u);
      } catch (e) {
        setUser(null);
      }
    }
    loadUser();

    // Listen for login/logout events from other components
    function handleAuthChange() {
      loadUser();
    }
    window.addEventListener('authChanged', handleAuthChange);
    return () => window.removeEventListener('authChanged', handleAuthChange);
  }, []);

  useEffect(() => {
    function onOAuthMessage(e: MessageEvent) {
      // accept messages from popup only with known shape
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === 'oauth' && e.data.success) {
        // refresh current user
        fetchCurrentUser().then(u => setUser(u)).catch(() => {});
      }
    }
    window.addEventListener('message', onOAuthMessage);
    return () => window.removeEventListener('message', onOAuthMessage);
  }, []);

  return (
    <div className="min-h-screen flex bg-[var(--bg-body)] text-[var(--text-main)]">
      <aside className="sidebar hidden md:block w-64 p-5 bg-[var(--surface)] border-r border-[var(--border-subtle)] min-h-screen">
        <div className="brand mb-6" style={{ alignItems: 'center' }}>
          <div style={{ width: 40, height: 40 }}>
            <Logo width={40} height={40} />
          </div>
          <div>
            <h2>Mstatili Finance</h2>
            <div className="muted text-xs">Personal Dashboard</div>
          </div>
        </div>
        <nav className="flex flex-col gap-1 mt-4">
          <NavLink to="/" className={({isActive}) => `px-3 py-2 rounded ${isActive ? 'bg-[var(--primary-100)] text-[var(--primary-600)]' : ''}`}>Dashboard</NavLink>
          <NavLink to="/transactions" className={({isActive}) => `px-3 py-2 rounded ${isActive ? 'bg-[var(--primary-100)] text-[var(--primary-600)]' : ''}`}>Transactions</NavLink>
          <NavLink to="/budgets" className={({isActive}) => `px-3 py-2 rounded ${isActive ? 'bg-[var(--primary-100)] text-[var(--primary-600)]' : ''}`}>Budgets</NavLink>
          <NavLink to="/wealth" className={({isActive}) => `px-3 py-2 rounded ${isActive ? 'bg-[var(--primary-100)] text-[var(--primary-600)]' : ''}`}>Wealth</NavLink>
          <NavLink to="/debt" className={({isActive}) => `px-3 py-2 rounded ${isActive ? 'bg-[var(--primary-100)] text-[var(--primary-600)]' : ''}`}>Debt Planner</NavLink>
          <NavLink to="/accounts" className={({isActive}) => `px-3 py-2 rounded ${isActive ? 'bg-[var(--primary-100)] text-[var(--primary-600)]' : ''}`}>Accounts</NavLink>
          <NavLink to="/categories" className={({isActive}) => `px-3 py-2 rounded ${isActive ? 'bg-[var(--primary-100)] text-[var(--primary-600)]' : ''}`}>Categories</NavLink>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="app-header flex flex-col md:flex-row md:items-center md:justify-between p-3 bg-transparent rounded gap-2">
            <div className="app-container w-full flex items-center justify-between">
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: 'wrap' }}>
              <button className="md:hidden inline-flex px-3 py-2 rounded bg-white/5 hover:bg-white/10" onClick={() => setOpen(!open)}>
                <HiMenu size={18} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Link to="/" aria-label="Home">
                  <Logo width={28} height={28} />
                </Link>
                <div>
                  <h3 style={{ margin: 0 }}>Finance Dashboard</h3>
                  <div className="muted text-xs">Vibrant • Modern • Mobile</div>
                </div>
              </div>
              <div className="inline-pill ml-3 hidden sm:inline-block">{range.startDate} → {range.endDate}</div>
              <div className="ml-3 hud">
                {/** HUD buttons show active state if range matches preset */}
                <button title="Last 7 days" aria-label="Last 7 days" aria-pressed={isPresetActive(range,7)} className={`hud-btn ${isPresetActive(range, 7) ? 'active' : ''}`} onClick={() => applyPresetRange(setRange, 7)}>7d</button>
                <button title="Last 30 days" aria-label="Last 30 days" aria-pressed={isPresetActive(range,30)} className={`hud-btn ${isPresetActive(range, 30) ? 'active' : ''}`} onClick={() => applyPresetRange(setRange, 30)}>30d</button>
                <button title="Last 90 days" aria-label="Last 90 days" aria-pressed={isPresetActive(range,90)} className={`hud-btn ${isPresetActive(range, 90) ? 'active' : ''}`} onClick={() => applyPresetRange(setRange, 90)}>90d</button>
                <button title="Last 1 year" aria-label="Last 1 year" aria-pressed={isPresetActive(range,365)} className={`hud-btn ${isPresetActive(range, 365) ? 'active' : ''}`} onClick={() => applyPresetRange(setRange, 365)}>1y</button>
              </div>
              <button title="Choose dates" className="ml-2 md:hidden icon-btn" onClick={() => setShowRangePanel((s) => !s)} aria-expanded={showRangePanel} aria-label="Toggle date selector">
                {showRangePanel ? (
                  <HiX size={16} aria-hidden />
                ) : (
                  // Filled calendar SVG for clearer visual
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 14H5V9h14v9z" />
                  </svg>
                )}
                <span className="sr-only">Choose dates</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button className="hud-btn" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'dark' ? <HiSun /> : <HiMoon />}
              </button>
              {user ? (
                <>
                  <span className="muted">Signed in as {user.username || user.email}</span>
                  <a className="px-3 py-2 rounded bg-white/5 hover:bg-white/10" href="http://127.0.0.1:8000/accounts/logout/">
                    Logout
                  </a>
                </>
              ) : (
                <>
                  {/* Show only Login on index/protected pages; show both on auth pages */}
                  {!isAuthPage && (
                    <Link title="Login" className="px-3 py-2 rounded bg-white/5 hover:bg-white/10" to="/login">Login</Link>
                  )}
                  <button title="Sign in with Google" aria-label="Sign in with Google" className="btn-primary ml-2" onClick={() => {
                    try {
                      const backend = 'http://127.0.0.1:8000';
                      const callback = `${window.location.origin}/oauth-callback`;
                      const url = `${backend}/accounts/google/login/?process=login&next=${encodeURIComponent(callback)}`;
                      const popup = window.open(url, 'oauth_google', 'width=600,height=700');
                      if (popup) popup.focus();
                    } catch (err) {
                      console.error('OAuth popup failed', err);
                      // fallback to full redirect
                      window.location.href = '/accounts/google/login/';
                    }
                  }}>
                    <svg width="16" height="16" viewBox="0 0 46 46" aria-hidden focusable="false" style={{verticalAlign: 'middle', marginRight: 8}}>
                      <path fill="#EA4335" d="M23 9c3 0 5.3 1 7 2.7l5-5C32.8 4.2 28.6 2 23 2 14.8 2 7.9 6.6 4 13l6.2 4.8C12 13.4 17 9 23 9z" />
                      <path fill="#4285F4" d="M46 23c0-1.6-.1-3.1-.3-4.6H23v8.7h12.9c-.6 3.1-2.7 5.7-5.8 7.4l6 4.7C42.1 36.6 46 30.3 46 23z" />
                      <path fill="#FBBC05" d="M10.2 28.2A13.7 13.7 0 0 1 9 23c0-1.6.3-3.1.9-4.4L4 13c-2.9 4.6-4 10-3 15.6L10.2 28.2z" />
                      <path fill="#34A853" d="M23 46c6.2 0 11.5-2 15.3-5.4l-6-4.7C29.9 36.3 26.7 37.8 23 37.8c-6 0-11.1-4.4-12.8-10.2L4 33C7.9 39.4 14.8 44 23 44z" />
                    </svg>
                    <span className="sr-only">Sign in with Google</span>
                  </button>
                  {/* Show Sign up only on auth pages */}
                  {isAuthPage && (
                    <Link title="Sign up" className="px-3 py-2 rounded btn-secondary ml-2" to="/signup">Sign up</Link>
                  )}
                </>
              )}
            </div>
            {/** Inline TimeRangeSelector: visible on md+, collapsible on small screens */}
            <div id="time-range-panel" className={`w-full mt-2 md:block slide-panel ${showRangePanel ? 'open' : ''}`} aria-hidden={!showRangePanel && true}>
              <div className="app-container py-1">
                <TimeRangeSelector />
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 app-container">
          <Outlet />
        </main>
      </div>

      {open && (
        <div className="mobile-nav" onClick={() => setOpen(false)}>
          <nav className="card" onClick={(e) => e.stopPropagation()}>
            <Link to="/">Dashboard</Link>
            <Link to="/transactions">Transactions</Link>
            <Link to="/budgets">Budgets</Link>
            <Link to="/wealth">Wealth</Link>
            <Link to="/debt">Debt Planner</Link>
            <Link to="/accounts">Accounts</Link>
          </nav>
        </div>
      )}
    </div>
  );
}
 
