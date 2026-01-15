import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { fetchCurrentUser } from "../api/auth";

// --- Components ---

const SpotlightCard = ({
  children,
  className = "",
  spotlightColor = "rgba(0, 96, 255, 0.15)"
}: {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-xl border border-white/10 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className="relative h-full z-0">{children}</div>
    </div>
  );
};

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

const stats = [
  { value: "KES 1.2B+", label: "Transacted" },
  { value: "15,000+", label: "Active Users" },
  { value: "4.8/5", label: "App Rating" },
  { value: "24/7", label: "Support" },
];

const calculators = [
  {
    title: "Budget Tracker",
    desc: "Set spending limits by category and track progress.",
    icon: "📊",
  },
  {
    title: "Debt Planner",
    desc: "Compare snowball vs avalanche payoff strategies.",
    icon: "💳",
  },
  {
    title: "Savings Goals",
    desc: "Set targets and track contributions over time.",
    icon: "🎯",
  },
  {
    title: "Net Worth",
    desc: "Monitor assets vs liabilities to see real growth.",
    icon: "💰",
  },
  {
    title: "Investments",
    desc: "Track stocks, funds, crypto and calculate returns.",
    icon: "📈",
  },
  {
    title: "Subscriptions",
    desc: "Manage recurring payments and renewal dates.",
    icon: "🔄",
  },
];

const features = [
  {
    title: "See clearly.",
    subtitle: "Complete Financial Visibility",
    desc: "Connect your manual entries from M-Pesa, banks, and cash into one unified dashboard. Understand exactly where every shilling goes with intuitive charts and categorization.",
    image: "/dashboard-preview.png", // We will use a placeholder div effectively
    align: "left"
  },
  {
    title: "Plan ahead.",
    subtitle: "Smart Budgeting",
    desc: "Create realistic monthly budgets based on your actual spending habits. Get alerts when you're close to your limits and adjust before it's too late.",
    image: "/budget-preview.png",
    align: "right"
  },
  {
    title: "Grow faster.",
    subtitle: "Wealth Tracking",
    desc: "Watch your net worth grow over time. Track assets like land, livestock, and stocks alongside your debts to verify your true financial health.",
    image: "/wealth-preview.png",
    align: "left"
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
    <div className="min-h-screen flex flex-col font-sans bg-white text-slate-900 overflow-x-hidden selection:bg-blue-100">
      <PublicHeader />

      <main className="flex-1">

        {/* HERO SECTION - White Clean */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="text-center lg:text-left space-y-8 animate-fade-in-up">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-100 bg-blue-50 text-brand-blue text-xs font-bold uppercase tracking-wide mx-auto lg:mx-0">
                  <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
                  Built for Kenya
                </div>

                {/* Headline */}
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter text-slate-900 leading-[0.95]">
                  Master <br />
                  your <span className="text-brand-blue">money.</span>
                </h1>

                <p className="text-xl text-slate-500 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  The high-performance platform for modern personal finance.
                  Track M-Pesa, budget smarter, and build wealth with institutional-grade tools.
                </p>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                  <AuthLink className="px-8 py-4 bg-brand-blue hover:bg-blue-700 text-white font-bold text-lg rounded-full shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1">
                    Start Your Journey
                  </AuthLink>
                  <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-lg rounded-full border border-slate-200 transition-all hover:-translate-y-1">
                    View Features
                  </button>
                </div>
              </div>

              {/* Graphical Hero Right - Abstract Tech */}
              <div className="relative h-[500px] w-full hidden lg:block perspective-1000">
                {/* Decorative Blobs */}
                <div className="absolute top-10 right-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
                <div className="absolute bottom-10 left-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

                {/* Abstract 'Card' Stack */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4/5 h-4/5">
                  <div className="absolute top-0 right-0 w-full h-full bg-slate-900 rounded-3xl shadow-2xl rotate-3 z-10 overflow-hidden border border-slate-700">
                    {/* Fake UI Inside */}
                    <div className="h-full w-full bg-navy-950 p-6 relative">
                      <div className="flex gap-2 mb-8">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                      <div className="text-slate-400 text-sm font-mono mb-2">NET WORTH GROWTH</div>
                      <div className="text-4xl font-bold text-white mb-8">+24.5%</div>
                      {/* Abstract bars */}
                      <div className="flex items-end gap-2 h-40">
                        {[40, 60, 45, 70, 55, 80, 65, 90].map((h, i) => (
                          <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-brand-blue/80 rounded-t-sm" />
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Back Card */}
                  <div className="absolute top-4 -right-4 w-full h-full bg-slate-100 rounded-3xl -rotate-3 z-0 border border-slate-200" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS BAR - Seamless Transition */}
        <div className="border-y border-slate-100 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FEATURES - Z-Pattern (Light Theme) */}
        <section id="features" className="py-24 space-y-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {features.map((feature, idx) => (
            <div key={feature.title} className={`flex flex-col lg:flex-row gap-16 items-center ${feature.align === 'right' ? 'lg:flex-row-reverse' : ''}`}>
              <div className="flex-1 space-y-6">
                <div className="text-brand-blue font-bold tracking-wider uppercase text-sm">{feature.subtitle}</div>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900">{feature.title}</h2>
                <p className="text-lg text-slate-600 leading-relaxed">{feature.desc}</p>
                <div className="pt-4">
                  <AuthLink className="text-slate-900 font-bold decoration-2 underline decoration-brand-blue underline-offset-4 hover:text-brand-blue transition-colors">
                    Learn more →
                  </AuthLink>
                </div>
              </div>
              <div className="flex-1 w-full aspect-[4/3] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-lg relative group">
                {/* Placeholder Content for Images */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-300">
                  <span className="text-9xl opacity-20 group-hover:scale-110 transition-transform duration-500">
                    {idx === 0 ? '👁️' : idx === 1 ? '📅' : '📈'}
                  </span>
                </div>
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-brand-blue/0 group-hover:bg-brand-blue/5 transition-colors duration-300" />
              </div>
            </div>
          ))}
        </section>

        {/* IMMERSIVE TOOLS SECTION - Deep Navy */}
        <section className="py-32 bg-navy-950 text-white relative overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">Tools for every strategy.</h2>
              <p className="text-xl text-slate-400">Everything you need to analyze, plan, and execute your financial goals.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {calculators.map((calc) => (
                <SpotlightCard key={calc.title} className="bg-navy-900/50 p-8 hover:bg-navy-900 transition-colors group">
                  <div className="text-4xl mb-6 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">{calc.icon}</div>
                  <h3 className="text-2xl font-bold mb-3 text-white">{calc.title}</h3>
                  <p className="text-slate-400 leading-relaxed mb-6">{calc.desc}</p>
                  <div className="text-brand-blue font-bold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Try Tool <span>→</span>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CTA - Deep Navy Continuation */}
        <section className="py-24 bg-navy-950 text-white border-t border-white/5">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              Start building <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">today.</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AuthLink className="px-12 py-5 bg-brand-blue hover:bg-blue-600 text-white font-bold text-xl rounded-full shadow-2xl hover:shadow-blue-500/40 transition-all hover:-translate-y-1">
                Create Free Account
              </AuthLink>
            </div>
            <p className="mt-8 text-slate-500">No credit card required · Free forever plan</p>
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
}
