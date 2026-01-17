import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(`[data-section="${sectionId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Features', action: () => scrollToSection('features') },
    { label: 'Screens', action: () => scrollToSection('screens') },
    { label: 'Security', action: () => scrollToSection('security') },
    { label: 'FAQs', action: () => scrollToSection('faq') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 dark:bg-slate-950 dark:border-slate-800/70">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <Logo variant="icon" width={32} height={32} title="Sonko" />
            <span className="font-semibold text-gray-900 dark:text-white text-lg">Sonko</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors dark:text-slate-300 dark:hover:text-white"
              >
                {link.label}
              </button>
            ))}
            <Link
              to="/blog"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors dark:text-slate-300 dark:hover:text-white"
            >
              Blog
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors dark:text-slate-300 dark:hover:text-white"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 rounded-lg transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 -mr-2 text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 dark:border-slate-800">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="text-left px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors dark:text-slate-200 dark:hover:bg-slate-800/60"
                >
                  {link.label}
                </button>
              ))}
              <Link
                to="/blog"
                className="px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors dark:text-slate-200 dark:hover:bg-slate-800/60"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
            </nav>
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-slate-800">
              <Link
                to="/login"
                className="px-3 py-2.5 text-center text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors dark:text-slate-200 dark:hover:bg-slate-800/60"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-3 py-2.5 text-center text-base font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
