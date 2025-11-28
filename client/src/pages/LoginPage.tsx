import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      // Send identifier as either email or username depending on format
      const payload = identifier.includes('@')
        ? { email: identifier, password }
        : { username: identifier, password };
      await login(payload);
      // Emit event so Layout refreshes user
      window.dispatchEvent(new Event('authChanged'));
      navigate("/");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container p-4">
      <div className="max-w-md mx-auto card">
        <h2 className="text-lg font-semibold mb-2">Sign in</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Email or Username</label>
            <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full border rounded px-2 py-1" type="text" placeholder="user@example.com or username" required />
          </div>

          <div>
            <label className="text-xs text-gray-600 block mb-1">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-2 py-1" type="password" required />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
          {error && <div className="text-xs text-red-600">{error}</div>}

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-xs text-blue-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>
        </form>

        <div className="mt-3 text-center">
          <div className="text-sm muted mb-2">Or sign in with</div>
          <a className="btn-secondary inline-flex items-center gap-2" href="/accounts/google/login/">Sign in with Google</a>
        </div>
      </div>
    </div>
  );
}
