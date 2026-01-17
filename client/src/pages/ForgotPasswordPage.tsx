import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword } from '../api/auth';
import Logo from '../components/Logo';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      await forgotPassword(email);
      setStatus('success');
      setEmail('');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.response?.data?.detail || 'Failed to send reset email');
    }
  };

  return (
    <div className="neu-page">
      <div className="neu-container">
        <div className="neu-card">
          <div className="neu-header">
            <div className="neu-icon">
              <Logo variant="icon" width={40} height={40} />
            </div>
            <h2>Reset Password</h2>
            <p>Enter your email and we&apos;ll send a reset link.</p>
          </div>

          {status === 'success' ? (
            <div className="neu-success" role="status">
              <svg className="neu-message-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>Check your email for a reset link. Redirecting to login...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="neu-form">
              <div className="neu-form-group">
                <div className="neu-input-wrapper">
                  <div className="neu-input">
                    <span className="neu-input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </span>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      required
                      disabled={status === 'loading'}
                    />
                    <label htmlFor="email">Email Address</label>
                  </div>
                </div>
              </div>

              {status === 'error' && (
                <div className="neu-error" role="alert">
                  <svg className="neu-message-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>{errorMsg}</span>
                </div>
              )}

              <button type="submit" disabled={status === 'loading'} className="neu-button">
                {status === 'loading' ? (
                  <>
                    <span className="neu-spinner" />
                    <span>Sending...</span>
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          )}

          <div className="neu-footer">
            <p>
              <Link to="/login" className="neu-link-bold">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
