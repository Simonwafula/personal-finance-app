import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { register } from "../api/auth";
import Logo from "../components/Logo";
import "../styles/neumorphism.css";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    try {
      setLoading(true);
      const user = await register({ 
        email, 
        password, 
        username,
        phone,
        country,
        city,
      });
      // Optimistic user injection
      window.dispatchEvent(new CustomEvent('authChanged', { detail: user }));
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="neu-page">
      <div className="neu-container" style={{ maxWidth: '480px' }}>
        <div className="neu-card">
          {/* Logo Header */}
          <div className="neu-header">
            <div className="neu-icon">
              <Logo width={40} height={40} />
            </div>
            <h2>Get Started</h2>
            <p>Create your free account in seconds</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="neu-form">
            {/* Email Input */}
            <div className="neu-form-group">
              <div className="neu-input-wrapper">
                <div className="neu-input">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=" "
                    required
                  />
                  <label htmlFor="email">Email Address *</label>
                  <div className="neu-input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Username Input */}
            <div className="neu-form-group">
              <div className="neu-input-wrapper">
                <div className="neu-input">
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder=" "
                  />
                  <label htmlFor="username">Username (optional)</label>
                  <div className="neu-input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="neu-form-group">
              <div className="neu-input-wrapper">
                <div className="neu-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=" "
                    required
                  />
                  <label htmlFor="password">Password *</label>
                  <div className="neu-input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </div>
                  <button
                    type="button"
                    className="neu-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Optional Fields */}
            <details className="neu-form-group" style={{ marginTop: '24px' }}>
              <summary style={{ 
                cursor: 'pointer', 
                fontWeight: '600', 
                color: '#6c7293',
                marginBottom: '16px',
                listStyle: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>👤</span>
                <span>Profile Information (Optional)</span>
              </summary>
              
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Phone */}
                <div className="neu-input-wrapper">
                  <div className="neu-input">
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder=" "
                    />
                    <label htmlFor="phone">Phone</label>
                    <div className="neu-input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Country & City */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="neu-input-wrapper">
                    <div className="neu-input">
                      <input
                        type="text"
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder=" "
                      />
                      <label htmlFor="country">Country</label>
                      <div className="neu-input-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="neu-input-wrapper">
                    <div className="neu-input">
                      <input
                        type="text"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder=" "
                      />
                      <label htmlFor="city">City</label>
                      <div className="neu-input-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </details>

            {/* Error Message */}
            {error && (
              <div className="neu-error">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" className="neu-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="neu-spinner"></span>
                  <span>Creating account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="neu-divider">
            <span>Or continue with</span>
          </div>

          {/* Social Login */}
          <div className="neu-social">
            <a href="/accounts/google/login/" className="neu-social-btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </a>
          </div>

          {/* Login link */}
          <div className="neu-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="neu-link-bold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

}
