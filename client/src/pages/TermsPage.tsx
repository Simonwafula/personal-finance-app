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

export default function TermsPage() {
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
      title: 'Acceptance of Terms',
      icon: '✅',
      content: [
        {
          text: 'By accessing or using Sonko, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our service.',
        },
        {
          text: 'We may update these terms from time to time. We will notify you of significant changes via email or through the app. Continued use of Sonko after changes constitutes acceptance of the new terms.',
        },
      ],
    },
    {
      title: 'Account Registration',
      icon: '👤',
      content: [
        {
          subtitle: 'Eligibility',
          text: 'You must be at least 18 years old to use Sonko. By creating an account, you represent that you meet this requirement.',
        },
        {
          subtitle: 'Account Security',
          text: 'You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately if you suspect unauthorized access to your account.',
        },
        {
          subtitle: 'Accurate Information',
          text: 'You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.',
        },
      ],
    },
    {
      title: 'Acceptable Use',
      icon: '📋',
      content: [
        {
          subtitle: 'Permitted Use',
          text: 'Sonko is designed for personal financial management. You may use the service to track your own transactions, budgets, and financial goals.',
        },
        {
          subtitle: 'Prohibited Activities',
          text: 'You may not: (a) use the service for illegal purposes, (b) attempt to gain unauthorized access to our systems, (c) interfere with other users, (d) reverse engineer the app, or (e) use automated tools to access the service.',
        },
        {
          subtitle: 'Data Accuracy',
          text: 'You are responsible for the accuracy of the financial data you enter. Sonko is a tracking tool and does not verify the accuracy of your entries.',
        },
      ],
    },
    {
      title: 'Service Description',
      icon: '🛠️',
      content: [
        {
          subtitle: 'Features',
          text: 'Sonko provides personal finance management tools including transaction tracking, budgeting, savings goals, debt planning, and financial reports.',
        },
        {
          subtitle: 'SMS Parsing (Mobile)',
          text: 'Our mobile app can parse M-Pesa and bank SMS messages to automatically detect transactions. This processing happens locally on your device.',
        },
        {
          subtitle: 'Not Financial Advice',
          text: 'Sonko is a tracking and organizational tool. We do not provide financial, investment, tax, or legal advice. Consult qualified professionals for such advice.',
        },
      ],
    },
    {
      title: 'Subscription & Payments',
      icon: '💳',
      content: [
        {
          subtitle: 'Free Tier',
          text: 'Sonko offers a free tier with core features. Some advanced features may require a paid subscription.',
        },
        {
          subtitle: 'Billing',
          text: 'Paid subscriptions are billed in advance on a monthly or annual basis. Prices are in Kenyan Shillings (KES) unless otherwise stated.',
        },
        {
          subtitle: 'Cancellation',
          text: 'You may cancel your subscription at any time. You will continue to have access to paid features until the end of your billing period.',
        },
        {
          subtitle: 'Refunds',
          text: 'Refunds are handled on a case-by-case basis. Contact support if you believe you are entitled to a refund.',
        },
      ],
    },
    {
      title: 'Intellectual Property',
      icon: '©️',
      content: [
        {
          subtitle: 'Our Property',
          text: 'Sonko, including its design, features, and content, is owned by Mstatili Technologies. Our trademarks and brand features may not be used without permission.',
        },
        {
          subtitle: 'Your Data',
          text: 'You retain ownership of the financial data you enter into Sonko. We do not claim any ownership rights over your personal information.',
        },
        {
          subtitle: 'Feedback',
          text: 'If you provide feedback or suggestions about Sonko, you grant us the right to use that feedback without compensation to you.',
        },
      ],
    },
    {
      title: 'Disclaimers & Limitations',
      icon: '⚠️',
      content: [
        {
          subtitle: 'Service Availability',
          text: 'We strive for high availability but do not guarantee uninterrupted access. We may perform maintenance or experience outages from time to time.',
        },
        {
          subtitle: 'No Warranty',
          text: 'Sonko is provided "as is" without warranties of any kind. We do not warrant that the service will be error-free or meet your specific requirements.',
        },
        {
          subtitle: 'Limitation of Liability',
          text: 'To the maximum extent permitted by law, Mstatili Technologies shall not be liable for any indirect, incidental, or consequential damages arising from your use of Sonko.',
        },
      ],
    },
    {
      title: 'Termination',
      icon: '🚪',
      content: [
        {
          subtitle: 'By You',
          text: 'You may delete your account at any time through your profile settings. This will permanently remove your data from our systems.',
        },
        {
          subtitle: 'By Us',
          text: 'We may suspend or terminate your account if you violate these terms or engage in activities that harm other users or our service.',
        },
        {
          subtitle: 'Effect of Termination',
          text: 'Upon termination, your right to use Sonko ceases immediately. We may delete your data in accordance with our data retention policies.',
        },
      ],
    },
    {
      title: 'Governing Law',
      icon: '⚖️',
      content: [
        {
          text: 'These Terms of Service are governed by the laws of Kenya. Any disputes arising from these terms or your use of Sonko shall be subject to the exclusive jurisdiction of the courts of Kenya.',
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
            background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139, 92, 246, 0.1), transparent)',
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
              background: 'rgba(139, 92, 246, 0.1)',
              marginBottom: '1.5rem',
            }}>
              <span style={{ fontSize: '1.25rem' }}>📜</span>
              <span style={{ color: '#a78bfa', fontSize: '0.875rem', fontWeight: 500 }}>Terms of Service</span>
            </div>

            <h1 style={{
              fontSize: isLargeScreen ? '3rem' : '2.25rem',
              fontWeight: 800,
              color: '#fff',
              marginBottom: '1.5rem',
              lineHeight: 1.1,
            }}>
              Terms of Service
            </h1>

            <p style={{
              fontSize: '1.125rem',
              color: '#94a3b8',
              lineHeight: 1.7,
              marginBottom: '1rem',
            }}>
              Please read these terms carefully before using Sonko. By using our service, you agree to these terms.
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
                      background: 'rgba(139, 92, 246, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>{section.icon}</span>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff' }}>{section.title}</h2>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {section.content.map((item, i) => (
                      <div key={i}>
                        {'subtitle' in item && item.subtitle && (
                          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.5rem' }}>
                            {item.subtitle}
                          </h3>
                        )}
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
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', marginBottom: '0.75rem' }}>
                Questions About These Terms?
              </h2>
              <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
                If you have any questions about these terms of service, please contact us.
              </p>
              <a
                href="mailto:legal@mstatilitechnologies.com"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
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
                Contact Legal Team
              </a>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
