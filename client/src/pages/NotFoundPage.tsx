import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
      <div className="text-7xl font-extrabold bg-gradient-to-r from-[var(--danger-400)] to-[var(--accent-500)] text-transparent bg-clip-text">404</div>
      <h1 className="text-2xl md:text-3xl font-bold">Page Not Found</h1>
      <p className="text-[var(--text-muted)] max-w-md">The page you are looking for doesn't exist or was moved. Use the navigation or return home.</p>
      <div className="flex gap-4">
        <Link to="/" className="btn-secondary">Landing</Link>
        <Link to="/dashboard" className="btn-primary">Dashboard</Link>
      </div>
    </div>
  );
}