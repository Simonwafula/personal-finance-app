// src/api/budgeting.ts
import { api } from "./client";
import type { Budget, BudgetSummary, BudgetLine } from "./types";

export async function fetchBudgets(): Promise<Budget[]> {
  const res = await api.get("/api/budgeting/budgets/");
  return res.data;
}

export async function fetchBudgetSummary(
  budgetId: number
): Promise<BudgetSummary> {
  const res = await api.get(
    `/api/budgeting/budgets/${budgetId}/summary/`
  );
  return res.data;
}

export interface CreateBudgetPayload {
  name: string;
  period_type: string;
  start_date: string;
  end_date: string;
  notes?: string;
}

export async function createBudget(
  payload: CreateBudgetPayload
): Promise<Budget> {
  const res = await api.post("/api/budgeting/budgets/", payload);
  return res.data;
}

export async function updateBudget(
  id: number,
  payload: Partial<CreateBudgetPayload>
): Promise<Budget> {
  const res = await api.patch(`/api/budgeting/budgets/${id}/`, payload);
  return res.data;
}

export async function deleteBudget(id: number): Promise<void> {
  await api.delete(`/api/budgeting/budgets/${id}/`);
}

export interface CreateBudgetLinePayload {
  budget: number;
  category: number;
  planned_amount: number;
}

export async function createBudgetLine(
  payload: CreateBudgetLinePayload
): Promise<BudgetLine> {
  const res = await api.post("/api/budgeting/budget-lines/", payload);
  return res.data;
}

export async function fetchBudgetLines(budgetId: number): Promise<BudgetLine[]> {
  const res = await api.get(`/api/budgeting/budget-lines/`, { params: { budget: budgetId } });
  return res.data;
}

export async function updateBudgetLine(id: number, payload: Partial<CreateBudgetLinePayload>): Promise<BudgetLine> {
  const res = await api.patch(`/api/budgeting/budget-lines/${id}/`, payload);
  return res.data;
}

export async function deleteBudgetLine(id: number): Promise<void> {
  await api.delete(`/api/budgeting/budget-lines/${id}/`);
}
