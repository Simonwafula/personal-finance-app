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
import "../styles/neumorphism.css";

// Small helper: Auth link to login page
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

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    fetchCurrentUser()
      .then(() => navigate("/dashboard"))
      .catch(() => {});
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b1021]">
      <PublicHeader />

      {/* Floating gradients for depth */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -right-20 h-96 w-96 rounded-full bg-gradient-to-bl from-blue-500/25 via-indigo-500/15 to-transparent blur-3xl" />
        <div className="absolute top-48 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-purple-500/20 via-pink-400/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-gradient-to-tr from-emerald-400/10 via-cyan-400/10 to-transparent blur-2xl" />
      </div>

      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* HERO SECTION */}
          <section className="py-16 md:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Headline */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-white/5 text-sm font-medium text-blue-700 dark:text-blue-200 shadow-sm border border-white/40 dark:border-white/10 backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  Modern personal finance, made local
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight text-gray-900 dark:text-white">
                  <span className="block">Your money,</span>
                  <span className="block bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                    crystal clear.
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-200/80 leading-relaxed max-w-xl">
                  Track M-Pesa, bank accounts, SACCO, investments, and debts in one glassy workspace. See the whole story and move faster.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <AuthLink className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:via-indigo-700 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-xl shadow-blue-500/20 transition-transform hover:-translate-y-0.5">
                    <span>Get Started Free</span>
                    <span className="text-lg">→</span>
                  </AuthLink>
                  <button
                    onClick={() => {
                      const section = document.querySelector("[data-section='demo']");
                      section?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-gray-200/70 dark:border-white/10 text-gray-900 dark:text-white font-semibold bg-white/70 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 shadow-sm backdrop-blur transition-all"
                  >
                    <span className="text-base">See Demo</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
                  {[
                    { label: "Synced accounts", value: "4" },
                    { label: "Tracked monthly", value: "KES 125k" },
                    { label: "Avg. savings boost", value: "+18%" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-white/50 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-sm px-4 py-3 shadow-sm"
                    >
                      <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        {item.label}
                      </div>
                      <div className="text-xl font-semibold text-gray-900 dark:text-white">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Visual Card */}
              <div className="relative h-80 md:h-96">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/80 via-white/50 to-white/30 dark:from-white/5 dark:via-white/0 dark:to-white/0 border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-2xl shadow-blue-900/20" />
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <div className="absolute -top-10 -right-10 h-48 w-48 bg-gradient-to-bl from-indigo-400/50 to-cyan-300/30 blur-3xl" />
                  <div className="absolute bottom-0 left-0 right-0 px-8 py-8 space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">Total Balance</div>
                      <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200 font-semibold">
                        +KES 12,400 this month
                      </span>
                    </div>
                    <div className="text-4xl font-bold text-gray-900 dark:text-white">KES 125,430</div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {[
                        { label: "M-Pesa", value: "KES 45,200" },
                        { label: "KCB Salary", value: "KES 62,100" },
                        { label: "SACCO", value: "KES 18,130" },
                        { label: "Investments", value: "KES 32,400" },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur px-3 py-3 shadow-sm"
                        >
                          <div className="text-xs text-gray-500 dark:text-gray-400">{item.label}</div>
                          <div className="text-base font-semibold text-gray-900 dark:text-white">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* DEMO SECTION */}
          <section
            data-section="demo"
            className="py-16 md:py-24 border-t border-white/40 dark:border-white/5"
          >
            <div className="mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  See it in action
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Get a real-time view of all your finances
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur text-sm text-gray-700 dark:text-white/80">
                Live demo · No sign-up needed
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Chart */}
              <div className="lg:col-span-2 rounded-3xl bg-white/80 dark:bg-white/5 border border-white/60 dark:border-white/10 p-6 shadow-xl shadow-blue-900/10 backdrop-blur-md">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">30-Day Overview</h3>
                  <span className="text-sm px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200 font-semibold">
                    Up 12% vs last month
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart
                    data={[
                      { date: "Nov 1", income: 8000, expenses: 5200 },
                      { date: "Nov 5", income: 8000, expenses: 7300 },
                      { date: "Nov 10", income: 27000, expenses: 12300 },
                      { date: "Nov 15", income: 27000, expenses: 8900 },
                      { date: "Nov 20", income: 35000, expenses: 15200 },
                      { date: "Nov 25", income: 35000, expenses: 9800 },
                      { date: "Nov 30", income: 35000, expenses: 6700 },
                    ]}
                  >
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
                        backgroundColor: "rgba(15, 23, 42, 0.85)",
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

              {/* Accounts Sidebar */}
              <div className="space-y-4">
                <div className="rounded-3xl bg-white/80 dark:bg-white/5 border border-white/60 dark:border-white/10 p-6 shadow-xl shadow-blue-900/10 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                      Accounts
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200 font-semibold">
                      Live
                    </span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: "M-Pesa", balance: "KES 45,200", icon: "📱" },
                      { name: "KCB Salary", balance: "KES 62,100", icon: "🏦" },
                      { name: "SACCO", balance: "KES 18,130", icon: "🤝" },
                    ].map((acc) => (
                      <div
                        key={acc.name}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/80 dark:bg-white/5 border border-white/60 dark:border-white/10 hover:-translate-y-0.5 transition-transform shadow-sm"
                      >
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {acc.icon} {acc.name}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{acc.balance}</div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-200">
                          Connected
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CALCULATORS SECTION */}
          <section className="py-16 md:py-24 border-t border-white/40 dark:border-white/5">
            <div className="mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Plan your finances
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Use these tools to set goals and stay on track
                </p>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Calculators are pre-filled with realistic Kenyan spending patterns.
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Budget Calculator */}
              <div className="rounded-3xl bg-gradient-to-br from-blue-50/70 via-white to-white/80 dark:from-blue-900/20 dark:via-white/5 dark:to-white/0 border border-white/60 dark:border-white/10 p-8 shadow-xl shadow-blue-900/10 backdrop-blur-md">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Budget Planner</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                  Allocate your income across categories and keep your savings target in sight.
                </p>
                <AuthLink className="block w-full text-center px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors">
                  Try It
                </AuthLink>
              </div>

              {/* Debt Payoff Calculator */}
              <div className="rounded-3xl bg-gradient-to-br from-purple-50/70 via-white to-white/80 dark:from-purple-900/20 dark:via-white/5 dark:to-white/0 border border-white/60 dark:border-white/10 p-8 shadow-xl shadow-purple-900/15 backdrop-blur-md">
                <div className="text-3xl mb-3">💳</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Debt Payoff</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                  See timelines and interest saved when you adjust monthly payments.
                </p>
                <AuthLink className="block w-full text-center px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-colors">
                  Try It
                </AuthLink>
              </div>

              {/* Savings Calculator */}
              <div className="rounded-3xl bg-gradient-to-br from-emerald-50/70 via-white to-white/80 dark:from-emerald-900/20 dark:via-white/5 dark:to-white/0 border border-white/60 dark:border-white/10 p-8 shadow-xl shadow-emerald-900/10 backdrop-blur-md">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Savings Goal</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                  Plan how much to save monthly to reach your financial goals.
                </p>
                <AuthLink className="block w-full text-center px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors">
                  Try It
                </AuthLink>
              </div>
            </div>
          </section>

          {/* FEATURES SECTION */}
          <section className="py-16 md:py-24 border-t border-white/40 dark:border-white/5">
            <div className="mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Everything you need
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  A single, calm workspace for your financial life
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur text-sm text-gray-700 dark:text-white/80">
                Built for Kenya · M-Pesa first
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Multi-Account Sync", desc: "Connect M-Pesa, bank accounts, SACCO and more", icon: "🔗" },
                { title: "Smart Insights", desc: "Understand your spending patterns and trends", icon: "💡" },
                { title: "Budget Tracking", desc: "Set limits and get alerts when you overspend", icon: "⚠️" },
                { title: "Debt Management", desc: "Track loans, calculate payoff timelines", icon: "📈" },
                { title: "Savings Goals", desc: "Plan and track progress on financial goals", icon: "🎯" },
                { title: "Wealth Tracking", desc: "Monitor your net worth and investment growth", icon: "💰" },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/85 dark:bg-white/5 backdrop-blur p-6 shadow-lg shadow-blue-900/10 hover:-translate-y-1 transition-transform"
                >
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ SECTION */}
          <section className="py-16 md:py-24 border-t border-white/40 dark:border-white/5">
            <div className="max-w-3xl">
              <div className="mb-12 text-center lg:text-left">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Questions?</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">Here's what people usually ask</p>
              </div>

              <div className="space-y-4">
                {[
                  { q: "Is my data secure?", a: "Yes. We use industry-standard encryption and never share your data with third parties." },
                  { q: "Is this free to use?", a: "Core features are always free. We may offer optional premium features in the future." },
                  { q: "Can I export my data?", a: "Yes. You can export your transactions and reports at any time." },
                  { q: "How do you make money?", a: "Currently we're bootstrapped. Future revenue may come from optional premium features." },
                ].map((faq, idx) => (
                  <details
                    key={idx}
                    className="group rounded-2xl border border-white/60 dark:border-white/10 p-6 bg-white/85 dark:bg-white/5 backdrop-blur cursor-pointer shadow-sm"
                  >
                    <summary className="flex items-center justify-between font-semibold text-gray-900 dark:text-white select-none">
                      {faq.q}
                      <span className="text-lg group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="py-16 md:py-24 border-t border-white/40 dark:border-white/5">
            <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700 p-12 md:p-16 text-center shadow-2xl shadow-blue-900/30">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to control your money?</h2>
              <p className="text-xl text-blue-50/90 mb-8 max-w-2xl mx-auto">
                Join thousands of Kenyans who've taken control of their finances.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <AuthLink className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                  <span>Get Started Free</span>
                  <span className="text-lg">→</span>
                </AuthLink>
                <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/60 text-white font-semibold backdrop-blur hover:bg-white/10 transition-all">
                  <span>Talk to us</span>
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
