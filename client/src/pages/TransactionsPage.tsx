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
  previewStatementPdf,
  confirmStatementPdfImport,
  exportTransactionsCsv,
} from "../api/finance";
import { fetchLiabilities } from "../api/wealth";
import { getSavingsGoals, type SavingsGoal } from "../api/savings";
import { getInvestments, type Investment as InvestmentItem } from "../api/investments";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { HiPlus, HiUpload, HiDownload, HiX, HiPencil, HiTrash, HiFilter, HiChevronDown, HiDocumentText } from "react-icons/hi";
import type {
  Transaction,
  Account,
  Category,
  Tag,
  TransactionKind,
  Liability,
  InvestmentAction,
} from "../api/types";

interface ImportResult {
  success?: { imported: number; skipped: number };
  error?: string;
}

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
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [investments, setInvestments] = useState<InvestmentItem[]>([]);

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
  const [fee, setFee] = useState<string>("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [savingsGoalId, setSavingsGoalId] = useState<number | "">("");
  const [transferAccountId, setTransferAccountId] = useState<number | "">("");
  const [liabilityId, setLiabilityId] = useState<number | "">("");
  const [investmentId, setInvestmentId] = useState<number | "">("");
  const [investmentAction, setInvestmentAction] = useState<InvestmentAction | "">("");
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<{
    statement_type: string;
    transactions: {
      date: string;
      amount: string;
      kind: "INCOME" | "EXPENSE";
      description: string;
      balance?: string | null;
    }[];
    summary: { total: number; income: number; expense: number };
  } | null>(null);
  const [pdfAccountId, setPdfAccountId] = useState<number | "">("");
  const [pdfOpeningBalance, setPdfOpeningBalance] = useState("");
  const [pdfAllowDuplicates, setPdfAllowDuplicates] = useState(false);
  const [pdfParsing, setPdfParsing] = useState(false);
  const [pdfImporting, setPdfImporting] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
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
      const [accs, cats, existingTags, goals, debtItems, investmentItems] = await Promise.all([
        fetchAccounts(),
        fetchCategories(),
        fetchTags(),
        getSavingsGoals(),
        fetchLiabilities(),
        getInvestments(),
      ]);
      setAccounts(accs);
      setAllTags(existingTags);
      setCategories(cats);
      setSavingsGoals(goals);
      setLiabilities(debtItems);
      setInvestments(investmentItems);
      
      if (accs.length > 0 && accountId === "") {
        setAccountId(accs[0].id);
      }
      if (accs.length > 0 && pdfAccountId === "") {
        setPdfAccountId(accs[0].id);
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
    if (kind === "TRANSFER" && !transferAccountId) {
      setError("Select a transfer destination account.");
      return;
    }
    if (kind !== "TRANSFER" && investmentId && !investmentAction) {
      setError("Select an investment action.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await createTransaction({
        account: accountId as number,
        date,
        amount: Number(amount),
        fee: fee ? Number(fee) : 0,
        kind,
        transfer_account: kind === "TRANSFER" && transferAccountId ? (transferAccountId as number) : null,
        investment: kind !== "TRANSFER" && investmentId ? (investmentId as number) : null,
        investment_action: kind !== "TRANSFER" && investmentId && investmentAction ? investmentAction : null,
        category: categoryId ? (categoryId as number) : null,
        description,
        tags,
        savings_goal: kind !== "TRANSFER" && savingsGoalId ? (savingsGoalId as number) : null,
        liability: kind === "EXPENSE" && liabilityId ? (liabilityId as number) : null,
      });

      setAmount("");
      setFee("");
      setDescription("");
      setTags("");
      setSavingsGoalId("");
      setTransferAccountId("");
      setLiabilityId("");
      setInvestmentId("");
      setInvestmentAction("");
      setShowAddForm(false);

      await loadTransactions();
      try {
        const { fetchAggregatedTransactions } = await import('../api/finance');
        const res = await fetchAggregatedTransactions({ start: range.startDate, end: range.endDate });
        setAggregatedSeries(res.series || []);
      } catch {
        // Silently ignore aggregation errors - non-critical
      }
      window.dispatchEvent(new Event('transactionsUpdated'));
    } catch (err) {
      console.error(err);
      setError("Failed to create transaction");
    } finally {
      setSaving(false);
    }
  }

  function resetPdfImportState() {
    setPdfFile(null);
    setPdfPreview(null);
    setPdfOpeningBalance("");
    setPdfAllowDuplicates(false);
    setPdfError(null);
  }

  async function handlePdfPreview() {
    if (!pdfFile) {
      setPdfError("Please select a PDF file first.");
      return;
    }
    try {
      setPdfParsing(true);
      setPdfError(null);
      const res = await previewStatementPdf(pdfFile, {
        opening_balance: pdfOpeningBalance || undefined,
      });
      setPdfPreview(res);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setPdfError(message);
    } finally {
      setPdfParsing(false);
    }
  }

  async function handlePdfConfirm() {
    if (!pdfPreview || !pdfAccountId) {
      setPdfError("Select an account and parse the PDF first.");
      return;
    }
    try {
      setPdfImporting(true);
      setPdfError(null);
      const res = await confirmStatementPdfImport({
        account: pdfAccountId as number,
        transactions: pdfPreview.transactions,
        allow_duplicates: pdfAllowDuplicates,
        statement_type: pdfPreview.statement_type,
        statement_name: pdfFile?.name,
      });
      setImportResult({ success: { imported: res.imported, skipped: res.skipped } });
      await loadTransactions();
      setShowPdfModal(false);
      resetPdfImportState();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setPdfError(message);
    } finally {
      setPdfImporting(false);
    }
  }

  const filteredCategories = categories.filter((c) => {
    if (kind === "TRANSFER") {
      return c.kind === "TRANSFER";
    }
    return c.kind === kind || c.kind === "EXPENSE" || c.kind === "INCOME";
  });

  // Calculate totals from filtered transactions
  const totalIncome = filteredTransactions
    .filter(tx => tx.kind === 'INCOME')
    .reduce((sum, tx) => sum + Number(tx.amount) - Number(tx.fee || 0), 0);
  const totalExpenses = filteredTransactions
    .filter(tx => tx.kind === 'EXPENSE')
    .reduce((sum, tx) => sum + Number(tx.amount) + Number(tx.fee || 0), 0);
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
    let editTx = tx;
    let fromAccount = tx.account;
    let toAccount: number | "" = tx.transfer_account ?? "";
    if (tx.kind === "TRANSFER" && tx.transfer_direction === "IN" && tx.transfer_group) {
      const outbound = transactions.find(
        (t) => t.transfer_group === tx.transfer_group && t.transfer_direction === "OUT"
      );
      if (outbound) {
        editTx = outbound;
        fromAccount = outbound.account;
        toAccount = outbound.transfer_account ?? "";
      } else if (tx.transfer_account) {
        fromAccount = tx.transfer_account;
        toAccount = tx.account;
      }
    }

    setEditingTx(editTx);
    setAccountId(fromAccount);
    setKind(editTx.kind);
    setCategoryId(editTx.category || "");
    setDate(editTx.date);
    setAmount(editTx.amount);
    setFee(Number(editTx.fee) ? String(editTx.fee) : "");
    setDescription(editTx.description);
    setTags(editTx.tags || "");
    setSavingsGoalId(editTx.savings_goal || "");
    setTransferAccountId(toAccount);
    setLiabilityId(editTx.liability || "");
    setInvestmentId(editTx.investment || "");
    if (editTx.investment) {
      setInvestmentAction(
        editTx.investment_action || (editTx.kind === "INCOME" ? "SELL" : "BUY")
      );
    } else {
      setInvestmentAction("");
    }
    setShowAddForm(true);
  }

  async function handleUpdate(e: FormEvent) {
    e.preventDefault();
    if (!editingTx || !accountId || !amount) return;
    if (kind === "TRANSFER" && !transferAccountId) {
      setError("Select a transfer destination account.");
      return;
    }
    if (kind !== "TRANSFER" && investmentId && !investmentAction) {
      setError("Select an investment action.");
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      await updateTransaction(editingTx.id, {
        account: accountId as number,
        date,
        amount: Number(amount),
        fee: fee ? Number(fee) : 0,
        kind,
        transfer_account: kind === "TRANSFER" && transferAccountId ? (transferAccountId as number) : null,
        investment: kind !== "TRANSFER" && investmentId ? (investmentId as number) : null,
        investment_action: kind !== "TRANSFER" && investmentId && investmentAction ? investmentAction : null,
        category: categoryId ? (categoryId as number) : null,
        description,
        tags,
        savings_goal: kind !== "TRANSFER" && savingsGoalId ? (savingsGoalId as number) : null,
        liability: kind === "EXPENSE" && liabilityId ? (liabilityId as number) : null,
      });
      
      // Reset form
      setAmount("");
      setFee("");
      setDescription("");
      setTags("");
      setSavingsGoalId("");
      setTransferAccountId("");
      setLiabilityId("");
      setInvestmentId("");
      setInvestmentAction("");
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
    setFee("");
    setDescription("");
    setTags("");
    setSavingsGoalId("");
    setCategoryId("");
    setTransferAccountId("");
    setLiabilityId("");
    setInvestmentId("");
    setInvestmentAction("");
    setShowAddForm(false);
  }

  const hasActiveFilters = filterCategory || filterKind || filterAccount;

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Transactions
          </h3>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            {range.startDate} → {range.endDate}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary inline-flex w-full sm:w-auto items-center gap-2 ${hasActiveFilters ? 'ring-2 ring-blue-500' : ''}`}
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
            className="btn-primary inline-flex w-full sm:w-auto items-center gap-2"
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              <Tooltip formatter={(v: number) => formatMoney(v)} />
              <Area type='monotone' dataKey='income' stroke='#16A34A' fill='#16A34A' fillOpacity={0.2} />
              <Area type='monotone' dataKey='expenses' stroke='#DC2626' fill='#DC2626' fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </details>

      {/* Quick Actions - More compact */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <HiUpload size={16} className="text-green-600" />
          <span>Import CSV</span>
        </button>
        <button
          onClick={() => {
            setShowPdfModal(true);
            setPdfError(null);
          }}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <HiDocumentText size={16} className="text-blue-600" />
          <span>Import PDF</span>
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
            } catch (err) {
              const message = err instanceof Error ? err.message : "Failed to export CSV";
              setError(message);
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
        accept="text/csv"
        className="hidden"
        onChange={async () => {
          const f = fileInputRef.current?.files?.[0];
          if (!f) {
            setImportResult({ error: "Please select a CSV file first." });
            return;
          }
          try {
            setImportResult(null);
            const res = await importTransactionsCsv(f);
            setImportResult({ success: res });
            await loadTransactions();
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setImportResult({ error: message });
          }
        }}
      />

      {importResult && (
        <div className={`card text-sm p-4 ${importResult.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {importResult.error && `Error: ${String(importResult.error)}`}
          {importResult.success && `Successfully imported ${importResult.success.imported} transactions (${importResult.success.skipped} skipped)`}
        </div>
      )}

      {showPdfModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowPdfModal(false);
            resetPdfImportState();
          }}
        >
          <div
            className="card w-full max-w-4xl p-4 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Import Statement (PDF)</h4>
              <button
                onClick={() => {
                  setShowPdfModal(false);
                  resetPdfImportState();
                }}
                className="text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <HiX size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">PDF file</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const nextFile = e.target.files?.[0] || null;
                    setPdfFile(nextFile);
                    setPdfPreview(null);
                    setPdfError(null);
                  }}
                  className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Account</label>
                <select
                  className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                  value={pdfAccountId}
                  onChange={(e) => setPdfAccountId(e.target.value ? Number(e.target.value) : "")}
                >
                  <option value="">Select account</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Opening balance (optional)</label>
                <input
                  type="number"
                  step="0.01"
                  value={pdfOpeningBalance}
                  onChange={(e) => setPdfOpeningBalance(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handlePdfPreview}
                disabled={pdfParsing || !pdfFile}
                className="btn-secondary text-sm disabled:opacity-50"
              >
                {pdfParsing ? "Parsing..." : "Parse PDF"}
              </button>
              <label className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <input
                  type="checkbox"
                  checked={pdfAllowDuplicates}
                  onChange={(e) => setPdfAllowDuplicates(e.target.checked)}
                />
                Allow duplicates
              </label>
              {pdfPreview && (
                <div className="text-sm text-[var(--text-muted)]">
                  {pdfPreview.statement_type.toUpperCase()} • {pdfPreview.summary.total} rows
                </div>
              )}
            </div>

            {pdfError && (
              <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                {pdfError}
              </div>
            )}

            {pdfPreview && (
              <div className="space-y-3">
                <div className="text-sm text-[var(--text-muted)]">
                  Income: {pdfPreview.summary.income} • Expenses: {pdfPreview.summary.expense}
                </div>
                <div className="border border-[var(--glass-border)] rounded-lg overflow-hidden">
                  <div className="max-h-[50vh] overflow-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-[var(--surface-hover)] text-left">
                        <tr>
                          <th className="px-3 py-2">Date</th>
                          <th className="px-3 py-2">Description</th>
                          <th className="px-3 py-2 text-right">Amount</th>
                          <th className="px-3 py-2">Kind</th>
                          <th className="px-3 py-2 text-right">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pdfPreview.transactions.map((row, idx) => (
                          <tr key={`${row.date}-${idx}`} className="border-t border-[var(--glass-border)]">
                            <td className="px-3 py-2">{row.date}</td>
                            <td className="px-3 py-2">{row.description}</td>
                            <td className="px-3 py-2 text-right">
                              {row.kind === "EXPENSE" ? "-" : ""}{formatMoney(row.amount)}
                            </td>
                            <td className="px-3 py-2">{row.kind}</td>
                            <td className="px-3 py-2 text-right">{row.balance ? formatMoney(row.balance) : "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowPdfModal(false);
                      resetPdfImportState();
                    }}
                    className="btn-secondary text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePdfConfirm}
                    disabled={pdfImporting || !pdfAccountId}
                    className="btn-primary text-sm disabled:opacity-50"
                  >
                    {pdfImporting ? "Importing..." : "Confirm Import"}
                  </button>
                </div>
              </div>
            )}
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
                onChange={(e) => {
                  const nextKind = e.target.value as TransactionKind;
                  setKind(nextKind);
                  if (nextKind !== "TRANSFER") setTransferAccountId("");
                  if (nextKind !== "EXPENSE") setLiabilityId("");
                  if (nextKind === "TRANSFER") {
                    setInvestmentId("");
                    setInvestmentAction("");
                    setSavingsGoalId("");
                  } else if (investmentId && !investmentAction) {
                    setInvestmentAction(nextKind === "INCOME" ? "SELL" : "BUY");
                  }
                }}
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
                onChange={(e) => {
                  const nextAccount = e.target.value ? Number(e.target.value) : "";
                  setAccountId(nextAccount);
                  if (nextAccount && transferAccountId === nextAccount) {
                    setTransferAccountId("");
                  }
                }}
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
              <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Fee (optional)</label>
              <input
                type="number"
                step="0.01"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder="0.00"
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
              />
            </div>
          </div>

          {kind === "TRANSFER" && (
            <div>
              <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Transfer To *</label>
              <select
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                value={transferAccountId}
                onChange={(e) => setTransferAccountId(e.target.value ? Number(e.target.value) : "")}
                required
              >
                <option value="">Select...</option>
                {accounts
                  .filter((acc) => acc.id !== accountId)
                  .map((acc) => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
              </select>
              {accounts.length < 2 && (
                <div className="text-xs text-[var(--text-muted)] mt-1">
                  Add another account to complete transfers.
                </div>
              )}
            </div>
          )}

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
                disabled={kind === "TRANSFER"}
              >
                <option value="">None</option>
                {savingsGoals.map((goal) => (
                  <option key={goal.id} value={goal.id}>{goal.emoji} {goal.name}</option>
                ))}
              </select>
            </div>
          </div>

          {kind !== "TRANSFER" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Investment (optional)</label>
                <select
                  className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                  value={investmentId}
                  onChange={(e) => {
                    const nextInvestment = e.target.value ? Number(e.target.value) : "";
                    setInvestmentId(nextInvestment);
                    if (nextInvestment && !investmentAction) {
                      setInvestmentAction(kind === "INCOME" ? "SELL" : "BUY");
                    }
                    if (!nextInvestment) {
                      setInvestmentAction("");
                    }
                  }}
                >
                  <option value="">None</option>
                  {investments.map((inv) => (
                    <option key={inv.id} value={inv.id}>{inv.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Investment Action</label>
                <select
                  className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                  value={investmentAction}
                  onChange={(e) => setInvestmentAction(e.target.value as InvestmentAction | "")}
                  disabled={!investmentId}
                >
                  <option value="">Select...</option>
                  <option value="BUY">Buy / Contribution</option>
                  <option value="SELL">Sell / Withdrawal</option>
                  <option value="DIVIDEND">Dividend (cash)</option>
                  <option value="INTEREST">Interest (cash)</option>
                  <option value="FEE">Fee / Charge</option>
                </select>
              </div>
            </div>
          )}

          {kind === "EXPENSE" && (
            <div>
              <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Debt (optional)</label>
              <select
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                value={liabilityId}
                onChange={(e) => setLiabilityId(e.target.value ? Number(e.target.value) : "")}
              >
                <option value="">None</option>
                {liabilities.map((debt) => (
                  <option key={debt.id} value={debt.id}>{debt.name}</option>
                ))}
              </select>
            </div>
          )}

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
            const transferLabel = tx.kind === "TRANSFER" && tx.transfer_account_name
              ? `Transfer ${tx.transfer_direction === "IN" ? "from" : "to"} ${tx.transfer_account_name}`
              : "";
            const transferMeta = tx.description ? transferLabel : "";
            const debtLabel = tx.liability_name ? `Debt: ${tx.liability_name}` : "";
            const investmentLabel = tx.investment_name
              ? `Investment: ${tx.investment_name}${tx.investment_action ? ` (${tx.investment_action})` : ""}`
              : "";
            const feeLabel = Number(tx.fee) > 0 ? `Fee: ${formatMoney(tx.fee)}` : "";
            
            return (
              <div key={tx.id} className="p-3 bg-[var(--surface)] rounded-lg">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{tx.description || transferLabel || tx.category_name || "Transaction"}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">
                      {tx.date} • {tx.account_name}
                      {tx.savings_goal_name && <span> • {tx.savings_goal_emoji} {tx.savings_goal_name}</span>}
                      {transferMeta && <span> • {transferMeta}</span>}
                      {debtLabel && <span> • {debtLabel}</span>}
                      {investmentLabel && <span> • {investmentLabel}</span>}
                      {feeLabel && <span> • {feeLabel}</span>}
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
                  const transferLabel = tx.kind === "TRANSFER" && tx.transfer_account_name
                    ? `Transfer ${tx.transfer_direction === "IN" ? "from" : "to"} ${tx.transfer_account_name}`
                    : "";
                  const investmentLabel = tx.investment_name
                    ? `Investment: ${tx.investment_name}${tx.investment_action ? ` (${tx.investment_action})` : ""}`
                    : "";
                  const feeLabel = Number(tx.fee) > 0 ? `Fee: ${formatMoney(tx.fee)}` : "";
                  
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
                        {transferLabel && (
                          <div className="text-xs text-[var(--text-muted)] mt-0.5">
                            {transferLabel}
                          </div>
                        )}
                        {tx.liability_name && (
                          <div className="text-xs text-[var(--text-muted)] mt-0.5">
                            Debt: {tx.liability_name}
                          </div>
                        )}
                        {investmentLabel && (
                          <div className="text-xs text-[var(--text-muted)] mt-0.5">
                            {investmentLabel}
                          </div>
                        )}
                        {feeLabel && (
                          <div className="text-xs text-[var(--text-muted)] mt-0.5">
                            {feeLabel}
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
