import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function PublicHeader() {
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(`[data-section="${sectionId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/60 dark:border-slate-800/60 backdrop-blur-xl shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        {/* Left: Logo + App Name */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity group">
          <Logo width={36} height={36} className="group-hover:scale-105 transition-transform" />
          <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">Mstatili Finance</span>
        </Link>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('demo')}
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Demo
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            FAQ
          </button>
        </nav>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors hidden sm:inline"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-sm hover:shadow-md"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
