import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { fetchCurrentUser } from "../api/auth";

// --- Components ---

const SpotlightCard = ({
  children,
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.1)"
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
      className={`relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-8 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className="relative h-full">{children}</div>
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

const chartData = [
  { date: "Nov 1", income: 8000, expenses: 5200 },
  { date: "Nov 5", income: 8000, expenses: 7300 },
  { date: "Nov 10", income: 27000, expenses: 12300 },
  { date: "Nov 15", income: 27000, expenses: 8900 },
  { date: "Nov 20", income: 35000, expenses: 15200 },
  { date: "Nov 25", income: 35000, expenses: 9800 },
  { date: "Nov 30", income: 35000, expenses: 6700 },
];

const features = [
  {
    title: "Multi-Account Tracking",
    desc: "Seamlessly track M-Pesa, bank accounts, SACCOs, and cash in one unified dashboard.",
    icon: "🔗",
    colSpan: "md:col-span-2"
  },
  { title: "Smart Categorization", desc: "Auto-organize your spending with custom rules.", icon: "🏷️", colSpan: "" },
  { title: "Budget Limits", desc: "Set strict monthly limits and get alerted.", icon: "⚡", colSpan: "" },
  {
    title: "Debt Payoff Planner",
    desc: "Visualize your debt freedom date using Snowball or Avalanche strategies.",
    icon: "💳",
    colSpan: "md:col-span-2"
  },
  { title: "Savings Goals", desc: "Track progress towards your dreams.", icon: "🎯", colSpan: "" },
  { title: "Investment Portfolio", desc: "Stocks, MMFS, Crypto, Insurance.", icon: "📈", colSpan: "" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser()
      .then(() => navigate("/dashboard"))
      .catch(() => { });
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Grids */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-slate-950/90" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] opacity-50 mix-blend-screen pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            v2.0 is now live
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Finance for the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 animate-gradient-x">
              Modern Kenyan.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop guessing where your money goes. Track M-Pesa, manage debts, and build wealth with a platform designed for your life.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
            <AuthLink className="h-12 px-8 rounded-full bg-white text-slate-950 font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2">
              Get Started Free <span className="text-indigo-600">→</span>
            </AuthLink>
            <button
              onClick={() => document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
              }
            className="h-12 px-8 rounded-full bg-slate-800/50 border border-slate-700 text-white font-medium hover:bg-slate-800 transition-colors"
            >
            Explore Features
          </button>
        </div>

        {/* Hero Dashboard Graphic */}
        <div className="mt-20 relative max-w-5xl mx-auto">
          <div className="relative rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-2 shadow-2xl shadow-indigo-500/10">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
            <div className="rounded-lg overflow-hidden bg-slate-950 aspect-[16/9] relative group">
              {/* Simulated UI */}
              <div className="absolute inset-0 flex flex-col">
                <div className="h-12 border-b border-slate-800 flex items-center px-4 gap-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-800" />
                    <div className="w-3 h-3 rounded-full bg-slate-800" />
                    <div className="w-3 h-3 rounded-full bg-slate-800" />
                  </div>
                  <div className="h-6 w-32 bg-slate-800/50 rounded-full" />
                </div>
                <div className="flex-1 p-6 grid grid-cols-3 gap-6">
                  <div className="col-span-2 space-y-6">
                    <div className="h-48 rounded-lg bg-indigo-500/5 border border-indigo-500/10 p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={2} fill="url(#heroGradient)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 rounded-lg bg-slate-900 border border-slate-800 p-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 mb-2" />
                        <div className="h-4 w-20 bg-slate-800 rounded mb-1" />
                        <div className="h-3 w-12 bg-slate-800/50 rounded" />
                      </div>
                      <div className="h-24 rounded-lg bg-slate-900 border border-slate-800 p-4">
                        <div className="w-8 h-8 rounded-full bg-rose-500/20 mb-2" />
                        <div className="h-4 w-20 bg-slate-800 rounded mb-1" />
                        <div className="h-3 w-12 bg-slate-800/50 rounded" />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 space-y-4">
                    <div className="h-full rounded-lg bg-slate-900/50 border border-slate-800 p-4">
                      <div className="h-4 w-24 bg-slate-800 rounded mb-4" />
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800" />
                          <div className="flex-1">
                            <div className="h-3 w-full bg-slate-800/50 rounded mb-1" />
                            <div className="h-2 w-1/2 bg-slate-800/30 rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
          </div>
        </div>
    </div>
      </section >

    {/* Features Grid */ }
    < section id = "features" className = "py-24 bg-slate-950 relative" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 md:text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Everything you need.</h2>
          <p className="text-lg text-slate-400">
            Powerful tools designed to replace your spreadsheets and give you clarity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <SpotlightCard key={feature.title} className={feature.colSpan}>
              <div className="text-4xl mb-4 p-3 bg-slate-800/50 rounded-2xl w-fit">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </SpotlightCard>
          ))}
        </div>
      </div>
      </section >

    {/* CTA Section */ }
    < section className = "py-24 relative overflow-hidden" >
        <div className="absolute inset-0 bg-indigo-600/10" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
            Ready to master your money?
          </h2>
          <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
            Join thousands of Kenyans using Mstatili Finance to build a better financial future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <AuthLink className="px-10 py-4 bg-white text-indigo-900 font-bold rounded-full hover:bg-indigo-50 transition-all shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-1">
               Create Free Account
             </AuthLink>
          </div>
          <p className="mt-8 text-slate-500 text-sm">No credit card required · Free forever plan available</p>
        </div>
      </section >

    <PublicFooter />
    </div >
  );
}
