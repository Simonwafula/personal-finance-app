// src/api/debt.ts
import { api } from "./client";
import type { DebtPlan, DebtScheduleRow } from "./types";

export async function fetchDebtPlans(): Promise<DebtPlan[]> {
  const res = await api.get("/api/debt/debt-plans/");
  return res.data;
}

export interface CreateDebtPlanPayload {
  strategy: string;
  monthly_amount_available: number;
  start_date: string;
}

export async function createDebtPlan(payload: CreateDebtPlanPayload): Promise<DebtPlan> {
  const res = await api.post("/api/debt/debt-plans/", payload);
  return res.data;
}

export async function fetchDebtSchedule(planId: number): Promise<DebtScheduleRow[]> {
  const res = await api.get(`/api/debt/debt-plans/${planId}/schedule/`);
  return res.data?.schedule || res.data;
}

export async function fetchDebtPlan(planId: number): Promise<DebtPlan> {
  const res = await api.get(`/api/debt/debt-plans/${planId}/`);
  return res.data;
}

export default {};
