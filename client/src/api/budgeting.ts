// src/api/budgeting.ts
import { api } from "./client";
import type { Budget, BudgetSummary } from "./types";

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
