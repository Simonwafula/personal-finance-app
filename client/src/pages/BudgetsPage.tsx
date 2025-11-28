// src/pages/BudgetsPage.tsx
import { useEffect, useState } from "react";
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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Budgets</h3>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      {loadingBudgets && <div>Loading budgets…</div>}

      {/* Create budget form */}
      <div className="card max-w-xl">
        <div className="text-sm font-medium mb-2">Create Budget</div>
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
          <div className="grid md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <input
                className="w-full border rounded px-2 py-1 text-sm"
                value={budgetName}
                onChange={(e) => setBudgetName(e.target.value)}
                placeholder="Budget name"
                required
              />
            </div>
            <div>
              <select
                value={periodType}
                onChange={(e) => setPeriodType(e.target.value as any)}
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value="MONTHLY">Monthly</option>
                <option value="ANNUAL">Annual</option>
                <option value="CUSTOM">Custom</option>
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3 mt-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>
          <div className="mt-2">
            <textarea
              className="w-full border rounded px-2 py-1 text-sm"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optional)"
            />
          </div>
          <div className="mt-2">
            <button
              type="submit"
              disabled={creating}
              className="btn-primary text-sm disabled:opacity-60"
            >
              {creating ? "Creating…" : "Create Budget"}
            </button>
          </div>
        </form>
      </div>

      {/* Budget line creation */}
      {selectedId && (
        <div className="card max-w-xl">
          <div className="text-sm font-medium mb-2">Add Budget Line</div>
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
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <select
                  value={categoryId}
                  onChange={(e) =>
                    setCategoryId(e.target.value ? Number(e.target.value) : "")
                  }
                  className="w-full border rounded px-2 py-1 text-sm"
                >
                  <option value="">— select category —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.kind})</option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="number"
                  step="0.01"
                  value={plannedAmount}
                  onChange={(e) => setPlannedAmount(e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="btn-primary text-sm disabled:opacity-60"
                >
                  Add Line
                </button>
              </div>
            </div>
          </form>

          {/* Better: show lines */}
          <div className="mt-3">
            <div className="text-xs text-gray-500 mb-1">Lines</div>
            {lines.length === 0 && <div className="text-sm text-gray-500">No lines for this budget.</div>}
            {lines.length > 0 && (
              <table className="min-w-full text-xs md:text-sm table-hover">
                <thead className="bg-gray-50 table-sticky">
                  <tr>
                    <th className="px-2 py-1 text-left">Category</th>
                    <th className="px-2 py-1 text-right">Planned</th>
                    <th className="px-2 py-1 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line) => {
                    const editing = editingId === line.id;
                    return (
                      <tr key={line.id} className="border-t">
                        <td className="px-2 py-1">
                          {editing ? (
                            <select
                              className="w-full border rounded px-2 py-1 text-sm"
                              value={editCategoryId}
                              onChange={(e) => setEditCategoryId(e.target.value ? Number(e.target.value) : "")}
                            >
                              <option value="">— select category —</option>
                              {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name} ({c.kind})</option>
                              ))}
                            </select>
                          ) : (
                            line.category_name
                          )}
                        </td>
                        <td className="px-2 py-1 text-right">
                          {editing ? (
                            <input
                              type="number"
                              step="0.01"
                              className="w-full border rounded px-2 py-1 text-sm"
                              value={editPlannedAmount}
                              onChange={(e) => setEditPlannedAmount(e.target.value)}
                            />
                          ) : (
                            formatMoney(line.planned_amount)
                          )}
                        </td>
                        <td className="px-2 py-1 text-left">
                          {editing ? (
                            <div className="flex gap-2">
                              <button
                                className="btn-success text-xs px-2 py-1 rounded"
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
                                className="btn-secondary text-xs px-2 py-1 rounded"
                                onClick={() => setEditingId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                className="btn-primary text-xs px-2 py-1 rounded"
                                onClick={() => {
                                  setEditingId(line.id);
                                  setEditCategoryId(line.category);
                                  setEditPlannedAmount(String(line.planned_amount));
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn-danger text-xs px-2 py-1 rounded"
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
            )}
          </div>
        </div>
      )}

      {!loadingBudgets && budgets.length === 0 && (
        <div className="text-sm text-gray-500">
          No budgets yet. Create some via Django admin for now.
        </div>
      )}

      {budgets.length > 0 && (
        <div className="flex flex-col md:flex-row gap-4">
          {/* Budget list */}
          <div className="md:w-1/3 bg-white rounded-lg shadow p-3">
            <div className="text-xs text-gray-500 mb-2">Select a budget</div>
            <ul className="space-y-1">
              {budgets.map((b) => {
                const active = b.id === selectedId;
                return (
                  <li key={b.id}>
                    <button
                      className={
                        "w-full text-left px-3 py-2 rounded-md text-sm " +
                        (active
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200")
                      }
                      onClick={() => setSelectedId(b.id)}
                    >
                      <div className="font-medium">{b.name}</div>
                      <div className="text-[11px] text-gray-500">
                        {b.start_date} → {b.end_date}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Budget summary */}
          <div className="md:flex-1 bg-white rounded-lg shadow p-3">
            {loadingSummary && <div>Loading summary…</div>}

            {!loadingSummary && summary && (
              <>
                <div className="flex justify-between items-center mb-2">
                  <div />
                  <div className="w-1/2 flex items-center justify-end">
                    <TimeRangeSelector
                      onChange={(r) => { setCustomStart(r.startDate); setCustomEnd(r.endDate); }}
                      initialStart={customStart ?? undefined}
                      initialEnd={customEnd ?? undefined}
                    />
                    {customStart && customEnd && (
                      <button className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded" onClick={() => { setCustomStart(null); setCustomEnd(null); setCustomSummary(null); }}>
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <div className="text-sm font-semibold">
                    {(customSummary ?? summary)?.budget.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {(customSummary ?? summary)?.budget.start_date} → {(customSummary ?? summary)?.budget.end_date}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs md:text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-1 text-left">Category</th>
                        <th className="px-2 py-1 text-right">Planned</th>
                        <th className="px-2 py-1 text-right">Actual</th>
                        <th className="px-2 py-1 text-right">Difference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(customSummary ? customSummary.lines : summary.lines).map((line) => (
                        <tr key={line.category_id} className="border-t">
                          <td className="px-2 py-1">{line.category_name}</td>
                          <td className="px-2 py-1 text-right">
                            {formatMoney(line.planned)}
                          </td>
                          <td className="px-2 py-1 text-right">
                            {formatMoney(line.actual)}
                          </td>
                          <td
                            className={
                              "px-2 py-1 text-right " +
                              (Number(line.difference) >= 0
                                ? "text-green-600"
                                : "text-red-600")
                            }
                          >
                            {formatMoney(line.difference)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                        <tfoot className="bg-gray-50 border-t">
                      <tr>
                        <td className="px-2 py-1 font-semibold">Total</td>
                        <td className="px-2 py-1 text-right font-semibold">
                          {formatMoney((customSummary ? customSummary.totals.planned : summary.totals.planned))}
                        </td>
                        <td className="px-2 py-1 text-right font-semibold">
                          {formatMoney((customSummary ? customSummary.totals.actual : summary.totals.actual))}
                        </td>
                        <td
                          className={
                            "px-2 py-1 text-right font-semibold " +
                            (Number((customSummary ? customSummary.totals.difference : summary.totals.difference)) >= 0
                              ? "text-green-600"
                              : "text-red-600")
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
              <div className="text-sm text-gray-500">
                Select a budget from the list.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
