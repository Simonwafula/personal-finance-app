import { useState, useEffect } from "react";
import { fetchProfile, updateProfile, type UserProfile } from "../api/auth";

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
          <p className="text-sm text-[var(--text-muted)] mt-1">Manage your personal info and account preferences</p>
        </div>
      </div>

      {error && (
        <div className="card bg-red-50 border-red-200 text-red-700">{error}</div>
      )}
      {success && (
        <div className="card bg-green-50 border-green-200 text-green-700">{success}</div>
      )}

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
              <input
                type="url"
                value={profile.avatar_url}
                onChange={(e) => handleChange('avatar_url', e.target.value)}
                className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="https://example.com/avatar.jpg"
              />
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
                    className="w-full border-2 rounded-lg px-3 py-2.5 bg-gray-50 text-sm"
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-1">Username cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={profile.email || ''}
                    disabled
                    className="w-full border-2 rounded-lg px-3 py-2.5 bg-gray-50 text-sm"
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-1">Email cannot be changed</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="+1234567890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={profile.date_of_birth || ''}
                    onChange={(e) => handleChange('date_of_birth', e.target.value)}
                    className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <input
                    type="text"
                    value={profile.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="Kenya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="Nairobi"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
