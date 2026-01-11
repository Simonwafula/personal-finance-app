import { useEffect, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { fetchCurrentUser } from "../api/auth";

const AuthLink = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => (
  <Link to="/login" className={className}>
    {children}
  </Link>
);

const chartData = [
  { date: "Nov 1", income: 8000, expenses: 5200 },
  { date: "Nov 5", income: 8000, expenses: 7300 },
  { date: "Nov 10", income: 27000, expenses: 12300 },
  { date: "Nov 15", income: 27000, expenses: 8900 },
  { date: "Nov 20", income: 35000, expenses: 15200 },
  { date: "Nov 25", income: 35000, expenses: 9800 },
  { date: "Nov 30", income: 35000, expenses: 6700 },
];

const accounts = [
  { name: "M-Pesa", balance: "KES 45,200", icon: "📱" },
  { name: "KCB Salary", balance: "KES 62,100", icon: "🏦" },
  { name: "SACCO", balance: "KES 18,130", icon: "🤝" },
];

const features = [
  {
    title: "Budget Tracker",
    desc: "Set spending limits by category and track progress throughout the month.",
    icon: "📊",
  },
  {
    title: "Debt Planner",
    desc: "Compare snowball vs avalanche strategies with payment timelines.",
    icon: "💳",
  },
  {
    title: "Savings Goals",
    desc: "Set targets with deadlines and track contributions over time.",
    icon: "🎯",
  },
  {
    title: "Net Worth Tracker",
    desc: "Monitor assets, liabilities, and see your financial health over time.",
    icon: "💰",
  },
  {
    title: "Investment Portfolio",
    desc: "Track stocks, funds, crypto, insurance and calculate returns.",
    icon: "📈",
  },
  {
    title: "Subscription Manager",
    desc: "Keep track of recurring payments and their renewal dates.",
    icon: "🔄",
  },
];

const stats = [
  { label: "Accounts", value: "Unlimited" },
  { label: "Price", value: "Free" },
  { label: "Data", value: "Exportable" },
];

const faqs = [
  {
    q: "How do I add my accounts?",
    a: "Simply create accounts manually - add your M-Pesa, bank accounts, SACCO, or cash on hand. Enter the current balance and start tracking.",
  },
  {
    q: "Can I export my data?",
    a: "Yes! Export all your transactions, accounts, and reports to CSV format. Your data is yours - no lock-in.",
  },
  {
    q: "Is it really free?",
    a: "Yes! All current features are completely free: unlimited transactions, budgets, debt planning, savings goals, and more.",
  },
  {
    q: "How secure is my data?",
    a: "Protected with encrypted sessions and secure authentication. Your data is isolated and never sold to third parties.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser()
      .then(() => navigate("/dashboard"))
      .catch(() => {});
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Subtle background gradient */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Text Content */}
              <div className="space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/50 text-sm font-medium text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Built for Kenya
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-slate-900 dark:text-white">
                  Your finances,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    simplified
                  </span>
                </h1>

                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-lg mx-auto lg:mx-0">
                  Track income, expenses, budgets, investments, and debts in one clean dashboard. Made for M-Pesa users.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <AuthLink className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5">
                    Get Started Free
                    <span>→</span>
                  </AuthLink>
                  <button
                    onClick={() => {
                      document.querySelector("[data-section='demo']")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                  >
                    See Demo
                  </button>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Dashboard Preview */}
              <div className="relative">
                <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-2xl shadow-slate-900/10 dark:shadow-black/30 border border-slate-200 dark:border-slate-700 p-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">Net Worth</div>
                      <div className="text-3xl font-bold text-slate-900 dark:text-white">KES 1,245,300</div>
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                      +3.4% this month
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Income vs Expenses</span>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          Income
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          Expenses
                        </span>
                      </div>
                    </div>
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="heroIncome" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="rgb(59, 130, 246)" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="rgb(59, 130, 246)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="heroExpenses" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="rgb(244, 63, 94)" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="rgb(244, 63, 94)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" hide />
                          <YAxis hide />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(15, 23, 42, 0.95)",
                              border: "none",
                              borderRadius: "8px",
                              color: "white",
                              fontSize: "12px",
                            }}
                            labelStyle={{ color: "#94a3b8" }}
                          />
                          <Area type="monotone" dataKey="income" stroke="rgb(59, 130, 246)" strokeWidth={2} fill="url(#heroIncome)" />
                          <Area type="monotone" dataKey="expenses" stroke="rgb(244, 63, 94)" strokeWidth={2} fill="url(#heroExpenses)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Accounts */}
                  <div className="space-y-2">
                    {accounts.map((acc) => (
                      <div
                        key={acc.name}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{acc.icon}</span>
                          <span className="font-medium text-slate-900 dark:text-white">{acc.name}</span>
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{acc.balance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-slate-900/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Everything you need to manage money
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Powerful tools designed for the Kenyan market. Track M-Pesa, banks, SACCOs, and more.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-blue-800 transition-all hover:-translate-y-1"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section data-section="demo" className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/50 text-sm font-medium text-blue-700 dark:text-blue-300 mb-4">
                Live Preview
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                See it in action
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                A real-time view of all your finances in one place
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Chart */}
              <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">30-Day Overview</h3>
                  <div className="px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                    +12% vs last month
                  </div>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgb(59, 130, 246)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="rgb(59, 130, 246)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgb(244, 63, 94)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="rgb(244, 63, 94)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="rgb(148, 163, 184)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgb(148, 163, 184)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.95)",
                          border: "none",
                          borderRadius: "8px",
                          color: "white",
                        }}
                        labelStyle={{ color: "#94a3b8" }}
                      />
                      <Area type="monotone" dataKey="income" stroke="rgb(59, 130, 246)" strokeWidth={2} fill="url(#colorIncome)" />
                      <Area type="monotone" dataKey="expenses" stroke="rgb(244, 63, 94)" strokeWidth={2} fill="url(#colorExpenses)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Side Panel */}
              <div className="space-y-6">
                {/* Summary Card */}
                <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">
                    This Month
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Income</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">+KES 135,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Expenses</span>
                      <span className="font-semibold text-rose-600 dark:text-rose-400">-KES 67,600</span>
                    </div>
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900 dark:text-white">Net Savings</span>
                        <span className="font-bold text-lg text-blue-600 dark:text-blue-400">+KES 67,400</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white">
                  <h3 className="font-semibold mb-3">Ready to start?</h3>
                  <p className="text-blue-100 text-sm mb-4">Create your free account and take control of your finances today.</p>
                  <AuthLink className="inline-flex items-center justify-center w-full gap-2 px-4 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors">
                    Get Started Free
                  </AuthLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section data-section="faq" className="py-20 bg-white dark:bg-slate-900/50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Frequently asked questions
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Everything you need to know about the app
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-5 font-semibold text-slate-900 dark:text-white cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    {faq.q}
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-slate-600 dark:text-slate-400">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to take control of your money?
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
                Join Kenyans who are already tracking, planning, and growing their finances.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <AuthLink className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                  Get Started Free
                  <span>→</span>
                </AuthLink>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
