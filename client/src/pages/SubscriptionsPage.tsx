// src/pages/SubscriptionsPage.tsx
import { useEffect, useMemo, useState, useCallback } from "react";

import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  HiPlus,
  HiRefresh,
  HiPencil,
  HiTrash,
  HiCalendar,
  HiClock,
  HiCurrencyDollar,
  HiChevronDown,
  HiChevronUp,
  HiEye,
  HiX,
  HiBan,
} from "react-icons/hi";
import {
  fetchAccounts,
  fetchCategories,
  fetchRecurring,
  createRecurring,
  updateRecurring,
  deleteRecurring,
  previewRecurring,
  materializeRecurring,
  type RecurringTransaction,
} from "../api/finance";
import type { Account, Category } from "../api/types";

function formatMoney(value: string | number) {
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return value.toString();
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Subscription category icons and colors
const SUBSCRIPTION_CATEGORIES: Record<string, { icon: string; color: string; label: string }> = {
  streaming: { icon: "🎬", color: "#E50914", label: "Streaming" },
  music: { icon: "🎵", color: "#1DB954", label: "Music" },
  software: { icon: "💻", color: "#0078D4", label: "Software" },
  utilities: { icon: "💡", color: "#F59E0B", label: "Utilities" },
  insurance: { icon: "🛡️", color: "#8B5CF6", label: "Insurance" },
  rent: { icon: "🏠", color: "#EC4899", label: "Rent/Mortgage" },
  gym: { icon: "💪", color: "#10B981", label: "Fitness" },
  phone: { icon: "📱", color: "#3B82F6", label: "Phone/Internet" },
  cloud: { icon: "☁️", color: "#6366F1", label: "Cloud Storage" },
  education: { icon: "📚", color: "#F97316", label: "Education" },
  news: { icon: "📰", color: "#64748B", label: "News/Media" },
  gaming: { icon: "🎮", color: "#EF4444", label: "Gaming" },
  income: { icon: "💰", color: "#22C55E", label: "Income" },
  other: { icon: "📦", color: "#94A3B8", label: "Other" },
};

// Detect subscription category from description
function detectSubscriptionCategory(description: string, kind: string): string {
  if (kind === "INCOME") return "income";
  const desc = description.toLowerCase();
  if (/netflix|disney|hulu|hbo|prime video|youtube premium|showmax|dstv/i.test(desc)) return "streaming";
  if (/spotify|apple music|tidal|deezer|soundcloud/i.test(desc)) return "music";
  if (/microsoft|adobe|notion|slack|zoom|figma|github|jetbrains/i.test(desc)) return "software";
  if (/electric|water|gas|kplc|safaricom|airtel|telkom/i.test(desc)) return "utilities";
  if (/insurance|apa|jubilee|britam|madison/i.test(desc)) return "insurance";
  if (/rent|mortgage|landlord/i.test(desc)) return "rent";
  if (/gym|fitness|yoga|crossfit/i.test(desc)) return "gym";
  if (/phone|internet|wifi|fiber|data|airtime/i.test(desc)) return "phone";
  if (/icloud|google one|dropbox|onedrive/i.test(desc)) return "cloud";
  if (/udemy|coursera|skillshare|linkedin learning|school|tuition/i.test(desc)) return "education";
  if (/newspaper|magazine|medium|substack/i.test(desc)) return "news";
  if (/xbox|playstation|nintendo|steam|gaming/i.test(desc)) return "gaming";
  return "other";
}

// Use RecurringTransaction type from api/finance
type RecurringItem = RecurringTransaction;

// Frequency display helpers
const FREQUENCY_LABELS: Record<string, string> = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

const FREQUENCY_COLORS: Record<string, string> = {
  DAILY: "#EF4444",
  WEEKLY: "#F59E0B",
  MONTHLY: "#3B82F6",
  YEARLY: "#8B5CF6",
};

export default function SubscriptionsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<RecurringItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [previewMap, setPreviewMap] = useState<Record<number, string[]>>({});

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "expenses" | "income">("all");
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

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

  const { monthlyIncome, monthlyExpenses, next30Net, forecastSeries, categoryBreakdown, filteredItems } = useMemo(() => {
    // Monthly equivalents
    let inc = 0;
    let exp = 0;
    const monthFactor = { DAILY: 30, WEEKLY: 4.345, MONTHLY: 1, YEARLY: 1/12 } as const;
    
    // Category breakdown for pie chart
    const categoryTotals: Record<string, number> = {};
    
    for (const r of items) {
      const amt = Number(r.amount);
      const factor = monthFactor[r.frequency];
      if (r.kind === "INCOME") {
        inc += amt * factor;
      } else if (r.kind === "EXPENSE") {
        exp += amt * factor;
        // Track by subscription category
        const subCat = detectSubscriptionCategory(r.description, r.kind);
        categoryTotals[subCat] = (categoryTotals[subCat] || 0) + amt * factor;
      }
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

    // Category breakdown for pie chart
    const categoryBreakdown = Object.entries(categoryTotals)
      .map(([cat, amount]) => ({
        name: SUBSCRIPTION_CATEGORIES[cat]?.label || cat,
        value: amount,
        color: SUBSCRIPTION_CATEGORIES[cat]?.color || "#94A3B8",
        icon: SUBSCRIPTION_CATEGORIES[cat]?.icon || "📦",
      }))
      .sort((a, b) => b.value - a.value);
    
    // Filter items based on active tab
    const filteredItems = items.filter(r => {
      if (activeTab === "expenses") return r.kind === "EXPENSE";
      if (activeTab === "income") return r.kind === "INCOME";
      return true;
    });

    return { monthlyIncome: inc, monthlyExpenses: exp, next30Net, forecastSeries: series, categoryBreakdown, filteredItems };
  }, [items, getOccurrencesForNextDays, activeTab]);

  // Reset form
  function resetForm() {
    setAccount("");
    setDate(new Date().toISOString().slice(0,10));
    setAmount("0");
    setKind("EXPENSE");
    setCategory("");
    setDescription("");
    setFrequency("MONTHLY");
    setEndDate("");
    setEditingId(null);
    setShowForm(false);
  }

  // Handle edit
  function handleEdit(item: RecurringItem) {
    setEditingId(item.id);
    setAccount(item.account);
    setDate(item.date);
    setAmount(String(item.amount));
    setKind(item.kind);
    setCategory(item.category || "");
    setDescription(item.description);
    setFrequency(item.frequency);
    setEndDate(item.end_date || "");
    setShowForm(true);
  }

  // Toggle card expansion
  function toggleCardExpand(id: number) {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Get days until next occurrence
  function getDaysUntil(dateStr: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">🔄 Subscriptions & Bills</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Track recurring expenses and income
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => loadAll()}
            className="btn btn-secondary text-sm"
          >
            <HiRefresh className="w-4 h-4" />
          </button>
          <button
            onClick={async () => {
              try {
                const res = await materializeRecurring(30);
                alert(`✅ Created ${res.created} upcoming transactions`);
                await loadAll();
              } catch (e) {
                console.error(e);
                setError("Failed to materialize recurring");
              }
            }}
            className="btn btn-secondary text-sm"
          >
            ⚡ Generate 30 Days
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary text-sm"
          >
            <HiPlus className="w-4 h-4 mr-1" />
            Add Recurring
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm p-4">
          {error}
          <button onClick={() => setError(null)} className="ml-2 text-red-500 hover:text-red-700">✕</button>
        </div>
      )}

      {/* Summary cards */}
      {!loading && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <HiCurrencyDollar className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-[var(--text-muted)]">Monthly Income</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-green-600">{formatMoney(monthlyIncome)}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              {items.filter(i => i.kind === "INCOME").length} sources
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <HiCurrencyDollar className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-sm text-[var(--text-muted)]">Monthly Expenses</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-red-600">{formatMoney(monthlyExpenses)}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              {items.filter(i => i.kind === "EXPENSE").length} subscriptions
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <HiCalendar className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-[var(--text-muted)]">Next 30 Days</span>
            </div>
            <div className={`text-xl sm:text-2xl font-bold ${next30Net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {next30Net >= 0 ? '+' : ''}{formatMoney(next30Net)}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Net cashflow</div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <HiClock className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-[var(--text-muted)]">Monthly Net</span>
            </div>
            <div className={`text-xl sm:text-2xl font-bold ${monthlyIncome - monthlyExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {monthlyIncome - monthlyExpenses >= 0 ? '+' : ''}{formatMoney(monthlyIncome - monthlyExpenses)}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Recurring balance</div>
          </div>
        </div>
      )}

      {loading && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-28 rounded-xl" />)}
        </div>
      )}

      {/* Charts Section */}
      {!loading && items.length > 0 && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cashflow Chart */}
          <div className="lg:col-span-2 card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">📈 60-Day Forecast</h3>
              <div className="flex items-center gap-3 text-xs">
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" checked={showNet} onChange={(e) => setShowNet(e.target.checked)} className="rounded" />
                  <span className="text-blue-600">Net</span>
                </label>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" checked={showIncome} onChange={(e) => setShowIncome(e.target.checked)} className="rounded" />
                  <span className="text-green-600">Income</span>
                </label>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" checked={showExpenses} onChange={(e) => setShowExpenses(e.target.checked)} className="rounded" />
                  <span className="text-red-600">Expenses</span>
                </label>
              </div>
            </div>
            {forecastSeries.length > 0 ? (
              <div style={{ width: "100%", height: 200 }}>
                <ResponsiveContainer width="100%" height={200}>
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
                    <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 10 }} />
                    <Tooltip 
                      formatter={(v: number | string) => formatMoney(Number(v))}
                      contentStyle={{
                        background: 'var(--surface)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
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
            ) : (
              <div className="text-center text-[var(--text-muted)] py-8">No forecast data</div>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="card p-4">
            <h3 className="font-semibold mb-4">💳 Expense Breakdown</h3>
            {categoryBreakdown.length > 0 ? (
              <>
                <div style={{ width: "100%", height: 160 }}>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        innerRadius={35}
                      >
                        {categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => formatMoney(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-2">
                  {categoryBreakdown.slice(0, 5).map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </div>
                      <span className="font-medium">{formatMoney(cat.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-[var(--text-muted)] py-8">No expenses yet</div>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[var(--border-subtle)]">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "all"
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
          }`}
        >
          All ({items.length})
        </button>
        <button
          onClick={() => setActiveTab("expenses")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "expenses"
              ? "border-red-500 text-red-600"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
          }`}
        >
          Expenses ({items.filter(i => i.kind === "EXPENSE").length})
        </button>
        <button
          onClick={() => setActiveTab("income")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "income"
              ? "border-green-500 text-green-600"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
          }`}
        >
          Income ({items.filter(i => i.kind === "INCOME").length})
        </button>
      </div>

      {/* Subscriptions List */}
      {filteredItems.length === 0 && !loading ? (
        <div className="card p-8 text-center">
          <div className="text-4xl mb-3">🔄</div>
          <h3 className="font-semibold mb-1">No recurring items yet</h3>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Add your first subscription or recurring bill
          </p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <HiPlus className="w-4 h-4 mr-1" />
            Add Recurring
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((r) => {
            const subCat = detectSubscriptionCategory(r.description, r.kind);
            const catInfo = SUBSCRIPTION_CATEGORIES[subCat] || SUBSCRIPTION_CATEGORIES.other;
            const daysUntil = getDaysUntil(r.date);
            const isExpanded = expandedCards.has(r.id);
            
            return (
              <div key={r.id} className="card p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ backgroundColor: `${catInfo.color}20`, color: catInfo.color }}
                  >
                    {catInfo.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold truncate">{r.description || '(No description)'}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span 
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ backgroundColor: `${FREQUENCY_COLORS[r.frequency]}20`, color: FREQUENCY_COLORS[r.frequency] }}
                          >
                            {FREQUENCY_LABELS[r.frequency]}
                          </span>
                          <span className="text-xs text-[var(--text-muted)]">{r.account_name}</span>
                          {r.category_name && (
                            <span className="text-xs text-[var(--text-muted)]">• {r.category_name}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <div className={`text-lg font-bold ${r.kind === "INCOME" ? "text-green-600" : "text-red-600"}`}>
                          {r.kind === "INCOME" ? "+" : "-"}{formatMoney(r.amount)}
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">
                          {daysUntil === 0 ? (
                            <span className="text-orange-600 font-medium">Due today</span>
                          ) : daysUntil < 0 ? (
                            <span className="text-red-600 font-medium">Overdue {Math.abs(daysUntil)}d</span>
                          ) : daysUntil <= 7 ? (
                            <span className="text-orange-600">In {daysUntil} days</span>
                          ) : (
                            <span>In {daysUntil} days</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] text-sm space-y-2">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <span className="text-[var(--text-muted)]">Next Date</span>
                            <div className="font-medium">{r.date}</div>
                          </div>
                          <div>
                            <span className="text-[var(--text-muted)]">End Date</span>
                            <div className="font-medium">{r.end_date || "No end"}</div>
                          </div>
                          <div>
                            <span className="text-[var(--text-muted)]">Last Executed</span>
                            <div className="font-medium">{r.last_executed || "Never"}</div>
                          </div>
                          <div>
                            <span className="text-[var(--text-muted)]">Category</span>
                            <div className="font-medium">{catInfo.label}</div>
                          </div>
                        </div>
                        
                        {/* Preview dates */}
                        {previewMap[r.id]?.length ? (
                          <div className="mt-2">
                            <span className="text-[var(--text-muted)]">Upcoming: </span>
                            <span className="text-xs">{previewMap[r.id].slice(0, 5).join(', ')}</span>
                          </div>
                        ) : (
                          <button
                            className="text-xs text-blue-600 hover:text-blue-700"
                            onClick={async () => {
                              try {
                                const p = await previewRecurring(r.id);
                                setPreviewMap(prev => ({ ...prev, [r.id]: p.dates }));
                              } catch (e) {
                                console.error(e);
                              }
                            }}
                          >
                            <HiEye className="w-3 h-3 inline mr-1" />
                            Show upcoming dates
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-subtle)]">
                  <button
                    onClick={() => toggleCardExpand(r.id)}
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-1"
                  >
                    {isExpanded ? <HiChevronUp className="w-4 h-4" /> : <HiChevronDown className="w-4 h-4" />}
                    {isExpanded ? "Less" : "More"}
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(r)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                      title="Edit"
                    >
                      <HiPencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await updateRecurring(r.id, { end_date: new Date().toISOString().slice(0,10) });
                          await loadAll();
                        } catch (e) { console.error(e); }
                      }}
                      className="p-1.5 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded"
                      title="End subscription"
                    >
                      <HiBan className="w-4 h-4" />
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm('Delete this recurring item?')) return;
                        try {
                          await deleteRecurring(r.id);
                          await loadAll();
                        } catch (e) { console.error(e); }
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                      title="Delete"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card)] rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
              <h2 className="text-lg font-semibold">
                {editingId ? "Edit Recurring Item" : "Add Recurring Item"}
              </h2>
              <button onClick={resetForm} className="p-2 hover:bg-[var(--surface)] rounded-lg">
                <HiX className="w-5 h-5" />
              </button>
            </div>
            
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSubmitting(true);
                setError(null);
                try {
                  if (!account) throw new Error("Select account");
                  const data = {
                    account: Number(account),
                    date,
                    amount: Number(amount),
                    kind,
                    category: category ? Number(category) : undefined,
                    description,
                    frequency,
                    end_date: endDate || undefined,
                  };
                  
                  if (editingId) {
                    await updateRecurring(editingId, data);
                  } else {
                    await createRecurring(data);
                  }
                  
                  resetForm();
                  await loadAll();
                } catch (e: unknown) {
                  console.error(e);
                  const msg = e instanceof Error ? e.message : "Failed to save";
                  setError(msg);
                } finally {
                  setSubmitting(false);
                }
              }}
              className="p-4 space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <input 
                    className="input w-full" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="e.g., Netflix, Rent, Salary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Amount *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="input w-full" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type *</label>
                  <select 
                    className="input w-full" 
                    value={kind} 
                    onChange={(e) => setKind(e.target.value as "INCOME"|"EXPENSE"|"TRANSFER")}
                  >
                    <option value="EXPENSE">💸 Expense</option>
                    <option value="INCOME">💰 Income</option>
                    <option value="TRANSFER">🔄 Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Frequency *</label>
                  <select 
                    className="input w-full" 
                    value={frequency} 
                    onChange={(e) => setFrequency(e.target.value as "DAILY"|"WEEKLY"|"MONTHLY"|"YEARLY")}
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Account *</label>
                  <select
                    className="input w-full"
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
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select 
                    className="input w-full" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value ? Number(e.target.value) : "")}
                  >
                    <option value="">Uncategorized</option>
                    {expenseCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Next Date *</label>
                  <input 
                    type="date" 
                    className="input w-full" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input 
                    type="date" 
                    className="input w-full" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Preview detected category */}
              {description && (
                <div className="p-3 bg-[var(--surface)] rounded-lg text-sm">
                  <span className="text-[var(--text-muted)]">Detected category: </span>
                  <span className="font-medium">
                    {SUBSCRIPTION_CATEGORIES[detectSubscriptionCategory(description, kind)]?.icon}{' '}
                    {SUBSCRIPTION_CATEGORIES[detectSubscriptionCategory(description, kind)]?.label}
                  </span>
                </div>
              )}
              
              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving…' : editingId ? 'Update' : 'Add Recurring'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
