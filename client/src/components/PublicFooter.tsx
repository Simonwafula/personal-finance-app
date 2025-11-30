import { Link } from 'react-router-dom';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/privacy" className="hover:text-gray-900 transition-colors">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-gray-900 transition-colors">
            Terms
          </Link>
          <Link to="/contact" className="hover:text-gray-900 transition-colors">
            Contact
          </Link>
        </div>
        <div>
          Made by Mstatili Technologies © {currentYear}
        </div>
      </div>
    </footer>
  );
}
