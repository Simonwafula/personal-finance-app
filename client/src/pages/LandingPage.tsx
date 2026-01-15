import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { fetchCurrentUser } from "../api/auth";
import Logo from "../components/Logo";

const features = [
  {
    title: "Track Everything",
    description: "Connect M-Pesa, bank accounts, and cash transactions in one unified dashboard.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Smart Budgets",
    description: "Create realistic budgets based on your spending habits and get alerts before overspending.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Wealth Tracking",
    description: "Monitor your net worth growth with assets, investments, and debt in one clear view.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: "Debt Management",
    description: "Compare snowball vs avalanche strategies and create a clear path to being debt-free.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
];

const tools = [
  { name: "Budget Tracker", description: "Set spending limits by category" },
  { name: "Savings Goals", description: "Track progress towards your targets" },
  { name: "Investment Portfolio", description: "Monitor stocks, funds, and crypto" },
  { name: "Subscription Manager", description: "Never miss a renewal date" },
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
    answer: "Mstatili Finance offers a generous free tier. Premium features are available at affordable rates for power users.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Force dark mode for landing page
    document.documentElement.classList.add("dark");

    // Redirect authenticated users to dashboard
    fetchCurrentUser()
      .then(() => navigate("/dashboard"))
      .catch(() => {});
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />

          <div className="max-w-6xl mx-auto px-6 lg:px-8 relative">
            <div className="max-w-3xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                Built for Kenya
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
                Master Your
                <span className="text-blue-500"> Money</span>
              </h1>

              <p className="text-lg lg:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                The modern personal finance platform. Track M-Pesa, budget smarter,
                and build wealth with tools designed for how you actually manage money.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5"
                >
                  Start Free
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-300 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl transition-all"
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Hero Visual - Dashboard Preview */}
            <div className="mt-16 lg:mt-20 relative" data-section="demo">
              <div className="relative mx-auto max-w-4xl">
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-3xl blur-2xl opacity-50" />

                {/* Dashboard mockup */}
                <div className="relative bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-slate-700">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-xs text-slate-500 font-mono">finance.mstatilitechnologies.com</span>
                    </div>
                  </div>

                  {/* Dashboard content */}
                  <div className="p-6 lg:p-8">
                    {/* Stats row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      {[
                        { label: "Net Worth", value: "KES 847,250", change: "+12.4%", positive: true },
                        { label: "This Month", value: "KES 45,200", change: "-8.2%", positive: false },
                        { label: "Savings", value: "KES 125,000", change: "+5.1%", positive: true },
                        { label: "Investments", value: "KES 320,500", change: "+18.7%", positive: true },
                      ].map((stat) => (
                        <div key={stat.label} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                          <p className="text-xs text-slate-500 font-medium mb-1">{stat.label}</p>
                          <p className="text-lg font-bold text-white">{stat.value}</p>
                          <p className={`text-xs font-medium ${stat.positive ? "text-green-400" : "text-red-400"}`}>
                            {stat.change}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Chart placeholder */}
                    <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                      <p className="text-sm text-slate-500 mb-4">Spending Trends</p>
                      <div className="flex items-end gap-2 h-32">
                        {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
                          <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-blue-600 to-blue-400" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-12 border-y border-slate-800/50 bg-slate-900/30">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-12 lg:gap-24">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl lg:text-4xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-28">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Everything You Need
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Powerful tools to help you understand, plan, and grow your finances.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group relative bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 lg:p-8 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="py-20 lg:py-28 bg-slate-900/50">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                  Tools for Every Goal
                </h2>
                <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                  Whether you're paying off debt, saving for a goal, or building an investment portfolio,
                  we have the tools to help you succeed.
                </p>

                <div className="space-y-4">
                  {tools.map((tool) => (
                    <div key={tool.name} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <div>
                        <p className="font-medium text-white">{tool.name}</p>
                        <p className="text-sm text-slate-500">{tool.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-purple-600/10 rounded-3xl blur-2xl" />
                <div className="relative bg-slate-900 rounded-2xl border border-slate-800 p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Logo width={32} height={32} />
                    <span className="font-semibold text-white">Mstatili Finance</span>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-400">Emergency Fund</span>
                        <span className="text-sm font-medium text-green-400">67%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-gradient-to-r from-green-500 to-green-400 rounded-full" />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">KES 201,000 of KES 300,000</p>
                    </div>

                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-400">Vacation Fund</span>
                        <span className="text-sm font-medium text-blue-400">45%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full w-[45%] bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">KES 45,000 of KES 100,000</p>
                    </div>

                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-400">New Laptop</span>
                        <span className="text-sm font-medium text-purple-400">82%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full w-[82%] bg-gradient-to-r from-purple-500 to-purple-400 rounded-full" />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">KES 82,000 of KES 100,000</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 lg:py-28" data-section="faq">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
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
                  className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                  <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28 bg-gradient-to-t from-slate-900 to-transparent">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Ready to Take Control?
            </h2>
            <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
              Join thousands of Kenyans who are building better financial habits with Mstatili Finance.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5"
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
