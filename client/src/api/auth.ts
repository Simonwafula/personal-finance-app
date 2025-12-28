// src/api/auth.ts
import { api } from "./client";

export interface UserProfile {
  bio: string;
  phone: string;
  avatar_url: string;
  date_of_birth: string | null;
  country: string;
  city: string;
  // Email notification preferences
  email_notifications: boolean;
  email_budget_alerts: boolean;
  email_recurring_reminders: boolean;
  email_weekly_summary: boolean;
}

export interface CurrentUser {
  id: number;
  username: string;
  email: string;
  profile?: UserProfile;
}

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const res = await api.get("/api/auth/me/");
  return res.data;
}

export interface RegisterPayload {
  email: string;
  password: string;
  username?: string;
  phone?: string;
  bio?: string;
  country?: string;
  city?: string;
}

export async function register(payload: RegisterPayload): Promise<CurrentUser> {
  const res = await api.post('/api/auth/register/', payload);
  return res.data;
}

export async function login(payload: { email?: string; username?: string; password: string }): Promise<CurrentUser> {
  const res = await api.post('/api/auth/login/', payload);
  return res.data;
}

export async function fetchProfile(): Promise<UserProfile> {
  const res = await api.get('/api/auth/profile/');
  return res.data;
}

export async function updateProfile(payload: Partial<UserProfile>): Promise<UserProfile> {
  const res = await api.patch('/api/auth/profile/', payload);
  return res.data;
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  const res = await api.post('/api/auth/forgot-password/', { email });
  return res.data;
}

export async function resetPassword(uid: string, token: string, newPassword: string): Promise<{ message: string }> {
  const res = await api.post('/api/auth/reset-password/', {
    uid,
    token,
    new_password: newPassword,
  });
  return res.data;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
  const res = await api.post('/api/auth/change-password/', {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return res.data;
}

// Backup/Restore functions
export async function exportBackup(): Promise<Blob> {
  const res = await api.get('/api/auth/profile/backup/export/', {
    responseType: 'blob',
  });
  return res.data;
}

export interface BackupStats {
  accounts: { created: number; updated: number };
  categories: { created: number; updated: number };
  transactions: { created: number; skipped: number };
  recurring_transactions: { created: number; skipped: number };
  budgets: { created: number; updated: number };
  savings_goals: { created: number; updated: number };
  debts: { created: number; updated: number };
  investments: { created: number; updated: number };
  investment_transactions: { created: number; skipped: number };
}

export interface ImportBackupResponse {
  message: string;
  stats: BackupStats;
}

export async function importBackup(file: File): Promise<ImportBackupResponse> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post('/api/auth/profile/backup/import/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

// Session Management
export interface UserSessionInfo {
  id: number;
  ip_address: string | null;
  device_type: string;
  browser: string;
  os: string;
  location: string;
  is_current: boolean;
  created_at: string;
  last_activity: string;
}

export interface LoginHistoryEntry {
  id: number;
  ip_address: string | null;
  device_type: string;
  browser: string;
  os: string;
  location: string;
  success: boolean;
  failure_reason: string;
  login_method: string;
  timestamp: string;
}

export async function fetchSessions(): Promise<UserSessionInfo[]> {
  const res = await api.get('/api/auth/profile/sessions/');
  return res.data;
}

export async function revokeSession(sessionId: number): Promise<{ message: string }> {
  const res = await api.delete(`/api/auth/profile/sessions/${sessionId}/revoke/`);
  return res.data;
}

export async function revokeAllOtherSessions(): Promise<{ message: string; revoked_count: number }> {
  const res = await api.delete('/api/auth/profile/sessions/revoke-all-other/');
  return res.data;
}

export async function fetchLoginHistory(): Promise<LoginHistoryEntry[]> {
  const res = await api.get('/api/auth/profile/login-history/');
  return res.data;
}
