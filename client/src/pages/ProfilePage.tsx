import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProfile, updateProfile, changePassword, logout, type UserProfile } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import { exportTransactionsCsv } from "../api/finance";
import SmsSettings from "../features/sms/SmsSettings";
import { PLATFORM_FEATURES } from "../utils/platform";
import { useTimeRange } from "../contexts/TimeRangeContext";

interface ProfileFormData extends UserProfile {
  username: string;
  email: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { logoutLocal } = useAuth();
  const { range } = useTimeRange();

  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "notifications" | "sms" | "backup" | "sessions"
  >("profile");

  const [profile, setProfile] = useState<ProfileFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNext, setPwNext] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      const data = await fetchProfile();
      setProfile(data as ProfileFormData);
    } catch (err: any) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;

    setError(null);
    setSuccess(null);
    try {
      setSaving(true);
      const { username, email, ...profileData } = profile;
      const updated = await updateProfile(profileData);
      setProfile({ ...updated, username, email });
      setSuccess("Profile updated successfully!");
      // Emit event so Layout can refresh user data
      window.dispatchEvent(new Event('authChanged'));
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(null);

    if (!pwCurrent || !pwNext) {
      setPwError("Please enter your current and new password.");
      return;
    }
    if (pwNext !== pwConfirm) {
      setPwError("New password and confirmation do not match.");
      return;
    }

    try {
      setPwSaving(true);
      const res = await changePassword({ currentPassword: pwCurrent, newPassword: pwNext });
      setPwSuccess(res.message || "Password changed successfully.");
      setPwCurrent("");
      setPwNext("");
      setPwConfirm("");
    } catch (err: any) {
      setPwError(err?.message || "Failed to change password");
    } finally {
      setPwSaving(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // Even if the server call fails, clear local auth state.
    } finally {
      logoutLocal();
      window.dispatchEvent(new Event('authChanged'));
      navigate('/');
    }
  }

  async function handleExportTransactions() {
    try {
      const blob = await exportTransactionsCsv({
        start: range.startDate,
        end: range.endDate,
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${range.startDate}_to_${range.endDate}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err?.message || "Failed to export transactions");
      setActiveTab("backup");
    }
  }

  function handleChange(field: keyof ProfileFormData, value: string) {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="card">
          <div className="skeleton h-24 rounded" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="card bg-red-50 border-red-200 text-red-700">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Your Profile</h2>
          <p className="text-base text-[var(--text-muted)] mt-1 font-medium">Manage your personal info and account preferences</p>
        </div>

        <button
          type="button"
          className="neu-button w-full sm:w-auto"
          onClick={handleLogout}
        >
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="card p-1 flex flex-wrap gap-1 bg-[var(--surface)]">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 px-4 py-3 font-semibold rounded-lg transition-all text-sm md:text-base ${
            activeTab === "profile"
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
              : "text-[var(--text-muted)] hover:bg-[var(--glass-bg)]"
          }`}
        >
          👤 Profile Info
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`flex-1 px-4 py-3 font-semibold rounded-lg transition-all text-sm md:text-base ${
            activeTab === "security"
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
              : "text-[var(--text-muted)] hover:bg-[var(--glass-bg)]"
          }`}
        >
          🛡️ Security
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex-1 px-4 py-3 font-semibold rounded-lg transition-all text-sm md:text-base ${
            activeTab === "notifications"
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
              : "text-[var(--text-muted)] hover:bg-[var(--glass-bg)]"
          }`}
        >
          🔔 Notifications
        </button>
        {PLATFORM_FEATURES.SMS_DETECTION && (
          <button
            onClick={() => setActiveTab("sms")}
            className={`flex-1 px-4 py-3 font-semibold rounded-lg transition-all text-sm md:text-base ${
              activeTab === "sms"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-[var(--text-muted)] hover:bg-[var(--glass-bg)]"
            }`}
          >
            📲 SMS Detection
          </button>
        )}
        <button
          onClick={() => setActiveTab("backup")}
          className={`flex-1 px-4 py-3 font-semibold rounded-lg transition-all text-sm md:text-base ${
            activeTab === "backup"
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
              : "text-[var(--text-muted)] hover:bg-[var(--glass-bg)]"
          }`}
        >
          💾 Backup
        </button>
        <button
          onClick={() => setActiveTab("sessions")}
          className={`flex-1 px-4 py-3 font-semibold rounded-lg transition-all text-sm md:text-base ${
            activeTab === "sessions"
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
              : "text-[var(--text-muted)] hover:bg-[var(--glass-bg)]"
          }`}
        >
          🕒 Sessions
        </button>
      </div>

      {error && (
        <div className="neu-error" style={{ marginBottom: '20px' }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="neu-success" style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px',
          marginBottom: '20px',
          background: '#e0e5ec',
          borderRadius: '15px',
          boxShadow: 'inset 4px 4px 10px #b8f0d4, inset -4px -4px 10px #ffffff',
          color: '#00c896',
          fontSize: '14px',
          fontWeight: '500',
          animation: 'gentleShake 0.5s ease'
        }}>
          <span>✓</span>
          <span>{success}</span>
        </div>
      )}

      {/* Profile Info */}
      {activeTab === "profile" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="card flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-[var(--surface)] shadow-md mb-3">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[var(--surface)] text-3xl">🧑</div>
                )}
              </div>
              <div className="font-semibold text-lg">{profile.username}</div>
              <div className="text-sm text-[var(--text-muted)]">{profile.email}</div>
              <div className="w-full mt-4">
                <label className="block text-sm font-medium mb-2">Avatar URL</label>
                <div className="neu-input">
                  <input
                    type="url"
                    id="avatar_url"
                    value={profile.avatar_url}
                    onChange={(e) => handleChange('avatar_url', e.target.value)}
                    placeholder=" "
                  />
                  <label htmlFor="avatar_url">https://example.com/avatar.jpg</label>
                  <div className="neu-input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card">
              <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <input
                    type="text"
                    value={profile.username || ''}
                    disabled
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 bg-gray-50 dark:bg-gray-700 text-base cursor-not-allowed opacity-70"
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-1">Username cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={profile.email || ''}
                    disabled
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 bg-gray-50 dark:bg-gray-700 text-base cursor-not-allowed opacity-70"
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-1">Email cannot be changed</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <div className="neu-input">
                    <input
                      type="tel"
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder=" "
                    />
                    <label htmlFor="phone">+1234567890</label>
                    <div className="neu-input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date of Birth</label>
                  <div className="neu-input">
                    <input
                      type="date"
                      id="date_of_birth"
                      value={profile.date_of_birth || ''}
                      onChange={(e) => handleChange('date_of_birth', e.target.value)}
                      placeholder=" "
                    />
                    <label htmlFor="date_of_birth">Select date</label>
                    <div className="neu-input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <div className="neu-input">
                    <input
                      type="text"
                      id="country"
                      value={profile.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      placeholder=" "
                    />
                    <label htmlFor="country">Kenya</label>
                    <div className="neu-input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <div className="neu-input">
                    <input
                      type="text"
                      id="city"
                      value={profile.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      placeholder=" "
                    />
                    <label htmlFor="city">Nairobi</label>
                    <div className="neu-input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <div className="neu-input" style={{ minHeight: '120px' }}>
                  <textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    placeholder=" "
                    rows={4}
                    style={{ 
                      minHeight: '100px',
                      resize: 'vertical',
                      paddingTop: '20px'
                    }}
                  />
                  <label htmlFor="bio" style={{ top: '20px' }}>Tell us about yourself...</label>
                  <div className="neu-input-icon" style={{ top: '20px' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <button
                  type="submit"
                  className="neu-button"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="neu-spinner"></span>
                      <span>Saving...</span>
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Security */}
      {activeTab === "security" && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Security</h3>

          {pwError && (
            <div className="neu-error" style={{ marginBottom: '16px' }}>
              <span>⚠️</span>
              <span>{pwError}</span>
            </div>
          )}
          {pwSuccess && (
            <div className="neu-success" style={{ marginBottom: '16px' }}>
              <span>✓</span>
              <span>{pwSuccess}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current password</label>
              <div className="neu-input">
                <input
                  type="password"
                  id="current_password"
                  value={pwCurrent}
                  onChange={(e) => setPwCurrent(e.target.value)}
                  placeholder=" "
                  autoComplete="current-password"
                />
                <label htmlFor="current_password">••••••••</label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">New password</label>
              <div className="neu-input">
                <input
                  type="password"
                  id="new_password"
                  value={pwNext}
                  onChange={(e) => setPwNext(e.target.value)}
                  placeholder=" "
                  autoComplete="new-password"
                />
                <label htmlFor="new_password">••••••••</label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm new password</label>
              <div className="neu-input">
                <input
                  type="password"
                  id="confirm_new_password"
                  value={pwConfirm}
                  onChange={(e) => setPwConfirm(e.target.value)}
                  placeholder=" "
                  autoComplete="new-password"
                />
                <label htmlFor="confirm_new_password">••••••••</label>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--border-subtle)]">
              <button type="submit" className="neu-button" disabled={pwSaving}>
                {pwSaving ? (
                  <>
                    <span className="neu-spinner"></span>
                    <span>Updating...</span>
                  </>
                ) : (
                  'Change Password'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Notifications</h3>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            View and manage your notifications.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="btn-primary" onClick={() => navigate('/notifications')}>
              Open Notifications
            </button>
          </div>
        </div>
      )}

      {/* SMS Detection */}
      {activeTab === "sms" && PLATFORM_FEATURES.SMS_DETECTION && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">SMS Transaction Detection</h3>
            <p className="text-sm text-[var(--text-muted)]">
              Manage the SMS senders you trust and keep automatic transaction detection tuned for your accounts.
              This feature runs only on the Android mobile app.
            </p>
          </div>
          <SmsSettings />
        </div>
      )}

      {/* Backup */}
      {activeTab === "backup" && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Backup</h3>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Export your data for offline storage. Export uses your currently selected date range.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="btn-primary" onClick={handleExportTransactions}>
              Export Transactions CSV
            </button>
            <button className="btn-secondary" onClick={() => navigate('/reports')}>
              Open Reports
            </button>
          </div>
        </div>
      )}

      {/* Sessions */}
      {activeTab === "sessions" && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Sessions</h3>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            You are signed in using secure session cookies. Use “Sign Out” to end your session.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="neu-button" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
