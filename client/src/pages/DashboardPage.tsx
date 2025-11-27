// src/pages/DashboardPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTransactions } from "../api/finance";
import { fetchCurrentNetWorth, fetchNetWorthSnapshots } from "../api/wealth";
import TimeRangeSelector from "../components/TimeRangeSelector";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts";
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

  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [txs, nw, nws] = await Promise.all([
          fetchTransactions(),
          fetchCurrentNetWorth().catch(() => null),
          fetchNetWorthSnapshots().catch(() => []),
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

        setTransactions(txs);

        if (nw) setNetWorth(nw);
        if (nws && nws.length > 0) {
            setSnapshots(nws);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // Chart data helpers
  function buildSeriesForRange(startDate: string, endDate: string) {
    // build daily or monthly based on span length
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    const diffDays = Math.ceil((+eDate - +sDate) / (24 * 60 * 60 * 1000));
    const bucketBy = diffDays <= 60 ? "day" : "month";
    const map: Record<string, { date: string; income: number; expenses: number }> = {};
    txsFiltered.forEach((tx) => {
      const d = new Date(tx.date);
      if (d < sDate || d > eDate) return;
      let key = d.toISOString().slice(0, 10);
      if (bucketBy === "month") key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}`;
      if (!map[key]) map[key] = { date: key, income: 0, expenses: 0 };
      if (tx.kind === "INCOME") map[key].income += Number(tx.amount);
      else if (tx.kind === "EXPENSE") map[key].expenses += Number(tx.amount);
    });
    const arr = Object.values(map).sort((a,b) => a.date.localeCompare(b.date));
    return arr;
  }

  const [startDate, setStartDate] = useState<string>(new Date(Date.now() - 30 * 24*60*60*1000).toISOString().slice(0,10));
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [txsFiltered, setTxsFiltered] = useState<Transaction[]>([]);

  useEffect(() => {
    // Apply a client-side filter to transactions by the selected range
    const s = new Date(startDate), e = new Date(endDate);
    const filtered = transactions.filter(tx => {
      const d = new Date(tx.date);
      return d >= s && d <= e;
    });
    setTxsFiltered(filtered);
  }, [startDate, endDate, transactions]);

  // nets worth series
  const [snapshots, setSnapshots] = useState<any[]>([]);
  // top categories
  const [categorySeries, setCategorySeries] = useState<any[]>([]);

  useEffect(() => {
    const map: Record<number, { id: number; name: string; amount: number }> = {};
    txsFiltered.forEach((tx) => {
      if (tx.kind === "EXPENSE") {
        const cid = tx.category || 0;
        const name = tx.category_name || "Uncategorized";
        if (!map[cid]) map[cid] = { id: cid, name, amount: 0 };
        map[cid].amount += Number(tx.amount);
      }
    });
    const arr = Object.values(map).sort((a,b) => b.amount - a.amount).slice(0,6);
    setCategorySeries(arr);
  }, [txsFiltered]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Overview</h3>

      <div className="flex items-center justify-between">
        <div />
        <div className="w-1/3">
          <TimeRangeSelector
            initialStart={startDate}
            initialEnd={endDate}
            onChange={(r) => {
              setStartDate(r.startDate);
              setEndDate(r.endDate);
            }}
          />
        </div>
      </div>
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
              <div className="mt-2">
                {/* income vs expenses area chart */}
                <ResponsiveContainer width="100%" height={80}>
                  <AreaChart data={buildSeriesForRange(startDate, endDate)} onClick={(e:any) => { const payload = e?.activePayload?.[0]?.payload; if(payload?.date) navigate(`/transactions?start=${payload.date}&end=${payload.date}`) }}>
                    <defs>
                      <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f87171" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" hide />
                    <Tooltip formatter={(value: any) => formatMoney(value as string | number)} />
                    <Area type="monotone" dataKey="income" stroke="#10b981" fill="url(#incomeGrad)" />
                    <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="url(#expenseGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
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
              <div className={"text-2xl font-bold " + (totals.savings >= 0 ? "text-green-600" : "text-red-600")}>
                {formatMoney(totals.savings)} KES
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-white shadow">
              <div className="text-xs text-gray-500 mb-1">Net Worth</div>
              {netWorth ? (
                <>
                  <div className="text-2xl font-bold">{formatMoney(netWorth.net_worth)} KES</div>
                  <div className="text-xs text-gray-500 mt-1">Assets: {formatMoney(netWorth.total_assets)} • Liabilities: {formatMoney(netWorth.total_liabilities)}</div>
                  <div className="mt-2">
                    {snapshots.length > 0 && (
                      <ResponsiveContainer width="100%" height={120}>
                        <AreaChart data={snapshots.map((s:any) => ({ date: s.date, net: Number(s.net_worth) })).sort((a,b)=>a.date.localeCompare(b.date))}>
                          <XAxis dataKey="date" />
                          <Tooltip formatter={(v: any) => formatMoney(v as string | number)} />
                          <Area type="monotone" dataKey="net" stroke="#6366f1" fill="#6366f1" onClick={(e:any) => { const payload = e?.payload; if(payload?.date) navigate(`/wealth?date=${payload.date}`) }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500">No net worth data yet. Add assets & liabilities.</div>
              )}
            </div>

            <div className="p-4 rounded-lg bg-white shadow">
              <div className="text-xs text-gray-500 mb-1">Top Expense Categories</div>
              <div style={{ width: "100%", height: 180 }}>
                {categorySeries.length === 0 && <div className="text-sm text-gray-500">No data</div>}
                {categorySeries.length > 0 && (
                  <ResponsiveContainer width="100%" height={140}>
                    <BarChart layout="vertical" data={categorySeries}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={140} />
                      <Tooltip formatter={(v: any) => formatMoney(v as string | number)} />
                      <Bar dataKey="amount" fill="#f97316" onClick={(d:any) => { const categoryId = d?.payload?.id; navigate(`/transactions?category=${categoryId}&start=${startDate}&end=${endDate}`) }} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white shadow">
              <div className="text-xs text-gray-500 mb-1">Quick notes (future widgets)</div>
              <div className="text-sm text-gray-600">Here we’ll later add charts: cashflow over time, top spending categories, etc.</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
