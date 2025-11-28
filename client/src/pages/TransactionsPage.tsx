// src/pages/TransactionsPage.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
// TimeRangeSelector provided globally via Layout
import { useTimeRange } from "../contexts/TimeRangeContext";
import type { FormEvent } from "react";
import {
  fetchTransactionsPaged,
  fetchAccounts,
  fetchCategories,
  createTransaction,
} from "../api/finance";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type {
  Transaction,
  Account,
  Category,
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

  const [loading, setLoading] = useState(false);
  const [pageLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [loadingRefs, setLoadingRefs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [accountId, setAccountId] = useState<number | "">("");
  const [kind, setKind] = useState<TransactionKind>("EXPENSE");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10) // today
  );
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [searchParams] = useSearchParams();
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const { range } = useTimeRange();
  const [filterCategory, setFilterCategory] = useState<number | "">(searchParams.get("category") ? Number(searchParams.get("category")) : "");
  const [filterKind, setFilterKind] = useState<TransactionKind | "">((searchParams.get("kind") as TransactionKind) || "");

  async function loadRefs() {
    try {
      setLoadingRefs(true);
      const [accs, cats] = await Promise.all([
        fetchAccounts(),
        fetchCategories(),
      ]);
      setAccounts(accs);
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
      // DRF LimitOffsetPagination returns results + count
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

  // Load aggregated data for the mini chart top of the transactions page
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
    // reload when pagination offset changes
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

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

      // Clear some fields for quick entry
      setAmount("");
      setDescription("");
      setTags("");

      await loadTransactions();
      // reload aggregated series after creating a new transaction
      try {
        const { fetchAggregatedTransactions } = await import('../api/finance');
        const res = await fetchAggregatedTransactions({ start: range.startDate, end: range.endDate });
        setAggregatedSeries(res.series || []);
      } catch (err) {}
      // notify other pages a transaction was created so they can re-fetch
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Transactions</h3>
      </div>

      {/* TimeRangeSelector is provided globally in the header/layout */}

      {/* mini aggregated chart */}
      <div className="pt-2">
        <div className="card">
          <div className="text-xs text-gray-500 mb-1">Cashflow</div>
          <div style={{ width: '100%', height: 80 }}>
            <ResponsiveContainer width='100%' height={80}>
              <AreaChart data={aggregatedSeries}>
                <XAxis dataKey='date' hide />
                <Tooltip formatter={(v:any) => formatMoney(v)} />
                <Area type='monotone' dataKey='income' stroke='#16A34A' fill='#16A34A' />
                <Area type='monotone' dataKey='expenses' stroke='#DC2626' fill='#DC2626' />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Add transaction form */}
      <form
        onSubmit={handleSubmit}
        className="card space-y-3"
      >
        <div className="text-sm font-medium mb-1">Add Transaction</div>

        {loadingRefs && (
          <div className="text-xs text-gray-500">Loading accounts…</div>
        )}

        <div className="grid md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Date</label>
            <input
              type="date"
              className="w-full border rounded px-2 py-1 text-sm"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Account</label>
            <select
              className="w-full border rounded px-2 py-1 text-sm"
              value={accountId}
              onChange={(e) =>
                setAccountId(e.target.value ? Number(e.target.value) : "")
              }
              required
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Type</label>
            <select
              className="w-full border rounded px-2 py-1 text-sm"
              value={kind}
              onChange={(e) => setKind(e.target.value as TransactionKind)}
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Category (optional)
            </label>
            <select
              className="w-full border rounded px-2 py-1 text-sm"
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
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              className="w-full border rounded px-2 py-1 text-sm"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">
              Description
            </label>
            <input
              className="w-full border rounded px-2 py-1 text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Lunch at Java, rent, salary..."
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Tags (optional)
          </label>
          <input
            className="w-full border rounded px-2 py-1 text-sm"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="comma,separated,tags"
          />
        </div>

        <button
          type="submit"
          disabled={saving || accounts.length === 0}
          className="btn-primary text-sm disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Transaction"}
        </button>

        {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
      </form>

      {/* Transactions table */}
      {loading && <div className="skeleton h-8 rounded" />}

      {!loading && filteredTransactions.length === 0 && (
        <div className="text-sm text-gray-500">
          No transactions yet. Use the form above to add some.
        </div>
      )}
      {filteredTransactions.length > 0 && (
          <div className="overflow-x-auto card table-hover">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 table-sticky">
              <tr>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Account</th>
                <th className="px-3 py-2 text-left">Category</th>
                <th className="px-3 py-2 text-right">Amount</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="border-t">
                  <td className="px-3 py-2">{tx.date}</td>
                  <td className="px-3 py-2">{tx.account_name}</td>
                  <td className="px-3 py-2">
                    {tx.category_name ?? (
                      <span className="text-gray-400">–</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {formatMoney(tx.amount)}
                  </td>
                  <td className="px-3 py-2">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-100">
                      {tx.kind}
                    </span>
                  </td>
                  <td className="px-3 py-2">{tx.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-3">
        <div className="text-sm text-gray-500">{totalCount !== null ? `${offset + 1}-${Math.min(offset + pageLimit, totalCount)} of ${totalCount}` : ''}</div>
        <div className="flex gap-2">
          <button className="hud-btn" onClick={() => setOffset(Math.max(0, offset - pageLimit))} disabled={offset === 0}>Prev</button>
          <button className="hud-btn" onClick={() => setOffset(offset + pageLimit)} disabled={totalCount !== null && offset + pageLimit >= (totalCount)}>Next</button>
        </div>
      </div>
    </div>
  );
}
