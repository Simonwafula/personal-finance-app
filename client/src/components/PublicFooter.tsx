import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);

  useEffect(() => {
    const lgQuery = window.matchMedia('(min-width: 1024px)');
    const mdQuery = window.matchMedia('(min-width: 768px)');

    const handleLgChange = (e: MediaQueryListEvent | MediaQueryList) => setIsLargeScreen(e.matches);
    const handleMdChange = (e: MediaQueryListEvent | MediaQueryList) => setIsMediumScreen(e.matches);

    handleLgChange(lgQuery);
    handleMdChange(mdQuery);

    lgQuery.addEventListener('change', handleLgChange);
    mdQuery.addEventListener('change', handleMdChange);

    return () => {
      lgQuery.removeEventListener('change', handleLgChange);
      mdQuery.removeEventListener('change', handleMdChange);
    };
  }, []);

  return (
    <footer style={{
      background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, #020617 100%)',
      borderTop: '1px solid rgba(71, 85, 105, 0.2)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle gradient accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.5) 50%, transparent 100%)',
      }} />

      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '4rem 1rem 2rem' }}>
        {/* Main footer content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isLargeScreen ? 'repeat(4, 1fr)' : isMediumScreen ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)',
          gap: '3rem',
        }}>
          {/* Brand column */}
          <div style={{ gridColumn: isLargeScreen ? 'span 2' : 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px -4px rgba(59, 130, 246, 0.5)',
              }}>
                <Logo variant="icon" width={24} height={24} title="Sonko" />
              </div>
              <span style={{ fontWeight: 700, color: '#fff', fontSize: '1.25rem' }}>Sonko</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '360px' }}>
              Track your budgets, expenses, transactions, savings, investments, loans, assets and liabilities. Build responsible financial habits and make informed decisions.
            </p>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              A product by{' '}
              <a
                href="https://mstatilitechnologies.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#60a5fa',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'color 0.2s ease',
                }}
              >
                Mstatili Technologies
              </a>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontWeight: 600,
              color: '#fff',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>Product</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { to: '/signup', label: 'Get Started' },
                { to: '/login', label: 'Sign In' },
                { to: '/blog', label: 'Blog' },
              ].map((link) => (
                <li key={link.to} style={{ marginBottom: '0.75rem' }}>
                  <Link
                    to={link.to}
                    style={{
                      color: '#94a3b8',
                      textDecoration: 'none',
                      fontSize: '0.9375rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 style={{
              fontWeight: 600,
              color: '#fff',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
              ].map((link) => (
                <li key={link.href} style={{ marginBottom: '0.75rem' }}>
                  <a
                    href={link.href}
                    style={{
                      color: '#94a3b8',
                      textDecoration: 'none',
                      fontSize: '0.9375rem',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="mailto:support@mstatilitechnologies.com"
                  style={{
                    color: '#60a5fa',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '0.5rem',
                    marginTop: '0.5rem',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                  }}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(71, 85, 105, 0.2)',
          display: 'flex',
          flexDirection: isMediumScreen ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
          <p style={{ color: '#64748b', fontSize: '0.875rem', textAlign: isMediumScreen ? 'left' : 'center' }}>
            © {currentYear} Mstatili Technologies. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Social links */}
            {[
              {
                href: 'https://twitter.com/sonkoapp',
                label: 'Twitter',
                icon: (
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                ),
              },
              {
                href: 'https://github.com/Simonwafula',
                label: 'GitHub',
                icon: (
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                ),
              },
            ].map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '0.625rem',
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(71, 85, 105, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                  e.currentTarget.style.color = '#60a5fa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)';
                  e.currentTarget.style.borderColor = 'rgba(71, 85, 105, 0.3)';
                  e.currentTarget.style.color = '#94a3b8';
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
