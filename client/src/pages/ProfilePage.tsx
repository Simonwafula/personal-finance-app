import { useState, useEffect } from "react";
import { HiUser, HiShieldCheck, HiKey, HiBell, HiMail, HiCloudUpload, HiCloudDownload, HiRefresh, HiDeviceMobile, HiDesktopComputer, HiLogout, HiCheck, HiX, HiClock } from "react-icons/hi";
import { fetchProfile, updateProfile, changePassword, exportBackup, importBackup, fetchSessions, revokeSession, revokeAllOtherSessions, fetchLoginHistory, type UserProfile, type BackupStats, type UserSessionInfo, type LoginHistoryEntry } from "../api/auth";

interface ProfileFormData extends UserProfile {
  username: string;
  email: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'backup' | 'sessions'>('profile');
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  
  // Backup state
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [backupStats, setBackupStats] = useState<BackupStats | null>(null);
  
  // Session state
  const [sessions, setSessions] = useState<UserSessionInfo[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryEntry[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [revokingSession, setRevokingSession] = useState<number | null>(null);

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

  function handleChange(field: keyof ProfileFormData, value: string | boolean | null) {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  }

  async function loadSessions() {
    try {
      setLoadingSessions(true);
      const [sessionsData, historyData] = await Promise.all([
        fetchSessions(),
        fetchLoginHistory(),
      ]);
      setSessions(sessionsData);
      setLoginHistory(historyData);
    } catch (err: any) {
      setError(err.message || 'Failed to load sessions');
    } finally {
      setLoadingSessions(false);
    }
  }

  async function handleRevokeSession(sessionId: number) {
    try {
      setRevokingSession(sessionId);
      await revokeSession(sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
      setSuccess('Session revoked successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to revoke session');
    } finally {
      setRevokingSession(null);
    }
  }

  async function handleRevokeAllOther() {
    if (!window.confirm('Are you sure you want to log out of all other devices?')) return;
    try {
      setRevokingSession(-1);
      const result = await revokeAllOtherSessions();
      setSessions(sessions.filter(s => s.is_current));
      setSuccess(result.message);
    } catch (err: any) {
      setError(err.message || 'Failed to revoke sessions');
    } finally {
      setRevokingSession(null);
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  }

  function getDeviceIcon(deviceType: string) {
    switch (deviceType.toLowerCase()) {
      case 'mobile':
        return <HiDeviceMobile size={20} className="text-[var(--text-muted)]" />;
      case 'tablet':
        return <HiDeviceMobile size={20} className="text-[var(--text-muted)]" />;
      default:
        return <HiDesktopComputer size={20} className="text-[var(--text-muted)]" />;
    }
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
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent flex items-center gap-2">
            <HiUser className="text-indigo-600" size={24} />
            Your Profile
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Manage your personal info and account preferences</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--border-subtle)]">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'profile'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <HiUser size={16} />
          Profile Info
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'security'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <HiShieldCheck size={16} />
          Security
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'notifications'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <HiBell size={16} />
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('backup')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'backup'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <HiCloudUpload size={16} />
          Backup
        </button>
        <button
          onClick={() => {
            setActiveTab('sessions');
            loadSessions();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'sessions'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <HiDeviceMobile size={16} />
          Sessions
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

      {activeTab === 'profile' && (
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
                <div className="neu-input neu-input-textarea">
                  <textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    placeholder=" "
                    rows={4}
                  />
                  <label htmlFor="bio">Tell us about yourself...</label>
                  <div className="neu-input-icon">
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

      {activeTab === 'security' && (
        <div className="max-w-2xl">
          <div className="card space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-subtle)]">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <HiKey className="text-amber-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Change Password</h3>
                <p className="text-sm text-[var(--text-muted)]">Update your password to keep your account secure</p>
              </div>
            </div>

            {passwordError && (
              <div className="neu-error">
                <span>⚠️</span>
                <span>{passwordError}</span>
              </div>
            )}
            {passwordSuccess && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm">
                <span>✓</span>
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={async (e) => {
              e.preventDefault();
              setPasswordError(null);
              setPasswordSuccess(null);
              
              if (newPassword !== confirmPassword) {
                setPasswordError('New passwords do not match');
                return;
              }
              
              if (newPassword.length < 8) {
                setPasswordError('Password must be at least 8 characters');
                return;
              }
              
              try {
                setChangingPassword(true);
                await changePassword(currentPassword, newPassword);
                setPasswordSuccess('Password changed successfully!');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
              } catch (err: any) {
                setPasswordError(err.message || 'Failed to change password');
              } finally {
                setChangingPassword(false);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <div className="neu-input">
                  <input
                    type="password"
                    id="current_password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder=" "
                    required
                  />
                  <label htmlFor="current_password">Enter current password</label>
                  <div className="neu-input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <div className="neu-input">
                  <input
                    type="password"
                    id="new_password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder=" "
                    required
                    minLength={8}
                  />
                  <label htmlFor="new_password">Enter new password</label>
                  <div className="neu-input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">Minimum 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <div className="neu-input">
                  <input
                    type="password"
                    id="confirm_password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder=" "
                    required
                  />
                  <label htmlFor="confirm_password">Confirm new password</label>
                  <div className="neu-input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" className="neu-button" disabled={changingPassword}>
                  {changingPassword ? (
                    <>
                      <span className="neu-spinner"></span>
                      <span>Updating...</span>
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="card mt-6 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-subtle)]">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <HiShieldCheck className="text-green-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Account Security</h3>
                <p className="text-sm text-[var(--text-muted)]">Your account security status</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[var(--surface)] rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Email verified</span>
                </div>
                <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[var(--surface)] rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-amber-500">○</span>
                  <span className="text-sm">Two-factor authentication</span>
                </div>
                <span className="text-xs text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full">Not enabled</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && profile && (
        <div className="space-y-6">
          <div className="card space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-subtle)]">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <HiMail className="text-indigo-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Email Notifications</h3>
                <p className="text-sm text-[var(--text-muted)]">Control what email alerts you receive</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Master toggle */}
              <div className="flex items-center justify-between p-4 bg-[var(--surface)] rounded-xl">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-xs text-[var(--text-muted)]">Master switch for all email notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.email_notifications ?? true}
                    onChange={(e) => {
                      handleChange('email_notifications', e.target.checked);
                      // Auto-save notification preferences
                      updateProfile({ email_notifications: e.target.checked }).catch(console.error);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* Individual toggles */}
              <div className={`space-y-3 transition-opacity ${profile.email_notifications ? '' : 'opacity-50 pointer-events-none'}`}>
                <div className="flex items-center justify-between p-3 bg-[var(--surface)] rounded-xl">
                  <div>
                    <p className="text-sm font-medium">Budget Alerts</p>
                    <p className="text-xs text-[var(--text-muted)]">Get notified when you reach budget thresholds</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.email_budget_alerts ?? true}
                      onChange={(e) => {
                        handleChange('email_budget_alerts', e.target.checked);
                        updateProfile({ email_budget_alerts: e.target.checked }).catch(console.error);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-[var(--surface)] rounded-xl">
                  <div>
                    <p className="text-sm font-medium">Subscription Reminders</p>
                    <p className="text-xs text-[var(--text-muted)]">Reminders for upcoming recurring payments</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.email_recurring_reminders ?? true}
                      onChange={(e) => {
                        handleChange('email_recurring_reminders', e.target.checked);
                        updateProfile({ email_recurring_reminders: e.target.checked }).catch(console.error);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-[var(--surface)] rounded-xl">
                  <div>
                    <p className="text-sm font-medium">Weekly Summary</p>
                    <p className="text-xs text-[var(--text-muted)]">Weekly overview of your financial activity</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.email_weekly_summary ?? false}
                      onChange={(e) => {
                        handleChange('email_weekly_summary', e.target.checked);
                        updateProfile({ email_weekly_summary: e.target.checked }).catch(console.error);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex gap-3">
              <HiBell className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-medium">Email Setup Required</p>
                <p className="text-xs mt-1 text-blue-600 dark:text-blue-400">
                  Email notifications require SMTP configuration in production. In development mode, emails are printed to the console.
                  Contact your administrator if emails aren't being delivered.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'backup' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Export Section */}
            <div className="card space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/30">
                  <HiCloudDownload className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold">Export Backup</h3>
                  <p className="text-sm text-[var(--text-muted)]">Download all your data as JSON</p>
                </div>
              </div>
              <p className="text-sm text-[var(--text-muted)]">
                Export all your accounts, transactions, categories, budgets, savings goals, debts, and investments to a JSON file. You can use this file to restore your data later or transfer it to another account.
              </p>
              <ul className="text-sm text-[var(--text-muted)] space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Accounts &amp; balances
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  All transactions &amp; recurring payments
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Categories &amp; budgets
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Savings goals &amp; debts
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Investments &amp; transactions
                </li>
              </ul>
              <button
                onClick={async () => {
                  try {
                    setExporting(true);
                    setError(null);
                    const blob = await exportBackup();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `finance_backup_${new Date().toISOString().split('T')[0]}.json`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                    setSuccess('Backup exported successfully!');
                  } catch (err: any) {
                    setError(err.message || 'Failed to export backup');
                  } finally {
                    setExporting(false);
                  }
                }}
                disabled={exporting}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {exporting ? (
                  <>
                    <HiRefresh className="animate-spin" size={16} />
                    Exporting...
                  </>
                ) : (
                  <>
                    <HiCloudDownload size={16} />
                    Download Backup
                  </>
                )}
              </button>
            </div>

            {/* Import Section */}
            <div className="card space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <HiCloudUpload className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold">Restore Backup</h3>
                  <p className="text-sm text-[var(--text-muted)]">Upload a backup file to restore</p>
                </div>
              </div>
              <p className="text-sm text-[var(--text-muted)]">
                Restore your data from a previously exported backup file. Existing data with matching names will be updated, and new items will be created.
              </p>
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  <strong>⚠️ Important:</strong> Transactions will be re-created, not deduplicated. Only use this for restoring to a new or empty account.
                </p>
              </div>
              <label className="block">
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    try {
                      setImporting(true);
                      setError(null);
                      setBackupStats(null);
                      const result = await importBackup(file);
                      setBackupStats(result.stats);
                      setSuccess('Backup restored successfully!');
                    } catch (err: any) {
                      setError(err.message || 'Failed to import backup');
                    } finally {
                      setImporting(false);
                      e.target.value = '';
                    }
                  }}
                  disabled={importing}
                />
                <div className={`btn-secondary w-full flex items-center justify-center gap-2 cursor-pointer ${importing ? 'opacity-50 pointer-events-none' : ''}`}>
                  {importing ? (
                    <>
                      <HiRefresh className="animate-spin" size={16} />
                      Restoring...
                    </>
                  ) : (
                    <>
                      <HiCloudUpload size={16} />
                      Select Backup File
                    </>
                  )}
                </div>
              </label>
              
              {backupStats && (
                <div className="mt-4 p-4 bg-[var(--surface)] rounded-xl space-y-2">
                  <h4 className="font-medium text-sm">Import Results:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Accounts:</span>
                      <span className="text-green-600">+{backupStats.accounts.created} / ↻{backupStats.accounts.updated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Categories:</span>
                      <span className="text-green-600">+{backupStats.categories.created} / ↻{backupStats.categories.updated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Transactions:</span>
                      <span className="text-green-600">+{backupStats.transactions.created}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Recurring:</span>
                      <span className="text-green-600">+{backupStats.recurring_transactions.created}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Budgets:</span>
                      <span className="text-green-600">+{backupStats.budgets.created} / ↻{backupStats.budgets.updated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Savings:</span>
                      <span className="text-green-600">+{backupStats.savings_goals.created} / ↻{backupStats.savings_goals.updated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Debts:</span>
                      <span className="text-green-600">+{backupStats.debts.created} / ↻{backupStats.debts.updated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Investments:</span>
                      <span className="text-green-600">+{backupStats.investments.created} / ↻{backupStats.investments.updated}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Google Drive Integration Info */}
          <div className="card p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex gap-3">
              <HiCloudUpload className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-medium">💡 Tip: Save to Google Drive</p>
                <p className="text-xs mt-1 text-blue-600 dark:text-blue-400">
                  After downloading your backup file, you can upload it to Google Drive for cloud storage.
                  Open <a href="https://drive.google.com" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Google Drive</a> and drag your backup file there for safekeeping.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sessions' && (
        <div className="space-y-6">
          {/* Active Sessions */}
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                  <HiDeviceMobile className="text-indigo-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold">Active Sessions</h3>
                  <p className="text-sm text-[var(--text-muted)]">Devices currently logged into your account</p>
                </div>
              </div>
              {sessions.filter(s => !s.is_current).length > 0 && (
                <button
                  onClick={handleRevokeAllOther}
                  disabled={revokingSession !== null}
                  className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <HiLogout size={16} />
                  Log out all other
                </button>
              )}
            </div>

            {loadingSessions ? (
              <div className="flex justify-center py-8">
                <HiRefresh className="animate-spin text-indigo-600" size={24} />
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-muted)]">
                <HiDeviceMobile size={40} className="mx-auto mb-2 opacity-50" />
                <p>No active sessions found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map(session => (
                  <div
                    key={session.id}
                    className={`flex items-center justify-between p-4 rounded-xl border ${
                      session.is_current
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-[var(--surface)] border-[var(--border-subtle)]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {getDeviceIcon(session.device_type)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {session.browser} on {session.os}
                          </span>
                          {session.is_current && (
                            <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                              This device
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-[var(--text-muted)] flex items-center gap-2">
                          <span>{session.ip_address || 'Unknown IP'}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <HiClock size={12} />
                            {formatDate(session.last_activity)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {!session.is_current && (
                      <button
                        onClick={() => handleRevokeSession(session.id)}
                        disabled={revokingSession === session.id}
                        className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Revoke session"
                      >
                        {revokingSession === session.id ? (
                          <HiRefresh className="animate-spin" size={18} />
                        ) : (
                          <HiLogout size={18} />
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Login History */}
          <div className="card space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800">
                <HiClock className="text-gray-600 dark:text-gray-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold">Login History</h3>
                <p className="text-sm text-[var(--text-muted)]">Recent login attempts to your account</p>
              </div>
            </div>

            {loadingSessions ? (
              <div className="flex justify-center py-8">
                <HiRefresh className="animate-spin text-indigo-600" size={24} />
              </div>
            ) : loginHistory.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-muted)]">
                <HiClock size={40} className="mx-auto mb-2 opacity-50" />
                <p>No login history found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border-subtle)]">
                      <th className="text-left py-2 px-3 font-medium text-[var(--text-muted)]">Status</th>
                      <th className="text-left py-2 px-3 font-medium text-[var(--text-muted)]">Device</th>
                      <th className="text-left py-2 px-3 font-medium text-[var(--text-muted)]">IP Address</th>
                      <th className="text-left py-2 px-3 font-medium text-[var(--text-muted)]">Method</th>
                      <th className="text-left py-2 px-3 font-medium text-[var(--text-muted)]">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginHistory.slice(0, 20).map(entry => (
                      <tr key={entry.id} className="border-b border-[var(--border-subtle)] last:border-0">
                        <td className="py-3 px-3">
                          {entry.success ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <HiCheck size={16} />
                              Success
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-600" title={entry.failure_reason}>
                              <HiX size={16} />
                              Failed
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className="flex items-center gap-2">
                            {getDeviceIcon(entry.device_type)}
                            {entry.browser} / {entry.os}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[var(--text-muted)]">
                          {entry.ip_address || '-'}
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded capitalize">
                            {entry.login_method}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[var(--text-muted)]">
                          {new Date(entry.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Security Tips */}
          <div className="card p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <div className="flex gap-3">
              <HiShieldCheck className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-amber-800 dark:text-amber-300">
                <p className="font-medium">🔒 Security Tips</p>
                <ul className="text-xs mt-1 text-amber-600 dark:text-amber-400 space-y-1">
                  <li>• Revoke sessions from devices you don't recognize</li>
                  <li>• If you see failed login attempts you didn't make, change your password</li>
                  <li>• Consider using a strong, unique password</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
