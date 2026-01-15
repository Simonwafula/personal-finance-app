import { Link } from 'react-router-dom';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white">Mstatili Finance</span>
            <span className="text-slate-700">|</span>
            <span className="text-sm text-slate-500">Personal Finance Made Simple</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link
              to="/login"
              className="text-slate-500 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-slate-500 hover:text-white transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/blog"
              className="text-slate-500 hover:text-white transition-colors"
            >
              Blog
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-slate-800/50 text-center text-sm text-slate-600">
          <a
            href="https://mstatilitechnologies.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-400 transition-colors"
          >
            Mstatili Technologies
          </a>
          {' '}&copy; {currentYear}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
