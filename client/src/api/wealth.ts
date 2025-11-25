// src/api/wealth.ts
import { api } from "./client";
import type { NetWorthCurrent } from "./types";

export async function fetchCurrentNetWorth(): Promise<NetWorthCurrent> {
  const res = await api.get("/api/wealth/net-worth-snapshots/current/");
  return res.data;
}
