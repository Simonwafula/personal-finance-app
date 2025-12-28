import React from 'react';
import { HiExclamationCircle, HiRefresh, HiHome } from 'react-icons/hi';

interface State { hasError: boolean; error?: Error; info?: React.ErrorInfo }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ info });
    // Log to console (could integrate remote logging later)
    console.error('ErrorBoundary caught error:', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, info: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
            <HiExclamationCircle className="text-red-600" size={40} />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-3 text-[var(--text-main)]">
            Something Went Wrong
          </h1>
          
          <p className="text-[var(--text-muted)] max-w-md mb-6">
            An unexpected error occurred while rendering this page. Please try again or return home.
          </p>

          {/* Error details (collapsible) */}
          {this.state.error && (
            <details className="mb-6 w-full max-w-xl text-left">
              <summary className="cursor-pointer text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] mb-2">
                View Error Details
              </summary>
              <pre className="rounded-xl p-4 overflow-auto bg-[var(--surface)] border border-[var(--border-subtle)] text-xs max-h-48">
                <span className="text-red-500 font-medium">{this.state.error.message}</span>
                {this.state.info?.componentStack && (
                  <span className="text-[var(--text-muted)]">{this.state.info.componentStack}</span>
                )}
              </pre>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={this.handleRetry}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-main)] font-medium transition-colors"
            >
              <HiRefresh size={18} />
              Try Again
            </button>
            
            <a 
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
            >
              <HiHome size={18} />
              Go to Dashboard
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
