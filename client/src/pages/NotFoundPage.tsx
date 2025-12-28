import { Link } from 'react-router-dom';
import { HiSearch, HiHome } from 'react-icons/hi';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
        <HiSearch className="text-amber-600" size={40} />
      </div>
      
      <div className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 text-transparent bg-clip-text mb-2">
        404
      </div>
      
      <h1 className="text-2xl md:text-3xl font-bold mb-3 text-[var(--text-main)]">
        Page Not Found
      </h1>
      
      <p className="text-[var(--text-muted)] max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved. Use the navigation or return to your dashboard.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link 
          to="/" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-main)] font-medium transition-colors"
        >
          Landing Page
        </Link>
        
        <Link 
          to="/dashboard" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
        >
          <HiHome size={18} />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}