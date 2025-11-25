// src/pages/BudgetsPage.tsx
import { useEffect, useState } from "react";
import { fetchBudgets, fetchBudgetSummary } from "../api/budgeting";
import type { Budget, BudgetSummary } from "../api/types";

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
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [loadingBudgets, setLoadingBudgets] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setSummary(null);
      return;
    }
    async function loadSummary() {
      try {
        setLoadingSummary(true);
        const data = await fetchBudgetSummary(selectedId);
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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Budgets</h3>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      {loadingBudgets && <div>Loading budgets…</div>}

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
                <div className="mb-3">
                  <div className="text-sm font-semibold">
                    {summary.budget.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {summary.budget.start_date} → {summary.budget.end_date}
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
                      {summary.lines.map((line) => (
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
                          {formatMoney(summary.totals.planned)}
                        </td>
                        <td className="px-2 py-1 text-right font-semibold">
                          {formatMoney(summary.totals.actual)}
                        </td>
                        <td
                          className={
                            "px-2 py-1 text-right font-semibold " +
                            (Number(summary.totals.difference) >= 0
                              ? "text-green-600"
                              : "text-red-600")
                          }
                        >
                          {formatMoney(summary.totals.difference)}
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
