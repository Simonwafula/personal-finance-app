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
    <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <Logo width={32} height={32} />
          <span className="font-semibold text-white text-lg hidden sm:inline">Mstatili Finance</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('demo')}
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Demo
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            FAQ
          </button>
          <Link
            to="/blog"
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Blog
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden sm:inline"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
