import { api } from "./client";

export interface ActivityLog {
  id: number;
  created_at: string;
  actor: "USER" | "SYSTEM";
  action: string;
  summary: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, unknown>;
}

export interface ActivityLogPage {
  count: number;
  next: string | null;
  previous: string | null;
  results: ActivityLog[];
}

export async function fetchActivityLogsPage(params: {
  limit?: number;
  offset?: number;
  start?: string;
  end?: string;
  action?: string;
  entity_type?: string;
  entity_id?: string;
}): Promise<ActivityLogPage> {
  const res = await api.get("/api/activity/logs/", { params });
  return res.data;
}
