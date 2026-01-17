import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-16 bg-slate-950">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative space-y-6">
        {/* 404 Number */}
        <div className="text-8xl md:text-9xl font-extrabold bg-gradient-to-r from-red-500 to-purple-500 text-transparent bg-clip-text">
          404
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-slate-400 max-w-md mx-auto">
          The page you are looking for doesn't exist or was moved. Use the navigation or return home.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            to="/"
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Go to Home
          </Link>
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
