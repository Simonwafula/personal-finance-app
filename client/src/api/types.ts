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
  current_balance: string;
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
  savings_goal: number | null;
  savings_goal_name: string | null;
  savings_goal_emoji: string | null;
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

export interface BudgetLine {
  id: number;
  budget: number;
  category: number;
  category_name: string;
  planned_amount: string;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: number;
  name: string;
  asset_type: string;
  current_value: string;
  acquisition_date: string | null;
  cost_basis: string | null;
  currency: string;
  linked_account: number | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Liability {
  id: number;
  name: string;
  liability_type: string;
  principal_balance: string;
  interest_rate: string;
  minimum_payment: string;
  due_day_of_month: number | null;
  linked_account: number | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface NetWorthSnapshot {
  id: number;
  date: string;
  total_assets: string;
  total_liabilities: string;
  net_worth: string;
  created_at: string;
  updated_at: string;
}

// Debt
export interface DebtPlan {
  id: number;
  strategy: string;
  monthly_amount_available: string;
  start_date: string;
  created_at: string;
  updated_at: string;
}

export interface DebtScheduleRow {
  month: string;
  liability_id: number;
  liability_name: string;
  starting_balance: string;
  interest: string;
  payment: string;
  principal: string;
  ending_balance: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface TagAnalysis {
  name: string;
  total: number;
  count: number;
  color: string;
}
