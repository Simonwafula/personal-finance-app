import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <Logo width={32} height={32} title="Utajiri" />
              <span className="font-bold text-white text-lg">Utajiri</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-4 max-w-sm">
              The modern personal finance app for Kenya. Track M-Pesa, budget smarter, and build lasting wealth.
            </p>
            <p className="text-slate-600 text-sm">
              Utajiri is a product by{' '}
              <a
                href="https://mstatilitechnologies.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Mstatili Technologies
              </a>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/signup" className="text-slate-500 hover:text-white text-sm transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-500 hover:text-white text-sm transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-slate-500 hover:text-white text-sm transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="/privacy" className="text-slate-500 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-slate-500 hover:text-white text-sm transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@mstatilitechnologies.com"
                  className="text-slate-500 hover:text-white text-sm transition-colors"
                >
                  support@mstatilitechnologies.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">
            &copy; {currentYear} Mstatili Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {/* Social links placeholder */}
            <a
              href="https://twitter.com/utajiriapp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://github.com/Simonwafula"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
