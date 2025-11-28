import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    try {
      setLoading(true);
      await register({ email, password, username });
      // Emit event so Layout refreshes user
      window.dispatchEvent(new Event('authChanged'));
      navigate("/");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container p-4">
      <div className="max-w-md mx-auto card">
        <h2 className="text-lg font-semibold mb-2">Create an account</h2>
        <p className="text-sm text-gray-500 mb-4">Sign up with email & password or use Google sign-in below.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-2 py-1" type="email" required />
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">Username (optional)</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-2 py-1" type="password" required />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>

          {error && <div className="text-xs text-red-600">{error}</div>}
        </form>

        <div className="mt-3 text-center">
          <div className="text-sm muted mb-2">Or sign up with</div>
          <a className="btn-secondary inline-flex items-center gap-2" href="/accounts/google/login/">Sign in with Google</a>
        </div>
      </div>
    </div>
  );
}
