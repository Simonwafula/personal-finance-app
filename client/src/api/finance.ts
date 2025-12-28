// src/api/finance.ts
import { api } from "./client";
import type { Account, Transaction, Category, Tag, TagAnalysis } from "./types";

export type { Account };

export async function fetchAccounts(): Promise<Account[]> {
  const res = await api.get("/api/finance/accounts/");
  return res.data;
}

// Alias for compatibility
export const getAccounts = fetchAccounts;

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

export async function updateAccount(
  id: number,
  payload: Partial<CreateAccountPayload>
): Promise<Account> {
  const res = await api.patch(`/api/finance/accounts/${id}/`, payload);
  return res.data;
}

export async function deleteAccount(id: number): Promise<void> {
  await api.delete(`/api/finance/accounts/${id}/`);
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
  savings_goal?: number | null;
}

export async function createTransaction(
  payload: CreateTransactionPayload
): Promise<Transaction> {
  const res = await api.post("/api/finance/transactions/", payload);
  return res.data;
}

export async function updateTransaction(
  id: number,
  payload: Partial<CreateTransactionPayload>
): Promise<Transaction> {
  const res = await api.patch(`/api/finance/transactions/${id}/`, payload);
  return res.data;
}

export async function deleteTransaction(id: number): Promise<void> {
  await api.delete(`/api/finance/transactions/${id}/`);
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

export async function updateCategory(
  id: number,
  payload: Partial<CreateCategoryPayload>
): Promise<Category> {
  const res = await api.patch(`/api/finance/categories/${id}/`, payload);
  return res.data;
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/api/finance/categories/${id}/`);
}

// Recurring transactions
export interface CreateRecurringPayload {
  account: number;
  date: string; // next due date
  amount: number;
  kind: "INCOME" | "EXPENSE" | "TRANSFER";
  category?: number | null;
  description?: string;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  end_date?: string | null;
}

export async function createRecurring(payload: CreateRecurringPayload) {
  const res = await api.post("/api/finance/recurring/", payload);
  return res.data;
}

export async function fetchRecurring(): Promise<any[]> {
  const res = await api.get("/api/finance/recurring/");
  return res.data;
}

export async function updateRecurring(id: number, payload: Partial<CreateRecurringPayload>) {
  const res = await api.patch(`/api/finance/recurring/${id}/`, payload);
  return res.data;
}

export async function deleteRecurring(id: number): Promise<void> {
  await api.delete(`/api/finance/recurring/${id}/`);
}

export async function previewRecurring(id: number): Promise<{ dates: string[] }> {
  const res = await api.get(`/api/finance/recurring/${id}/preview/`);
  return res.data;
}

export async function materializeRecurring(days: number = 30): Promise<{ created: number; days: number }> {
  const res = await api.post(`/api/finance/recurring/materialize/`, { days });
  return res.data;
}

// CSV import/export
export async function importTransactionsCsv(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await api.post("/api/finance/transactions/import-csv/", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function exportTransactionsCsv(params: any = {}) {
  const res = await api.get("/api/finance/transactions/export-csv/", { params, responseType: 'blob' });
  return res.data;
}

export async function exportAccountsCsv() {
  const res = await api.get("/api/finance/accounts/export-csv/", { responseType: 'blob' });
  return res.data;
}

export async function exportCategoriesCsv() {
  const res = await api.get("/api/finance/categories/export-csv/", { responseType: 'blob' });
  return res.data;
}

// Import M-Pesa statement
export async function importMpesaStatement(file: File, accountId: number) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("account_id", accountId.toString());
  const res = await api.post("/api/finance/transactions/import-mpesa/", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// Import generic bank statement
export interface BankImportOptions {
  accountId: number;
  dateColumn: string;
  amountColumn?: string;
  debitColumn?: string;
  creditColumn?: string;
  descriptionColumn?: string;
  dateFormat?: string;
}

export async function importBankStatement(file: File, options: BankImportOptions) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("account_id", options.accountId.toString());
  fd.append("date_column", options.dateColumn);
  if (options.amountColumn) fd.append("amount_column", options.amountColumn);
  if (options.debitColumn) fd.append("debit_column", options.debitColumn);
  if (options.creditColumn) fd.append("credit_column", options.creditColumn);
  if (options.descriptionColumn) fd.append("description_column", options.descriptionColumn);
  if (options.dateFormat) fd.append("date_format", options.dateFormat);
  const res = await api.post("/api/finance/transactions/import-bank/", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// Tags
export async function fetchTags(): Promise<Tag[]> {
  const res = await api.get("/api/finance/tags/");
  return res.data;
}

export interface CreateTagPayload {
  name: string;
  color?: string;
}

export async function createTag(payload: CreateTagPayload): Promise<Tag> {
  const res = await api.post("/api/finance/tags/", payload);
  return res.data;
}

export async function updateTag(
  id: number,
  payload: Partial<CreateTagPayload>
): Promise<Tag> {
  const res = await api.patch(`/api/finance/tags/${id}/`, payload);
  return res.data;
}

export async function deleteTag(id: number): Promise<void> {
  await api.delete(`/api/finance/tags/${id}/`);
}

export async function fetchTagAnalysis(params: {
  start?: string;
  end?: string;
}): Promise<{ tags: TagAnalysis[] }> {
  const res = await api.get("/api/finance/tags/analysis/", { params });
  return res.data;
}
