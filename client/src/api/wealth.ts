// src/api/wealth.ts
import { api } from "./client";
import type { NetWorthCurrent, Asset, Liability, NetWorthSnapshot } from "./types";

export async function fetchCurrentNetWorth(): Promise<NetWorthCurrent> {
  const res = await api.get("/api/wealth/net-worth-snapshots/current/");
  return res.data;
}

export async function fetchAssets(): Promise<Asset[]> {
  const res = await api.get("/api/wealth/assets/");
  return res.data;
}

export async function createAsset(payload: Partial<Asset>): Promise<Asset> {
  const res = await api.post("/api/wealth/assets/", payload);
  return res.data;
}

export async function fetchLiabilities(): Promise<Liability[]> {
  const res = await api.get("/api/wealth/liabilities/");
  return res.data;
}

export async function createLiability(payload: Partial<Liability>): Promise<Liability> {
  const res = await api.post("/api/wealth/liabilities/", payload);
  return res.data;
}

export async function createNetWorthSnapshot(): Promise<NetWorthSnapshot> {
  const res = await api.post("/api/wealth/net-worth-snapshots/snapshot/");
  return res.data;
}

export async function fetchNetWorthSnapshots(): Promise<NetWorthSnapshot[]> {
  const res = await api.get("/api/wealth/net-worth-snapshots/");
  return res.data;
}
