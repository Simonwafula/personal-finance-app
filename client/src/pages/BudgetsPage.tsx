// src/pages/BudgetsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { fetchBudgets, fetchBudgetSummary, createBudget, createBudgetLine, fetchBudgetLines, updateBudgetLine, deleteBudgetLine } from "../api/budgeting";
import { fetchCategories, fetchTransactions } from "../api/finance";
import TimeRangeSelector from "../components/TimeRangeSelector";
import type { Category, Budget, BudgetSummary, BudgetLine } from "../api/types";

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
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Budgets
          </h3>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Plan and track your spending against budget goals
          </p>
        </div>
      </div>

      {error && (
        <div className="card bg-red-50 border-red-200 text-red-700 text-sm p-4 animate-slide-in">
          {error}
        </div>
      )}

      {loadingBudgets && <div className="skeleton h-32 rounded" />}

      {/* Create budget form */
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

      {/* Create budget form */}
      <div className="card animate-slide-in">
        <div className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>📝</span>
          Create Budget
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
        >
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">Budget Name *</label>
              <input
                className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                value={budgetName}
                onChange={(e) => setBudgetName(e.target.value)}
                placeholder="e.g., January 2025, Q1 Budget"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Period Type</label>
              <select
                value={periodType}
                onChange={(e) => setPeriodType(e.target.value as any)}
                className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="MONTHLY">Monthly</option>
                <option value="ANNUAL">Annual</option>
                <option value="CUSTOM">Custom</option>
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Notes (optional)</label>
            <textarea
              className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors"
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
              className="btn-primary disabled:opacity-60"
            >
              {creating ? "Creating…" : "Create Budget"}
            </button>
          </div>
        </form>
      </div>

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
                  className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors"
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
                  className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors"
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
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {lines.map((line) => {
                      const editing = editingId === line.id;
                      return (
                        <tr key={line.id} className="hover:bg-[var(--surface)] transition-colors">
                          <td className="px-4 py-3">
                            {editing ? (
                              <select
                                className="w-full border-2 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
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
                                className="w-full border-2 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
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
      )}      {budgets.length > 0 && (
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
  );
}
