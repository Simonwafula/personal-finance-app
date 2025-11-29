import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';
import Logo from '../components/Logo';
import { fetchCurrentUser } from '../api/auth';

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    fetchCurrentUser().then(() => navigate('/dashboard')).catch(() => {});
  }, [navigate]);

  interface TrendPoint { month: string; income: number; expenses: number; }
  interface CatPoint { name: string; amount: number; }
  // Simple deterministic sample data (no randomness / side effects)
  const spendTrend: TrendPoint[] = Array.from({ length: 12 }).map((_, i) => ({
    month: new Date(2025, i, 1).toLocaleString('en', { month: 'short' }),
    income: 80000 + i * 1500 + (i % 3) * 2200,
    expenses: 50000 + i * 1200 + (i % 4) * 1800,
  }));
  const categoryMock: CatPoint[] = [
    { name: 'Food', amount: 24000 },
    { name: 'Transport', amount: 18000 },
    { name: 'Housing', amount: 35000 },
    { name: 'Health', amount: 12000 },
    { name: 'Leisure', amount: 9000 },
    { name: 'Other', amount: 7000 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 -left-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center space-y-8 pt-12 animate-fade-in">
          <div className="flex justify-center">
            <Logo width={80} height={80} />
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
              Your Financial
            </span>
            <span className="block mt-2 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-transparent bg-clip-text">
              Command Center
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed">
            Track spending, grow wealth, plan budgets, and visualize progress with a unified, secure dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/signup" className="btn-primary px-10 py-5 text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
              Get Started Free
            </Link>
            <Link to="/login" className="btn-secondary px-10 py-5 text-lg font-semibold hover:scale-105 transition-all">
              Log In
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-[var(--text-muted)] pt-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No Credit Card</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Real-time Insights</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-8 animate-slide-in">
          {[
            {
              title: 'Spending Intelligence',
              desc: 'Tag, categorize, and analyze expense trends with powerful filters.',
              icon: '📊',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              title: 'Wealth Tracking',
              desc: 'Monitor assets, debts, and net worth trajectory in real-time.',
              icon: '💰',
              color: 'from-green-500 to-emerald-500'
            },
            {
              title: 'Budget Planning',
              desc: 'Set goals, allocate funds, and prevent overspending effortlessly.',
              icon: '🎯',
              color: 'from-purple-500 to-pink-500'
            },
            {
              title: 'Debt Strategy',
              desc: 'Organize obligations and plan payoff progress with clarity.',
              icon: '📉',
              color: 'from-orange-500 to-red-500'
            },
            {
              title: 'Real-time Insights',
              desc: 'Adaptive date ranges with instant aggregations and charts.',
              icon: '⚡',
              color: 'from-yellow-500 to-orange-500'
            },
            {
              title: 'Premium UI/UX',
              desc: 'Glassmorphism, gradients, and micro-animations for clarity.',
              icon: '✨',
              color: 'from-indigo-500 to-purple-500'
            },
          ].map(card => (
            <div key={card.title} className="card-elevated backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 p-6 hover:scale-105 transition-all group">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              <h3 className="font-bold text-xl mb-2">{card.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Security Section */}
        <div className="card-elevated backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 p-8 md:p-12 rounded-3xl animate-scale-in">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 space-y-4">
              <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-2">
                🔒 Privacy First
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Your Data, Your Control</h2>
              <p className="text-lg text-[var(--text-muted)] leading-relaxed">
                Your financial data is protected using secure session authentication. Password reset flows and limited exposure of sensitive endpoints reduce risk. No third-party trackers.
              </p>
              <div className="flex gap-4 pt-4">
                <Link to="/signup" className="btn-primary px-6 py-3 hover:scale-105 transition-transform">Create Account</Link>
                <Link to="/login" className="btn-secondary px-6 py-3 hover:scale-105 transition-transform">Access Dashboard</Link>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: 'Encrypted Sessions', desc: 'Secure cookie-based auth', icon: '🔐' },
                  { title: 'Role Isolation', desc: 'Only your data, private', icon: '👤' },
                  { title: 'Recovery Flow', desc: 'Password reset guidance', icon: '🔄' },
                  { title: 'Performance', desc: 'Fast aggregation pipeline', icon: '⚡' },
                ].map(item => (
                  <div key={item.title} className="p-5 rounded-xl bg-gradient-to-br from-[var(--surface)] to-[var(--surface-glass)] hover:scale-105 transition-transform">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className="font-semibold text-sm">{item.title}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Preview Section */}
        <div className="space-y-10 animate-fade-in">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">See Insights Before You Join</h2>
            <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
              Powerful visualizations help you understand your money at a glance
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="card-elevated backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">📈</span>
                Sample Cashflow Trend
              </h3>
              <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={spendTrend}>
                <defs>
                  <linearGradient id="landingIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--success-400)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--success-400)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="landingExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--danger-400)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--danger-400)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.3} />
                <XAxis dataKey="month" stroke="var(--text-muted)" />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)',
                  }}
                />
                <Area type="monotone" dataKey="income" stroke="var(--success-400)" strokeWidth={2} fill="url(#landingIncome)" />
                <Area type="monotone" dataKey="expenses" stroke="var(--danger-400)" strokeWidth={2} fill="url(#landingExpense)" />
              </AreaChart>
            </ResponsiveContainer>
            </div>
            <div className="card-elevated backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Example Expense Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={260}>
              <BarChart layout="vertical" data={categoryMock}>
                <defs>
                  <linearGradient id="landingCat" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--accent-400)" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="var(--accent-500)" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.3} />
                <XAxis type="number" stroke="var(--text-muted)" />
                <YAxis type="category" dataKey="name" width={80} stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '12px' }} />
                <Bar dataKey="amount" fill="url(#landingCat)" radius={[0,8,8,0]} />
              </BarChart>
            </ResponsiveContainer>
            </div>
          </div>
          <div className="text-center pt-4">
            <Link to="/signup" className="btn-primary px-10 py-5 text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
              Start Tracking Now
            </Link>
          </div>
        </div>

        <footer className="text-center text-sm text-[var(--text-muted)] pt-16 pb-8 border-t border-[var(--border-subtle)]">
          <p>© {new Date().getFullYear()} Mstatili Finance. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
