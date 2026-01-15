import { Link } from 'react-router-dom';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-slate-400">
            <span className="font-bold text-white text-lg">Mstatili Finance</span>
            <span className="text-slate-700">|</span>
            <span className="text-sm">Personal Finance Made Simple</span>
          </div>

          <div className="flex items-center gap-8 text-sm">
            <Link
              to="/login"
              className="text-slate-400 hover:text-blue-400 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-slate-400 hover:text-blue-400 transition-colors"
            >
              Create Account
            </Link>
            <Link
              to="/blog"
              className="text-slate-400 hover:text-blue-400 transition-colors"
            >
              Blog
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <a href="https://mstatilitechnologies.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
            Mstatili Technologies
          </a> &copy; {currentYear}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
