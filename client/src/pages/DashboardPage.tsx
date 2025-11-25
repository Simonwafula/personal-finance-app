// src/pages/DashboardPage.tsx
import { useEffect, useState } from "react";
import { fetchTransactions } from "../api/finance";
import { fetchCurrentNetWorth } from "../api/wealth";
import type { Transaction, NetWorthCurrent } from "../api/types";

interface DashboardTotals {
  income: number;
  expenses: number;
  savings: number;
}

function formatMoney(value: number | string) {
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return value.toString();
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function DashboardPage() {
  const [totals, setTotals] = useState<DashboardTotals>({
    income: 0,
    expenses: 0,
    savings: 0,
  });
  const [netWorth, setNetWorth] = useState<NetWorthCurrent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [txs, nw] = await Promise.all([
          fetchTransactions(),
          fetchCurrentNetWorth().catch(() => null),
        ]);

        // Simple totals over all transactions for now
        let income = 0;
        let expenses = 0;

        txs.forEach((tx: Transaction) => {
          const amount = Number(tx.amount);
          if (tx.kind === "INCOME") {
            income += amount;
          } else if (tx.kind === "EXPENSE") {
            expenses += amount;
          }
        });

        setTotals({
          income,
          expenses,
          savings: income - expenses,
        });

        if (nw) setNetWorth(nw);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Overview</h3>

      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}

      {!loading && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-white shadow">
              <div className="text-xs text-gray-500 mb-1">Total Income</div>
              <div className="text-2xl font-bold">
                {formatMoney(totals.income)} KES
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white shadow">
              <div className="text-xs text-gray-500 mb-1">Total Expenses</div>
              <div className="text-2xl font-bold text-red-600">
                {formatMoney(totals.expenses)} KES
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white shadow">
              <div className="text-xs text-gray-500 mb-1">Net Savings</div>
              <div
                className={
                  "text-2xl font-bold " +
                  (totals.savings >= 0 ? "text-green-600" : "text-red-600")
                }
              >
                {formatMoney(totals.savings)} KES
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-white shadow">
              <div className="text-xs text-gray-500 mb-1">Net Worth</div>
              {netWorth ? (
                <>
                  <div className="text-2xl font-bold">
                    {formatMoney(netWorth.net_worth)} KES
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Assets: {formatMoney(netWorth.total_assets)} • Liabilities:{" "}
                    {formatMoney(netWorth.total_liabilities)}
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500">
                  No net worth data yet. Add assets & liabilities.
                </div>
              )}
            </div>

            <div className="p-4 rounded-lg bg-white shadow">
              <div className="text-xs text-gray-500 mb-1">
                Quick notes (future widgets)
              </div>
              <div className="text-sm text-gray-600">
                Here we’ll later add charts: cashflow over time, top spending
                categories, etc.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
