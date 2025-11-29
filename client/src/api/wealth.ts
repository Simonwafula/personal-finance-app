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

export async function updateAsset(id: number, payload: Partial<Asset>): Promise<Asset> {
  const res = await api.patch(`/api/wealth/assets/${id}/`, payload);
  return res.data;
}

export async function deleteAsset(id: number): Promise<void> {
  await api.delete(`/api/wealth/assets/${id}/`);
}

export async function fetchLiabilities(): Promise<Liability[]> {
  const res = await api.get("/api/wealth/liabilities/");
  return res.data;
}

export async function createLiability(payload: Partial<Liability>): Promise<Liability> {
  const res = await api.post("/api/wealth/liabilities/", payload);
  return res.data;
}

export async function updateLiability(id: number, payload: Partial<Liability>): Promise<Liability> {
  const res = await api.patch(`/api/wealth/liabilities/${id}/`, payload);
  return res.data;
}

export async function deleteLiability(id: number): Promise<void> {
  await api.delete(`/api/wealth/liabilities/${id}/`);
}

export async function createNetWorthSnapshot(): Promise<NetWorthSnapshot> {
  const res = await api.post("/api/wealth/net-worth-snapshots/snapshot/");
  return res.data;
}

export async function fetchNetWorthSnapshots(): Promise<NetWorthSnapshot[]> {
  const res = await api.get("/api/wealth/net-worth-snapshots/");
  return res.data;
}
