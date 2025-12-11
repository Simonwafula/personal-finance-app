import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function PublicHeader() {
  return (
    <header className="bg-white/90 dark:bg-slate-950/90 border-b border-slate-200/60 dark:border-slate-800/60 backdrop-blur-xl shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {/* Left: Logo + App Name */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity group">
          <Logo width={36} height={36} className="group-hover:scale-110 transition-transform" />
          <span className="font-bold text-xl text-slate-900 dark:text-slate-50 tracking-tight">Mstatili Finance</span>
        </Link>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/#features" 
            className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Features
          </Link>
          <Link 
            to="/#pricing" 
            className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Pricing
          </Link>
          <Link 
            to="/blog" 
            className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Blog
          </Link>
        </nav>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
