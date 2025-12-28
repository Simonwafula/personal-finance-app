// src/pages/TransactionsPage.tsx - Streamlined for transaction tracking only
import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useTimeRange } from "../contexts/TimeRangeContext";
import type { FormEvent } from "react";
import {
  fetchTransactionsPaged,
  fetchAccounts,
  fetchCategories,
  fetchTags,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  importTransactionsCsv,
  exportTransactionsCsv,
  importMpesaStatement,
  importBankStatement,
} from "../api/finance";
import { getSavingsGoals, type SavingsGoal } from "../api/savings";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { HiPlus, HiUpload, HiDownload, HiX, HiPencil, HiTrash, HiFilter, HiChevronDown, HiCash } from "react-icons/hi";
import type {
  Transaction,
  Account,
  Category,
  Tag,
  TransactionKind,
} from "../api/types";

function formatMoney(value: string | number) {
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return value.toString();
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [aggregatedSeries, setAggregatedSeries] = useState<{date:string;income:number;expenses:number}[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);

  const [loading, setLoading] = useState(false);
  const [pageLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [loadingRefs, setLoadingRefs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [accountId, setAccountId] = useState<number | "">("");
  const [kind, setKind] = useState<TransactionKind>("EXPENSE");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [savingsGoalId, setSavingsGoalId] = useState<number | "">("");
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResult, setImportResult] = useState<any | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importType, setImportType] = useState<"mpesa" | "bank" | "simple">("mpesa");
  const [importAccountId, setImportAccountId] = useState<number | "">(""  );
  const [importing, setImporting] = useState(false);
  const [bankDateColumn, setBankDateColumn] = useState("date");
  const [bankAmountColumn, setBankAmountColumn] = useState("");
  const [bankDebitColumn, setBankDebitColumn] = useState("");
  const [bankCreditColumn, setBankCreditColumn] = useState("");
  const [bankDescColumn, setBankDescColumn] = useState("description");
  const [bankDateFormat, setBankDateFormat] = useState("%Y-%m-%d");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [searchParams] = useSearchParams();
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const { range } = useTimeRange();
  const [filterCategory, setFilterCategory] = useState<number | "">(searchParams.get("category") ? Number(searchParams.get("category")) : "");
  const [filterKind, setFilterKind] = useState<TransactionKind | "">((searchParams.get("kind") as TransactionKind) || "");
  const [filterAccount, setFilterAccount] = useState<number | "">(searchParams.get("account") ? Number(searchParams.get("account")) : "");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilters, setShowFilters] = useState(!!searchParams.get("account") || !!searchParams.get("category") || !!searchParams.get("kind"));
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function loadRefs() {
    try {
      setLoadingRefs(true);
      const [accs, cats, existingTags, goals] = await Promise.all([
        fetchAccounts(),
        fetchCategories(),
        fetchTags(),
        getSavingsGoals(),
      ]);
      setAccounts(accs);
      setAllTags(existingTags);
      setCategories(cats);
      setSavingsGoals(goals);
      
      if (accs.length > 0 && accountId === "") {
        setAccountId(accs[0].id);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load accounts/categories");
    } finally {
      setLoadingRefs(false);
    }
  }

  async function loadTransactions() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTransactionsPaged({ start: range.startDate, end: range.endDate, limit: pageLimit, offset });
      const items = data.results ?? data;
      setTransactions(items);
      setTotalCount(typeof data.count === 'number' ? data.count : null);
      applyFilters(items, range.startDate, range.endDate, filterCategory, filterKind);
    } catch (err) {
      console.error(err);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadAggregated() {
      try {
        const { fetchAggregatedTransactions } = await import('../api/finance');
        const res = await fetchAggregatedTransactions({ start: range.startDate, end: range.endDate, group_by: 'day' });
        setAggregatedSeries((res.series && res.series.length > 0) ? res.series : generateEmptyDaySeries(range.startDate, range.endDate));
      } catch (err) {
        console.error(err);
      }
    }
    loadAggregated();
  }, [range.startDate, range.endDate]);

  function generateEmptyDaySeries(start: string, end: string) {
    const s = new Date(start);
    const e = new Date(end);
    const out: {date:string;income:number;expenses:number}[] = [];
    for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
      out.push({ date: d.toISOString().slice(0,10), income: 0, expenses: 0 });
    }
    return out;
  }

  function applyFilters(
    txs: Transaction[],
    start?: string | null,
    end?: string | null,
    category?: number | "",
    kindF?: TransactionKind | "",
    account?: number | ""
  ) {
    let filtered = txs.slice();
    if (start) {
      const s = new Date(start);
      filtered = filtered.filter((t) => new Date(t.date) >= s);
    }
    if (end) {
      const e = new Date(end);
      filtered = filtered.filter((t) => new Date(t.date) <= e);
    }
    if (category) {
      filtered = filtered.filter((t) => t.category === category);
    }
    if (kindF) {
      filtered = filtered.filter((t) => t.kind === kindF);
    }
    if (account) {
      filtered = filtered.filter((t) => t.account === account);
    }
    setFilteredTransactions(filtered);
  }

  useEffect(() => {
    loadRefs();
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFilterCategory(searchParams.get("category") ? Number(searchParams.get("category")) : "");
    setFilterKind((searchParams.get("kind") as TransactionKind) || "");
    setFilterAccount(searchParams.get("account") ? Number(searchParams.get("account")) : "");
    const hasFilters = !!searchParams.get("account") || !!searchParams.get("category") || !!searchParams.get("kind");
    if (hasFilters) setShowFilters(true);
    applyFilters(
      transactions, 
      range.startDate, 
      range.endDate, 
      searchParams.get("category") ? Number(searchParams.get("category")) : "", 
      (searchParams.get("kind") as TransactionKind) || "", 
      searchParams.get("account") ? Number(searchParams.get("account")) : ""
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Re-apply filters when filter state changes
  useEffect(() => {
    applyFilters(transactions, range.startDate, range.endDate, filterCategory, filterKind, filterAccount);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategory, filterKind, filterAccount]);

  useEffect(() => {
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, range.startDate, range.endDate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!accountId || !amount) return;

    try {
      setSaving(true);
      setError(null);

      await createTransaction({
        account: accountId as number,
        date,
        amount: Number(amount),
        kind,
        category: categoryId ? (categoryId as number) : null,
        description,
        tags,
        savings_goal: savingsGoalId ? (savingsGoalId as number) : null,
      });

      setAmount("");
      setDescription("");
      setTags("");
      setSavingsGoalId("");
      setShowAddForm(false);

      await loadTransactions();
      try {
        const { fetchAggregatedTransactions } = await import('../api/finance');
        const res = await fetchAggregatedTransactions({ start: range.startDate, end: range.endDate });
        setAggregatedSeries(res.series || []);
      } catch (err) {}
      window.dispatchEvent(new Event('transactionsUpdated'));
    } catch (err) {
      console.error(err);
      setError("Failed to create transaction");
    } finally {
      setSaving(false);
    }
  }

  const filteredCategories = categories.filter(
    (c) => c.kind === kind || c.kind === "EXPENSE" || c.kind === "INCOME"
  );

  // Calculate totals from filtered transactions
  const totalIncome = filteredTransactions
    .filter(tx => tx.kind === 'INCOME')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
  const totalExpenses = filteredTransactions
    .filter(tx => tx.kind === 'EXPENSE')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
  const netCashflow = totalIncome - totalExpenses;

  async function handleDelete(id: number) {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      setDeletingId(id);
      await deleteTransaction(id);
      await loadTransactions();
      window.dispatchEvent(new Event('transactionsUpdated'));
    } catch (err) {
      console.error(err);
      setError('Failed to delete transaction');
    } finally {
      setDeletingId(null);
    }
  }

  function startEdit(tx: Transaction) {
    setEditingTx(tx);
    setAccountId(tx.account);
    setKind(tx.kind);
    setCategoryId(tx.category || "");
    setDate(tx.date);
    setAmount(tx.amount);
    setDescription(tx.description);
    setTags(tx.tags || "");
    setSavingsGoalId(tx.savings_goal || "");
    setShowAddForm(true);
  }

  async function handleUpdate(e: FormEvent) {
    e.preventDefault();
    if (!editingTx || !accountId || !amount) return;
    
    try {
      setSaving(true);
      setError(null);
      
      await updateTransaction(editingTx.id, {
        account: accountId as number,
        date,
        amount: Number(amount),
        kind,
        category: categoryId ? (categoryId as number) : null,
        description,
        tags,
        savings_goal: savingsGoalId ? (savingsGoalId as number) : null,
      });
      
      // Reset form
      setAmount("");
      setDescription("");
      setTags("");
      setSavingsGoalId("");
      setEditingTx(null);
      setShowAddForm(false);
      
      await loadTransactions();
      window.dispatchEvent(new Event('transactionsUpdated'));
    } catch (err) {
      console.error(err);
      setError("Failed to update transaction");
    } finally {
      setSaving(false);
    }
  }

  function cancelEdit() {
    setEditingTx(null);
    setAmount("");
    setDescription("");
    setTags("");
    setSavingsGoalId("");
    setCategoryId("");
    setShowAddForm(false);
  }

  const hasActiveFilters = filterCategory || filterKind || filterAccount;

  // Helper to format date range nicely
  const formatDateRange = (start: string, end: string) => {
    const startD = new Date(start);
    const endD = new Date(end);
    const sameYear = startD.getFullYear() === endD.getFullYear();
    const sameMonth = sameYear && startD.getMonth() === endD.getMonth();
    
    if (sameMonth) {
      return `${startD.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${endD.getDate()}, ${endD.getFullYear()}`;
    }
    if (sameYear) {
      return `${startD.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endD.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${endD.getFullYear()}`;
    }
    return `${startD.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${endD.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="space-y-4 pb-20 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-2">
            <HiCash className="text-blue-600" />
            Transactions
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {formatDateRange(range.startDate, range.endDate)}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary inline-flex items-center gap-2 ${hasActiveFilters ? 'ring-2 ring-blue-500' : ''}`}
          >
            <HiFilter size={18} />
            <span className="hidden sm:inline">Filter</span>
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-blue-500" />}
          </button>
          <button
            onClick={() => {
              setEditingTx(null);
              setAmount("");
              setDescription("");
              setTags("");
              setSavingsGoalId("");
              setCategoryId("");
              setShowAddForm(!showAddForm);
            }}
            className="btn-primary inline-flex items-center gap-2"
          >
            <HiPlus size={18} />
            <span>Add</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm p-3">
          {error}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-3 text-center">
          <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Income</div>
          <div className="text-lg font-bold text-green-600">{formatMoney(totalIncome)}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Expenses</div>
          <div className="text-lg font-bold text-red-600">{formatMoney(totalExpenses)}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Net</div>
          <div className={`text-lg font-bold ${netCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {netCashflow >= 0 ? '+' : ''}{formatMoney(netCashflow)}
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="card p-4 animate-slide-in">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm">Filters</h4>
            {hasActiveFilters && (
              <button 
                onClick={() => {
                  setFilterCategory("");
                  setFilterKind("");
                  setFilterAccount("");
                }}
                className="text-xs text-blue-600 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Account</label>
              <select
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                value={filterAccount}
                onChange={(e) => setFilterAccount(e.target.value ? Number(e.target.value) : "")}
              >
                <option value="">All accounts</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Type</label>
              <select
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                value={filterKind}
                onChange={(e) => setFilterKind(e.target.value as TransactionKind | "")}
              >
                <option value="">All types</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
                <option value="TRANSFER">Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Category</label>
              <select
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value ? Number(e.target.value) : "")}
              >
                <option value="">All categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Cashflow Chart - Collapsible on mobile */}
      <details className="card group" open>
        <summary className="flex items-center justify-between cursor-pointer list-none">
          <h4 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide">
            Cashflow Chart
          </h4>
          <HiChevronDown size={20} className="text-[var(--text-muted)] group-open:rotate-180 transition-transform" />
        </summary>
        <div className="mt-3" style={{ width: '100%', height: 100 }}>
          <ResponsiveContainer width='100%' height={100}>
            <AreaChart data={aggregatedSeries}>
              <XAxis dataKey='date' hide />
              <Tooltip formatter={(v:any) => formatMoney(v)} />
              <Area type='monotone' dataKey='income' stroke='#16A34A' fill='#16A34A' fillOpacity={0.2} />
              <Area type='monotone' dataKey='expenses' stroke='#DC2626' fill='#DC2626' fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </details>

      {/* Quick Actions - More compact */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => {
            setShowImportModal(true);
            setImportResult(null);
          }}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <HiUpload size={16} className="text-green-600" />
          <span>Import Statement</span>
        </button>
        <button
          onClick={async () => {
            try {
              setExporting(true);
              const blob = await exportTransactionsCsv({ start: range.startDate, end: range.endDate });
              const url = window.URL.createObjectURL(new Blob([blob]));
              const a = document.createElement("a");
              a.href = url;
              a.download = "transactions.csv";
              document.body.appendChild(a);
              a.click();
              a.remove();
              window.URL.revokeObjectURL(url);
            } catch (err: any) {
              setError(err?.message || "Failed to export CSV");
            } finally {
              setExporting(false);
            }
          }}
          disabled={exporting}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <HiDownload size={16} className="text-orange-600" />
          <span>{exporting ? "Exporting..." : "Export CSV"}</span>
        </button>
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <span>Manage Categories</span>
        </Link>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
      />

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="card w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Import Statement</h3>
              <button onClick={() => setShowImportModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                <HiX size={24} />
              </button>
            </div>

            {/* Import Type Selection */}
            <div className="flex gap-2">
              <button
                onClick={() => setImportType("mpesa")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  importType === "mpesa" 
                    ? "bg-green-600 text-white" 
                    : "bg-gray-100 dark:bg-gray-700 text-[var(--text-muted)]"
                }`}
              >
                📱 M-Pesa
              </button>
              <button
                onClick={() => setImportType("bank")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  importType === "bank" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 dark:bg-gray-700 text-[var(--text-muted)]"
                }`}
              >
                🏦 Bank CSV
              </button>
              <button
                onClick={() => setImportType("simple")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  importType === "simple" 
                    ? "bg-purple-600 text-white" 
                    : "bg-gray-100 dark:bg-gray-700 text-[var(--text-muted)]"
                }`}
              >
                📄 Simple CSV
              </button>
            </div>

            {/* Account Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Target Account *</label>
              <select
                value={importAccountId}
                onChange={(e) => setImportAccountId(e.target.value ? Number(e.target.value) : "")}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                required
              >
                <option value="">Select account...</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>{acc.name} ({acc.account_type})</option>
                ))}
              </select>
            </div>

            {/* M-Pesa Info */}
            {importType === "mpesa" && (
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-sm">
                <p className="font-medium text-green-800 dark:text-green-300 mb-2">📱 M-Pesa Statement Import</p>
                <ul className="text-green-700 dark:text-green-400 text-xs space-y-1">
                  <li>• Download your M-Pesa statement from Safaricom app</li>
                  <li>• Supports standard M-Pesa CSV format</li>
                  <li>• Auto-detects: Receipt No., Date, Paid In, Withdrawn</li>
                  <li>• Duplicate transactions are automatically skipped</li>
                </ul>
              </div>
            )}

            {/* Bank CSV Options */}
            {importType === "bank" && (
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm">
                  <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">🏦 Bank Statement Import</p>
                  <p className="text-blue-700 dark:text-blue-400 text-xs">Configure column names to match your bank's CSV format</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Date Column *</label>
                    <input
                      type="text"
                      value={bankDateColumn}
                      onChange={(e) => setBankDateColumn(e.target.value)}
                      placeholder="e.g., Date, Transaction Date"
                      className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Date Format</label>
                    <select
                      value={bankDateFormat}
                      onChange={(e) => setBankDateFormat(e.target.value)}
                      className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-800"
                    >
                      <option value="%Y-%m-%d">YYYY-MM-DD</option>
                      <option value="%d/%m/%Y">DD/MM/YYYY</option>
                      <option value="%m/%d/%Y">MM/DD/YYYY</option>
                      <option value="%d-%m-%Y">DD-MM-YYYY</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Amount Column (if single column)</label>
                  <input
                    type="text"
                    value={bankAmountColumn}
                    onChange={(e) => setBankAmountColumn(e.target.value)}
                    placeholder="e.g., Amount (negative = expense)"
                    className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-800"
                  />
                </div>
                <p className="text-xs text-[var(--text-muted)]">OR use separate debit/credit columns:</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Debit Column</label>
                    <input
                      type="text"
                      value={bankDebitColumn}
                      onChange={(e) => setBankDebitColumn(e.target.value)}
                      placeholder="e.g., Debit, Withdrawal"
                      className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Credit Column</label>
                    <input
                      type="text"
                      value={bankCreditColumn}
                      onChange={(e) => setBankCreditColumn(e.target.value)}
                      placeholder="e.g., Credit, Deposit"
                      className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Description Column</label>
                  <input
                    type="text"
                    value={bankDescColumn}
                    onChange={(e) => setBankDescColumn(e.target.value)}
                    placeholder="e.g., Description, Narrative"
                    className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>
            )}

            {/* Simple CSV Info */}
            {importType === "simple" && (
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-sm">
                <p className="font-medium text-purple-800 dark:text-purple-300 mb-2">📄 Simple CSV Format</p>
                <p className="text-purple-700 dark:text-purple-400 text-xs mb-2">
                  Your CSV should have these columns:
                </p>
                <code className="block bg-purple-100 dark:bg-purple-800/30 px-2 py-1 rounded text-xs">
                  account,date,amount,kind,description
                </code>
                <p className="text-purple-600 dark:text-purple-400 text-xs mt-2">
                  • account = account ID number<br/>
                  • kind = INCOME, EXPENSE, or TRANSFER
                </p>
              </div>
            )}

            {/* File Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Select File *</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
              />
            </div>

            {/* Import Result */}
            {importResult && (
              <div className={`p-3 rounded-lg text-sm ${
                importResult.error 
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' 
                  : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              }`}>
                {importResult.error && <p>❌ Error: {String(importResult.error)}</p>}
                {importResult.success && (
                  <div>
                    <p>✅ Import Complete!</p>
                    <ul className="text-xs mt-1 space-y-0.5">
                      <li>• {importResult.success.created} transactions created</li>
                      {importResult.success.skipped > 0 && <li>• {importResult.success.skipped} rows skipped</li>}
                      {importResult.success.total_errors > 0 && (
                        <li className="text-amber-600 dark:text-amber-400">
                          • {importResult.success.total_errors} errors
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const file = fileInputRef.current?.files?.[0];
                  if (!file) {
                    setImportResult({ error: "Please select a file" });
                    return;
                  }
                  if (!importAccountId && importType !== "simple") {
                    setImportResult({ error: "Please select an account" });
                    return;
                  }
                  
                  try {
                    setImporting(true);
                    setImportResult(null);
                    let res;
                    
                    if (importType === "mpesa") {
                      res = await importMpesaStatement(file, importAccountId as number);
                    } else if (importType === "bank") {
                      res = await importBankStatement(file, {
                        accountId: importAccountId as number,
                        dateColumn: bankDateColumn,
                        amountColumn: bankAmountColumn || undefined,
                        debitColumn: bankDebitColumn || undefined,
                        creditColumn: bankCreditColumn || undefined,
                        descriptionColumn: bankDescColumn || undefined,
                        dateFormat: bankDateFormat,
                      });
                    } else {
                      res = await importTransactionsCsv(file);
                    }
                    
                    setImportResult({ success: res });
                    await loadTransactions();
                  } catch (err: any) {
                    setImportResult({ error: err?.response?.data?.detail || err?.message || String(err) });
                  } finally {
                    setImporting(false);
                  }
                }}
                disabled={importing}
                className="flex-1 btn-primary"
              >
                {importing ? "Importing..." : "Import"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Transaction Form */}
      {showAddForm && (
        <form onSubmit={editingTx ? handleUpdate : handleSubmit} className="card p-4 space-y-4 animate-slide-in">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{editingTx ? 'Edit Transaction' : 'Add Transaction'}</h4>
            <button type="button" onClick={cancelEdit} className="text-[var(--text-muted)] hover:text-[var(--text)]">
              <HiX size={20} />
            </button>
          </div>

          {loadingRefs && (
            <div className="text-sm text-[var(--text-muted)]">Loading...</div>
          )}

          {!loadingRefs && accounts.length === 0 && (
            <div className="text-center py-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <p className="text-sm text-amber-700 dark:text-amber-400 mb-2">You need to create an account first</p>
              <Link to="/accounts" className="btn-primary text-sm">
                Go to Accounts
              </Link>
            </div>
          )}

          {accounts.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Date *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                required
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Amount *</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Type *</label>
              <select
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                value={kind}
                onChange={(e) => setKind(e.target.value as TransactionKind)}
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
                <option value="TRANSFER">Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Account *</label>
              <select
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value ? Number(e.target.value) : "")}
                required
              >
                <option value="">Select...</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Category</label>
              <select
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
              >
                <option value="">None</option>
                {filteredCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Savings Goal</label>
              <select
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                value={savingsGoalId}
                onChange={(e) => setSavingsGoalId(e.target.value ? Number(e.target.value) : "")}
              >
                <option value="">None</option>
                {savingsGoals.map((goal) => (
                  <option key={goal.id} value={goal.id}>{goal.emoji} {goal.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Lunch, rent, salary..."
              className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Tags</label>
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {allTags.map((tag) => {
                  const isSelected = tags.split(",").map(t => t.trim()).includes(tag.name);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        const currentTags = tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [];
                        if (isSelected) {
                          setTags(currentTags.filter(t => t !== tag.name).join(", "));
                        } else {
                          setTags([...currentTags, tag.name].join(", "));
                        }
                      }}
                      className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${isSelected ? 'ring-2 ring-offset-1' : 'opacity-60 hover:opacity-100'}`}
                      style={{
                        backgroundColor: tag.color + "20",
                        color: tag.color,
                        borderColor: tag.color,
                      }}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            )}
            <input
              className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Or type comma,separated,tags"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={saving || accounts.length === 0}
              className="btn-primary flex-1 disabled:opacity-60"
            >
              {saving ? "Saving..." : editingTx ? "Update" : "Save"}
            </button>
            <button type="button" onClick={cancelEdit} className="btn-secondary">
              Cancel
            </button>
          </div>
            </>
          )}
        </form>
      )}

      {/* Transactions List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">
            Transactions
            {hasActiveFilters && <span className="text-sm font-normal text-[var(--text-muted)] ml-2">(filtered)</span>}
          </h4>
          <div className="text-sm text-[var(--text-muted)]">
            {filteredTransactions.length} {filteredTransactions.length === 1 ? 'item' : 'items'}
            {totalCount !== null && totalCount > pageLimit && (
              <span className="ml-1">of {totalCount}</span>
            )}
          </div>
        </div>

        {loading && <div className="skeleton h-32 rounded" />}

        {!loading && filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-[var(--text-muted)]">
            <p className="mb-1">No transactions found</p>
            <p className="text-sm">{hasActiveFilters ? 'Try adjusting your filters' : 'Click "Add" to create one'}</p>
          </div>
        )}

        {/* Mobile cards */}
        <div className="block md:hidden space-y-2">
          {filteredTransactions.map((tx) => {
            const txTags = tx.tags ? tx.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
            const tagColors = Object.fromEntries(allTags.map(t => [t.name, t.color]));
            
            return (
              <div key={tx.id} className="p-3 bg-[var(--surface)] rounded-lg">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{tx.description || tx.category_name || "Transaction"}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">
                      {tx.date} • {tx.account_name}
                      {tx.savings_goal_name && <span> • {tx.savings_goal_emoji} {tx.savings_goal_name}</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`font-semibold ${tx.kind === 'INCOME' ? 'text-green-600' : tx.kind === 'EXPENSE' ? 'text-red-600' : 'text-gray-600'}`}>
                      {tx.kind === 'INCOME' ? '+' : tx.kind === 'EXPENSE' ? '-' : ''}{formatMoney(tx.amount)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex flex-wrap gap-1">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      tx.kind === 'INCOME' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                      tx.kind === 'EXPENSE' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {tx.kind}
                    </span>
                    {tx.category_name && (
                      <span className="inline-block px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        {tx.category_name}
                      </span>
                    )}
                    {txTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: (tagColors[tag] || "#3B82F6") + "20",
                          color: tagColors[tag] || "#3B82F6",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(tx)}
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-[var(--text-muted)]"
                    >
                      <HiPencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(tx.id)}
                      disabled={deletingId === tx.id}
                      className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 disabled:opacity-50"
                    >
                      <HiTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop table */}
        {filteredTransactions.length > 0 && (
          <div className="hidden md:block overflow-x-auto -mx-4 sm:-mx-6">
            <table className="min-w-full text-sm">
              <thead className="bg-[var(--surface)] sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-[var(--text-muted)]">Date</th>
                  <th className="px-4 py-2 text-left font-medium text-[var(--text-muted)]">Description</th>
                  <th className="px-4 py-2 text-left font-medium text-[var(--text-muted)]">Account</th>
                  <th className="px-4 py-2 text-left font-medium text-[var(--text-muted)]">Category</th>
                  <th className="px-4 py-2 text-right font-medium text-[var(--text-muted)]">Amount</th>
                  <th className="px-4 py-2 text-left font-medium text-[var(--text-muted)]">Tags</th>
                  <th className="px-4 py-2 text-right font-medium text-[var(--text-muted)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filteredTransactions.map((tx) => {
                  const txTags = tx.tags ? tx.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
                  const tagColors = Object.fromEntries(allTags.map(t => [t.name, t.color]));
                  
                  return (
                    <tr key={tx.id} className="hover:bg-[var(--surface)] transition-colors">
                      <td className="px-4 py-2.5 whitespace-nowrap">{tx.date}</td>
                      <td className="px-4 py-2.5">
                        <div className="font-medium">{tx.description || "—"}</div>
                        {tx.savings_goal_name && (
                          <div className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                            {tx.savings_goal_emoji} {tx.savings_goal_name}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2.5">{tx.account_name}</td>
                      <td className="px-4 py-2.5">
                        {tx.category_name || <span className="text-[var(--text-muted)]">—</span>}
                      </td>
                      <td className="px-4 py-2.5 text-right whitespace-nowrap">
                        <span className={`font-semibold ${
                          tx.kind === 'INCOME' ? 'text-green-600' : 
                          tx.kind === 'EXPENSE' ? 'text-red-600' : 
                          'text-gray-600'
                        }`}>
                          {tx.kind === 'INCOME' ? '+' : tx.kind === 'EXPENSE' ? '-' : ''}
                          {formatMoney(tx.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        {txTags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {txTags.slice(0, 2).map((tag, idx) => (
                              <span
                                key={idx}
                                className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                                style={{
                                  backgroundColor: (tagColors[tag] || "#3B82F6") + "20",
                                  color: tagColors[tag] || "#3B82F6",
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                            {txTags.length > 2 && (
                              <span className="text-xs text-[var(--text-muted)]">+{txTags.length - 2}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[var(--text-muted)]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => startEdit(tx)}
                            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-[var(--text-muted)]"
                            title="Edit"
                          >
                            <HiPencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(tx.id)}
                            disabled={deletingId === tx.id}
                            className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 disabled:opacity-50"
                            title="Delete"
                          >
                            <HiTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalCount !== null && totalCount > pageLimit && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <button 
              className="btn-secondary text-sm" 
              onClick={() => setOffset(Math.max(0, offset - pageLimit))} 
              disabled={offset === 0}
            >
              Previous
            </button>
            <div className="text-sm text-[var(--text-muted)]">
              Page {Math.floor(offset / pageLimit) + 1} of {Math.ceil(totalCount / pageLimit)}
            </div>
            <button 
              className="btn-secondary text-sm" 
              onClick={() => setOffset(offset + pageLimit)} 
              disabled={offset + pageLimit >= totalCount}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
