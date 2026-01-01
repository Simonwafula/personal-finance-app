import React from 'react';

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

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-container py-20 text-center">
          <div className="text-6xl font-extrabold bg-gradient-to-r from-red-500 to-pink-500 text-transparent bg-clip-text mb-4">App Error</div>
          <p className="text-sm text-[var(--text-muted)] mb-6">An unexpected error occurred while rendering this page.</p>
          {this.state.error && (
            <pre className="rounded-lg p-4 text-left overflow-auto bg-[var(--surface)] border border-[var(--border-subtle)] text-xs max-h-64">
{this.state.error.message}\n{this.state.info?.componentStack}
            </pre>
          )}
          <div className="mt-6 flex justify-center gap-3">
            <a href="/" className="btn-secondary">Return Home</a>
            <button onClick={() => this.setState({ hasError: false, error: undefined, info: undefined })} className="btn-primary">Retry</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
