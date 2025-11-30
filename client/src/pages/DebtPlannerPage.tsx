// src/pages/DebtPlannerPage.tsx
import { useEffect, useMemo, useState } from "react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  fetchDebtPlans,
  createDebtPlan,
  fetchDebtSchedule,
  updateDebtPlan,
  deleteDebtPlan,
} from "../api/debt";
import type { DebtPlan, DebtScheduleRow } from "../api/types";

function formatMoney(value: string | number) {
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return value.toString();
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function DebtPlannerPage() {
  const [plans, setPlans] = useState<DebtPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<DebtScheduleRow[]>([]);
  const [creating, setCreating] = useState(false);
  const [strategy, setStrategy] = useState<DebtPlan["strategy"]>("AVALANCHE");
  const [monthly, setMonthly] = useState("0");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editStrategy, setEditStrategy] = useState<DebtPlan["strategy"]>("AVALANCHE");
  const [editMonthly, setEditMonthly] = useState("0");
  const [editStartDate, setEditStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [liabilityFilter, setLiabilityFilter] = useState<number | null>(null);
  const [showOnlyFiltered, setShowOnlyFiltered] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [altInterest, setAltInterest] = useState<number | null>(null);
  const [altStrategy, setAltStrategy] = useState<string | null>(null);

  const selectedPlan = useMemo(() => plans.find(p => p.id === selectedId) || null, [plans, selectedId]);

  const { monthsCount, totalInterest, totalPrincipal, totalPayments, initialDebt, timeline } = useMemo(() => {
    if (!schedule || schedule.length === 0) {
      return { monthsCount: 0, totalInterest: 0, totalPrincipal: 0, totalPayments: 0, initialDebt: 0, timeline: [] as { month: string; remaining: number }[] };
    }

    // distinct months
    const monthSet = new Set<string>();
    // first occurrence per liability to compute initial total
    const firstByLiability = new Map<number, number>();
    let _totalInterest = 0;
    let _totalPrincipal = 0;
    let _totalPayments = 0;
    const monthAgg: Record<string, { payment: number; interest: number; principal: number; ending: number }> = {};

    for (const row of schedule) {
      const m = String(row.month).slice(0, 7); // YYYY-MM
      monthSet.add(m);
      const lid = row.liability_id;
      if (!firstByLiability.has(lid)) {
        firstByLiability.set(lid, Number(row.starting_balance));
      }
      const interest = Number(row.interest);
      const principal = Number(row.principal);
      const payment = Number(row.payment);
      const ending = Number(row.ending_balance);
      _totalInterest += interest;
      _totalPrincipal += principal;
      _totalPayments += payment;
      if (!monthAgg[m]) monthAgg[m] = { payment: 0, interest: 0, principal: 0, ending: 0 };
      monthAgg[m].payment += payment;
      monthAgg[m].interest += interest;
      monthAgg[m].principal += principal;
      monthAgg[m].ending += ending;
    }

    const initial = Array.from(firstByLiability.values()).reduce((a, b) => a + b, 0);
    const monthsCount = monthSet.size;
    // Build timeline as remaining balance at end of month (sum across liabilities)
    const timeline = Object.entries(monthAgg)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, agg]) => ({ month, remaining: Math.max(agg.ending, 0) }));

    return { monthsCount, totalInterest: _totalInterest, totalPrincipal: _totalPrincipal, totalPayments: _totalPayments, initialDebt: initial, timeline };
  }, [schedule]);

  async function load() {
    try {
      setLoading(true);
      const data = await fetchDebtPlans();
      setPlans(data);
      if (data.length > 0 && selectedId == null) {
        setSelectedId(data[0].id);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load debt plans");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!selectedId) {
      setSchedule([]);
      return;
    }
    async function loadSchedule() {
      try {
        const s = await fetchDebtSchedule(selectedId as number);
        setSchedule(s || []);
      } catch (err) {
        console.error(err);
        setSchedule([]);
      }
    }
    loadSchedule();
  }, [selectedId]);

  useEffect(() => {
    if (!selectedPlan) return;
    // Initialize edit fields from selected plan
    setEditStrategy(selectedPlan.strategy as DebtPlan["strategy"]);
    setEditMonthly(String(selectedPlan.monthly_amount_available));
    setEditStartDate(selectedPlan.start_date);
  }, [selectedPlan?.id]);

  // Compute alternate strategy interest for "interest saved" comparison
  useEffect(() => {
    async function computeAlt() {
      if (!selectedPlan || !selectedId) {
        setAltInterest(null);
        setAltStrategy(null);
        return;
      }
      const other = selectedPlan.strategy === 'AVALANCHE' ? 'SNOWBALL' : 'AVALANCHE';
      setAltStrategy(other);
      try {
        const alt = await fetchDebtSchedule(selectedId, other);
        const total = alt.reduce((sum, r) => sum + Number(r.interest), 0);
        setAltInterest(total);
      } catch (e) {
        console.error(e);
        setAltInterest(null);
      }
    }
    computeAlt();
  }, [selectedPlan?.strategy, selectedId, schedule.length]);

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            💳 Debt Planner
          </h1>
          <p className="text-base text-[var(--text-muted)] mt-2 font-medium">
            Build payoff strategies using Avalanche or Snowball methods
          </p>
        </div>
        {plans.length > 0 && (
          <div className="inline-flex px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-sm font-semibold">
            {plans.length} {plans.length === 1 ? 'Plan' : 'Plans'}
          </div>
        )}
      </div>

      {loading && <div className="skeleton h-32 rounded" />}
      {error && (
        <div className="card bg-red-50 border-red-200 text-red-700 text-sm p-4 animate-slide-in">{error}</div>
      )}

      <div className="card animate-slide-in">
        <div className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>📝</span>
          Create Debt Plan
        </div>
        <form onSubmit={async (e) => {
          e.preventDefault();
          setCreating(true);
          try {
            await createDebtPlan({ strategy, monthly_amount_available: Number(monthly), start_date: startDate });
            setStrategy("AVALANCHE");
            setMonthly("0");
            setStartDate(new Date().toISOString().slice(0, 10));
            await load();
          } catch (err) {
            console.error(err);
            setError("Failed to create plan");
          } finally { setCreating(false); }
        }}>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Strategy</label>
              <select value={strategy} onChange={(e) => setStrategy(e.target.value as any)} className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200">
                <option value="AVALANCHE">Avalanche</option>
                <option value="SNOWBALL">Snowball</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Monthly Amount *</label>
              <input type="number" step="0.01" className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400" value={monthly} onChange={(e) => setMonthly(e.target.value)} placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input type="date" className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]"><button className="btn-primary" disabled={creating}>{creating ? 'Creating…' : 'Create Plan'}</button></div>
        </form>
      </div>

      {/* Overview Stats */}
      {schedule.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card hover:shadow-lg transition-shadow">
            <div className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">Total Debt</div>
            <div className="text-2xl font-bold">{formatMoney(initialDebt)}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">At plan start</div>
          </div>
          <div className="card hover:shadow-lg transition-shadow">
            <div className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">Monthly Budget</div>
            <div className="text-2xl font-bold">{formatMoney(Number(selectedPlan?.monthly_amount_available || 0))}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Allocated to debts</div>
          </div>
          <div className="card hover:shadow-lg transition-shadow">
            <div className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">Months to Payoff</div>
            <div className="text-2xl font-bold">{monthsCount}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Based on current plan</div>
          </div>
          <div className="card hover:shadow-lg transition-shadow">
            <div className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">Total Interest</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{formatMoney(totalInterest)}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Cumulative interest</div>
          </div>
          {altInterest != null && (
            <div className="card hover:shadow-lg transition-shadow lg:col-span-2">
              <div className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">Interest Saved vs {altStrategy}</div>
              {(() => {
                const saved = Math.round((altInterest - totalInterest) * 100) / 100;
                const positive = saved > 0;
                return (
                  <div className={`text-2xl font-bold ${positive ? 'text-green-600 dark:text-green-400' : 'text-[var(--text)]'}`}>
                    {positive ? '+' : ''}{formatMoney(saved)}
                    <span className="ml-2 text-sm text-[var(--text-muted)]">{positive ? 'less interest than' : 'vs'} {altStrategy}</span>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* Plan list and schedule */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold flex items-center gap-2">
                <span>📋</span>
                Plans
              </div>
              {selectedPlan && (
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1.5 rounded-md text-sm bg-[var(--surface)] hover:bg-[var(--surface-hover)]"
                    onClick={() => setEditing((v) => !v)}
                  >
                    {editing ? 'Cancel' : 'Edit'}
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-md text-sm bg-[var(--surface)] hover:bg-[var(--surface-hover)]"
                    onClick={async () => {
                      if (!selectedPlan) return;
                      try {
                        const dup = await createDebtPlan({
                          strategy: selectedPlan.strategy,
                          monthly_amount_available: Number(selectedPlan.monthly_amount_available),
                          start_date: selectedPlan.start_date,
                        });
                        await load();
                        setSelectedId(dup.id);
                      } catch (err) {
                        console.error(err);
                        setError('Failed to duplicate plan');
                      }
                    }}
                  >
                    Duplicate
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-md text-sm bg-red-50 text-red-700 hover:bg-red-100"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          {plans.map(p => (
            <div key={p.id} className="mb-2"> 
              <button onClick={() => setSelectedId(p.id)} className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all ${selectedId === p.id ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'bg-[var(--surface)] hover:bg-[var(--surface-hover)] hover:shadow-md'}`}>
                <div className="font-semibold">{p.strategy}</div>
                <div className={`${selectedId === p.id ? 'text-white/80' : 'text-[var(--text-muted)]'} text-xs mt-1`}>{p.start_date} • {formatMoney(Number(p.monthly_amount_available))}</div>
              </button>
            </div>
          ))}

          {editing && selectedPlan && (
            <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
              <div className="text-sm font-semibold mb-3">Edit Plan</div>
              <div className="grid gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Strategy</label>
                  <select value={editStrategy} onChange={(e) => setEditStrategy(e.target.value as any)} className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200">
                    <option value="AVALANCHE">Avalanche</option>
                    <option value="SNOWBALL">Snowball</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Monthly Amount</label>
                  <input type="number" step="0.01" className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400" value={editMonthly} onChange={(e) => setEditMonthly(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <input type="date" className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200" value={editStartDate} onChange={(e) => setEditStartDate(e.target.value)} />
                </div>
                <div className="flex justify-end">
                  <button
                    className="btn-primary"
                    onClick={async () => {
                      if (!selectedPlan) return;
                      try {
                        await updateDebtPlan(selectedPlan.id, {
                          strategy: editStrategy,
                          monthly_amount_available: Number(editMonthly),
                          start_date: editStartDate,
                        });
                        await load();
                        setEditing(false);
                      } catch (err) {
                        console.error(err);
                        setError('Failed to update plan');
                      }
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold flex items-center gap-2">
                <span>📈</span>
                Schedule
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 rounded-md text-sm bg-[var(--surface)] hover:bg-[var(--surface-hover)]"
                  onClick={() => {
                    if (!schedule || schedule.length === 0) return;
                    const headers = [
                      'month','liability_id','liability_name','starting_balance','interest','payment','principal','ending_balance'
                    ];
                    const rows = schedule
                      .filter(r => !liabilityFilter || r.liability_id === liabilityFilter)
                      .map(r => headers.map(h => String((r as any)[h])));
                    const csv = [headers.join(','), ...rows.map(r => r.map(v => /[",\n]/.test(v) ? '"' + v.replace(/"/g,'""') + '"' : v).join(','))].join('\n');
                    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `debt_schedule_${selectedPlan?.id ?? 'plan'}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Export CSV
                </button>
                <button
                  className="px-3 py-1.5 rounded-md text-sm bg-[var(--surface)] hover:bg-[var(--surface-hover)]"
                  onClick={async () => {
                    if (!selectedId) return;
                    // Quick recalculation = re-fetch the schedule
                    try {
                      const s = await fetchDebtSchedule(selectedId);
                      setSchedule(s || []);
                    } catch (err) {
                      console.error(err);
                      setError('Failed to recalculate schedule');
                    }
                  }}
                >
                  Recalculate
                </button>
              </div>
            </div>

            {/* Filters and payoff order */}
            {schedule.length > 0 && (
              <div className="grid gap-3 md:grid-cols-2 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Liability Filter</label>
                  <select
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                    value={liabilityFilter ?? ''}
                    onChange={(e) => setLiabilityFilter(e.target.value ? Number(e.target.value) : null)}
                  >
                    <option value="">All</option>
                    {Array.from(new Map(schedule.map(s => [s.liability_id, s.liability_name])).entries()).map(([id, name]) => (
                      <option key={id} value={id}>{name}</option>
                    ))}
                  </select>
                  <label className="inline-flex items-center gap-2 mt-2 text-sm">
                    <input type="checkbox" checked={showOnlyFiltered} onChange={(e) => setShowOnlyFiltered(e.target.checked)} />
                    Show only selected
                  </label>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">Payoff Order</div>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Map(schedule.map((s, idx) => [s.liability_id, { name: s.liability_name, idx }])).entries())
                      .sort((a,b) => a[1].idx - b[1].idx)
                      .map(([id, info], i) => (
                        <span key={id} className={`px-2.5 py-1 rounded-full text-xs ${liabilityFilter === id ? 'bg-blue-600 text-white' : 'bg-[var(--surface)]'}`}>{i+1}. {info.name}</span>
                      ))}
                  </div>
                </div>
              </div>
            )}
          {/* Payoff Timeline Chart */}
          {timeline.length > 0 && (
            <div className="mb-6">
              <div className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">Payoff Timeline</div>
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={timeline}>
                    <defs>
                      <linearGradient id="debtGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="var(--text-muted)" />
                    <Tooltip 
                      formatter={(v:any) => formatMoney(v as string | number)}
                      contentStyle={{
                        background: 'var(--surface)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(20px)',
                      }}
                    />
                    <Area type="monotone" dataKey="remaining" stroke="#8B5CF6" strokeWidth={2} fill="url(#debtGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Principal vs Interest Stacked Chart */}
          {schedule.length > 0 && (
            <div className="mb-6">
              <div className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">Payments Breakdown</div>
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={Object.entries(schedule.reduce((acc: any, r) => {
                    if (liabilityFilter && r.liability_id !== liabilityFilter && showOnlyFiltered) return acc;
                    const m = String(r.month).slice(0,7);
                    if (!acc[m]) acc[m] = { month: m, interest: 0, principal: 0 };
                    acc[m].interest += Number(r.interest);
                    acc[m].principal += Number(r.principal);
                    return acc;
                  }, {})).sort((a,b) => a[0].localeCompare(b[0])).map(([,v]) => v)}>
                    <defs>
                      <linearGradient id="debtInterest" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="debtPrincipal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="var(--text-muted)" />
                    <Tooltip 
                      formatter={(v:any) => formatMoney(v as string | number)}
                      contentStyle={{
                        background: 'var(--surface)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(20px)',
                      }}
                    />
                    <Area type="monotone" dataKey="interest" name="Interest" stackId="1" stroke="#EF4444" strokeWidth={2} fill="url(#debtInterest)" />
                    <Area type="monotone" dataKey="principal" name="Principal" stackId="1" stroke="#10B981" strokeWidth={2} fill="url(#debtPrincipal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          {schedule.length === 0 && <div className="text-center py-16 text-[var(--text-muted)]">Select a plan to view the schedule</div>}
          {schedule.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-[var(--surface)] sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Month</th>
                    <th className="px-4 py-3 text-left font-semibold">Liability</th>
                    <th className="px-4 py-3 text-right font-semibold">Starting</th>
                    <th className="px-4 py-3 text-right font-semibold">Interest</th>
                    <th className="px-4 py-3 text-right font-semibold">Payment</th>
                    <th className="px-4 py-3 text-right font-semibold">Principal</th>
                    <th className="px-4 py-3 text-right font-semibold">Ending</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {schedule
                    .filter(s => !showOnlyFiltered || !liabilityFilter || s.liability_id === liabilityFilter)
                    .map((s, idx) => (
                    <tr key={idx} className={`hover:bg-[var(--surface)] transition-colors ${liabilityFilter && s.liability_id !== liabilityFilter && !showOnlyFiltered ? 'opacity-40' : ''}`}>
                      <td className="px-4 py-3">{s.month}</td>
                      <td className="px-4 py-3">{s.liability_name}</td>
                      <td className="px-4 py-3 text-right">{formatMoney(s.starting_balance)}</td>
                      <td className="px-4 py-3 text-right">{formatMoney(s.interest)}</td>
                      <td className="px-4 py-3 text-right">{formatMoney(s.payment)}</td>
                      <td className="px-4 py-3 text-right">{formatMoney(s.principal)}</td>
                      <td className="px-4 py-3 text-right">{formatMoney(s.ending_balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && selectedPlan && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowDeleteModal(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="card max-w-md w-full">
              <div className="text-lg font-semibold mb-2">Delete Plan?</div>
              <p className="text-sm text-[var(--text-muted)] mb-4">This action cannot be undone.</p>
              <div className="flex items-center justify-end gap-2">
                <button className="px-3 py-1.5 rounded-md text-sm bg-[var(--surface)] hover:bg-[var(--surface-hover)]" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button
                  className="px-3 py-1.5 rounded-md text-sm bg-red-600 text-white hover:bg-red-700"
                  onClick={async () => {
                    try {
                      await deleteDebtPlan(selectedPlan.id);
                      setShowDeleteModal(false);
                      await load();
                      setSelectedId(null);
                      setSchedule([]);
                    } catch (err) {
                      console.error(err);
                      setError('Failed to delete plan');
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}