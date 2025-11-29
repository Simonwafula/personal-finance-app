import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { register } from "../api/auth";
import Logo from "../components/Logo";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Brand */}
        <div className="text-center mb-8 animate-slide-in">
          <div className="inline-block mb-4">
            <Logo width={64} height={64} />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Get Started
          </h1>
          <p className="text-[var(--text-muted)]">Create your Mstatili Finance account</p>
        </div>

        {/* Signup Card */}
        <div className="card-elevated backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Required Fields */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text-main)] mb-2">
                Email Address *
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary-600)] transition-all"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-main)] mb-2">
                Username (optional)
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary-600)] transition-all"
                type="text"
                placeholder="Leave empty to use email"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-main)] mb-2">
                Password *
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary-600)] transition-all"
                type="password"
                placeholder="Create a strong password"
                required
              />
            </div>

            {/* Optional Profile Fields */}
            <div className="pt-4 border-t border-[var(--border-subtle)]">
              <p className="text-xs font-semibold text-[var(--text-muted)] mb-3 uppercase tracking-wide">
                Profile Information (Optional)
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
                    Phone
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary-600)] transition-all"
                    type="tel"
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
                      Country
                    </label>
                    <input
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary-600)] transition-all"
                      placeholder="Kenya"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
                      City
                    </label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary-600)] transition-all"
                      placeholder="Nairobi"
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-slide-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full text-base py-3"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  Creating account…
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border-subtle)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[var(--surface)] text-[var(--text-muted)] font-medium">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <a
            href="/accounts/google/login/"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[var(--border-subtle)] rounded-xl hover:bg-[var(--surface-hover)] hover:border-[var(--primary-400)] transition-all font-semibold"
          >
            <svg width="20" height="20" viewBox="0 0 46 46">
              <path fill="#EA4335" d="M23 9c3 0 5.3 1 7 2.7l5-5C32.8 4.2 28.6 2 23 2 14.8 2 7.9 6.6 4 13l6.2 4.8C12 13.4 17 9 23 9z" />
              <path fill="#4285F4" d="M46 23c0-1.6-.1-3.1-.3-4.6H23v8.7h12.9c-.6 3.1-2.7 5.7-5.8 7.4l6 4.7C42.1 36.6 46 30.3 46 23z" />
              <path fill="#FBBC05" d="M10.2 28.2A13.7 13.7 0 0 1 9 23c0-1.6.3-3.1.9-4.4L4 13c-2.9 4.6-4 10-3 15.6L10.2 28.2z" />
              <path fill="#34A853" d="M23 46c6.2 0 11.5-2 15.3-5.4l-6-4.7C29.9 36.3 26.7 37.8 23 37.8c-6 0-11.1-4.4-12.8-10.2L4 33C7.9 39.4 14.8 44 23 44z" />
            </svg>
            Sign up with Google
          </a>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--text-muted)]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[var(--primary-400)] hover:text-[var(--primary-500)] transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-[var(--text-muted)] animate-fade-in">
          <p>© 2025 Mstatili Finance. Secure & Private.</p>
        </div>
      </div>
    </div>
  );

}
