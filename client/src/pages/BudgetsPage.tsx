// src/pages/BudgetsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBudgets, fetchBudgetSummary, createBudget, createBudgetLine, fetchBudgetLines, updateBudgetLine, deleteBudgetLine } from "../api/budgeting";
import { fetchCategories, fetchTransactions } from "../api/finance";
import TimeRangeSelector from "../components/TimeRangeSelector";
import type { Category, Budget, BudgetSummary, BudgetLine } from "../api/types";
import "../styles/neumorphism.css";

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
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-01-31");
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
    // Reset lines when selecting a new budget
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
      } catch (err) {
        // ignore; lines will be cleared
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
      } catch (err) {
        console.error(err);
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
        // Fetch the current budget lines if we don't already have them
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
          budget: { id: selectedId, name: budgets.find(b => b.id === selectedId)?.name ?? '', start_date: customStart, end_date: customEnd },
          lines: linesResult,
          totals: { planned: String(totalPlanned), actual: String(totalActual), difference: String(totalPlanned - totalActual) },
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
    <div className="space-y-6 pb-20 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            📊 Budgets
          </h1>
          <p className="text-base text-[var(--text-muted)] mt-2 font-medium">
            Plan and track your spending with custom budgets
          </p>
        </div>
        {budgets.length > 0 && (
          <div className="inline-flex px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-sm font-semibold">
            {budgets.length} {budgets.length === 1 ? 'Budget' : 'Budgets'}
          </div>
        )}
      </div>

      {error && (
        <div className="card bg-red-50 border-red-200 text-red-700 text-sm p-4 animate-slide-in">
          {error}
        </div>
      )}

      {loadingBudgets && <div className="skeleton h-32 rounded" />}

      {activeSummary && overThreshold.length > 0 && (
        <div className="card border-yellow-300 bg-yellow-50 text-yellow-900 animate-slide-in">
          <div className="flex items-start gap-3">
            <div className="text-xl">⚠️</div>
            <div className="flex-1">
              <div className="font-semibold">Budget usage warning</div>
              <div className="text-sm">
                {overThreshold.length} categor{overThreshold.length === 1 ? "y" : "ies"} at or above 90% of planned amount.
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {overThreshold.slice(0, 5).map((x) => (
                  <span key={x.name} className="badge bg-yellow-200 text-yellow-900">
                    {x.name}: {Math.round(x.ratio * 100)}%
                  </span>
                ))}
                {overThreshold.length > 5 && (
                  <span className="badge bg-yellow-200 text-yellow-900">+{overThreshold.length - 5} more</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Create budget form - left column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="neu-card animate-slide-in sticky top-6">
            <div className="neu-header">
              <h2 className="neu-title">📝 Create Budget</h2>
            </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setCreating(true);
            try {
              await createBudget({
                name: budgetName,
                period_type: periodType,
                start_date: startDate,
                end_date: endDate,
                notes,
              });
              setBudgetName("");
              setNotes("");
              setStartDate("2025-01-01");
              setEndDate("2025-01-31");
              await (async function reload() {
                setLoadingBudgets(true);
                const data = await fetchBudgets();
                setBudgets(data);
                setLoadingBudgets(false);
              })();
            } catch (err) {
              console.error(err);
              setError("Failed to create budget");
            } finally {
              setCreating(false);
            }
          }}
          className="neu-form"
        >
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 neu-form-group">
              <div className="neu-input">
                <input
                  id="budget_name"
                  value={budgetName}
                  onChange={(e) => setBudgetName(e.target.value)}
                  placeholder=" "
                  required
                />
                <label htmlFor="budget_name">e.g., January 2025, Q1 Budget</label>
                <div className="neu-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="neu-form-group">
              <label className="block text-sm font-medium mb-2">Period Type</label>
              <select
                value={periodType}
                onChange={(e) => setPeriodType(e.target.value as any)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
              >
                <option value="MONTHLY">Monthly</option>
                <option value="ANNUAL">Annual</option>
                <option value="CUSTOM">Custom</option>
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div className="neu-form-group">
              <div className="neu-input">
                <input
                  type="date"
                  id="budget_start"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder=" "
                />
                <label htmlFor="budget_start">Start Date</label>
                <div className="neu-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="neu-form-group">
              <div className="neu-input">
                <input
                  type="date"
                  id="budget_end"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder=" "
                />
                <label htmlFor="budget_end">End Date</label>
                <div className="neu-input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 neu-form-group">
            <label className="block text-sm font-medium mb-2">Notes (optional)</label>
            <textarea
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes..."
              rows={3}
            />
          </div>
          <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
            <button
              type="submit"
              disabled={creating}
              className="neu-button disabled:opacity-60"
            >
              {creating ? (
                <>
                  <span className="neu-spinner"></span>
                  <span>Creating…</span>
                </>
              ) : (
                "Create Budget"
              )}
            </button>
            </button>
          </div>
        </form>
      </div>

      {/* Budgeting Tips Card */}
      <div className="card bg-gradient-to-br from-amber-50/50 to-yellow-50/50 dark:from-amber-900/10 dark:to-yellow-900/10 border border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-3xl">💡</span>
          <div>
            <h3 className="font-semibold text-lg mb-1">Smart Budgeting Tips</h3>
            <p className="text-sm text-[var(--text-muted)]">Expert advice for better financial planning</p>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <Link to="/blog/budgeting-50-30-20-rule" className="flex gap-2 hover:bg-white/50 dark:hover:bg-gray-800/50 p-2 rounded-lg transition-colors group">
            <span className="text-green-600 dark:text-green-400 font-bold">•</span>
            <div>
              <p><strong>50/30/20 Rule:</strong> Allocate 50% to needs, 30% to wants, and 20% to savings.</p>
              <span className="text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Read full guide →</span>
            </div>
          </Link>
          <Link to="/blog/zero-based-budgeting" className="flex gap-2 hover:bg-white/50 dark:hover:bg-gray-800/50 p-2 rounded-lg transition-colors group">
            <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
            <div>
              <p><strong>Zero-Based Budgeting:</strong> Give every shilling a purpose by planning where each one goes.</p>
              <span className="text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Read full guide →</span>
            </div>
          </Link>
          <div className="flex gap-2">
            <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
            <p><strong>Review Monthly:</strong> Check your budgets regularly and adjust based on actual spending patterns.</p>
          </div>
          <div className="flex gap-2">
            <span className="text-orange-600 dark:text-orange-400 font-bold">•</span>
            <p><strong>Emergency Fund First:</strong> Build a buffer of 3-6 months of expenses before aggressive investing.</p>
          </div>
        </div>
        <Link to="/blog" className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-800 block text-center text-sm font-semibold text-blue-600 hover:text-blue-700">
          View All Financial Tips →
        </Link>
      </div>
      </div>
      {/* End of left column */}

      {/* Right column */}
      <div className="lg:col-span-3 space-y-6">
        {/* Budget line creation */}
        {selectedId && (
        <div className="card animate-slide-in">
          <div className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>➕</span>
            Add Budget Line
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await createBudgetLine({
                  budget: selectedId,
                  category: categoryId as number,
                  planned_amount: Number(plannedAmount),
                });
                setCategoryId("");
                setPlannedAmount("0");
                const [s, blines] = await Promise.all([
                  fetchBudgetSummary(selectedId as number),
                  fetchBudgetLines(selectedId as number),
                ]);
                setSummary(s);
                setLines(blines);
              } catch (err) {
                console.error(err);
                setError("Failed to create budget line");
              }
            }}
          >
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) =>
                    setCategoryId(e.target.value ? Number(e.target.value) : "")
                  }
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                  required
                >
                  <option value="">— select category —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.kind})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Planned Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  value={plannedAmount}
                  onChange={(e) => setPlannedAmount(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="btn-primary disabled:opacity-60"
              >
                Add Line
              </button>
            </div>
          </form>

          {/* Budget lines list */}
          <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
            <div className="text-sm font-semibold mb-3 text-[var(--text-muted)] uppercase tracking-wide">
              Budget Lines {lines.length > 0 && `(${lines.length})`}
            </div>
            {lines.length === 0 && (
              <div className="text-center py-8 text-[var(--text-muted)]">
                <div className="text-4xl mb-2">📋</div>
                <p className="text-sm">No lines for this budget yet</p>
              </div>
            )}
            {lines.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-[var(--surface)] sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Category</th>
                      <th className="px-4 py-3 text-right font-semibold">Planned</th>
                      <th className="px-4 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {lines.map((line) => {
                      const editing = editingId === line.id;
                      return (
                        <tr key={line.id} className="hover:bg-[var(--surface)] transition-colors">
                          <td className="px-4 py-3">
                            {editing ? (
                              <select
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                                value={editCategoryId}
                                onChange={(e) => setEditCategoryId(e.target.value ? Number(e.target.value) : "")}
                              >
                                <option value="">— select category —</option>
                                {categories.map((c) => (
                                  <option key={c.id} value={c.id}>{c.name} ({c.kind})</option>
                                ))}
                              </select>
                            ) : (
                              <span className="font-medium">{line.category_name}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {editing ? (
                              <input
                                type="number"
                                step="0.01"
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                                value={editPlannedAmount}
                                onChange={(e) => setEditPlannedAmount(e.target.value)}
                              />
                            ) : (
                              <span className="font-semibold">{formatMoney(line.planned_amount)}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {editing ? (
                              <div className="flex gap-2 justify-end">
                                <button
                                  className="btn-primary text-xs px-3 py-1.5 rounded"
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
                                >
                                  Save
                                </button>
                                <button
                                  className="btn-secondary text-xs px-3 py-1.5 rounded"
                                  onClick={() => setEditingId(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex gap-2 justify-end">
                                <button
                                  className="btn-edit text-xs px-3 py-1.5 rounded inline-flex items-center gap-1"
                                  onClick={() => {
                                    setEditingId(line.id);
                                    setEditCategoryId(line.category);
                                    setEditPlannedAmount(String(line.planned_amount));
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn-delete text-xs px-3 py-1.5 rounded inline-flex items-center gap-1"
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
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {!loadingBudgets && budgets.length === 0 && (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">💰</div>
          <p className="text-lg mb-2 font-medium">No budgets yet</p>
          <p className="text-sm text-[var(--text-muted)]">Create your first budget above to start tracking</p>
        </div>
      )}
      
      {budgets.length > 0 && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Budget list */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📊</span>
                Your Budgets
              </div>
              <ul className="space-y-2">
                {budgets.map((b) => {
                  const active = b.id === selectedId;
                  return (
                    <li key={b.id}>
                      <button
                        className={
                          "w-full text-left px-4 py-3 rounded-lg text-sm transition-all " +
                          (active
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                            : "bg-[var(--surface)] hover:bg-[var(--surface-hover)] hover:shadow-md")
                        }
                        onClick={() => setSelectedId(b.id)}
                      >
                        <div className="font-semibold">{b.name}</div>
                        <div className={`text-xs mt-1 ${active ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>
                          {b.start_date} → {b.end_date}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Budget summary */}
          <div className="lg:col-span-2">
            <div className="card">
              {loadingSummary && <div className="skeleton h-64 rounded" />}

              {!loadingSummary && summary && (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <div className="text-lg font-semibold">
                        {(customSummary ?? summary)?.budget.name}
                      </div>
                      <div className="text-sm text-[var(--text-muted)]">
                        {(customSummary ?? summary)?.budget.start_date} → {(customSummary ?? summary)?.budget.end_date}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TimeRangeSelector
                        onChange={(r) => { setCustomStart(r.startDate); setCustomEnd(r.endDate); }}
                        initialStart={customStart ?? undefined}
                        initialEnd={customEnd ?? undefined}
                      />
                      {customStart && customEnd && (
                        <button 
                          className="btn-secondary text-xs px-3 py-2" 
                          onClick={() => { 
                            setCustomStart(null); 
                            setCustomEnd(null); 
                            setCustomSummary(null); 
                          }}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-[var(--surface)]">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Category</th>
                          <th className="px-4 py-3 text-right font-semibold">Planned</th>
                          <th className="px-4 py-3 text-right font-semibold">Actual</th>
                          <th className="px-4 py-3 text-right font-semibold">Difference</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-subtle)]">
                        {(customSummary ? customSummary.lines : summary.lines).map((line) => (
                          <tr key={line.category_id} className="hover:bg-[var(--surface)] transition-colors">
                            <td className="px-4 py-3 font-medium">{line.category_name}</td>
                            <td className="px-4 py-3 text-right font-semibold">
                              {formatMoney(line.planned)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {formatMoney(line.actual)}
                            </td>
                            <td
                              className={
                                "px-4 py-3 text-right font-semibold " +
                                (Number(line.difference) >= 0
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400")
                              }
                            >
                              {formatMoney(line.difference)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-[var(--surface)] border-t-2 border-[var(--border-subtle)]">
                        <tr className="font-bold">
                          <td className="px-4 py-4">Total</td>
                          <td className="px-4 py-4 text-right">
                            {formatMoney((customSummary ? customSummary.totals.planned : summary.totals.planned))}
                          </td>
                          <td className="px-4 py-4 text-right">
                            {formatMoney((customSummary ? customSummary.totals.actual : summary.totals.actual))}
                          </td>
                          <td
                            className={
                              "px-4 py-4 text-right text-lg " +
                              (Number((customSummary ? customSummary.totals.difference : summary.totals.difference)) >= 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400")
                            }
                          >
                            {formatMoney((customSummary ? customSummary.totals.difference : summary.totals.difference))}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </>
              )}

              {!loadingSummary && !summary && (
                <div className="text-center py-16 text-[var(--text-muted)]">
                  <div className="text-5xl mb-4">📋</div>
                  <p className="text-lg mb-2 font-medium">Select a budget</p>
                  <p className="text-sm">Choose a budget from the list to view its summary</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
      {/* End of right column */}
      </div>
      {/* End of first grid */}
    </div>
  );
}
