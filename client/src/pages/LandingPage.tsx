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
    tone: "from-blue-500/10 via-white/50 to-white/90 dark:from-blue-900/40 dark:via-slate-900/50 dark:to-slate-900/0",
    border: "border-blue-200 dark:border-blue-800/30",
  },
  {
    title: "Debt Planner",
    desc: "Compare snowball vs avalanche strategies with payment timelines.",
    icon: "💳",
    tone: "from-purple-500/10 via-white/50 to-white/90 dark:from-purple-900/40 dark:via-slate-900/50 dark:to-slate-900/0",
    border: "border-purple-200 dark:border-purple-800/30",
  },
  {
    title: "Savings Goals",
    desc: "Set targets with deadlines and track contributions over time.",
    icon: "🎯",
    tone: "from-emerald-500/10 via-white/50 to-white/90 dark:from-emerald-900/40 dark:via-slate-900/50 dark:to-slate-900/0",
    border: "border-emerald-200 dark:border-emerald-800/30",
  },
  {
    title: "Net Worth Tracker",
    desc: "Monitor assets, liabilities, and see your financial health over time.",
    icon: "💰",
    tone: "from-amber-500/10 via-white/50 to-white/90 dark:from-amber-900/40 dark:via-slate-900/50 dark:to-slate-900/0",
    border: "border-amber-200 dark:border-amber-800/30",
  },
  {
    title: "Investment Portfolio",
    desc: "Track stocks, funds, crypto, insurance and calculate returns.",
    icon: "📈",
    tone: "from-cyan-500/10 via-white/50 to-white/90 dark:from-cyan-900/40 dark:via-slate-900/50 dark:to-slate-900/0",
    border: "border-cyan-200 dark:border-cyan-800/30",
  },
  {
    title: "Subscription Manager",
    desc: "Keep track of recurring payments and their renewal dates.",
    icon: "🔄",
    tone: "from-rose-500/10 via-white/50 to-white/90 dark:from-rose-900/40 dark:via-slate-900/50 dark:to-slate-900/0",
    border: "border-rose-200 dark:border-rose-800/30",
  },
];

