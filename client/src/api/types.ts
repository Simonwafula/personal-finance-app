// src/api/types.ts

export type AccountType =
  | "BANK"
  | "MOBILE_MONEY"
  | "CASH"
  | "SACCO"
  | "INVESTMENT"
  | "LOAN"
  | "CREDIT_CARD"
  | "OTHER";

export interface Account {
  id: number;
  name: string;
  account_type: AccountType;
  currency: string;
  opening_balance: string;
  status: "ACTIVE" | "CLOSED";
  institution: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export type CategoryKind = "INCOME" | "EXPENSE" | "TRANSFER";

export interface Category {
  id: number;
  name: string;
  kind: CategoryKind;
  parent: number | null;
  created_at: string;
  updated_at: string;
}

export type TransactionKind = "INCOME" | "EXPENSE" | "TRANSFER";

export interface Transaction {
  id: number;
  account: number;
  account_name: string;
  date: string;
  amount: string;
  kind: TransactionKind;
  category: number | null;
  category_name: string | null;
  description: string;
  tags: string;
  is_recurring: boolean;
  recurring_rule: any;
  created_at: string;
  updated_at: string;
}

// --- Wealth / Net worth ---

export interface NetWorthCurrent {
  total_assets: string;
  total_liabilities: string;
  net_worth: string;
}

// --- Budgets ---

export type BudgetPeriodType = "MONTHLY" | "ANNUAL" | "CUSTOM";

export interface Budget {
  id: number;
  name: string;
  period_type: BudgetPeriodType;
  start_date: string;
  end_date: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

// This matches the /summary/ response from backend
export interface BudgetSummaryLine {
  category_id: number;
  category_name: string;
  planned: string;
  actual: string;
  difference: string;
}

export interface BudgetSummaryTotals {
  planned: string;
  actual: string;
  difference: string;
}

export interface BudgetSummary {
  budget: {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
  };
  lines: BudgetSummaryLine[];
  totals: BudgetSummaryTotals;
}
