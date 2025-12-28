// src/pages/BudgetsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchBudgets,
  fetchBudgetSummary,
  createBudget,
  updateBudget,
  deleteBudget,
  createBudgetLine,
  fetchBudgetLines,
  updateBudgetLine,
  deleteBudgetLine,
} from "../api/budgeting";
import { fetchCategories, fetchTransactions } from "../api/finance";
import TimeRangeSelector from "../components/TimeRangeSelector";
import type { Category, Budget, BudgetSummary, BudgetLine } from "../api/types";
import {
  HiPlus,
  HiX,
  HiPencil,
  HiTrash,
  HiDotsVertical,
  HiCalendar,
  HiCurrencyDollar,
  HiChartBar,
  HiTrendingUp,
  HiTrendingDown,
  HiExclamationCircle,
  HiCheckCircle,
  HiClock,
  HiExternalLink,
} from "react-icons/hi";

function formatMoney(value: string | number) {
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return value.toString();
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [creating, setCreating] = useState(false);
  const [budgetName, setBudgetName] = useState("");
  const [periodType, setPeriodType] = useState<Budget["period_type"]>("MONTHLY");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");

  // budget lines
  const [lines, setLines] = useState<BudgetLine[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCategoryId, setEditCategoryId] = useState<number | "">("");
  const [editPlannedAmount, setEditPlannedAmount] = useState<string>("0");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [plannedAmount, setPlannedAmount] = useState("0");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [loadingBudgets, setLoadingBudgets] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customStart, setCustomStart] = useState<string | null>(null);
  const [customEnd, setCustomEnd] = useState<string | null>(null);
  const [customSummary, setCustomSummary] = useState<BudgetSummary | null>(null);
  const [showCreateBudget, setShowCreateBudget] = useState(false);
  const [showAddLine, setShowAddLine] = useState(false);
  const [editingBudgetId, setEditingBudgetId] = useState<number | null>(null);
  const [budgetMenuOpen, setBudgetMenuOpen] = useState<number | null>(null);
  const [addingLine, setAddingLine] = useState(false);
  const threshold = 0.9;

  const activeSummary = customSummary ?? summary;
  const overThreshold = useMemo(() => {
    if (!activeSummary) return [] as Array<{ name: string; ratio: number }>;
    return activeSummary.lines
      .map((l) => {
        const planned = Number(l.planned);
        const actual = Number(l.actual);
        const ratio = planned > 0 ? actual / planned : 0;
        return { name: l.category_name, ratio };
      })
      .filter((x) => x.ratio >= threshold)
      .sort((a, b) => b.ratio - a.ratio);
  }, [activeSummary]);

  // Budget health calculation
  const budgetHealth = useMemo(() => {
    if (!activeSummary) return null;
    const planned = Number(activeSummary.totals.planned);
    const actual = Number(activeSummary.totals.actual);
    if (planned === 0) return { status: "empty", percent: 0 };
    const percent = (actual / planned) * 100;
    if (percent >= 100) return { status: "over", percent };
    if (percent >= 90) return { status: "warning", percent };
    if (percent >= 50) return { status: "good", percent };
    return { status: "excellent", percent };
  }, [activeSummary]);

  const selectedBudget = budgets.find((b) => b.id === selectedId);

  // Days remaining in budget period
  const daysRemaining = useMemo(() => {
    if (!selectedBudget) return null;
    const end = new Date(selectedBudget.end_date);
    const today = new Date();
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  }, [selectedBudget]);

  // Helper to set dates based on period type
  function handlePeriodTypeChange(type: Budget["period_type"]) {
    setPeriodType(type);
    const now = new Date();
    if (type === "MONTHLY") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      setStartDate(start.toISOString().slice(0, 10));
      setEndDate(end.toISOString().slice(0, 10));
      setBudgetName(`${start.toLocaleString("default", { month: "long" })} ${start.getFullYear()}`);
    } else if (type === "ANNUAL") {
      setStartDate(`${now.getFullYear()}-01-01`);
      setEndDate(`${now.getFullYear()}-12-31`);
      setBudgetName(`${now.getFullYear()} Annual Budget`);
    }
  }

  useEffect(() => {
    async function loadBudgets() {
      try {
        setLoadingBudgets(true);
        const data = await fetchBudgets();
        setBudgets(data);
        if (data.length > 0) {
          setSelectedId(data[0].id);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load budgets");
      } finally {
        setLoadingBudgets(false);
      }
    }
    loadBudgets();
    (async function loadCategories() {
      try {
        const cats = await fetchCategories();
        setCategories(cats);
      } catch (err) {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setLines([]);
      return;
    }
    async function loadLines() {
      try {
        const [s, blines] = await Promise.all([
          fetchBudgetSummary(selectedId as number),
          fetchBudgetLines(selectedId as number),
        ]);
        setSummary(s);
        setLines(blines);
      } catch {
        // ignore
      }
    }
    loadLines();
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) {
      setSummary(null);
      return;
    }
    async function loadSummary() {
      try {
        setLoadingSummary(true);
        const data = await fetchBudgetSummary(selectedId as number);
        setSummary(data);
      } catch {
        console.error("Failed to load budget summary");
        setError("Failed to load budget summary");
      } finally {
        setLoadingSummary(false);
      }
    }
    loadSummary();
  }, [selectedId]);

  useEffect(() => {
    async function computeCustom() {
      if (!selectedId || !customStart || !customEnd) {
        setCustomSummary(null);
        return;
      }
      try {
        setLoadingSummary(true);
        const linesData = lines;
        const txs = await fetchTransactions();
        const start = new Date(customStart);
        const end = new Date(customEnd);

        let totalPlanned = 0;
        let totalActual = 0;
        const linesResult = linesData.map((line) => {
          const planned = Number(line.planned_amount || 0);
          totalPlanned += planned;
          const actual = txs
            .filter((t) => t.category === line.category)
            .filter((t) => {
              const d = new Date(t.date);
              return d >= start && d <= end;
            })
            .reduce((acc, t) => acc + Number(t.amount), 0);
          totalActual += actual;
          const diff = planned - actual;
          return {
            category_id: line.category,
            category_name: categories.find((c) => c.id === line.category)?.name ?? "",
            planned: String(planned),
            actual: String(actual),
            difference: String(diff),
          };
        });

        setCustomSummary({
          budget: {
            id: selectedId,
            name: budgets.find((b) => b.id === selectedId)?.name ?? "",
            start_date: customStart,
            end_date: customEnd,
          },
          lines: linesResult,
          totals: {
            planned: String(totalPlanned),
            actual: String(totalActual),
            difference: String(totalPlanned - totalActual),
          },
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSummary(false);
      }
    }
    computeCustom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customStart, customEnd, selectedId, lines, categories]);

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-2">
            <HiChartBar className="text-emerald-600" />
            Budgets
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Plan and track your spending limits
          </p>
        </div>
        <button
          onClick={() => {
            setShowCreateBudget(!showCreateBudget);
            setEditingBudgetId(null);
            handlePeriodTypeChange("MONTHLY");
          }}
          className="btn-primary inline-flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-shadow"
        >
          <HiPlus size={18} />
          <span>New Budget</span>
        </button>
      </div>

      {error && (
        <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm p-3">
          {error}
        </div>
      )}

      {/* Budget usage warning */}
      {activeSummary && overThreshold.length > 0 && (
        <div className="card bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-300 dark:border-amber-700 p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-800/50 rounded-lg">
              <HiExclamationCircle className="text-amber-600 dark:text-amber-400" size={20} />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-amber-800 dark:text-amber-200">
                {overThreshold.length} categor{overThreshold.length === 1 ? "y" : "ies"} at 90%+ of budget
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {overThreshold.slice(0, 5).map((x) => (
                  <span
                    key={x.name}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100"
                  >
                    {x.name}
                    <span className="px-1.5 py-0.5 bg-amber-300 dark:bg-amber-700 rounded-full">
                      {Math.round(x.ratio * 100)}%
                    </span>
                  </span>
                ))}
                {overThreshold.length > 5 && (
                  <span className="text-xs text-amber-700 dark:text-amber-300 self-center">+{overThreshold.length - 5} more</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Budget Form */}
      {showCreateBudget && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            
            // Validate before setting creating state
            if (!budgetName.trim()) {
              setError("Budget name is required");
              return;
            }
            if (!startDate || !endDate) {
              setError("Start and end dates are required");
              return;
            }
            
            setCreating(true);
            try {
              if (editingBudgetId) {
                // Update existing budget
                await updateBudget(editingBudgetId, {
                  name: budgetName.trim(),
                  period_type: periodType,
                  start_date: startDate,
                  end_date: endDate,
                  notes: notes.trim(),
                });
              } else {
                // Create new budget
                await createBudget({
                  name: budgetName.trim(),
                  period_type: periodType,
                  start_date: startDate,
                  end_date: endDate,
                  notes: notes.trim(),
                });
              }
              setBudgetName("");
              setNotes("");
              setShowCreateBudget(false);
              setEditingBudgetId(null);
              const data = await fetchBudgets();
              setBudgets(data);
              if (!editingBudgetId && data.length > 0) {
                setSelectedId(data[data.length - 1].id);
              }
            } catch (err: unknown) {
              console.error("Budget save error:", err);
              const errorObj = err as { message?: string; payload?: Record<string, string[]> };
              if (errorObj.payload) {
                // Handle Django validation errors
                const messages = Object.entries(errorObj.payload)
                  .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`)
                  .join("; ");
                setError(messages || "Failed to save budget");
              } else {
                setError(errorObj.message || "Failed to save budget");
              }
            } finally {
              setCreating(false);
            }
          }}
          className="card p-4 space-y-4 animate-slide-in"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{editingBudgetId ? "Edit Budget" : "Create New Budget"}</h4>
            <button
              type="button"
              onClick={() => {
                setShowCreateBudget(false);
                setEditingBudgetId(null);
                setBudgetName("");
                setNotes("");
              }}
              className="text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              <HiX size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Budget Name *</label>
              <input
                value={budgetName}
                onChange={(e) => setBudgetName(e.target.value)}
                placeholder="e.g., January 2025"
                required
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Period</label>
              <select
                value={periodType}
                onChange={(e) => handlePeriodTypeChange(e.target.value as Budget["period_type"])}
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
              >
                <option value="MONTHLY">Monthly</option>
                <option value="ANNUAL">Annual</option>
                <option value="CUSTOM">Custom</option>
              </select>
            </div>
            <div className="hidden sm:block" />
            <div>
              <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Start Date *</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">End Date *</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={creating} className="btn-primary disabled:opacity-60">
              {creating ? (editingBudgetId ? "Saving..." : "Creating...") : (editingBudgetId ? "Save Changes" : "Create Budget")}
            </button>
            <button type="button" onClick={() => {
              setShowCreateBudget(false);
              setEditingBudgetId(null);
              setBudgetName("");
              setNotes("");
            }} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loadingBudgets && <div className="skeleton h-32 rounded" />}

      {/* Empty state */}
      {!loadingBudgets && budgets.length === 0 && !showCreateBudget && (
        <div className="card text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center">
            <HiChartBar className="text-emerald-600 dark:text-emerald-400" size={36} />
          </div>
          <h3 className="text-lg font-semibold mb-1">No budgets yet</h3>
          <p className="text-sm text-[var(--text-muted)] mb-6 max-w-sm mx-auto">
            Create your first budget to start tracking your spending and reach your financial goals
          </p>
          <button
            onClick={() => {
              setShowCreateBudget(true);
              handlePeriodTypeChange("MONTHLY");
            }}
            className="btn-primary inline-flex items-center gap-2"
          >
            <HiPlus size={18} /> Create Your First Budget
          </button>
        </div>
      )}

      {/* Budgets Section */}
      {budgets.length > 0 && (
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Budget List */}
          <div className="lg:col-span-1">
            <div className="card p-4 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-[var(--text-muted)] uppercase tracking-wide">
                  Budgets
                </h3>
                <span className="text-xs bg-[var(--surface)] px-2 py-0.5 rounded-full">
                  {budgets.length}
                </span>
              </div>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                {budgets.map((b) => {
                  const active = b.id === selectedId;
                  return (
                    <div
                      key={b.id}
                      className={`relative rounded-lg text-sm transition-all ${
                        active
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow"
                          : "bg-[var(--surface)] hover:bg-[var(--surface-hover)]"
                      }`}
                    >
                      <button
                        onClick={() => setSelectedId(b.id)}
                        className="w-full text-left px-3 py-2.5 pr-10"
                      >
                        <div className="font-medium truncate">{b.name}</div>
                        <div className={`text-xs mt-0.5 ${active ? "text-white/80" : "text-[var(--text-muted)]"}`}>
                          {b.start_date} → {b.end_date}
                        </div>
                      </button>
                      
                      {/* Budget Actions Menu */}
                      <div className="absolute right-1 top-1/2 -translate-y-1/2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setBudgetMenuOpen(budgetMenuOpen === b.id ? null : b.id);
                          }}
                          className={`p-1.5 rounded hover:bg-black/10 ${active ? "text-white/80" : "text-[var(--text-muted)]"}`}
                        >
                          <HiDotsVertical size={16} />
                        </button>
                        
                        {budgetMenuOpen === b.id && (
                          <div className="absolute right-0 top-full mt-1 bg-[var(--card)] border border-[var(--border-subtle)] rounded-lg shadow-lg z-10 min-w-[120px]">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingBudgetId(b.id);
                                setBudgetName(b.name);
                                setPeriodType(b.period_type);
                                setStartDate(b.start_date);
                                setEndDate(b.end_date);
                                setNotes(b.notes || "");
                                setShowCreateBudget(true);
                                setBudgetMenuOpen(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--surface)] flex items-center gap-2"
                            >
                              <HiPencil size={14} /> Edit
                            </button>
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (!confirm(`Delete budget "${b.name}"?`)) return;
                                try {
                                  await deleteBudget(b.id);
                                  const data = await fetchBudgets();
                                  setBudgets(data);
                                  if (selectedId === b.id) {
                                    setSelectedId(data.length > 0 ? data[0].id : null);
                                  }
                                } catch (err) {
                                  console.error(err);
                                  setError("Failed to delete budget");
                                }
                                setBudgetMenuOpen(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--surface)] flex items-center gap-2 text-red-600"
                            >
                              <HiTrash size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Budget Detail */}
          <div className="lg:col-span-3 space-y-6">
            {selectedBudget && (
              <>
                {/* Budget Overview Cards */}
                {activeSummary && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="card p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          <HiCurrencyDollar className="text-blue-600 dark:text-blue-400" size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-[var(--text-muted)]">Planned</p>
                          <p className="text-lg font-bold">{formatMoney(activeSummary.totals.planned)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="card p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                          <HiChartBar className="text-purple-600 dark:text-purple-400" size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-[var(--text-muted)]">Spent</p>
                          <p className="text-lg font-bold">{formatMoney(activeSummary.totals.actual)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="card p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${Number(activeSummary.totals.difference) >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                          {Number(activeSummary.totals.difference) >= 0 
                            ? <HiTrendingUp className="text-green-600 dark:text-green-400" size={20} />
                            : <HiTrendingDown className="text-red-600 dark:text-red-400" size={20} />
                          }
                        </div>
                        <div>
                          <p className="text-xs text-[var(--text-muted)]">Remaining</p>
                          <p className={`text-lg font-bold ${Number(activeSummary.totals.difference) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {formatMoney(activeSummary.totals.difference)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="card p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          !daysRemaining || daysRemaining <= 0 ? 'bg-gray-100 dark:bg-gray-800' :
                          daysRemaining <= 7 ? 'bg-amber-100 dark:bg-amber-900/30' :
                          'bg-emerald-100 dark:bg-emerald-900/30'
                        }`}>
                          <HiClock className={`${
                            !daysRemaining || daysRemaining <= 0 ? 'text-gray-600 dark:text-gray-400' :
                            daysRemaining <= 7 ? 'text-amber-600 dark:text-amber-400' :
                            'text-emerald-600 dark:text-emerald-400'
                          }`} size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-[var(--text-muted)]">Days Left</p>
                          <p className="text-lg font-bold">
                            {daysRemaining !== null ? (daysRemaining <= 0 ? 'Ended' : daysRemaining) : '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Budget Health Indicator */}
                {budgetHealth && budgetHealth.status !== 'empty' && (
                  <div className={`card p-4 ${
                    budgetHealth.status === 'over' ? 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-800' :
                    budgetHealth.status === 'warning' ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800' :
                    budgetHealth.status === 'good' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800' :
                    'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {budgetHealth.status === 'over' && <HiExclamationCircle className="text-red-600" size={20} />}
                        {budgetHealth.status === 'warning' && <HiExclamationCircle className="text-amber-600" size={20} />}
                        {budgetHealth.status === 'good' && <HiCheckCircle className="text-blue-600" size={20} />}
                        {budgetHealth.status === 'excellent' && <HiCheckCircle className="text-emerald-600" size={20} />}
                        <span className="font-semibold">
                          {budgetHealth.status === 'over' && 'Over Budget!'}
                          {budgetHealth.status === 'warning' && 'Approaching Limit'}
                          {budgetHealth.status === 'good' && 'On Track'}
                          {budgetHealth.status === 'excellent' && 'Excellent Progress'}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{budgetHealth.percent.toFixed(1)}% used</span>
                    </div>
                    <div className="h-3 bg-white/50 dark:bg-black/20 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all rounded-full ${
                          budgetHealth.status === 'over' ? 'bg-red-500' :
                          budgetHealth.status === 'warning' ? 'bg-amber-500' :
                          budgetHealth.status === 'good' ? 'bg-blue-500' :
                          'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(budgetHealth.percent, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Budget Header & Add Line */}
                <div className="card p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <div>
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <HiCalendar className="text-[var(--text-muted)]" size={20} />
                        {selectedBudget.name}
                      </h2>
                      <p className="text-sm text-[var(--text-muted)] mt-0.5">
                        {new Date(selectedBudget.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} → {new Date(selectedBudget.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddLine(!showAddLine)}
                      className="btn-secondary inline-flex items-center gap-1.5 text-sm"
                    >
                      <HiPlus size={16} />
                      Add Category
                    </button>
                  </div>

                  {/* Add Line Form */}
                  {showAddLine && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setError(null);
                        
                        // Validation
                        if (!categoryId) {
                          setError("Please select a category");
                          return;
                        }
                        if (!plannedAmount || Number(plannedAmount) <= 0) {
                          setError("Please enter a valid planned amount");
                          return;
                        }
                        
                        setAddingLine(true);
                        try {
                          await createBudgetLine({
                            budget: selectedId as number,
                            category: categoryId as number,
                            planned_amount: Number(plannedAmount),
                          });
                          setCategoryId("");
                          setPlannedAmount("0");
                          setShowAddLine(false);
                          const [s, blines] = await Promise.all([
                            fetchBudgetSummary(selectedId as number),
                            fetchBudgetLines(selectedId as number),
                          ]);
                          setSummary(s);
                          setLines(blines);
                        } catch (err: unknown) {
                          console.error("Budget line creation error:", err);
                          const errorObj = err as { message?: string; response?: { data?: Record<string, string[]> } };
                          if (errorObj.response?.data) {
                            const messages = Object.entries(errorObj.response.data)
                              .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`)
                              .join("; ");
                            setError(messages || "Failed to add budget line");
                          } else {
                            setError(errorObj.message || "Failed to add budget line");
                          }
                        } finally {
                          setAddingLine(false);
                        }
                      }}
                      className="p-3 bg-[var(--surface)] rounded-lg mb-4 animate-slide-in"
                    >
                      <div className="grid sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Category</label>
                          <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
                            required
                            className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                          >
                            <option value="">Select category...</option>
                            {categories.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name} ({c.kind})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">
                            Planned Amount
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={plannedAmount}
                            onChange={(e) => setPlannedAmount(e.target.value)}
                            required
                            className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button type="submit" disabled={addingLine} className="btn-primary text-sm disabled:opacity-50">
                          {addingLine ? "Adding..." : "Add"}
                        </button>
                        <button type="button" onClick={() => setShowAddLine(false)} className="btn-secondary text-sm">
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Budget Lines */}
                  {lines.length === 0 && !showAddLine && (
                    <div className="text-center py-10 text-[var(--text-muted)]">
                      <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[var(--surface)] flex items-center justify-center">
                        <HiCurrencyDollar className="text-[var(--text-muted)]" size={28} />
                      </div>
                      <p className="font-medium mb-1">No categories yet</p>
                      <p className="text-sm mb-3">Add spending categories to track your budget</p>
                      <button
                        onClick={() => setShowAddLine(true)}
                        className="text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:underline inline-flex items-center gap-1"
                      >
                        <HiPlus size={14} /> Add your first category
                      </button>
                    </div>
                  )}

                  {lines.length > 0 && (
                    <div className="space-y-3">
                      {lines.map((line) => {
                        const editing = editingId === line.id;
                        const summaryLine = activeSummary?.lines.find((l) => l.category_id === line.category);
                        const planned = Number(line.planned_amount);
                        const actual = summaryLine ? Number(summaryLine.actual) : 0;
                        const pct = planned > 0 ? (actual / planned) * 100 : 0;
                        const overBudget = actual > planned;
                        const nearLimit = pct >= 80 && !overBudget;

                        return (
                          <div key={line.id} className={`p-4 rounded-xl border transition-all ${
                            overBudget 
                              ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800' 
                              : nearLimit
                              ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800'
                              : 'bg-[var(--surface)] border-transparent'
                          }`}>
                            {editing ? (
                              <div className="grid sm:grid-cols-3 gap-3">
                                <select
                                  value={editCategoryId}
                                  onChange={(e) => setEditCategoryId(e.target.value ? Number(e.target.value) : "")}
                                  className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                                >
                                  {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                      {c.name}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={editPlannedAmount}
                                  onChange={(e) => setEditPlannedAmount(e.target.value)}
                                  className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={async () => {
                                      try {
                                        await updateBudgetLine(line.id, {
                                          category: editCategoryId as number,
                                          planned_amount: Number(editPlannedAmount),
                                        });
                                        setEditingId(null);
                                        const [s, blines] = await Promise.all([
                                          fetchBudgetSummary(selectedId as number),
                                          fetchBudgetLines(selectedId as number),
                                        ]);
                                        setSummary(s);
                                        setLines(blines);
                                      } catch (err) {
                                        console.error(err);
                                        setError("Failed to update line");
                                      }
                                    }}
                                    className="btn-primary text-sm flex-1"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="btn-secondary text-sm flex-1"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold">{line.category_name}</span>
                                    {overBudget && (
                                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 font-medium">
                                        Over
                                      </span>
                                    )}
                                    {nearLimit && (
                                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-medium">
                                        Near limit
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => {
                                        setEditingId(line.id);
                                        setEditCategoryId(line.category);
                                        setEditPlannedAmount(String(line.planned_amount));
                                      }}
                                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                      title="Edit"
                                    >
                                      <HiPencil size={15} />
                                    </button>
                                    <button
                                      onClick={async () => {
                                        if (!confirm("Delete this budget line?")) return;
                                        try {
                                          await deleteBudgetLine(line.id);
                                          const [s, blines] = await Promise.all([
                                            fetchBudgetSummary(selectedId as number),
                                            fetchBudgetLines(selectedId as number),
                                          ]);
                                          setSummary(s);
                                          setLines(blines);
                                        } catch (err) {
                                          console.error(err);
                                          setError("Failed to delete line");
                                        }
                                      }}
                                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                      title="Delete"
                                    >
                                      <HiTrash size={15} />
                                    </button>
                                  </div>
                                </div>
                                {/* Amount display */}
                                <div className="flex items-baseline justify-between">
                                  <div className="flex items-baseline gap-1">
                                    <span className={`text-2xl font-bold ${overBudget ? 'text-red-600 dark:text-red-400' : ''}`}>
                                      {formatMoney(actual)}
                                    </span>
                                    <span className="text-sm text-[var(--text-muted)]">
                                      of {formatMoney(planned)}
                                    </span>
                                  </div>
                                  <span className={`text-sm font-medium ${
                                    overBudget ? 'text-red-600 dark:text-red-400' :
                                    nearLimit ? 'text-amber-600 dark:text-amber-400' :
                                    'text-emerald-600 dark:text-emerald-400'
                                  }`}>
                                    {overBudget ? `+${formatMoney(actual - planned)} over` : `${formatMoney(planned - actual)} left`}
                                  </span>
                                </div>
                                {/* Progress bar */}
                                <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full transition-all rounded-full ${
                                      overBudget
                                        ? "bg-gradient-to-r from-red-500 to-pink-500"
                                        : nearLimit
                                        ? "bg-gradient-to-r from-amber-500 to-orange-500"
                                        : "bg-gradient-to-r from-emerald-500 to-teal-500"
                                    }`}
                                    style={{ width: `${Math.min(pct, 100)}%` }}
                                  />
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-[var(--text-muted)]">{pct.toFixed(0)}% of budget used</span>
                                  <Link
                                    to={`/transactions?category=${line.category}`}
                                    className="text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 font-medium"
                                  >
                                    View transactions <HiExternalLink size={12} />
                                  </Link>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Budget Summary Table */}
                {loadingSummary && <div className="skeleton h-48 rounded-xl" />}

                {!loadingSummary && activeSummary && activeSummary.lines.length > 0 && (
                  <div className="card p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <HiChartBar className="text-[var(--text-muted)]" size={18} />
                        Detailed Summary
                      </h3>
                      <div className="flex items-center gap-2">
                        <TimeRangeSelector
                          onChange={(r) => {
                            setCustomStart(r.startDate);
                            setCustomEnd(r.endDate);
                          }}
                          initialStart={customStart ?? undefined}
                          initialEnd={customEnd ?? undefined}
                        />
                        {customStart && customEnd && (
                          <button
                            className="btn-secondary text-xs px-2 py-1"
                            onClick={() => {
                              setCustomStart(null);
                              setCustomEnd(null);
                              setCustomSummary(null);
                            }}
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[var(--border-subtle)]">
                            <th className="text-left py-2 font-medium">Category</th>
                            <th className="text-right py-2 font-medium">Planned</th>
                            <th className="text-right py-2 font-medium">Actual</th>
                            <th className="text-right py-2 font-medium">Difference</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeSummary.lines.map((line) => (
                            <tr key={line.category_id} className="border-b border-[var(--border-subtle)] last:border-0">
                              <td className="py-2">{line.category_name}</td>
                              <td className="py-2 text-right">{formatMoney(line.planned)}</td>
                              <td className="py-2 text-right">{formatMoney(line.actual)}</td>
                              <td
                                className={`py-2 text-right font-medium ${
                                  Number(line.difference) >= 0
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {formatMoney(line.difference)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="sm:hidden space-y-2">
                      {activeSummary.lines.map((line) => (
                        <div key={line.category_id} className="p-2 bg-[var(--surface)] rounded-lg">
                          <div className="font-medium mb-1">{line.category_name}</div>
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-muted)]">
                              {formatMoney(line.actual)} / {formatMoney(line.planned)}
                            </span>
                            <span
                              className={`font-medium ${
                                Number(line.difference) >= 0
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {Number(line.difference) >= 0 ? "+" : ""}
                              {formatMoney(line.difference)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {!selectedBudget && !loadingBudgets && (
              <div className="card text-center py-16 text-[var(--text-muted)]">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--surface)] flex items-center justify-center">
                  <HiChartBar size={32} />
                </div>
                <p className="font-semibold text-lg mb-1">Select a budget</p>
                <p className="text-sm">Choose a budget from the list to view details and track spending</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tips Section */}
      {budgets.length > 0 && (
        <div className="card bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/10 dark:to-teal-900/10 p-5">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span className="text-xl">💡</span> Budgeting Tips
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-600 font-bold">50</span>
              </div>
              <div>
                <p className="font-semibold">50/30/20 Rule</p>
                <p className="text-[var(--text-muted)]">50% needs, 30% wants, 20% savings</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <HiCalendar className="text-blue-600" size={16} />
              </div>
              <div>
                <p className="font-semibold">Review Weekly</p>
                <p className="text-[var(--text-muted)]">Check your progress regularly</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <HiTrendingUp className="text-purple-600" size={16} />
              </div>
              <div>
                <p className="font-semibold">Adjust & Improve</p>
                <p className="text-[var(--text-muted)]">Refine budgets based on actual spending</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
