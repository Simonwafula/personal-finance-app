import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { fetchCurrentUser } from "../api/auth";

// Feature blocks grouped by theme: Track, Plan, Grow
const featureBlocks = [
  {
    theme: "Track",
    title: "See Everything Clearly",
    description: "All your money in one place.",
    color: "blue",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    bullets: [
      "M-Pesa, bank accounts & cash unified",
      "Auto-import from SMS messages",
      "Real-time balance updates",
    ],
  },
  {
    theme: "Plan",
    title: "Budget With Confidence",
    description: "Know where every shilling goes.",
    color: "green",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bullets: [
      "Category-based spending limits",
      "Alerts before you overspend",
      "Savings goals with progress tracking",
    ],
  },
  {
    theme: "Grow",
    title: "Build Lasting Wealth",
    description: "Watch your net worth climb.",
    color: "purple",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    bullets: [
      "Track assets, investments & debts",
      "Debt payoff strategies (snowball/avalanche)",
      "Investment portfolio monitoring",
    ],
  },
];

// App screenshots for preview section
const appScreens = [
  { name: "Dashboard", description: "Your financial overview at a glance" },
  { name: "Transactions", description: "Track every shilling in and out" },
  { name: "Budgets", description: "Stay on top of your spending limits" },
  { name: "Reports", description: "Insights to help you grow" },
];

const stats = [
  { value: "KES 1.2B+", label: "Tracked" },
  { value: "15,000+", label: "Users" },
  { value: "4.8/5", label: "Rating" },
];

