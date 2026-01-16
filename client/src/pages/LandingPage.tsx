import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { fetchCurrentUser } from "../api/auth";

// Inline styles to ensure layout works regardless of Tailwind purging
const heroGridStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4rem',
  alignItems: 'center',
};

const heroGridStyleLg: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: '4rem',
  alignItems: 'center',
};

// Modern glassmorphism card style
const glassCardStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: '1.5rem',
  border: '1px solid rgba(148, 163, 184, 0.1)',
  position: 'relative',
  overflow: 'hidden',
};

// Feature blocks - accurately describing app capabilities
const featureBlocks = [
  {
    theme: "Transactions",
    title: "Record Every Transaction",
    description: "Never lose track of where your money goes.",
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    iconBg: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    bullets: [
      "Log income, expenses & transfers",
      "Auto-import M-Pesa & bank SMS",
      "Categorize with custom tags",
    ],
  },
  {
    theme: "Budgets",
    title: "Set & Track Budgets",
    description: "Control spending with category limits.",
    color: "green",
    gradient: "from-emerald-500 to-teal-500",
    iconBg: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    bullets: [
      "Monthly budgets by category",
      "See remaining vs spent at a glance",
      "Track savings goals progress",
    ],
  },
  {
    theme: "Insights",
    title: "Understand Your Finances",
    description: "Reports and analytics for better decisions.",
    color: "purple",
    gradient: "from-purple-500 to-pink-500",
    iconBg: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    bullets: [
      "Income vs expense breakdowns",
      "Net worth tracking over time",
      "Spending trends by category",
    ],
  },
];

// App screenshots for preview section - reflecting actual app screens
const appScreens = [
  { name: "Dashboard", description: "Overview of all accounts & balances", icon: "📊" },
  { name: "Transactions", description: "Complete history of money in & out", icon: "💳" },
  { name: "Budgets", description: "Monthly limits by spending category", icon: "🎯" },
  { name: "Net Worth", description: "Assets, liabilities & investments", icon: "📈" },
];

// What the app helps you do
const benefits = [
  { text: "See all accounts in one place", icon: "👁️" },
  { text: "Know exactly where money goes", icon: "🎯" },
  { text: "Make informed financial decisions", icon: "💡" },
];

