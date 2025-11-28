import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../api/auth';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [uid, setUid] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const uidParam = searchParams.get('uid');
    const tokenParam = searchParams.get('token');

    if (!uidParam || !tokenParam) {
      setErrorMsg('Invalid reset link. Please request a new one.');
      setStatus('error');
      return;
    }

    setUid(uidParam);
    setToken(tokenParam);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!password || !confirmPassword) {
      setErrorMsg('Please fill in all fields');
      setStatus('error');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      setStatus('error');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters');
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      await resetPassword(uid, token, password);
      setStatus('success');
      // Redirect after 2 seconds
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.response?.data?.detail || 'Failed to reset password');
    }
  };

  if (status === 'error' && !uid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8 space-y-6">
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200 text-sm">
                {errorMsg}
              </p>
            </div>
            <button
              onClick={() => navigate('/forgot-password')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Request New Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Set New Password
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Enter your new password below.
            </p>
          </div>

          {status === 'success' ? (
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-green-800 dark:text-green-200 text-sm font-medium">
                ✓ Password reset successful. Redirecting to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={status === 'loading'}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={status === 'loading'}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>

              {status === 'error' && (
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    {errorMsg}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                {status === 'loading' ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Back to login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
