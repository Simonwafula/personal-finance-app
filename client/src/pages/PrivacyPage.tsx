import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';

const glassCardStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: '1.5rem',
  border: '1px solid rgba(148, 163, 184, 0.1)',
  padding: '2rem',
};

export default function PrivacyPage() {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    window.scrollTo(0, 0);

    const lgQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => setIsLargeScreen(e.matches);
    handleChange(lgQuery);
    lgQuery.addEventListener('change', handleChange);
    return () => lgQuery.removeEventListener('change', handleChange);
  }, []);

  const sections = [
    {
      title: 'Information We Collect',
      icon: '📊',
      content: [
        {
          subtitle: 'Account Information',
          text: 'When you create an account, we collect your email address and name. If you use social login (Google), we receive basic profile information from that service.',
        },
        {
          subtitle: 'Financial Data',
          text: 'We collect transaction data, account balances, budget information, and other financial details you enter into the app. If you use SMS import, we process M-Pesa and bank SMS messages locally on your device.',
        },
        {
          subtitle: 'Usage Data',
          text: 'We collect anonymous usage statistics to improve our service, including features used, session duration, and app performance metrics.',
        },
      ],
    },
    {
      title: 'How We Use Your Information',
      icon: '🔧',
      content: [
        {
          subtitle: 'Provide Our Services',
          text: 'Your financial data is used to display your accounts, track transactions, generate reports, and provide budgeting insights.',
        },
        {
          subtitle: 'Improve the App',
          text: 'Anonymous usage data helps us understand how people use Sonko so we can make improvements and fix issues.',
        },
        {
          subtitle: 'Communications',
          text: 'We may send you important service updates, security alerts, and (with your consent) occasional product updates.',
        },
      ],
    },
    {
      title: 'Data Security',
      icon: '🔒',
      content: [
        {
          subtitle: 'Encryption',
          text: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. We use industry-standard security practices.',
        },
        {
          subtitle: 'No Bank Credentials',
          text: 'We never store your bank login credentials. SMS parsing happens locally on your device, and we only store the extracted transaction data.',
        },
        {
          subtitle: 'Access Controls',
          text: 'Your account is protected by password authentication, with optional PIN and biometric protection on mobile devices.',
        },
      ],
    },
    {
      title: 'Data Sharing',
      icon: '🤝',
      content: [
        {
          subtitle: 'We Do Not Sell Your Data',
          text: 'Your personal and financial information is never sold to third parties. Period.',
        },
        {
          subtitle: 'Service Providers',
          text: 'We work with select service providers (hosting, analytics) who are contractually obligated to protect your data.',
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose information if required by law or to protect the rights, property, or safety of Sonko, our users, or others.',
        },
      ],
    },
    {
      title: 'Your Rights',
      icon: '✨',
      content: [
        {
          subtitle: 'Access & Export',
          text: 'You can access all your data through the app and export it at any time in standard formats.',
        },
        {
          subtitle: 'Deletion',
          text: 'You can delete your account and all associated data at any time from your profile settings.',
        },
        {
          subtitle: 'Correction',
          text: 'You can update or correct your personal information at any time through the app.',
        },
      ],
    },
    {
      title: 'Cookies & Tracking',
      icon: '🍪',
      content: [
        {
          subtitle: 'Essential Cookies',
          text: 'We use essential cookies to keep you logged in and remember your preferences.',
        },
        {
          subtitle: 'Analytics',
          text: 'We use privacy-focused analytics to understand app usage. No personal data is shared with third-party advertisers.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section style={{
          padding: isLargeScreen ? '6rem 0 4rem' : '4rem 0 3rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background gradient */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.1), transparent)',
            pointerEvents: 'none',
          }} />

          <div style={{ maxWidth: '52rem', margin: '0 auto', padding: '0 1rem', position: 'relative' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#94a3b8',
                textDecoration: 'none',
                fontSize: '0.875rem',
                marginBottom: '2rem',
              }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              background: 'rgba(59, 130, 246, 0.1)',
              marginBottom: '1.5rem',
            }}>
              <span style={{ fontSize: '1.25rem' }}>🔒</span>
              <span style={{ color: '#60a5fa', fontSize: '0.875rem', fontWeight: 500 }}>Privacy Policy</span>
            </div>

            <h1 style={{
              fontSize: isLargeScreen ? '3rem' : '2.25rem',
              fontWeight: 800,
              color: '#fff',
              marginBottom: '1.5rem',
              lineHeight: 1.1,
            }}>
              Your Privacy Matters
            </h1>

            <p style={{
              fontSize: '1.125rem',
              color: '#94a3b8',
              lineHeight: 1.7,
              marginBottom: '1rem',
            }}>
              At Sonko, we believe your financial data is deeply personal. This policy explains how we collect, use, and protect your information.
            </p>

            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Last updated: January 2026
            </p>
          </div>
        </section>

        {/* Content Sections */}
        <section style={{ padding: '0 0 6rem' }}>
          <div style={{ maxWidth: '52rem', margin: '0 auto', padding: '0 1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {sections.map((section, index) => (
                <div key={index} style={glassCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <span style={{
                      fontSize: '1.5rem',
                      width: '48px',
                      height: '48px',
                      borderRadius: '0.75rem',
                      background: 'rgba(59, 130, 246, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>{section.icon}</span>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff' }}>{section.title}</h2>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {section.content.map((item, i) => (
                      <div key={i}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.5rem' }}>
                          {item.subtitle}
                        </h3>
                        <p style={{ color: '#94a3b8', lineHeight: 1.7 }}>{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Section */}
            <div style={{
              ...glassCardStyle,
              marginTop: '2rem',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', marginBottom: '0.75rem' }}>
                Questions About Privacy?
              </h2>
              <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
                If you have any questions about this privacy policy or how we handle your data, please reach out.
              </p>
              <a
                href="mailto:privacy@mstatilitechnologies.com"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                }}
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Privacy Team
              </a>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