const features = [
  { title: "Multi-Account Tracking", desc: "Track M-Pesa, banks, SACCO, cash manually", icon: "🔗", colSpan: "md:col-span-2" },
  { title: "Transaction Categories", desc: "Organize spending with custom categories", icon: "🏷️", colSpan: "" },
  { title: "Budget Limits", desc: "Set monthly limits per category", icon: "⚡", colSpan: "" },
  { title: "Debt Planner", desc: "Snowball/avalanche payoff strategies", icon: "💳", colSpan: "md:col-span-2" },
  { title: "Savings Goals", desc: "Track progress towards financial targets", icon: "🎯", colSpan: "" },
  { title: "Investment Portfolio", desc: "Stocks, funds, crypto, insurance", icon: "📈", colSpan: "" },
  { title: "Net Worth Tracking", desc: "Assets minus liabilities over time", icon: "💰", colSpan: "md:col-span-2" },
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
      .catch(() => { });
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-x-hidden transition-colors duration-300">
      <PublicHeader />

      {/* Hero Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-10 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-0 right-10 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero Section */}
          <section className="py-20 lg:py-32 relative">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 text-center lg:text-left animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/80 dark:bg-blue-900/30 text-sm font-semibold text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 shadow-sm backdrop-blur mx-auto lg:mx-0 transition-transform hover:scale-105">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  Built for Kenya · M-Pesa first
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  Master your money, <br className="hidden lg:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 animate-gradient-x">
                    build your wealth.
                  </span>
                </h1>

                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  The all-in-one platform to track M-Pesa transactions, budget smarter,
                  plan debt repayment, and watch your net worth grow.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                  <AuthLink className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 overflow-hidden">
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    <span>Start for Free</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </AuthLink>
                  <button
                    onClick={() => {
                      document.querySelector("[data-section='demo']")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    View Live Demo
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200/60 dark:border-slate-800/60 max-w-xl mx-auto lg:mx-0">
                  {highlights.map((item) => (
                    <div key={item.label} className="text-center lg:text-left">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">{item.value}</div>
                      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Dashboard Preview */}
              <div className="relative max-w-[600px] w-full mx-auto lg:mx-0 animate-fade-in-up animation-delay-500 perspective-1000">
                <div className="relative rounded-3xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl shadow-blue-900/20 p-2 transform rotate-y-[-5deg] hover:rotate-y-0 transition-transform duration-700 ease-out">
                  <div className="rounded-2xl overflow-hidden bg-white/90 dark:bg-slate-900/90 shadow-inner">

                    {/* Fake Browser Header */}
                    <div className="h-8 bg-slate-100 dark:bg-slate-800 flex items-center px-4 gap-2 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400/80" />
                        <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                        <div className="w-3 h-3 rounded-full bg-green-400/80" />
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Net Worth Teaser */}
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Net Worth</div>
                          <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">KES 1.2M</div>
                        </div>
                        <div className="text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                          ▲ 12.5%
                        </div>
                      </div>

                      {/* Chart */}
                      <div className="h-48 rounded-xl bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 p-4 border border-blue-100/50 dark:border-blue-800/30">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="heroIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="income" stroke="#3B82F6" strokeWidth={3} fill="url(#heroIncome)" />
                            {/* Simplified expenses line for aesthetic cleanliness */}
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Recent Transations */}
                      <div className="space-y-3">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recent Activity</div>
                        {[
                          { title: "Salary · KCB", amount: "+KES 62,100", icon: "💰", color: "text-emerald-600" },
                          { title: "Rent · Riverside", amount: "-KES 28,000", icon: "🏠", color: "text-slate-900 dark:text-white" },
                          { title: "Naivas Supermarket", amount: "-KES 5,400", icon: "🛒", color: "text-slate-900 dark:text-white" },
                        ].map((tx, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-default group">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm text-lg group-hover:scale-110 transition-transform">
                                {tx.icon}
                              </div>
                              <span className="font-medium text-slate-700 dark:text-slate-200">{tx.title}</span>
                            </div>
                            <span className={`font-bold ${tx.color}`}>{tx.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Demo Section */}
          <section data-section="demo" className="py-24 relative overflow-hidden">
            <div className="mb-12 text-center max-w-2xl mx-auto">
              <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wide uppercase text-sm">Live Preview</span>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mt-2 mb-4">See your money clearly.</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Interactive dashboards allow you to filter, sort, and visualize your financial health in real-time.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Chart Card */}
              <div className="lg:col-span-2 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none hover:shadow-blue-500/10 transition-shadow">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Cash Flow</h3>
                    <p className="text-sm text-slate-500">Income vs Expenses (30 Days)</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)', backgroundColor: '#1e293b', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="income" stroke="#3B82F6" strokeWidth={3} fill="url(#colorIncome)" />
                      <Area type="monotone" dataKey="expenses" stroke="#EC4899" strokeWidth={3} fill="url(#colorExpenses)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Accounts Card */}
              <div className="rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Your Accounts</h3>
                  <div className="space-y-4">
                    {accounts.map((acc) => (
                      <div key={acc.name} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between hover:scale-[1.02] transition-transform cursor-pointer">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{acc.icon}</span>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">{acc.name}</div>
                            <div className="text-xs text-slate-500">{acc.status}</div>
                          </div>
                        </div>
                        <div className="font-bold text-slate-700 dark:text-slate-300">{acc.balance}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <AuthLink className="mt-8 w-full py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 font-semibold text-center hover:border-blue-500 hover:text-blue-500 transition-colors">
                  + Add New Account
                </AuthLink>
              </div>
            </div>
          </section>

          {/* Tools Grid (Bento Style) */}
          <section className="py-24">
            <div className="mb-16 md:text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Financial Tools for Everyone</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Whether you're saving for a goal, paying off debt, or planning your budget, we have a tool for clearly visualizing your progress.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {calculators.map((calc, idx) => (
                <div
                  key={calc.title}
                  className={`group relative overflow-hidden rounded-[2rem] border ${calc.border} bg-gradient-to-br ${calc.tone} p-8 hover:-translate-y-2 hover:shadow-xl transition-all duration-300`}
                >
                  <div className="absolute top-4 right-4 text-6xl opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">{calc.icon}</div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="text-4xl mb-4">{calc.icon}</div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{calc.title}</h3>
                      <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-8">{calc.desc}</p>
                    </div>
                    <AuthLink className="inline-flex items-center font-bold text-slate-900 dark:text-white group-hover:gap-2 transition-all">
                      Try Tool <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </AuthLink>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Features List */}
          <section className="py-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <div key={feature.title} className={`${feature.colSpan} p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-start gap-4 hover:bg-white dark:hover:bg-slate-800 transition-colors`}>
                  <div className="text-3xl bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm">{feature.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-24 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details key={faq.q} className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 open:shadow-lg transition-shadow duration-300">
                  <summary className="flex items-center justify-between p-6 font-semibold text-lg text-slate-900 dark:text-white cursor-pointer select-none">
                    {faq.q}
                    <span className="transform group-open:rotate-180 transition-transform duration-300 text-slate-400">
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="py-20">
            <div className="rounded-[2.5rem] bg-blue-600 overflow-hidden relative shadow-2xl shadow-blue-900/40 text-center px-6 py-20 lg:px-20 lg:py-24">
              {/* Background patterns */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute w-96 h-96 bg-white rounded-full -top-20 -left-20 mix-blend-overlay filter blur-3xl animate-blob" />
                <div className="absolute w-96 h-96 bg-white rounded-full -bottom-20 -right-20 mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000" />
              </div>

              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Ready to take control?</h2>
                <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                  Join thousands of Kenyans using Mstatili Finance to master their budget and grow their wealth.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <AuthLink className="bg-white text-blue-700 px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all">
                    Create Free Account
                  </AuthLink>
                </div>
                <p className="mt-8 text-blue-200 text-sm">No credit card required · Free forever plan available</p>
              </div>
            </div>
          </section>

        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
