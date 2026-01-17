import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { fetchCurrentUser } from "../api/auth";

// Feature data
const features = [
  {
    title: "Track everything",
    description: "Record income and expenses in seconds and see where your money goes.",
    bullets: [
      "Transactions with categories and tags",
      "Multi-account tracking (cash, mobile money, bank, SACCO)",
      "Fast search and filters",
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    title: "Plan with confidence",
    description: "Budget smarter and stay ready for upcoming expenses.",
    bullets: [
      "Monthly budgets with progress tracking",
      "Subscription and recurring expense tracking",
      "Savings goals with targets and deadlines",
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    title: "Grow your wealth",
    description: "Make better decisions with clear reports and performance insights.",
    bullets: [
      "Net worth tracking and trends",
      "Investment portfolio monitoring",
      "Debt planner and payoff strategy view",
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
];

const screens = [
  { src: "/landing/screen-dashboard.webp", caption: "Dashboard overview" },
  { src: "/landing/screen-transaction.webp", caption: "Transactions & categories" },
  { src: "/landing/screen-budget.webp", caption: "Budgets & progress" },
  { src: "/landing/screen-reports.webp", caption: "Reports & analytics" },
  { src: "/landing/screen-goals.webp", caption: "Goals tracking" },
];

// FAQ data
const faqs = [
  {
    question: "What is Sonko?",
    answer: "Sonko is a personal finance app that helps you track every shilling, plan your budget, and grow your wealth with clarity.",
  },
  {
    question: "Can I track expenses manually?",
    answer: "Yes. You can add income and expenses manually, assign categories and tags, and track spending trends over time.",
  },
  {
    question: "Does Sonko support multiple accounts?",
    answer: "Yes. You can track multiple accounts such as cash, mobile money, bank and SACCO accounts in one place.",
  },
  {
    question: "Can I create budgets and savings goals?",
    answer: "Yes. Sonko supports monthly budgets and savings goals so you can plan ahead and track progress consistently.",
  },
  {
    question: "Does Sonko support SMS transaction detection?",
    answer: "On Android, Sonko can detect supported transaction SMS messages and help you save them quickly with smart suggestions.",
  },
  {
    question: "Is Sonko safe and private?",
    answer: "Yes. Sonko is built with privacy-first principles and you remain in full control of your financial data.",
  },
  {
    question: "Can I export my data?",
    answer: "Yes. You can export your transactions, reports, and other data anytime in standard formats.",
  },
  {
    question: "Is Sonko free?",
    answer: "Sonko includes core features for free. Sonko Pro unlocks premium tools such as advanced analytics, automation and deeper insights.",
  },
  {
    question: "Will Sonko be available on iPhone (iOS)?",
    answer: "Sonko is currently focused on delivering the best experience on supported platforms. iOS support may be considered in future updates.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    fetchCurrentUser()
      .then(() => navigate("/dashboard"))
      .catch(() => {});
  }, [navigate]);

  const scrollToSection = (section: string) => {
    const element = document.querySelector(`[data-section="${section}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-slate-950 dark:text-slate-100">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-20 lg:py-24 bg-white dark:bg-slate-950">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
              <div className="text-center lg:text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium mb-6 dark:bg-slate-800 dark:text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                  Sonko — Track. Plan. Grow.
                </div>

                {/* Headline */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">
                  Track every shilling.{" "}
                  <span className="text-blue-700 dark:text-blue-300">Grow your wealth.</span>
                </h1>

                {/* Subheadline */}
                <p className="text-lg md:text-xl text-gray-700 dark:text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Take control of your personal finances with Sonko — a modern money tracker built for clarity. Track income and expenses, plan budgets, manage debts, monitor investments, and stay consistent with your goals.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 rounded-lg transition-colors shadow-sm"
                  >
                    Get Started Free
                  </Link>
                  <button
                    type="button"
                    onClick={() => scrollToSection("features")}
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    View Features
                  </button>
                </div>

                {/* Trust chips */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-gray-600 dark:text-slate-300">
                  {[
                    "Privacy-first",
                    "Multi-account tracking",
                    "Budgets • Goals • Reports",
                    "Smart SMS transaction detection (Android)",
                  ].map((chip) => (
                    <span
                      key={chip}
                      className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium dark:bg-slate-800 dark:text-slate-200"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative">
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-2 md:p-3 shadow-xl shadow-gray-200/50 dark:bg-slate-900/70 dark:border-slate-700 dark:shadow-slate-950/50">
                  <img
                    src="/landing/hero-dashboard.webp"
                    alt="Sonko dashboard preview"
                    className="w-full rounded-xl"
                  />
                </div>

                <div className="absolute -top-4 left-6 hidden sm:flex flex-col gap-1 rounded-xl border border-gray-200 bg-white/90 px-4 py-3 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
                  <span className="text-xs text-gray-500 dark:text-slate-400">Total balance</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">KES 847,250</span>
                </div>
                <div className="absolute bottom-6 -left-4 hidden sm:flex flex-col gap-1 rounded-xl border border-gray-200 bg-white/90 px-4 py-3 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
                  <span className="text-xs text-gray-500 dark:text-slate-400">Monthly spend</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">KES 42,800</span>
                </div>
                <div className="absolute top-1/2 -right-6 hidden md:flex flex-col gap-1 rounded-xl border border-gray-200 bg-white/90 px-4 py-3 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
                  <span className="text-xs text-gray-500 dark:text-slate-400">Budget used</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">62% this month</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 md:py-20 lg:py-24 bg-gray-50 dark:bg-slate-900/40" data-section="features" id="features">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            {/* Section Header */}
            <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Everything you need to stay in control
              </h2>
              <p className="text-lg text-gray-700 dark:text-slate-300">
                Sonko helps you understand your money, stay on budget, and grow wealth through consistent tracking and better decisions.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all h-full flex flex-col dark:bg-slate-900/70 dark:border-slate-700 dark:hover:border-slate-500"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-4 dark:bg-blue-900/30 dark:text-blue-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 dark:text-slate-300 leading-relaxed">{feature.description}</p>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-slate-300">
                    {feature.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Screens Section */}
        <section className="py-24 md:py-20 lg:py-24 bg-white dark:bg-slate-950" data-section="screens" id="screens">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                See Sonko in action
              </h2>
              <p className="text-lg text-gray-700 dark:text-slate-300">
                A clean dashboard, simple tracking, and powerful insights — everything designed for clarity.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
              {screens.map((screen) => (
                <div
                  key={screen.src}
                  className="group rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md flex flex-col h-full dark:bg-slate-900/70 dark:border-slate-700"
                >
                  <div className="flex h-44 items-center justify-center overflow-hidden rounded-xl bg-gray-50 dark:bg-slate-900/40 sm:h-48 lg:h-52">
                    <img
                      src={screen.src}
                      alt={screen.caption}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 text-center text-sm font-semibold text-gray-700 dark:text-slate-300">
                    {screen.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-24 md:py-20 lg:py-24 bg-gradient-to-b from-white via-gray-50 to-gray-50 dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-900" data-section="security" id="security">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Content */}
              <div className="order-2 lg:order-1">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Your data stays yours
                </h2>
                <p className="text-lg text-gray-700 dark:text-slate-300 mb-8 leading-relaxed">
                  Sonko is built with privacy and security in mind. Your financial records are personal — and you stay in full control of your data.
                </p>

                <ul className="space-y-4">
                  {[
                    "Privacy-first design",
                    "Secure access (PIN / device security)",
                    "Export your data anytime",
                    "No selling of personal data",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 dark:text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Image */}
              <div className="order-1 lg:order-2 bg-white rounded-2xl border border-gray-200 p-2 md:p-3 dark:bg-slate-900/70 dark:border-slate-700">
                <img
                  src="/landing/security-illustration.webp"
                  alt="Security illustration"
                  className="w-full rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-950" data-section="faq" id="faq">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently asked questions
              </h2>
              <p className="text-lg text-gray-600 dark:text-slate-300">
                Everything you need to know about Sonko.
              </p>
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl overflow-hidden dark:border-slate-700"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 bg-white hover:bg-gray-50 transition-colors dark:bg-slate-900/70 dark:hover:bg-slate-800"
                    aria-expanded={openFaq === index}
                  >
                    <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 text-gray-500 dark:text-slate-400 shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4 text-gray-600 dark:text-slate-300 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden py-24 md:py-20 lg:py-24 bg-blue-600">
          <img
            src="/landing/mobile-dashboard.webp"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 top-1/2 hidden w-44 -translate-y-1/2 opacity-20 sm:block md:w-56 lg:w-64"
          />
          <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Start tracking today
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
              Sonko makes money management simple. Track spending, set goals, stay on budget, and build wealth — one day at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-blue-600 bg-white hover:bg-blue-50 rounded-lg transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
