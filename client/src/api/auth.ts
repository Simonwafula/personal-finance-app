// src/api/auth.ts
import { api } from "./client";

export interface UserProfile {
  bio: string;
  phone: string;
  avatar_url: string;
  date_of_birth: string | null;
  country: string;
  city: string;
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