const faqs = [
  {
    question: "What can I track with Utajiri?",
    answer: "Track all your finances: bank accounts, M-Pesa, cash, income, expenses, budgets, savings goals, investments, and debts. Everything in one place.",
    icon: "📋",
  },
  {
    question: "How does SMS import work?",
    answer: "On mobile, Utajiri can read your M-Pesa and bank SMS messages and automatically extract transaction details. This happens locally on your device for privacy.",
    icon: "📱",
  },
  {
    question: "Is my data private and secure?",
    answer: "Yes. Your data is encrypted and stored securely. We never access your bank accounts directly - you control what information you add.",
    icon: "🔒",
  },
  {
    question: "Can I access it on multiple devices?",
    answer: "Yes. Use Utajiri on the web or download our Android app. Your data syncs across all your devices.",
    icon: "📲",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    fetchCurrentUser()
      .then(() => navigate("/dashboard"))
      .catch(() => { });

    // Check screen size for responsive layout (Tailwind breakpoints: sm=640, md=768, lg=1024)
    const lgQuery = window.matchMedia('(min-width: 1024px)');
    const mdQuery = window.matchMedia('(min-width: 768px)');
    const smQuery = window.matchMedia('(min-width: 640px)');

    const handleLgChange = (e: MediaQueryListEvent | MediaQueryList) => setIsLargeScreen(e.matches);
    const handleMdChange = (e: MediaQueryListEvent | MediaQueryList) => setIsMediumScreen(e.matches);
    const handleSmChange = (e: MediaQueryListEvent | MediaQueryList) => setIsSmallScreen(e.matches);

    handleLgChange(lgQuery);
    handleMdChange(mdQuery);
    handleSmChange(smQuery);

    lgQuery.addEventListener('change', handleLgChange);
    mdQuery.addEventListener('change', handleMdChange);
    smQuery.addEventListener('change', handleSmChange);

    return () => {
      lgQuery.removeEventListener('change', handleLgChange);
      mdQuery.removeEventListener('change', handleMdChange);
      smQuery.removeEventListener('change', handleSmChange);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section - 2 Column Layout */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          {/* Animated background gradient */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.15), transparent)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }} />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div style={isLargeScreen ? heroGridStyleLg : heroGridStyle}>
              {/* Left Column - Content */}
              <div style={{ textAlign: isLargeScreen ? 'left' : 'center', flex: 1 }}>
                {/* Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  marginBottom: '1.5rem',
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#60a5fa', animation: 'pulse 2s infinite' }} />
                  <span style={{ color: '#60a5fa', fontSize: '0.875rem', fontWeight: 500 }}>Personal Finance Tracker</span>
                </div>

                {/* Headline */}
                <h1 style={{
                  fontSize: isLargeScreen ? '3.75rem' : isSmallScreen ? '3rem' : '2.25rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  marginBottom: '1.5rem',
                  lineHeight: 1.1,
                }}>
                  All Your{' '}
                  <span style={{
                    background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #34d399 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>Finances</span>
                  {' '}in One Place
                </h1>

                <p style={{
                  fontSize: isLargeScreen ? '1.25rem' : '1.125rem',
                  color: '#94a3b8',
                  marginBottom: '2rem',
                  lineHeight: 1.7,
                  maxWidth: '540px',
                  marginLeft: isLargeScreen ? 0 : 'auto',
                  marginRight: isLargeScreen ? 0 : 'auto',
                }}>
                  Track your income, expenses, budgets, and accounts — M-Pesa, bank, and cash — so you always know where your money stands.
                </p>

                {/* CTAs */}
                <div style={{ display: 'flex', flexDirection: isSmallScreen ? 'row' : 'column', gap: '1rem', justifyContent: isLargeScreen ? 'flex-start' : 'center', marginBottom: '2rem' }}>
                  <Link
                    to="/signup"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '1rem 2rem',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      borderRadius: '0.875rem',
                      boxShadow: '0 10px 40px -10px rgba(59, 130, 246, 0.5), 0 0 0 1px rgba(255,255,255,0.1) inset',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Start Free →
                  </Link>
                  <Link
                    to="/login"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '1rem 2rem',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#e2e8f0',
                      background: 'rgba(30, 41, 59, 0.5)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '0.875rem',
                      backdropFilter: 'blur(10px)',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Sign In
                  </Link>
                </div>

                {/* Benefits Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: isLargeScreen ? 'flex-start' : 'center', fontSize: '0.875rem', color: '#64748b' }}>
                  {benefits.map((benefit, i) => (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>{benefit.icon}</span>
                      <span>{benefit.text}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column - Phone Mockup */}
              <div className="relative flex justify-center shrink-0" data-section="demo">
                <div className="relative">
                  {/* Glow effect */}
                  <div style={{
                    position: 'absolute',
                    inset: '-20px',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.2) 50%, rgba(16, 185, 129, 0.2) 100%)',
                    borderRadius: '3rem',
                    filter: 'blur(40px)',
                  }} />

                  {/* Phone frame - outer shell */}
                  <div style={{
                    background: 'linear-gradient(180deg, #475569 0%, #1e293b 100%)',
                    padding: '4px',
                    borderRadius: '2.5rem',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1) inset',
                    position: 'relative',
                  }}>
                    {/* Phone body */}
                    <div style={{ background: '#0f172a', borderRadius: '2.3rem', padding: '4px' }}>
                      {/* Inner screen */}
                      <div style={{ background: '#020617', borderRadius: '2rem', overflow: 'hidden', width: '280px' }}>
                        {/* Notch */}
                        <div style={{ position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)', width: '80px', height: '24px', background: '#000', borderRadius: '999px', zIndex: 20 }} />

                        {/* Screen content */}
                        <div style={{ padding: '3rem 1rem 1.5rem' }}>
                          {/* Mini header */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '12px', color: '#fff', fontWeight: 700 }}>U</span>
                              </div>
                              <span style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>Utajiri</span>
                            </div>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #334155, #1e293b)', border: '2px solid #475569' }} />
                          </div>

                          {/* Balance card */}
                          <div style={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                            borderRadius: '1rem',
                            padding: '1rem',
                            marginBottom: '0.75rem',
                            boxShadow: '0 10px 30px -10px rgba(59, 130, 246, 0.5)',
                          }}>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginBottom: '4px' }}>Total Balance</p>
                            <p style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}>KES 847,250</p>
                            <p style={{ color: '#86efac', fontSize: '11px', marginTop: '4px' }}>↑ 12.4% this month</p>
                          </div>

                          {/* Stats row */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <div style={{ background: 'rgba(30, 41, 59, 0.8)', borderRadius: '0.75rem', padding: '0.75rem', border: '1px solid rgba(71, 85, 105, 0.3)' }}>
                              <p style={{ color: '#64748b', fontSize: '10px' }}>Income</p>
                              <p style={{ color: '#4ade80', fontSize: '14px', fontWeight: 600 }}>+65,200</p>
                            </div>
                            <div style={{ background: 'rgba(30, 41, 59, 0.8)', borderRadius: '0.75rem', padding: '0.75rem', border: '1px solid rgba(71, 85, 105, 0.3)' }}>
                              <p style={{ color: '#64748b', fontSize: '10px' }}>Expenses</p>
                              <p style={{ color: '#f87171', fontSize: '14px', fontWeight: 600 }}>-42,800</p>
                            </div>
                          </div>

                          {/* Transactions */}
                          <div style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '0.75rem', padding: '0.75rem', border: '1px solid rgba(71, 85, 105, 0.2)' }}>
                            <p style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 500, marginBottom: '0.5rem' }}>Recent Transactions</p>
                            {[
                              { name: 'Safaricom', amount: '-1,500', color: '#f87171', icon: '📱' },
                              { name: 'Salary Deposit', amount: '+65,000', color: '#4ade80', icon: '💼' },
                              { name: 'Naivas Groceries', amount: '-3,200', color: '#f87171', icon: '🛒' },
                            ].map((tx, i) => (
                              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: i < 2 ? '1px solid rgba(71, 85, 105, 0.2)' : 'none' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <span style={{ fontSize: '12px' }}>{tx.icon}</span>
                                  <span style={{ color: '#fff', fontSize: '11px' }}>{tx.name}</span>
                                </span>
                                <span style={{ color: tx.color, fontSize: '11px', fontWeight: 500 }}>{tx.amount}</span>
                              </div>
                            ))}
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

        {/* What You Can Track Section */}
        <section style={{
          padding: '3rem 0',
          borderTop: '1px solid rgba(71, 85, 105, 0.2)',
          borderBottom: '1px solid rgba(71, 85, 105, 0.2)',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.5) 0%, rgba(30, 41, 59, 0.3) 100%)',
        }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: isLargeScreen ? '3rem' : '1.5rem' }}>
              {[
                { icon: '💳', label: 'Transactions' },
                { icon: '📊', label: 'Budgets' },
                { icon: '💰', label: 'Savings' },
                { icon: '📈', label: 'Investments' },
                { icon: '🏠', label: 'Assets' },
                { icon: '💸', label: 'Debts' },
              ].map((item) => (
                <div key={item.label} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1.25rem',
                  background: 'rgba(30, 41, 59, 0.5)',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(71, 85, 105, 0.3)',
                }}>
                  <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                  <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section - Track / Plan / Grow */}
        <section style={{ padding: isLargeScreen ? '6rem 0' : '4rem 0' }} data-section="features">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#60a5fa',
                fontSize: '0.875rem',
                fontWeight: 500,
                marginBottom: '1rem',
              }}>Features</span>
              <h2 style={{
                fontSize: isLargeScreen ? '2.5rem' : '2rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '1rem',
              }}>
                Everything You Need to Succeed
              </h2>
              <p style={{ fontSize: '1.125rem', color: '#94a3b8', maxWidth: '540px', margin: '0 auto' }}>
                From tracking every shilling to building lasting wealth.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMediumScreen ? 'repeat(3, 1fr)' : 'repeat(1, 1fr)', gap: '1.5rem' }}>
              {featureBlocks.map((block) => (
                <div
                  key={block.theme}
                  style={{
                    ...glassCardStyle,
                    padding: isLargeScreen ? '2rem' : '1.5rem',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Gradient border effect */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '1.5rem',
                    padding: '1px',
                    background: `linear-gradient(135deg, ${block.color === 'blue' ? 'rgba(59, 130, 246, 0.3)' : block.color === 'green' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(139, 92, 246, 0.3)'} 0%, transparent 50%)`,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    pointerEvents: 'none',
                  }} />

                  {/* Icon with gradient background */}
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '1rem',
                    background: block.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    boxShadow: `0 10px 30px -10px ${block.color === 'blue' ? 'rgba(59, 130, 246, 0.5)' : block.color === 'green' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(139, 92, 246, 0.5)'}`,
                    color: '#fff',
                  }}>
                    {block.icon}
                  </div>

                  {/* Theme badge */}
                  <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    background: `${block.color === 'blue' ? 'rgba(59, 130, 246, 0.1)' : block.color === 'green' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(139, 92, 246, 0.1)'}`,
                    color: `${block.color === 'blue' ? '#60a5fa' : block.color === 'green' ? '#34d399' : '#a78bfa'}`,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    marginBottom: '1rem',
                  }}>{block.theme}</span>

                  {/* Content */}
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>{block.title}</h3>
                  <p style={{ color: '#94a3b8', marginBottom: '1.5rem', lineHeight: 1.6 }}>{block.description}</p>

                  {/* Bullet points */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {block.bullets.map((bullet, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
                        <span style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: `${block.color === 'blue' ? 'rgba(59, 130, 246, 0.2)' : block.color === 'green' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(139, 92, 246, 0.2)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px',
                        }}>
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke={block.color === 'blue' ? '#60a5fa' : block.color === 'green' ? '#34d399' : '#a78bfa'} strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Screens Preview Section */}
        <section style={{
          padding: isLargeScreen ? '6rem 0' : '4rem 0',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.5) 0%, rgba(30, 41, 59, 0.3) 50%, rgba(15, 23, 42, 0.5) 100%)',
        }} data-section="screens">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                background: 'rgba(139, 92, 246, 0.1)',
                color: '#a78bfa',
                fontSize: '0.875rem',
                fontWeight: 500,
                marginBottom: '1rem',
              }}>Preview</span>
              <h2 style={{ fontSize: isLargeScreen ? '2.5rem' : '2rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
                See Utajiri in Action
              </h2>
              <p style={{ fontSize: '1.125rem', color: '#94a3b8', maxWidth: '540px', margin: '0 auto' }}>
                Clean, intuitive screens designed for real people managing real money.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isLargeScreen ? 'repeat(4, 1fr)' : isSmallScreen ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)', gap: '1.5rem' }}>
              {appScreens.map((screen, index) => (
                <div key={screen.name} style={{ textAlign: 'center' }}>
                  {/* Screen mockup */}
                  <div style={{
                    ...glassCardStyle,
                    aspectRatio: '9/16',
                    marginBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem',
                  }}>
                    {/* Gradient overlay */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(135deg, ${
                        index === 0 ? 'rgba(59, 130, 246, 0.1)' :
                        index === 1 ? 'rgba(16, 185, 129, 0.1)' :
                        index === 2 ? 'rgba(245, 158, 11, 0.1)' :
                        'rgba(139, 92, 246, 0.1)'
                      } 0%, transparent 100%)`,
                      borderRadius: '1.5rem',
                    }} />

                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>{screen.icon}</span>
                      <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Preview</span>
                    </div>
                  </div>

                  {/* Label */}
                  <h3 style={{ fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>{screen.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{screen.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section style={{ padding: isLargeScreen ? '6rem 0' : '4rem 0' }} data-section="faq">
          <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#34d399',
                fontSize: '0.875rem',
                fontWeight: 500,
                marginBottom: '1rem',
              }}>FAQ</span>
              <h2 style={{ fontSize: isLargeScreen ? '2.5rem' : '2rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
                Common Questions
              </h2>
              <p style={{ fontSize: '1.125rem', color: '#94a3b8' }}>
                Everything you need to know to get started.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  style={{
                    ...glassCardStyle,
                    padding: '1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <span style={{
                      fontSize: '1.5rem',
                      width: '48px',
                      height: '48px',
                      borderRadius: '0.75rem',
                      background: 'rgba(30, 41, 59, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>{faq.icon}</span>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>{faq.question}</h3>
                      <p style={{ color: '#94a3b8', lineHeight: 1.7 }}>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          padding: isLargeScreen ? '6rem 0' : '4rem 0',
          background: 'linear-gradient(180deg, transparent 0%, rgba(59, 130, 246, 0.05) 50%, transparent 100%)',
          position: 'relative',
        }}>
          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }} />

          <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 1rem', textAlign: 'center', position: 'relative' }}>
            <h2 style={{
              fontSize: isLargeScreen ? '3rem' : '2rem',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '1.5rem',
              lineHeight: 1.2,
            }}>
              Ready to Take Control?
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#94a3b8', marginBottom: '2.5rem', maxWidth: '480px', margin: '0 auto 2.5rem' }}>
              Join thousands of Kenyans building better financial habits with Utajiri.
            </p>
            <Link
              to="/signup"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.25rem 3rem',
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#ffffff',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                borderRadius: '1rem',
                boxShadow: '0 20px 50px -10px rgba(59, 130, 246, 0.5), 0 0 0 1px rgba(255,255,255,0.1) inset',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              Create Free Account →
            </Link>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '1.5rem' }}>No credit card required</p>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
