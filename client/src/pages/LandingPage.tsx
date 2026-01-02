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

const highlights = [
  { label: "Track accounts", value: "Unlimited" },
  { label: "Free forever", value: "Core features" },
  { label: "Your data", value: "Export anytime" },
];

const accounts = [
  { name: "M-Pesa", balance: "KES 45,200", status: "Manual", icon: "📱" },
  { name: "KCB Salary", balance: "KES 62,100", status: "Manual", icon: "🏦" },
  { name: "SACCO", balance: "KES 18,130", status: "Manual", icon: "🤝" },
];

const calculators = [
  {
    title: "Budget Tracker",
    desc: "Set spending limits by category and track progress throughout the month.",
    icon: "📊",
    tone: "from-blue-100/60 via-white to-white/80 dark:from-blue-900/20 dark:via-white/5 dark:to-white/0",
  },
  {
    title: "Debt Planner",
    desc: "Compare snowball vs avalanche strategies with payment timelines.",
    icon: "💳",
    tone: "from-purple-100/60 via-white to-white/80 dark:from-purple-900/20 dark:via-white/5 dark:to-white/0",
  },
  {
    title: "Savings Goals",
    desc: "Set targets with deadlines and track contributions over time.",
    icon: "🎯",
    tone: "from-emerald-100/60 via-white to-white/80 dark:from-emerald-900/20 dark:via-white/5 dark:to-white/0",
  },
  {
    title: "Net Worth Tracker",
    desc: "Monitor assets, liabilities, and see your financial health over time.",
    icon: "💰",
    tone: "from-amber-100/60 via-white to-white/80 dark:from-amber-900/20 dark:via-white/5 dark:to-white/0",
  },
  {
    title: "Investment Portfolio",
    desc: "Track stocks, funds, crypto, insurance and calculate returns.",
    icon: "📈",
    tone: "from-cyan-100/60 via-white to-white/80 dark:from-cyan-900/20 dark:via-white/5 dark:to-white/0",
  },
  {
    title: "Subscription Manager",
    desc: "Keep track of recurring payments and their renewal dates.",
    icon: "🔄",
    tone: "from-rose-100/60 via-white to-white/80 dark:from-rose-900/20 dark:via-white/5 dark:to-white/0",
  },
];

const features = [
  { title: "Multi-Account Tracking", desc: "Track M-Pesa, banks, SACCO, cash manually", icon: "🔗" },
  { title: "Transaction Categories", desc: "Organize spending with custom categories", icon: "🏷️" },
  { title: "Budget Limits", desc: "Set monthly limits per category", icon: "⚡" },
  { title: "Debt Planner", desc: "Snowball/avalanche payoff strategies", icon: "💳" },
  { title: "Savings Goals", desc: "Track progress towards financial targets", icon: "🎯" },
  { title: "Investment Portfolio", desc: "Stocks, funds, crypto, insurance", icon: "📈" },
  { title: "Net Worth Tracking", desc: "Assets minus liabilities over time", icon: "💰" },
  { title: "Subscription Tracker", desc: "Monitor recurring payments", icon: "🔄" },
];

