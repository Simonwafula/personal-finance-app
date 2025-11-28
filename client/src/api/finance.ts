// src/api/finance.ts
import { api } from "./client";
import type { Account, Transaction, Category } from "./types";

export async function fetchAccounts(): Promise<Account[]> {
  const res = await api.get("/api/finance/accounts/");
  return res.data;
}

export interface CreateAccountPayload {
  name: string;
  account_type: string;
  currency?: string;
  opening_balance?: number;
  institution?: string;
  notes?: string;
}

export async function createAccount(
  payload: CreateAccountPayload
): Promise<Account> {
  const res = await api.post("/api/finance/accounts/", payload);
  return res.data;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await api.get("/api/finance/categories/");
  return res.data;
}

export interface TransactionFilters {
  account?: number;
  start?: string;
  end?: string;
  category?: number;
  kind?: "INCOME" | "EXPENSE" | "TRANSFER";
  limit?: number;
  offset?: number;
}

export async function fetchTransactions(
  filters: TransactionFilters = {}
): Promise<Transaction[]> {
  const res = await api.get("/api/finance/transactions/", {
    params: filters,
  });
  return res.data;
}

export async function fetchTransactionsPaged(
  filters: TransactionFilters & { limit?: number; offset?: number } = {}
): Promise<any> {
  const res = await api.get("/api/finance/transactions/", { params: filters });
  return res.data;
}

export interface AggregatedQuery {
  start?: string;
  end?: string;
  group_by?: "day" | "month";
  kind?: "INCOME" | "EXPENSE" | "TRANSFER";
}

export async function fetchAggregatedTransactions(
  q: AggregatedQuery = {}
): Promise<{ series: Array<{ date: string; income: number; expenses: number }> }> {
  const res = await api.get("/api/finance/transactions/aggregated/", { params: q });
  return res.data;
}

export async function fetchTopCategories(
  q: { start?: string; end?: string; limit?: number } = {}
): Promise<{ categories: Array<{ id: number; name: string; amount: number }> }> {
  const res = await api.get("/api/finance/transactions/top_categories/", { params: q });
  return res.data;
}

// NEW:
export interface CreateTransactionPayload {
  account: number;
  date: string;              // 'YYYY-MM-DD'
  amount: number;
  kind: "INCOME" | "EXPENSE" | "TRANSFER";
  category?: number | null;
  description?: string;
  tags?: string;
}

export async function createTransaction(
  payload: CreateTransactionPayload
): Promise<Transaction> {
  const res = await api.post("/api/finance/transactions/", payload);
  return res.data;
}

export interface CreateCategoryPayload {
  name: string;
  kind: "INCOME" | "EXPENSE" | "TRANSFER";
  parent?: number | null;
}

export async function createCategory(
  payload: CreateCategoryPayload
): Promise<Category> {
  const res = await api.post("/api/finance/categories/", payload);
  return res.data;
}
