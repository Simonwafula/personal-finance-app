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
  importTransactionsCsv,
  exportTransactionsCsv,
} from "../api/finance";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { HiPlus, HiUpload, HiDownload, HiX, HiCog } from "react-icons/hi";
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
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResult, setImportResult] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [searchParams] = useSearchParams();
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const { range } = useTimeRange();
  const [filterCategory, setFilterCategory] = useState<number | "">(searchParams.get("category") ? Number(searchParams.get("category")) : "");
  const [filterKind, setFilterKind] = useState<TransactionKind | "">((searchParams.get("kind") as TransactionKind) || "");
  const [showAddForm, setShowAddForm] = useState(false);

  async function loadRefs() {
    try {
      setLoadingRefs(true);
      const [accs, cats, existingTags] = await Promise.all([
        fetchAccounts(),
        fetchCategories(),
        fetchTags(),
      ]);
      setAccounts(accs);
      setAllTags(existingTags);
      setCategories(cats);
      
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
    kindF?: TransactionKind | ""
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
    applyFilters(transactions, range.startDate, range.endDate, searchParams.get("category") ? Number(searchParams.get("category")) : "", (searchParams.get("kind") as TransactionKind) || "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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
      });

      setAmount("");
      setDescription("");
      setTags("");
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

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Transactions
          </h3>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Track your income and expenses
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/categories"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <HiCog size={18} />
            <span className="hidden sm:inline">Manage Categories</span>
            <span className="sm:hidden">Categories</span>
          </Link>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <HiPlus size={18} />
            <span>Add</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="card bg-red-50 border-red-200 text-red-700 text-sm p-4">
          {error}
        </div>
      )}

      {/* Cashflow Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide">
            Cashflow Overview
          </h4>
          <div className="text-xs text-[var(--text-muted)]">
            {range.startDate} → {range.endDate}
          </div>
        </div>
        <div style={{ width: '100%', height: 120 }}>
          <ResponsiveContainer width='100%' height={120}>
            <AreaChart data={aggregatedSeries}>
              <XAxis dataKey='date' hide />
              <Tooltip formatter={(v:any) => formatMoney(v)} />
              <Area type='monotone' dataKey='income' stroke='#16A34A' fill='#16A34A' fillOpacity={0.2} />
              <Area type='monotone' dataKey='expenses' stroke='#DC2626' fill='#DC2626' fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button
          onClick={() => {
            const input = fileInputRef.current;
            if (input) input.click();
          }}
          className="card p-4 hover:shadow-lg transition-shadow text-left"
        >
          <HiUpload size={24} className="text-green-600 mb-2" />
          <div className="text-sm font-semibold">Import CSV</div>
          <div className="text-xs text-[var(--text-muted)]">Upload file</div>
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
          className="card p-4 hover:shadow-lg transition-shadow text-left disabled:opacity-50"
        >
          <HiDownload size={24} className="text-orange-600 mb-2" />
          <div className="text-sm font-semibold">Export CSV</div>
          <div className="text-xs text-[var(--text-muted)]">
            {exporting ? "Preparing..." : "Download"}
          </div>
        </button>

        <Link
          to="/categories"
          className="card p-4 hover:shadow-lg transition-shadow text-left col-span-2 sm:col-span-1"
        >
          <HiCog size={24} className="text-purple-600 mb-2" />
          <div className="text-sm font-semibold">Settings</div>
          <div className="text-xs text-[var(--text-muted)]">Categories & Tags</div>
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
          } catch (err: any) {
            setImportResult({ error: err?.message || String(err) });
          }
        }}
      />

      {importResult && (
        <div className={`card text-sm p-4 ${importResult.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {importResult.error && `Error: ${String(importResult.error)}`}
          {importResult.success && `Successfully imported ${importResult.success.created ?? 'transactions'}`}
        </div>
      )}

      {/* Add Transaction Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="card space-y-4 animate-slide-in">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">Add New Transaction</h4>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <HiX size={20} />
            </button>
          </div>

          {loadingRefs && (
            <div className="text-sm text-[var(--text-muted)]">Loading accounts…</div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date *</label>
              <input
                type="date"
                className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Account *</label>
              <select
                className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                value={accountId}
                onChange={(e) =>
                  setAccountId(e.target.value ? Number(e.target.value) : "")
                }
                required
              >
                <option value="">Select account</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type *</label>
              <select
                className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                value={kind}
                onChange={(e) => setKind(e.target.value as TransactionKind)}
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
                <option value="TRANSFER">Transfer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Amount *</label>
              <input
                type="number"
                step="0.01"
                className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                value={categoryId}
                onChange={(e) =>
                  setCategoryId(e.target.value ? Number(e.target.value) : "")
                }
              >
                <option value="">— None —</option>
                {filteredCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.kind})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">Description</label>
              <input
                className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Lunch at Java, rent, salary..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">Tags (optional)</label>
              {allTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {allTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        const currentTags = tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [];
                        if (currentTags.includes(tag.name)) {
                          setTags(currentTags.filter(t => t !== tag.name).join(", "));
                        } else {
                          setTags([...currentTags, tag.name].join(", "));
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        tags.split(",").map(t => t.trim()).includes(tag.name)
                          ? "ring-2 ring-offset-2 opacity-100"
                          : "opacity-60 hover:opacity-100"
                      }`}
                      style={{
                        backgroundColor: tag.color + "20",
                        color: tag.color,
                        borderColor: tag.color,
                      }}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              )}
              <input
                className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="comma,separated,tags"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || accounts.length === 0}
              className="btn-primary flex-1 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Transaction"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Transactions List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold">Recent Transactions</h4>
          {totalCount !== null && (
            <div className="text-sm text-[var(--text-muted)]">
              {offset + 1}-{Math.min(offset + pageLimit, totalCount)} of {totalCount}
            </div>
          )}
        </div>

        {loading && <div className="skeleton h-32 rounded" />}

        {!loading && filteredTransactions.length === 0 && (
          <div className="text-center py-12 text-[var(--text-muted)]">
            <p className="text-lg mb-2">No transactions yet</p>
            <p className="text-sm">Click "Add" to create your first transaction</p>
          </div>
        )}

        {/* Mobile cards */}
        <div className="block md:hidden space-y-3">
          {filteredTransactions.map((tx) => {
            const txTags = tx.tags ? tx.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
            const tagColors = Object.fromEntries(allTags.map(t => [t.name, t.color]));
            
            return (
              <div key={tx.id} className="p-4 bg-[var(--surface)] rounded-lg space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{tx.description || "—"}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">
                      {tx.date} • {tx.account_name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-lg">
                      {formatMoney(tx.amount)}
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      tx.kind === 'INCOME' ? 'bg-green-100 text-green-800' : 
                      tx.kind === 'EXPENSE' ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {tx.kind}
                    </span>
                  </div>
                </div>
                
                {tx.category_name && (
                  <div className="text-sm">
                    <span className="text-[var(--text-muted)]">Category:</span>{" "}
                    <span className="font-medium">{tx.category_name}</span>
                  </div>
                )}
                
                {txTags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {txTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: (tagColors[tag] || "#3B82F6") + "20",
                          color: tagColors[tag] || "#3B82F6",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop table */}
        {filteredTransactions.length > 0 && (
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[var(--surface)] sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Account</th>
                  <th className="px-4 py-3 text-left font-semibold">Category</th>
                  <th className="px-4 py-3 text-right font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold">Type</th>
                  <th className="px-4 py-3 text-left font-semibold">Description</th>
                  <th className="px-4 py-3 text-left font-semibold">Tags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filteredTransactions.map((tx) => {
                  const txTags = tx.tags ? tx.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
                  const tagColors = Object.fromEntries(allTags.map(t => [t.name, t.color]));
                  
                  return (
                    <tr key={tx.id} className="hover:bg-[var(--surface)] transition-colors">
                      <td className="px-4 py-3">{tx.date}</td>
                      <td className="px-4 py-3">{tx.account_name}</td>
                      <td className="px-4 py-3">
                        {tx.category_name ?? (
                          <span className="text-[var(--text-muted)]">–</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {formatMoney(tx.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          tx.kind === 'INCOME' ? 'bg-green-100 text-green-800' : 
                          tx.kind === 'EXPENSE' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {tx.kind}
                        </span>
                      </td>
                      <td className="px-4 py-3">{tx.description}</td>
                      <td className="px-4 py-3">
                        {txTags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {txTags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: (tagColors[tag] || "#3B82F6") + "20",
                                  color: tagColors[tag] || "#3B82F6",
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[var(--text-muted)]">–</span>
                        )}
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