const faqs = [
  {
    question: "Is my financial data secure?",
    answer: "Yes. We use bank-level encryption and never store your bank credentials. Your data is encrypted at rest and in transit.",
  },
  {
    question: "Can I track M-Pesa transactions?",
    answer: "Absolutely. You can manually log M-Pesa transactions or use our SMS parsing feature to automatically import them.",
  },
  {
    question: "Is there a mobile app?",
    answer: "Yes, we have Android and iOS apps available. You can also access everything through our responsive web app.",
  },
  {
    question: "What does it cost?",
    answer: "Utajiri offers a generous free tier. Premium features are available at affordable rates for power users.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add("dark");
    fetchCurrentUser()
      .then(() => navigate("/dashboard"))
      .catch(() => {});
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section - 2 Column Layout */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div style={{ display: 'flex', flexDirection: 'row', gap: '4rem', alignItems: 'center' }} className="flex-col lg:flex-row">
              {/* Left Column - Content */}
              <div className="text-center lg:text-left flex-1">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  Built for Kenya
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
                  Master Your <span style={{ color: '#60a5fa' }}>Money</span>
                </h1>

                <p className="text-lg lg:text-xl text-slate-400 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0" style={{ maxWidth: '60ch' }}>
                  Track M-Pesa, budget smarter, and build wealth with tools designed for how you actually manage money.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    Start Free
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-300 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    Sign In
                  </Link>
                </div>

                {/* Trust Chips - Simple text badges */}
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="text-green-400">&#10003;</span> Private by design
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-blue-400">&#10003;</span> Export anytime
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-purple-400">&#10003;</span> PIN & Biometrics
                  </span>
                </div>
              </div>

              {/* Right Column - Phone Mockup */}
              <div className="relative flex justify-center shrink-0" data-section="demo">
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/10 to-blue-600/20 rounded-[3rem] blur-2xl" />

                  {/* Phone frame - outer shell */}
                  <div style={{ background: 'linear-gradient(to bottom, #475569, #1e293b)', padding: '4px', borderRadius: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                    {/* Phone body */}
                    <div style={{ background: '#0f172a', borderRadius: '2.3rem', padding: '4px' }}>
                      {/* Inner screen */}
                      <div style={{ background: '#020617', borderRadius: '2rem', overflow: 'hidden', width: '260px' }}>
                        {/* Notch */}
                        <div style={{ position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)', width: '60px', height: '20px', background: '#000', borderRadius: '999px', zIndex: 20 }} />

                      {/* Screen content */}
                      <div className="pt-10 pb-6 px-4">
                        {/* Mini header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center">
                              <span className="text-[8px] text-white font-bold">U</span>
                            </div>
                            <span className="text-white text-xs font-medium">Utajiri</span>
                          </div>
                          <div className="w-6 h-6 rounded-full bg-slate-800" />
                        </div>

                        {/* Balance card */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-3 mb-3">
                          <p className="text-blue-200 text-[10px] mb-0.5">Total Balance</p>
                          <p className="text-white text-lg font-bold">KES 847,250</p>
                          <p className="text-green-300 text-[10px]">+12.4% this month</p>
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-slate-800/80 rounded-lg p-2">
                            <p className="text-slate-500 text-[9px]">Income</p>
                            <p className="text-green-400 text-xs font-semibold">+65,200</p>
                          </div>
                          <div className="bg-slate-800/80 rounded-lg p-2">
                            <p className="text-slate-500 text-[9px]">Expenses</p>
                            <p className="text-red-400 text-xs font-semibold">-42,800</p>
                          </div>
                        </div>

                        {/* Transactions */}
                        <div className="bg-slate-800/50 rounded-lg p-2">
                          <p className="text-slate-400 text-[9px] font-medium mb-2">Recent</p>
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-white text-[10px]">Safaricom</span>
                              <span className="text-red-400 text-[10px]">-1,500</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white text-[10px]">Salary</span>
                              <span className="text-green-400 text-[10px]">+65,000</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white text-[10px]">Groceries</span>
                              <span className="text-red-400 text-[10px]">-3,200</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-10 border-y border-slate-800/50 bg-slate-900/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-8 lg:gap-20">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl lg:text-4xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section - Track / Plan / Grow */}
        <section className="py-20 lg:py-24" data-section="features">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto" style={{ maxWidth: '60ch' }}>
                From tracking every shilling to building lasting wealth.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {featureBlocks.map((block) => (
                <div
                  key={block.theme}
                  className="group bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 lg:p-8 transition-all duration-300"
                >
                  {/* Theme badge */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                    block.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                    block.color === 'green' ? 'bg-green-500/10 text-green-400' :
                    'bg-purple-500/10 text-purple-400'
                  }`}>
                    {block.theme}
                  </div>

                  {/* Icon */}
                  <div className={`w-10 h-10 flex items-center justify-center rounded-lg mb-4 transition-colors ${
                    block.color === 'blue' ? 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20' :
                    block.color === 'green' ? 'bg-green-500/10 text-green-400 group-hover:bg-green-500/20' :
                    'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20'
                  }`}>
                    {block.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-2">{block.title}</h3>
                  <p className="text-slate-400 mb-4">{block.description}</p>

                  {/* Bullet points */}
                  <ul className="space-y-2">
                    {block.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                        <svg className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                          block.color === 'blue' ? 'text-blue-400' :
                          block.color === 'green' ? 'text-green-400' :
                          'text-purple-400'
                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Screens Preview Section - NEW */}
        <section className="py-20 lg:py-24 bg-slate-900/50" data-section="screens">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                See Utajiri in Action
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Clean, intuitive screens designed for real people managing real money.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {appScreens.map((screen, index) => (
                <div key={screen.name} className="group">
                  {/* Screen mockup placeholder */}
                  <div className="relative bg-slate-800 rounded-2xl border border-slate-700/50 overflow-hidden mb-4 aspect-[9/16] transition-all group-hover:border-slate-600 group-hover:shadow-lg group-hover:shadow-blue-500/10">
                    {/* Placeholder screen content */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 p-4">
                      {/* Status bar */}
                      <div className="flex justify-between items-center text-[10px] text-slate-500 mb-4">
                        <span>9:41</span>
                        <div className="flex gap-1">
                          <div className="w-3 h-1.5 bg-slate-600 rounded-sm" />
                          <div className="w-3 h-1.5 bg-slate-600 rounded-sm" />
                          <div className="w-4 h-2 bg-slate-600 rounded-sm" />
                        </div>
                      </div>

                      {/* Screen-specific content */}
                      {index === 0 && (
                        // Dashboard
                        <div className="space-y-3">
                          <div className="bg-blue-600/20 rounded-xl p-3 border border-blue-500/20">
                            <div className="h-2 w-16 bg-slate-600 rounded mb-2" />
                            <div className="h-4 w-24 bg-white/20 rounded" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-slate-700/50 rounded-lg p-2 h-16" />
                            <div className="bg-slate-700/50 rounded-lg p-2 h-16" />
                          </div>
                          <div className="bg-slate-700/50 rounded-lg p-2 h-20" />
                        </div>
                      )}
                      {index === 1 && (
                        // Transactions
                        <div className="space-y-2">
                          <div className="h-3 w-20 bg-slate-600 rounded mb-4" />
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className="flex items-center justify-between bg-slate-700/30 rounded-lg p-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-slate-600 rounded-full" />
                                <div className="h-2 w-16 bg-slate-600 rounded" />
                              </div>
                              <div className="h-2 w-12 bg-slate-500 rounded" />
                            </div>
                          ))}
                        </div>
                      )}
                      {index === 2 && (
                        // Budgets
                        <div className="space-y-3">
                          <div className="h-3 w-16 bg-slate-600 rounded mb-4" />
                          {[
                            { color: 'bg-green-500', width: '70%' },
                            { color: 'bg-yellow-500', width: '85%' },
                            { color: 'bg-blue-500', width: '45%' },
                          ].map((bar, i) => (
                            <div key={i} className="space-y-1">
                              <div className="h-2 w-20 bg-slate-600 rounded" />
                              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div className={`h-full ${bar.color} rounded-full`} style={{ width: bar.width }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {index === 3 && (
                        // Reports
                        <div className="space-y-3">
                          <div className="h-3 w-16 bg-slate-600 rounded mb-4" />
                          <div className="bg-slate-700/50 rounded-lg p-2 h-24 flex items-end gap-1 px-3">
                            {[30, 50, 40, 70, 55, 80, 65].map((h, i) => (
                              <div key={i} className="flex-1 bg-blue-500/60 rounded-t" style={{ height: `${h}%` }} />
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-slate-700/50 rounded-lg p-2 h-12" />
                            <div className="bg-slate-700/50 rounded-lg p-2 h-12" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Overlay gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Label */}
                  <h3 className="font-semibold text-white mb-1">{screen.name}</h3>
                  <p className="text-sm text-slate-500">{screen.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 lg:py-24" data-section="faq">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Common Questions
              </h2>
              <p className="text-lg text-slate-400">
                Everything you need to know to get started.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-xl p-6 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                  <p className="text-slate-400 leading-relaxed" style={{ maxWidth: '65ch' }}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-24 bg-gradient-to-t from-slate-900 to-transparent">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Ready to Take Control?
            </h2>
            <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto" style={{ maxWidth: '60ch' }}>
              Join thousands of Kenyans building better financial habits with Utajiri.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Create Free Account
            </Link>
            <p className="text-sm text-slate-500 mt-6">No credit card required</p>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
