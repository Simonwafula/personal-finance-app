import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "../api/auth";

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser()
      .then(() => navigate("/dashboard"))
      .catch(() => {});
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0B1120] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 -left-40 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-50">
        <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-lg">
              M
            </div>
            <span className="text-xl font-bold">Mstatili</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How it Works</a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-300 hover:text-white transition-colors font-medium">
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2.5 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm mb-8">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-gray-300">Trusted by 500+ Kenyans</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Take Control of
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Your Money
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              The all-in-one finance app built for Kenya. Track M-Pesa, bank accounts,
              budgets, debts, and investments in one beautiful dashboard.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
              >
                Start Free Today
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Demo
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-12 md:gap-20">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">100%</div>
                <div className="text-sm text-gray-500">Free Forever</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">M-Pesa</div>
                <div className="text-sm text-gray-500">SMS Tracking</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">Secure</div>
                <div className="text-sm text-gray-500">Bank-level</div>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent z-10 pointer-events-none" />
            <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-2 shadow-2xl">
              <div className="rounded-xl bg-[#0d1424] p-6 overflow-hidden">
                {/* Mock Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-sm text-gray-500">Total Balance</div>
                    <div className="text-3xl font-bold">KES 247,500</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-sm font-medium">
                      +12.5% this month
                    </div>
                  </div>
                </div>

                {/* Mock Chart Area */}
                <div className="h-48 flex items-end justify-between gap-2 mb-6">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 80].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-blue-500 to-purple-500 opacity-80"
                        style={{ height: `${h}%` }}
                      />
                      <span className="text-[10px] text-gray-600">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                    </div>
                  ))}
                </div>

                {/* Mock Account Cards */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: 'M-Pesa', balance: 'KES 45,200', color: 'from-green-500 to-emerald-600', icon: '📱' },
                    { name: 'KCB Bank', balance: 'KES 182,300', color: 'from-blue-500 to-cyan-600', icon: '🏦' },
                    { name: 'SACCO', balance: 'KES 20,000', color: 'from-purple-500 to-pink-600', icon: '🤝' },
                  ].map((acc) => (
                    <div key={acc.name} className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${acc.color} flex items-center justify-center text-sm`}>
                          {acc.icon}
                        </div>
                        <span className="text-sm text-gray-400">{acc.name}</span>
                      </div>
                      <div className="text-lg font-semibold">{acc.balance}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 mb-4">
              Powerful Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built specifically for Kenya's financial ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "📊",
                title: "Smart Budgeting",
                desc: "Set monthly budgets by category. Get alerts before you overspend.",
                gradient: "from-blue-500/20 to-cyan-500/20"
              },
              {
                icon: "💳",
                title: "Debt Payoff Planner",
                desc: "Compare snowball vs avalanche. See your debt-free date.",
                gradient: "from-purple-500/20 to-pink-500/20"
              },
              {
                icon: "🎯",
                title: "Savings Goals",
                desc: "Set targets with deadlines. Track progress automatically.",
                gradient: "from-green-500/20 to-emerald-500/20"
              },
              {
                icon: "📈",
                title: "Investment Tracker",
                desc: "Stocks, MMFs, SACCOs, crypto - all in one place.",
                gradient: "from-orange-500/20 to-red-500/20"
              },
              {
                icon: "💰",
                title: "Net Worth Dashboard",
                desc: "Assets minus liabilities. See your true financial health.",
                gradient: "from-yellow-500/20 to-orange-500/20"
              },
              {
                icon: "📱",
                title: "M-Pesa SMS Sync",
                desc: "Auto-detect transactions from your M-Pesa messages.",
                gradient: "from-teal-500/20 to-blue-500/20"
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className={`group p-6 rounded-2xl bg-gradient-to-br ${feature.gradient} border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-sm text-green-400 mb-4">
              Simple Setup
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Get Started in Minutes
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              No complicated setup. Just sign up and start tracking.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Account",
                desc: "Sign up with email or Google. Takes less than 30 seconds.",
                icon: "👤"
              },
              {
                step: "02",
                title: "Add Your Accounts",
                desc: "Add M-Pesa, bank accounts, SACCOs, or cash on hand.",
                icon: "🏦"
              },
              {
                step: "03",
                title: "Track Everything",
                desc: "Log transactions, set budgets, and watch your wealth grow.",
                icon: "📈"
              },
            ].map((item, idx) => (
              <div key={item.step} className="relative">
                {idx < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-white/20 to-transparent" />
                )}
                <div className="relative z-10 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl">
                    {item.icon}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Step {item.step}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm text-purple-400 mb-4">
              Simple Pricing
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Free. Forever.
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              No hidden fees. No credit card required. No limits.
            </p>
          </div>

          <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-sm font-medium">
              Currently Free
            </div>

            <div className="text-center mb-8">
              <div className="text-6xl font-bold mb-2">
                KES 0
                <span className="text-2xl text-gray-500 font-normal">/month</span>
              </div>
              <p className="text-gray-400">All features included</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                "Unlimited transactions",
                "Unlimited accounts",
                "Budget tracking",
                "Debt planner",
                "Savings goals",
                "Net worth tracking",
                "Investment portfolio",
                "CSV export",
                "M-Pesa SMS sync",
                "Reports & analytics",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            <Link
              to="/signup"
              className="block w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl text-center hover:opacity-90 transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Questions? Answers.
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is it really free?",
                a: "Yes! All features are completely free. We may introduce premium features in the future, but core functionality will always be free."
              },
              {
                q: "How do I add my accounts?",
                a: "Simply create accounts manually - add your M-Pesa, bank accounts, SACCO, or cash. Enter the balance and start tracking."
              },
              {
                q: "Is my data secure?",
                a: "Absolutely. We use bank-level encryption and never sell your data. Your financial info is private and secure."
              },
              {
                q: "Can I export my data?",
                a: "Yes! Export all your transactions and reports to CSV format anytime. Your data is yours."
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl bg-white/5 border border-white/5 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 font-semibold cursor-pointer select-none hover:bg-white/5 transition-colors">
                  {faq.q}
                  <span className="text-gray-500 group-open:rotate-180 transition-transform">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-400">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Transform
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Finances?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join hundreds of Kenyans who are already taking control of their money.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-purple-500/25 text-lg"
          >
            Create Free Account
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm">
              M
            </div>
            <span className="font-semibold">Mstatili Finance</span>
          </div>

          <div className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Mstatili Technologies. All rights reserved.
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link to="/login" className="text-gray-400 hover:text-white transition-colors">Sign In</Link>
            <Link to="/signup" className="text-gray-400 hover:text-white transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
