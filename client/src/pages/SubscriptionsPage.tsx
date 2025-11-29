// src/pages/SubscriptionsPage.tsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  fetchAccounts,
  fetchCategories,
  fetchRecurring,
  createRecurring,
  updateRecurring,
  deleteRecurring,
  previewRecurring,
  materializeRecurring,
} from "../api/finance";
import type { Account, Category } from "../api/types";

function formatMoney(value: string | number) {
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return value.toString();
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

type RecurringItem = {
  id: number;
  account: number;
  account_name: string;
  date: string;
  amount: string | number;
  kind: "INCOME" | "EXPENSE" | "TRANSFER";
  category: number | null;
  category_name: string | null;
  description: string;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  end_date: string | null;
  last_executed: string | null;
  created_at: string;
  updated_at: string;
};

export default function SubscriptionsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<RecurringItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [previewMap, setPreviewMap] = useState<Record<number, string[]>>({});

  // form
  const [account, setAccount] = useState<number | "">("");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [amount, setAmount] = useState<string>("0");
  const [kind, setKind] = useState<"INCOME"|"EXPENSE"|"TRANSFER">("EXPENSE");
  const [category, setCategory] = useState<number | "">("");
  const [description, setDescription] = useState<string>("");
  const [frequency, setFrequency] = useState<"DAILY"|"WEEKLY"|"MONTHLY"|"YEARLY">("MONTHLY");
  const [endDate, setEndDate] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [showNet, setShowNet] = useState(true);
  const [showIncome, setShowIncome] = useState(false);
  const [showExpenses, setShowExpenses] = useState(false);

  async function loadAll() {
    try {
      setLoading(true);
      const [accs, cats, rec] = await Promise.all([
        fetchAccounts(),
        fetchCategories(),
        fetchRecurring(),
      ]);
      setAccounts(accs);
      setCategories(cats);
      setItems(rec);
    } catch (e) {
      console.error(e);
      setError("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []);

  const expenseCategories = useMemo(() => categories.filter(c => c.kind === "EXPENSE"), [categories]);

  const getOccurrencesForNextDays = useCallback((item: RecurringItem, days: number) => {
    function addMonths(d: Date, months: number) {
      const month = d.getMonth() + months;
      const year = d.getFullYear() + Math.floor(month / 12);
      const finalMonth = ((month % 12) + 12) % 12;
      const day = Math.min(d.getDate(), 28);
      return new Date(year, finalMonth, day);
    }
    function fmtISO(d: Date) { return d.toISOString().slice(0,10); }
    const out: { date: string; amount: number }[] = [];
    const today = new Date();
    const horizon = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    let next = new Date(item.date);
    // if last_executed exists, advance one interval from that date
    if (item.last_executed) {
      next = new Date(item.last_executed);
      if (item.frequency === "DAILY") next.setDate(next.getDate() + 1);
      else if (item.frequency === "WEEKLY") next.setDate(next.getDate() + 7);
      else if (item.frequency === "MONTHLY") next = addMonths(next, 1);
      else next = new Date(next.getFullYear() + 1, next.getMonth(), next.getDate());
    }
    const endDate = item.end_date ? new Date(item.end_date) : null;
    const signedAmount = (item.kind === "INCOME" ? 1 : item.kind === "EXPENSE" ? -1 : 0) * Number(item.amount);
    while (next <= horizon && (!endDate || next <= endDate)) {
      out.push({ date: fmtISO(next), amount: signedAmount });
      if (item.frequency === "DAILY") next.setDate(next.getDate() + 1);
      else if (item.frequency === "WEEKLY") next.setDate(next.getDate() + 7);
      else if (item.frequency === "MONTHLY") next = addMonths(next, 1);
      else next = new Date(next.getFullYear() + 1, next.getMonth(), next.getDate());
    }
    return out;
  }, []);

  const { monthlyIncome, monthlyExpenses, next30Net, forecastSeries } = useMemo(() => {
    // Monthly equivalents
    let inc = 0;
    let exp = 0;
    const monthFactor = { DAILY: 30, WEEKLY: 4.345, MONTHLY: 1, YEARLY: 1/12 } as const;
    for (const r of items) {
      const amt = Number(r.amount);
      const factor = monthFactor[r.frequency];
      if (r.kind === "INCOME") inc += amt * factor;
      else if (r.kind === "EXPENSE") exp += amt * factor;
    }

    // Forecast next 60 days
    const map: Record<string, { income: number; expenses: number; net: number }> = {};
    for (const r of items) {
      const occ = getOccurrencesForNextDays(r, 60);
      for (const o of occ) {
        if (!map[o.date]) map[o.date] = { income: 0, expenses: 0, net: 0 };
        if (o.amount >= 0) map[o.date].income += o.amount; else map[o.date].expenses += Math.abs(o.amount);
        map[o.date].net += o.amount;
      }
    }
    const series: Array<{ date: string; net: number; income: number; expenses: number }> = Object.entries(map)
      .sort((a,b) => a[0].localeCompare(b[0]))
      .map(([date, v]) => ({ date, net: v.net, income: v.income, expenses: v.expenses }));
    const next30Net = series
      .slice(0, 30)
      .reduce((sum, p) => sum + p.net, 0);

    return { monthlyIncome: inc, monthlyExpenses: exp, next30Net, forecastSeries: series };
  }, [items, getOccurrencesForNextDays]);

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Subscriptions
          </h3>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Manage recurring transactions like bills, rent, and memberships
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-hover)]"
            onClick={async () => {
              try {
                const res = await materializeRecurring(30);
                alert(`Created ${res.created} upcoming transactions`);
              } catch (e) {
                console.error(e);
                setError("Failed to materialize recurring");
              }
            }}
          >
            Materialize 30 days
          </button>
          <button
            className="btn-primary"
            onClick={() => loadAll()}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Summary cards */}
      {!loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card hover:shadow-lg transition-shadow">
            <div className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">Monthly Income</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{monthlyIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="card hover:shadow-lg transition-shadow">
            <div className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">Monthly Expenses</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{monthlyExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="card hover:shadow-lg transition-shadow">
            <div className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">Next 30 Days (Net)</div>
            <div className={`text-2xl font-bold ${next30Net >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{next30Net.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
        </div>
      )}

      {/* Upcoming cashflow chart */}
      {!loading && forecastSeries.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold flex items-center gap-2">
              <span>📈</span>
              Upcoming Cashflow (60 days)
            </div>
            <div className="flex items-center gap-4 text-sm">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={showNet} onChange={(e) => setShowNet(e.target.checked)} />
                Net
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={showIncome} onChange={(e) => setShowIncome(e.target.checked)} />
                Income
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={showExpenses} onChange={(e) => setShowExpenses(e.target.checked)} />
                Expenses
              </label>
            </div>
          </div>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={forecastSeries}>
                <defs>
                  <linearGradient id="subsNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="subsIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="subsExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="var(--text-muted)" />
                <Tooltip 
                  formatter={(v: number | string) => (Number(v)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  contentStyle={{
                    background: 'var(--surface)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)',
                  }}
                />
                {showNet && (
                  <Area type="monotone" dataKey="net" name="Net" stroke="#3B82F6" strokeWidth={2} fill="url(#subsNet)" />
                )}
                {showIncome && (
                  <Area type="monotone" dataKey="income" name="Income" stroke="#10B981" strokeWidth={2} fill="url(#subsIncome)" />
                )}
                {showExpenses && (
                  <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#EF4444" strokeWidth={2} fill="url(#subsExpenses)" />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {loading && <div className="skeleton h-40 rounded" />}
      {error && (
        <div className="card bg-red-50 border-red-200 text-red-700 text-sm p-4 animate-slide-in">{error}</div>
      )}

      {/* Create form */}
      <div className="card">
        <div className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>➕</span>
          Add Recurring
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            setError(null);
            try {
              if (!account) throw new Error("Select account");
              await createRecurring({
                account: Number(account),
                date,
                amount: Number(amount),
                kind,
                category: category ? Number(category) : undefined,
                description,
                frequency,
                end_date: endDate || undefined,
              });
              setAccount("");
              setDate(new Date().toISOString().slice(0,10));
              setAmount("0");
              setKind("EXPENSE");
              setCategory("");
              setDescription("");
              setFrequency("MONTHLY");
              setEndDate("");
              await loadAll();
            } catch (e: unknown) {
              console.error(e);
              const msg = e instanceof Error ? e.message : "Failed to create recurring";
              setError(msg);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Account *</label>
              <select
                className="w-full border-2 rounded-lg px-3 py-2.5 text-sm"
                value={account}
                onChange={(e) => setAccount(e.target.value ? Number(e.target.value) : "")}
                required
              >
                <option value="">Select account</option>
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Next Date *</label>
              <input type="date" className="w-full border-2 rounded-lg px-3 py-2.5 text-sm" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Amount *</label>
              <input type="number" step="0.01" className="w-full border-2 rounded-lg px-3 py-2.5 text-sm" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Kind</label>
              <select className="w-full border-2 rounded-lg px-3 py-2.5 text-sm" value={kind} onChange={(e) => setKind(e.target.value as "INCOME"|"EXPENSE"|"TRANSFER")}>
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
                <option value="TRANSFER">Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select className="w-full border-2 rounded-lg px-3 py-2.5 text-sm" value={category} onChange={(e) => setCategory(e.target.value ? Number(e.target.value) : "") }>
                <option value="">Uncategorized</option>
                {expenseCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Frequency</label>
              <select className="w-full border-2 rounded-lg px-3 py-2.5 text-sm" value={frequency} onChange={(e) => setFrequency(e.target.value as "DAILY"|"WEEKLY"|"MONTHLY"|"YEARLY")}>
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium mb-2">Description</label>
              <input className="w-full border-2 rounded-lg px-3 py-2.5 text-sm" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Netflix, Rent, Gym" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input type="date" className="w-full border-2 rounded-lg px-3 py-2.5 text-sm" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
            <button className="btn-primary" disabled={submitting}>{submitting ? 'Adding…' : 'Add Recurring'}</button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="card">
        <div className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>📅</span>
          Your Recurring Items {items.length > 0 && `(${items.length})`}
        </div>
        {items.length === 0 && (
          <div className="text-center py-12 text-[var(--text-muted)]">No recurring items yet</div>
        )}
        {items.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[var(--surface)] sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Description</th>
                  <th className="px-4 py-3 text-left font-semibold">Account</th>
                  <th className="px-4 py-3 text-left font-semibold">Category</th>
                  <th className="px-4 py-3 text-right font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold">Frequency</th>
                  <th className="px-4 py-3 text-left font-semibold">Next Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Preview</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {items.map((r) => (
                  <tr key={r.id} className="hover:bg-[var(--surface)] transition-colors">
                    <td className="px-4 py-3 font-medium">{r.description || '(No description)'}</td>
                    <td className="px-4 py-3">{r.account_name}</td>
                    <td className="px-4 py-3">{r.category_name || '-'}</td>
                    <td className="px-4 py-3 text-right">{formatMoney(r.amount)}</td>
                    <td className="px-4 py-3">{r.frequency}</td>
                    <td className="px-4 py-3">{r.date}</td>
                    <td className="px-4 py-3">
                      {previewMap[r.id]?.length ? (
                        <div className="text-xs text-[var(--text-muted)]">
                          {previewMap[r.id].join(', ')}
                        </div>
                      ) : (
                        <button
                          className="px-2 py-1 rounded bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-xs"
                          onClick={async () => {
                            try {
                              const p = await previewRecurring(r.id);
                              setPreviewMap(prev => ({ ...prev, [r.id]: p.dates }));
                            } catch (e) {
                              console.error(e);
                            }
                          }}
                        >
                          Show dates
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          className="px-2 py-1 rounded bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-xs"
                          onClick={async () => {
                            try {
                              await updateRecurring(r.id, { end_date: new Date().toISOString().slice(0,10) });
                              await loadAll();
                            } catch (e) { console.error(e); }
                          }}
                          title="End today"
                        >
                          End
                        </button>
                        <button
                          className="px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 text-xs"
                          onClick={async () => {
                            if (!confirm('Delete recurring item?')) return;
                            try {
                              await deleteRecurring(r.id);
                              await loadAll();
                            } catch (e) { console.error(e); }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
