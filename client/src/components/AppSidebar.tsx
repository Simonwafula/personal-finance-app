import { NavLink, Link } from 'react-router-dom';
import { HiHome, HiCreditCard, HiChartBar, HiTrendingUp, HiCalculator, HiBriefcase, HiTag, HiUser, HiBell, HiBookOpen, HiClock } from 'react-icons/hi';
import Logo from './Logo';
import { useAuth } from '../contexts/AuthContext';

export default function AppSidebar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 hidden lg:block">
      <div className="h-full flex flex-col p-4">
        {/* Brand Section */}
        <Link to="/dashboard" className="flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity">
          <Logo variant="icon" width={44} height={44} />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Sonko</h2>
            <div className="text-xs text-gray-500">Financial Dashboard</div>
          </div>
        </Link>

        {/* Navigation Sections */}
        <nav className="flex-1 space-y-6 overflow-y-auto">
          {/* Overview Section */}
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-3">
              Overview
            </div>
            <div className="space-y-1">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <HiHome className="w-5 h-5" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink
                to="/transactions"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <HiCreditCard className="w-5 h-5" />
                <span>Transactions</span>
              </NavLink>
              <NavLink
                to="/accounts"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <HiBriefcase className="w-5 h-5" />
                <span>Accounts</span>
              </NavLink>
              <NavLink
                to="/notifications"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <HiBell className="w-5 h-5" />
                <span>Notifications</span>
              </NavLink>
              <NavLink
                to="/activity"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <HiClock className="w-5 h-5" />
                <span>Activity</span>
              </NavLink>
            </div>
          </div>

          {/* Planning Section */}
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-3">
              Planning
            </div>
            <div className="space-y-1">
              <NavLink
                to="/budgets"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <HiChartBar className="w-5 h-5" />
                <span>Budgets</span>
              </NavLink>
              <NavLink
                to="/debt"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <HiCalculator className="w-5 h-5" />
                <span>Debt Planner</span>
              </NavLink>
              <NavLink
                to="/subscriptions"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <HiCreditCard className="w-5 h-5" />
                <span>Subscriptions</span>
              </NavLink>
            </div>
          </div>

          {/* Growth Section */}
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-3">
              Growth
            </div>
            <div className="space-y-1">
              <NavLink
                to="/wealth"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <HiTrendingUp className="w-5 h-5" />
                <span>Net Worth</span>
              </NavLink>
              <NavLink
                to="/savings"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <HiTrendingUp className="w-5 h-5" />
                <span>Savings</span>
              </NavLink>
              <NavLink
                to="/categories"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <HiTag className="w-5 h-5" />
                <span>Categories</span>
              </NavLink>
              <NavLink
                to="/blog"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <HiBookOpen className="w-5 h-5" />
                <span>Financial Tips</span>
              </NavLink>
            </div>
          </div>
        </nav>

        {/* User Section */}
        <div className="pt-4 border-t border-gray-200 mt-4">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <HiUser className="w-5 h-5" />
            <span>{user.username || user.email}</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
