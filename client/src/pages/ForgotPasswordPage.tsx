import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../api/auth';

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
      // Redirect after 3 seconds
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
            <h1 className="neu-title">Reset Password</h1>
            <p className="neu-subtitle">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {status === 'success' ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: '#e0e5ec',
              borderRadius: '15px',
              boxShadow: 'inset 4px 4px 10px #b8f0d4, inset -4px -4px 10px #ffffff',
              color: '#00c896',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              <span>✓</span>
              <span>Check your email for a reset link. Redirecting to login...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="neu-form">
              <div className="neu-form-group">
                <div className="neu-input">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=" "
                    required
                    disabled={status === 'loading'}
                  />
                  <label htmlFor="email">your@email.com</label>
                  <div className="neu-input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                </div>
              </div>

              {status === 'error' && (
                <div className="neu-error">
                  <span>⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              <button type="submit" className="neu-button" disabled={status === 'loading'}>
                {status === 'loading' ? (
                  <>
                    <span className="neu-spinner"></span>
                    <span>Sending...</span>
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          )}

          <div className="neu-divider"></div>
          <div style={{ textAlign: 'center', fontSize: '14px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Remember your password? </span>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                cursor: 'pointer',
                fontWeight: '500',
                textDecoration: 'underline'
              }}
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
