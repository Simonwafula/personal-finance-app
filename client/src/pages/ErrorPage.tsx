import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { HiExclamationCircle, HiRefresh, HiHome } from 'react-icons/hi';

interface ErrorPageProps {
  error?: Error | null;
  statusCode?: number;
  title?: string;
  message?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

export default function ErrorPage({ 
  error, 
  statusCode, 
  title, 
  message,
  showRetry = true,
  onRetry 
}: ErrorPageProps) {
  const routeError = useRouteError?.();
  
  // Determine error details
  let errorStatus = statusCode;
  let errorTitle = title;
  let errorMessage = message;
  
  if (isRouteErrorResponse(routeError)) {
    errorStatus = routeError.status;
    errorTitle = routeError.statusText;
    errorMessage = routeError.data?.message || routeError.data;
  } else if (routeError instanceof Error) {
    errorMessage = routeError.message;
  } else if (error) {
    errorMessage = error.message;
  }

  // Default values based on status code
  if (!errorTitle) {
    switch (errorStatus) {
      case 400:
        errorTitle = 'Bad Request';
        break;
      case 401:
        errorTitle = 'Unauthorized';
        errorMessage = errorMessage || 'You need to be logged in to access this page.';
        break;
      case 403:
        errorTitle = 'Forbidden';
        errorMessage = errorMessage || 'You don\'t have permission to access this resource.';
        break;
      case 404:
        errorTitle = 'Not Found';
        errorMessage = errorMessage || 'The page you\'re looking for doesn\'t exist.';
        break;
      case 500:
        errorTitle = 'Server Error';
        errorMessage = errorMessage || 'Something went wrong on our end. Please try again later.';
        break;
      case 502:
        errorTitle = 'Bad Gateway';
        errorMessage = errorMessage || 'The server is temporarily unavailable.';
        break;
      case 503:
        errorTitle = 'Service Unavailable';
        errorMessage = errorMessage || 'The service is temporarily unavailable. Please try again later.';
        break;
      default:
        errorTitle = 'Something Went Wrong';
        errorMessage = errorMessage || 'An unexpected error occurred. Please try again.';
    }
  }

  const getGradientColors = () => {
    if (errorStatus === 404) return 'from-amber-500 to-orange-500';
    if (errorStatus === 401 || errorStatus === 403) return 'from-yellow-500 to-amber-500';
    if (errorStatus && errorStatus >= 500) return 'from-red-500 to-rose-500';
    return 'from-red-500 to-pink-500';
  };

  const getIconBgColor = () => {
    if (errorStatus === 404) return 'bg-amber-100 dark:bg-amber-900/30';
    if (errorStatus === 401 || errorStatus === 403) return 'bg-yellow-100 dark:bg-yellow-900/30';
    if (errorStatus && errorStatus >= 500) return 'bg-red-100 dark:bg-red-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  const getIconColor = () => {
    if (errorStatus === 404) return 'text-amber-600';
    if (errorStatus === 401 || errorStatus === 403) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
      <div className={`w-20 h-20 rounded-full ${getIconBgColor()} flex items-center justify-center mb-6`}>
        <HiExclamationCircle className={getIconColor()} size={40} />
      </div>
      
      {errorStatus && (
        <div className={`text-6xl md:text-7xl font-extrabold bg-gradient-to-r ${getGradientColors()} text-transparent bg-clip-text mb-2`}>
          {errorStatus}
        </div>
      )}
      
      <h1 className="text-2xl md:text-3xl font-bold mb-3 text-[var(--text-main)]">
        {errorTitle}
      </h1>
      
      <p className="text-[var(--text-muted)] max-w-md mb-8">
        {errorMessage}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        {showRetry && (
          <button 
            onClick={handleRetry}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-main)] font-medium transition-colors"
          >
            <HiRefresh size={18} />
            Try Again
          </button>
        )}
        
        <Link 
          to="/dashboard" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
        >
          <HiHome size={18} />
          Go to Dashboard
        </Link>
      </div>

      {/* Show technical details in dev mode */}
      {import.meta.env.DEV && error && (
        <div className="mt-8 w-full max-w-2xl">
          <details className="text-left">
            <summary className="cursor-pointer text-sm text-[var(--text-muted)] hover:text-[var(--text-main)]">
              Technical Details
            </summary>
            <pre className="mt-2 rounded-xl p-4 overflow-auto bg-[var(--surface)] border border-[var(--border-subtle)] text-xs max-h-48 text-left">
              {error.stack || error.message}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}

// Standalone component for common error states
export function ServerErrorPage() {
  return <ErrorPage statusCode={500} />;
}

export function UnauthorizedPage() {
  return <ErrorPage statusCode={401} />;
}

export function ForbiddenPage() {
  return <ErrorPage statusCode={403} />;
}

export function ServiceUnavailablePage() {
  return <ErrorPage statusCode={503} />;
}
