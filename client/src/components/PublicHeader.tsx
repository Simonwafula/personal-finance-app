import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function PublicHeader() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left: Logo + App Name */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Logo width={32} height={32} />
          <span className="font-semibold text-lg text-gray-900">Mstatili Finance</span>
        </Link>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/#features" 
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Features
          </Link>
          <Link 
            to="/#pricing" 
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Pricing
          </Link>
          <Link 
            to="/blog" 
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Blog
          </Link>
        </nav>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold text-blue-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-all"
          >
            Sign In
          </Link>
          <button
            onClick={() => {
              try {
                const callback = `${window.location.origin}/oauth-callback`;
                const url = `/accounts/google/login/?process=login&next=${encodeURIComponent(callback)}`;
                const popup = window.open(url, 'oauth_google', 'width=600,height=700');
                if (popup) popup.focus();
              } catch (err) {
                console.error('OAuth popup failed', err);
                window.location.href = '/accounts/google/login/';
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all shadow-sm"
          >
            <svg width="16" height="16" viewBox="0 0 46 46" aria-hidden="true">
              <path fill="#EA4335" d="M23 9c3 0 5.3 1 7 2.7l5-5C32.8 4.2 28.6 2 23 2 14.8 2 7.9 6.6 4 13l6.2 4.8C12 13.4 17 9 23 9z" />
              <path fill="#4285F4" d="M46 23c0-1.6-.1-3.1-.3-4.6H23v8.7h12.9c-.6 3.1-2.7 5.7-5.8 7.4l6 4.7C42.1 36.6 46 30.3 46 23z" />
              <path fill="#FBBC05" d="M10.2 28.2A13.7 13.7 0 0 1 9 23c0-1.6.3-3.1.9-4.4L4 13c-2.9 4.6-4 10-3 15.6L10.2 28.2z" />
              <path fill="#34A853" d="M23 46c6.2 0 11.5-2 15.3-5.4l-6-4.7C29.9 36.3 26.7 37.8 23 37.8c-6 0-11.1-4.4-12.8-10.2L4 33C7.9 39.4 14.8 44 23 44z" />
            </svg>
            <span className="hidden sm:inline">Try Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
}
