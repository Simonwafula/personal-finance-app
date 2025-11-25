// src/api/auth.ts
import { api } from "./client";

export interface CurrentUser {
  id: number;
  username: string;
  email: string;
}

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const res = await api.get("/api/auth/me/");
  return res.data;
}
