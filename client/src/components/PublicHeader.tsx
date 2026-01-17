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
    <header className="bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <Logo variant="icon" width={36} height={36} title="Sonko" />
          <span className="font-bold text-white text-lg tracking-tight hidden sm:inline">Sonko</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => scrollToSection('features')}
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors py-2"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('screens')}
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors py-2"
          >
            Screens
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors py-2"
          >
            FAQ
          </button>
          <Link
            to="/blog"
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors py-2"
          >
            Blog
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors py-2 px-3 hidden sm:inline-block"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all shadow-sm hover:shadow-md hover:shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
