import { useEffect, useState } from "react";
import { HiMenu, HiOutlineCurrencyDollar } from "react-icons/hi";
import { Outlet, NavLink, Link } from "react-router-dom";
import TimeRangeSelector from "../components/TimeRangeSelector";
import { useTimeRange } from "../contexts/TimeRangeContext";
import { fetchCurrentUser, type CurrentUser } from "../api/auth";

export default function Layout() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [open, setOpen] = useState(false);
  const { range } = useTimeRange();

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
  }, []);

  return (
    <div className="min-h-screen flex bg-[var(--bg-body)] text-[var(--text-main)]">
      <aside className="hidden md:block w-64 p-5 bg-[var(--surface)] border-r border-[var(--border-subtle)] min-h-screen">
        <div className="brand mb-6">
          <HiOutlineCurrencyDollar size={28} className="text-[var(--primary-600)]" />
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
        <header className="flex items-center justify-between p-3 bg-transparent rounded">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="hidden md:inline-flex mobile-only px-3 py-2 rounded bg-white/5 hover:bg-white/10" onClick={() => setOpen(!open)}>
              <HiMenu size={18} />
            </button>
            <div>
              <h3 style={{ margin: 0 }}>Finance Dashboard</h3>
              <div className="muted text-xs">Vibrant • Modern • Mobile</div>
            </div>
            <div className="inline-pill ml-3">{range.startDate} → {range.endDate}</div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="muted">Signed in as {user.username || user.email}</span>
                <a className="px-3 py-2 rounded bg-white/5 hover:bg-white/10" href="http://127.0.0.1:8000/accounts/logout/">
                  Logout
                </a>
              </>
            ) : (
              <a className="px-3 py-2 rounded bg-gradient-to-r from-indigo-500 to-cyan-400 text-white" href="http://127.0.0.1:8000/accounts/google/login/">
                Login with Google
              </a>
            )}
          </div>
        </header>
        <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-body)]">
          <div className="app-container py-3">
            <TimeRangeSelector />
          </div>
        </div>

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
 
