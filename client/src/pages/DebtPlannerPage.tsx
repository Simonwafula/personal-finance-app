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
import {
  fetchLiabilities,
  createLiability,
  updateLiability,
  deleteLiability,
} from "../api/wealth";
import type { DebtPlan, DebtScheduleRow, Liability } from "../api/types";
import { HiPencil, HiTrash, HiX, HiPlus } from "react-icons/hi";

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

  // Debt Tracker state
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [showDebtForm, setShowDebtForm] = useState(false);
  const [editingDebtId, setEditingDebtId] = useState<number | null>(null);
  const [debtName, setDebtName] = useState("");
  const [debtType, setDebtType] = useState("LOAN");
  const [debtBalance, setDebtBalance] = useState("");
  const [debtInterestRate, setDebtInterestRate] = useState("");
  const [debtMinPayment, setDebtMinPayment] = useState("");
  const [debtTenure, setDebtTenure] = useState("");
  const [debtStartDate, setDebtStartDate] = useState("");
  const [debtDueDay, setDebtDueDay] = useState("");
  const [debtNotes, setDebtNotes] = useState("");
  const [savingDebt, setSavingDebt] = useState(false);
  const [activeTab, setActiveTab] = useState<'tracker' | 'planner'>('tracker');

  const selectedPlan = useMemo(() => plans.find(p => p.id === selectedId) || null, [plans, selectedId]);

  const { monthsCount, totalInterest, initialDebt, timeline } = useMemo(() => {
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
      const [plansData, liabilitiesData] = await Promise.all([
        fetchDebtPlans(),
        fetchLiabilities(),
      ]);
      setPlans(plansData);
      setLiabilities(liabilitiesData);
      if (plansData.length > 0 && selectedId == null) {
        setSelectedId(plansData[0].id);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load debt data");
    } finally {
      setLoading(false);
    }
  }

  function resetDebtForm() {
    setDebtName("");
    setDebtType("LOAN");
    setDebtBalance("");
    setDebtInterestRate("");
    setDebtMinPayment("");
    setDebtTenure("");
    setDebtStartDate("");
    setDebtDueDay("");
    setDebtNotes("");
    setEditingDebtId(null);
    setShowDebtForm(false);
  }

  function editDebt(debt: Liability) {
    setEditingDebtId(debt.id);
    setDebtName(debt.name);
    setDebtType(debt.liability_type);
    setDebtBalance(debt.principal_balance);
    setDebtInterestRate(debt.interest_rate ? String(debt.interest_rate) : "");
    setDebtMinPayment(debt.minimum_payment ? String(debt.minimum_payment) : "");
    setDebtTenure(debt.tenure_months?.toString() || "");
    setDebtStartDate(debt.start_date || "");
    setDebtDueDay(debt.due_day_of_month?.toString() || "");
    setDebtNotes(debt.notes || "");
    setShowDebtForm(true);
  }

  async function handleDebtSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSavingDebt(true);
      const payload: Partial<Liability> = {
        name: debtName,
        liability_type: debtType,
        principal_balance: debtBalance,
        interest_rate: debtInterestRate ? debtInterestRate : null,
        minimum_payment: debtMinPayment ? debtMinPayment : null,
        tenure_months: debtTenure ? Number(debtTenure) : null,
        start_date: debtStartDate || null,
        due_day_of_month: debtDueDay ? Number(debtDueDay) : null,
        notes: debtNotes,
      };

      if (editingDebtId) {
        await updateLiability(editingDebtId, payload);
      } else {
        await createLiability(payload);
      }
      resetDebtForm();
      await load();
    } catch (err) {
      console.error(err);
      setError(editingDebtId ? "Failed to update debt" : "Failed to add debt");
    } finally {
      setSavingDebt(false);
    }
  }

  async function handleDeleteDebt(id: number) {
    if (!confirm("Are you sure you want to delete this debt?")) return;
    try {
      await deleteLiability(id);
      await load();
    } catch (err) {
      console.error(err);
      setError("Failed to delete debt");
    }
  }

  // Calculate totals for debt tracker
  const totalDebt = liabilities.reduce(
    (sum, l) => sum + Number(l.principal_balance), 0
  );
  const totalMinPayments = liabilities.reduce(
    (sum, l) => sum + Number(l.minimum_payment || 0), 0
  );
  const interestRates = liabilities
    .filter((l) => l.interest_rate !== null)
    .map((l) => Number(l.interest_rate));
  const avgInterestRate = interestRates.length > 0
    ? interestRates.reduce((sum, rate) => sum + rate, 0) / interestRates.length
    : 0;

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
            💳 Debt Manager
          </h1>
          <p className="text-base text-[var(--text-muted)] mt-2 font-medium">
            Track your debts and create payoff strategies
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 text-sm font-semibold">
            {liabilities.length} {liabilities.length === 1 ? 'Debt' : 'Debts'}
          </span>
          {plans.length > 0 && (
            <span className="inline-flex px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-sm font-semibold">
              {plans.length} {plans.length === 1 ? 'Plan' : 'Plans'}
            </span>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--border-subtle)] pb-1">
        <button
          onClick={() => setActiveTab('tracker')}
          className={`flex-1 min-w-[160px] px-6 py-3 rounded-t-lg font-semibold transition-all ${
            activeTab === 'tracker'
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
              : 'bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-muted)]'
          }`}
        >
          📊 Debt Tracker
        </button>
        <button
          onClick={() => setActiveTab('planner')}
          className={`flex-1 min-w-[160px] px-6 py-3 rounded-t-lg font-semibold transition-all ${
            activeTab === 'planner'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
              : 'bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-muted)]'
          }`}
        >
          📈 Payoff Planner
        </button>
      </div>

      {loading && <div className="skeleton h-32 rounded" />}
      {error && (
        <div className="card bg-red-50 border-red-200 text-red-700 text-sm p-4 animate-slide-in">{error}</div>
      )}

      {/* DEBT TRACKER TAB */}
      {activeTab === 'tracker' && (
        <>
          {/* Summary Cards */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="card bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-2xl">💰</div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)] font-medium">Total Debt</p>
                    <p className="text-2xl font-bold text-red-500">KES {formatMoney(totalDebt)}</p>
                  </div>
                </div>
              </div>
              <div className="card bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-2xl">📅</div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)] font-medium">Monthly Minimums</p>
                    <p className="text-2xl font-bold text-amber-500">KES {formatMoney(totalMinPayments)}</p>
                  </div>
                </div>
              </div>
              <div className="card bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl">📊</div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)] font-medium">Avg Interest Rate</p>
                    <p className="text-2xl font-bold text-purple-500">{avgInterestRate.toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Debt Button / Form */}
          <div className="card animate-slide-in">
            {!showDebtForm ? (
              <button
                onClick={() => setShowDebtForm(true)}
                className="w-full py-4 border-2 border-dashed border-[var(--border-subtle)] rounded-xl text-[var(--text-muted)] hover:border-red-500 hover:text-red-500 transition-all flex items-center justify-center gap-2"
              >
                <HiPlus size={20} />
                Add New Debt
              </button>
            ) : (
              <form onSubmit={handleDebtSubmit}>
                <div className="flex items-center justify-between mb-6">
                  <div className="text-lg font-semibold flex items-center gap-2">
                    {editingDebtId ? "✏️ Edit Debt" : "➕ Add New Debt"}
                  </div>
                  <button type="button" onClick={resetDebtForm} className="text-gray-500 hover:text-gray-700">
                    <HiX size={20} />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Debt Name *</label>
                    <input
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      value={debtName}
                      onChange={(e) => setDebtName(e.target.value)}
                      placeholder="e.g., KCB Loan, Credit Card"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Type *</label>
                    <select
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      value={debtType}
                      onChange={(e) => setDebtType(e.target.value)}
                    >
                      <option value="LOAN">Loan</option>
                      <option value="MORTGAGE">Mortgage</option>
                      <option value="CREDIT_CARD">Credit Card</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Balance (KES) *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      value={debtBalance}
                      onChange={(e) => setDebtBalance(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      value={debtInterestRate}
                      onChange={(e) => setDebtInterestRate(e.target.value)}
                      placeholder="14.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Minimum Payment (KES)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      value={debtMinPayment}
                      onChange={(e) => setDebtMinPayment(e.target.value)}
                      placeholder="5000.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tenure (Months)</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      value={debtTenure}
                      onChange={(e) => setDebtTenure(e.target.value)}
                      placeholder="36"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Loan Start Date</label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      value={debtStartDate}
                      onChange={(e) => setDebtStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Due Day of Month</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      value={debtDueDay}
                      onChange={(e) => setDebtDueDay(e.target.value)}
                      placeholder="15"
                    />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium mb-2">Notes</label>
                    <textarea
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      value={debtNotes}
                      onChange={(e) => setDebtNotes(e.target.value)}
                      placeholder="Optional notes about this debt..."
                      rows={2}
                    />
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex gap-3">
                  <button type="submit" className="btn-primary bg-gradient-to-r from-red-500 to-orange-500" disabled={savingDebt}>
                    {savingDebt ? 'Saving...' : editingDebtId ? 'Update Debt' : 'Add Debt'}
                  </button>
                  <button type="button" onClick={resetDebtForm} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Debts List */}
          {liabilities.length > 0 ? (
            <div className="card animate-slide-in">
              <div className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📋</span>
                Your Debts
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-[var(--surface)]">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Name</th>
                      <th className="px-4 py-3 text-left font-semibold">Type</th>
                      <th className="px-4 py-3 text-right font-semibold">Balance</th>
                      <th className="px-4 py-3 text-right font-semibold">Interest</th>
                      <th className="px-4 py-3 text-right font-semibold">Min Payment</th>
                      <th className="px-4 py-3 text-center font-semibold">Tenure</th>
                      <th className="px-4 py-3 text-center font-semibold">Remaining</th>
                      <th className="px-4 py-3 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {liabilities.map((debt) => (
                      <tr key={debt.id} className="hover:bg-[var(--surface)] transition-colors">
                        <td className="px-4 py-3 font-medium">{debt.name}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            debt.liability_type === 'MORTGAGE' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                            debt.liability_type === 'CREDIT_CARD' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                            debt.liability_type === 'LOAN' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                          }`}>
                            {debt.liability_type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-red-600 dark:text-red-400">
                          {formatMoney(debt.principal_balance)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {debt.interest_rate !== null ? `${debt.interest_rate}%` : "-"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {debt.minimum_payment !== null ? formatMoney(debt.minimum_payment) : "-"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {debt.tenure_months ? `${debt.tenure_months} mo` : '-'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {debt.remaining_tenure !== null ? (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              debt.remaining_tenure <= 6 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                              debt.remaining_tenure <= 12 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                            }`}>
                              {debt.remaining_tenure} mo left
                            </span>
                          ) : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => editDebt(debt)}
                              className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 transition-colors"
                              title="Edit"
                            >
                              <HiPencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteDebt(debt.id)}
                              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition-colors"
                              title="Delete"
                            >
                              <HiTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : !loading && (
            <div className="card text-center py-12">
              <div className="text-4xl mb-4">🎉</div>
              <div className="text-xl font-semibold mb-2">No Debts!</div>
              <p className="text-[var(--text-muted)]">
                You haven't added any debts yet. Click "Add New Debt" to start tracking.
              </p>
            </div>
          )}

          {/* Tip Card */}
          {liabilities.length > 0 && (
            <div className="card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💡</div>
                <div>
                  <p className="font-semibold mb-1">Ready to pay off faster?</p>
                  <p className="text-sm text-[var(--text-muted)]">
                    Switch to the <strong>Payoff Planner</strong> tab to create a debt payoff strategy using Avalanche (highest interest first) or Snowball (lowest balance first) methods.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* PAYOFF PLANNER TAB */}
      {activeTab === 'planner' && (
        <>
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
        </>
      )}
    </div>
  );
}