const faqs = [
  {
    q: "How do I add my accounts?",
    a: "Simply create accounts manually - add your M-Pesa, bank accounts, SACCO, or cash on hand. Enter the current balance and start tracking. There's no automatic bank connection - you have full control over what data you enter.",
  },
  {
    q: "Can I export my data?",
    a: "Yes! You can export all your transactions, accounts, and reports to CSV format. Your data is yours—take it with you anytime, use it in other tools, or keep offline backups. No lock-in, no hidden fees for exports.",
  },
  {
    q: "Is it really free?",
    a: "Yes! All current features are completely free: unlimited transactions, budgets, debt planning, savings goals, investment tracking, and net worth monitoring. We may introduce premium features in the future, but everything you see today is free.",
  },
  {
    q: "How secure is my financial data?",
    a: "Your data is protected with encrypted sessions and secure authentication (email/password or Google OAuth). Your data is isolated—no one else can see it. We don't sell your information to third parties.",
  },
  {
    q: "Do I need to be tech-savvy to use this?",
    a: "Not at all! The interface is designed to be intuitive and user-friendly. If you can use WhatsApp or M-Pesa, you can use this app. We provide clear visual feedback and an easy-to-navigate dashboard.",
  },
  {
    q: "What features are you planning to add?",
    a: "Coming soon: M-Pesa statement import, bank statement parsing, Chama/group savings management, automated recurring transactions, and smart notifications. Let us know what features matter most to you!",
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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <PublicHeader />

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 left-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-40 -right-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-10 left-1/4 h-60 w-60 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <main className="flex-1 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="py-14 md:py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/10 text-sm font-semibold text-blue-800 dark:text-blue-100 border border-white/50 dark:border-0 shadow-sm backdrop-blur mx-auto lg:mx-0">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  Built for Kenya · M-Pesa first
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] text-slate-900 dark:text-white">
                  Get a clear picture of your money in one place.
                </h1>
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-200/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Track Budget, Income, Spending, Investments, and Debts in a single dashboard.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-1 justify-center lg:justify-start">
                  <AuthLink className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-semibold rounded-xl shadow-xl shadow-blue-500/25 transition-transform hover:-translate-y-0.5">
                    <span>Join us</span>
                    <span className="text-lg">→</span>
                  </AuthLink>
                  <button
                    onClick={() => {
                      document.querySelector("[data-section='demo']")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-slate-200/80 dark:border-0 text-slate-900 dark:text-white font-semibold bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 shadow-sm backdrop-blur transition-all"
                  >
                    Try a live demo (no login)
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-xl mx-auto lg:mx-0">
                  {highlights.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/50 dark:border-0 bg-white/80 dark:bg-white/10 backdrop-blur px-4 py-4 shadow-sm text-center"
                    >
                      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {item.label}
                      </div>
                      <div className="text-xl font-semibold text-slate-900 dark:text-white">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative max-w-xl w-full mx-auto lg:mx-0">
                <div className="rounded-3xl border border-white/60 dark:border-0 bg-white/85 dark:bg-white/10 shadow-2xl shadow-blue-900/20 backdrop-blur-xl p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">Net worth</div>
                      <div className="text-3xl font-bold text-slate-900 dark:text-white">KES 1,245,300</div>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200 font-semibold">
                      +KES 42,000 this month
                    </span>
                  </div>

                  <div className="rounded-2xl border border-white/50 dark:border-0 bg-white/80 dark:bg-white/10 backdrop-blur p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold text-slate-800 dark:text-white">Income vs Expenses</div>
                      <div className="text-xs text-emerald-600 dark:text-emerald-300 font-semibold">+12% vs last month</div>
                    </div>
                    <div className="h-36">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="heroIncome" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="rgb(59, 130, 246)" stopOpacity={0.9} />
                              <stop offset="95%" stopColor="rgb(59, 130, 246)" stopOpacity={0.05} />
                            </linearGradient>
                            <linearGradient id="heroExpenses" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="rgb(236, 72, 153)" stopOpacity={0.9} />
                              <stop offset="95%" stopColor="rgb(236, 72, 153)" stopOpacity={0.05} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" hide />
                          <YAxis hide />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(15, 23, 42, 0.9)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              borderRadius: "10px",
                              color: "white",
                            }}
                            labelStyle={{ color: "#e2e8f0" }}
                          />
                          <Area type="monotone" dataKey="income" stroke="rgb(59, 130, 246)" strokeWidth={2} fill="url(#heroIncome)" />
                          <Area type="monotone" dataKey="expenses" stroke="rgb(236, 72, 153)" strokeWidth={2} fill="url(#heroExpenses)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-semibold text-slate-800 dark:text-white">Recent activity</div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Demo data</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { title: "Salary · KCB", amount: "+KES 62,100", tone: "text-emerald-600 dark:text-emerald-300" },
                        { title: "Rent · Riverside", amount: "-KES 28,000", tone: "text-rose-500 dark:text-rose-300" },
                        { title: "SACCO Savings", amount: "-KES 8,500", tone: "text-amber-500 dark:text-amber-300" },
                        { title: "Groceries", amount: "-KES 5,400", tone: "text-rose-500 dark:text-rose-300" },
                      ].map((tx) => (
                        <div
                          key={tx.title}
                          className="flex items-center justify-between rounded-xl border border-white/40 dark:border-0 bg-white/80 dark:bg-white/10 backdrop-blur px-3 py-2"
                        >
                          <div className="text-sm text-slate-800 dark:text-white">{tx.title}</div>
                          <div className={`text-sm font-semibold ${tx.tone}`}>{tx.amount}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section data-section="demo" className="py-16 md:py-20 border-t border-white/50 dark:border-t-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
              <div>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-300 mb-1">Live snapshot</p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">See it in action</h2>
                <p className="text-base md:text-lg text-slate-600 dark:text-slate-300">
                  Real-time view of all your finances in one place.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/10 border border-white/60 dark:border-0 text-sm text-slate-700 dark:text-white/80 backdrop-blur">
                Live demo · No sign-up needed
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-3xl bg-white/80 dark:bg-white/10 border border-white/60 dark:border-0 p-6 shadow-xl shadow-blue-900/15 backdrop-blur-md">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">30-Day Overview</h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200 font-semibold">
                    Up 12% vs last month
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="rgb(59, 130, 246)" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="rgb(59, 130, 246)" stopOpacity={0.08} />
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="rgb(236, 72, 153)" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="rgb(236, 72, 153)" stopOpacity={0.08} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="rgb(148, 163, 184)" style={{ fontSize: "12px" }} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgb(148, 163, 184)" style={{ fontSize: "12px" }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.9)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "12px",
                        color: "white",
                      }}
                      labelStyle={{ color: "#e2e8f0" }}
                    />
                    <Area type="monotone" dataKey="income" stroke="rgb(59, 130, 246)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="expenses" stroke="rgb(236, 72, 153)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpenses)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl bg-white/80 dark:bg-white/10 border border-white/60 dark:border-0 p-6 shadow-xl shadow-blue-900/15 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                      Accounts
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-200 font-semibold">
                      Demo
                    </span>
                  </div>
                  <div className="space-y-3">
                    {accounts.map((acc) => (
                      <div
                        key={acc.name}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/90 dark:bg-white/10 border border-white/60 dark:border-0 shadow-sm"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">
                            {acc.icon} {acc.name}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">{acc.balance}</div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200">
                          {acc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-20 border-t border-white/50 dark:border-t-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
              <div>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-300 mb-1">Guided tools</p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Plan your finances</h2>
                <p className="text-base md:text-lg text-slate-600 dark:text-slate-300">
                  Pre-filled with realistic Kenyan spending patterns.
                </p>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Pick a calculator and try it.</div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {calculators.map((calc) => (
                <div
                  key={calc.title}
                  className={`rounded-3xl bg-gradient-to-br ${calc.tone} border border-white/60 dark:border-white/10 p-7 shadow-xl shadow-blue-900/10 backdrop-blur-md`}
                >
                  <div className="text-3xl mb-3">{calc.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{calc.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">{calc.desc}</p>
                  <AuthLink className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold shadow-md hover:shadow-lg transition-all">
                    Try It
                  </AuthLink>
                </div>
              ))}
            </div>
          </section>

          <section className="py-16 md:py-20 border-t border-white/50 dark:border-t-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
              <div>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-300 mb-1">Calm control</p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Everything you need</h2>
                <p className="text-base md:text-lg text-slate-600 dark:text-slate-300">
                  One workspace for income, spend, debt, and goals.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/10 border border-white/60 dark:border-0 text-sm text-slate-700 dark:text-white/80 backdrop-blur">
                Built for Kenya · M-Pesa first
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/60 dark:border-0 bg-white/85 dark:bg-white/10 backdrop-blur p-4 shadow-lg shadow-blue-900/10 hover:-translate-y-1 transition-transform"
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="py-16 md:py-20 border-t border-white/50 dark:border-t-0">
            <div className="max-w-3xl mx-auto">
              <div className="mb-10 text-center">
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-300 mb-2">Answers</p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Questions?</h2>
                <p className="text-base md:text-lg text-slate-600 dark:text-slate-300">What people usually ask us</p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq) => (
                  <details
                    key={faq.q}
                    className="group rounded-2xl border border-white/60 dark:border-0 p-5 bg-white/85 dark:bg-white/10 backdrop-blur shadow-sm"
                  >
                    <summary className="flex items-center justify-between font-semibold text-slate-900 dark:text-white cursor-pointer select-none">
                      {faq.q}
                      <span className="text-lg group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 md:py-20 border-t border-white/50 dark:border-t-0">
            <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700 p-12 md:p-16 text-center shadow-2xl shadow-blue-900/30">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to control your money?</h2>
              <p className="text-lg md:text-xl text-blue-50/90 mb-8 max-w-2xl mx-auto">
                Join thousands of Kenyans who track, plan, and grow with Mstatili Finance.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <AuthLink className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                  <span>Get Started Free</span>
                  <span className="text-lg">→</span>
                </AuthLink>
                <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/70 text-white font-semibold backdrop-blur hover:bg-white/10 transition-all">
                  Talk to us
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
