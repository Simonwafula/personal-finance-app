// src/pages/DashboardPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAggregatedTransactions, fetchTopCategories } from "../api/finance";
import { fetchTransactions } from "../api/finance";
import { fetchCurrentNetWorth, fetchNetWorthSnapshots } from "../api/wealth";
import { useTimeRange } from "../contexts/TimeRangeContext";
// TimeRangeSelector comes from global context (rendered in Layout)
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts";
import type { NetWorthCurrent } from "../api/types";

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
  const { range } = useTimeRange();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [nw, nws] = await Promise.all([
          fetchCurrentNetWorth().catch(() => null),
          fetchNetWorthSnapshots().catch(() => []),
        ]);

        // Aggregated data from backend for the selected range
        const q: any = {
          start: range.startDate,
          end: range.endDate,
          group_by: 'day',
        };
        const [agg, top, recent] = await Promise.all([
          fetchAggregatedTransactions(q),
          fetchTopCategories({ start: range.startDate, end: range.endDate, limit: 6 }),
          fetchTransactions({ start: range.startDate, end: range.endDate, limit: 6 }).catch(() => []),
        ]);

        // no local txs were fetched; aggregated series drives charts
        setAggregatedSeries((agg.series && agg.series.length > 0) ? agg.series : generateEmptyDaySeries(range.startDate, range.endDate));
        setCategorySeries(top.categories.map((c:any) => ({ id: c.id, name: c.name, amount: c.amount })));
        setRecentTx(recent || []);

        // Compute totals from aggregated series
        let income = 0;
        let expenses = 0;
        (agg.series || []).forEach(p => { income += p.income; expenses += p.expenses; });
        setTotals({ income, expenses, savings: income - expenses });

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
  }, [range.startDate, range.endDate]);

  // listen for created transactions elsewhere and reload aggregated content
  useEffect(() => {
    function onUpdated() {
      (async () => {
        try {
          const q: any = { start: range.startDate, end: range.endDate, group_by: 'day' };
          const agg = await fetchAggregatedTransactions(q);
          setAggregatedSeries((agg.series && agg.series.length > 0) ? agg.series : generateEmptyDaySeries(range.startDate, range.endDate));
          const top = await fetchTopCategories({ start: range.startDate, end: range.endDate, limit: 6 });
          setCategorySeries(top.categories.map((c:any) => ({ id: c.id, name: c.name, amount: c.amount })));
          const recent = await fetchTransactions({ start: range.startDate, end: range.endDate, limit: 6 }).catch(() => []);
          setRecentTx(recent || []);
          let income = 0; let expenses = 0;
          (agg.series || []).forEach((p:any) => { income += p.income; expenses += p.expenses; });
          setTotals({ income, expenses, savings: income - expenses });
        } catch (err) {
          // ignore
        }
      })();
    }
    window.addEventListener('transactionsUpdated', onUpdated);
    return () => window.removeEventListener('transactionsUpdated', onUpdated);
  }, [range.startDate, range.endDate]);

  // Chart data helpers
  const startDate = range.startDate;
  const endDate = range.endDate;
  const [aggregatedSeries, setAggregatedSeries] = useState<{date:string;income:number;expenses:number}[]>([]);

  function generateEmptyDaySeries(start: string, end: string) {
    const s = new Date(start);
    const e = new Date(end);
    const out: {date:string;income:number;expenses:number}[] = [];
    for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
      out.push({ date: d.toISOString().slice(0,10), income: 0, expenses: 0 });
    }
    return out;
  }

  useEffect(() => {
    // nothing; we use aggregatedSeries from API now.
  }, [startDate, endDate]);

  useEffect(() => {
    // Whenever the aggregated data changes by range, update the series state
  }, [aggregatedSeries]);

  // nets worth series
  const [snapshots, setSnapshots] = useState<any[]>([]);
  // top categories
  const [categorySeries, setCategorySeries] = useState<any[]>([]);
  const [recentTx, setRecentTx] = useState<any[]>([]);

  // categorySeries is populated by the backend top categories endpoint

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Overview</h3>

      <div className="flex items-center justify-between">
        <div />
        <div className="w-1/3">
          {/* TimeRangeSelector is provided globally in the header/layout */}
        </div>
      </div>
      {loading && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="skeleton h-28 rounded" />
          <div className="skeleton h-28 rounded" />
          <div className="skeleton h-28 rounded" />
        </div>
      )}
      {error && (
        <div className="text-red-600 text-sm flex items-center gap-3">
          <div>{error}</div>
          <button className="btn-secondary" onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {!loading && (
        <>
          {/* Sparkline mini-cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="card spark-card">
              <div style={{flex:1}}>
                <div className="text-xs text-gray-500">Income (spark)</div>
                <div className="spark-value">{formatMoney(totals.income)} KES</div>
              </div>
              <div style={{width:120, height:40}}>
                <ResponsiveContainer width="100%" height={36}>
                  <AreaChart data={aggregatedSeries}>
                    <Area dataKey="income" stroke="#16A34A" fillOpacity={0.12} fill="#16A34A" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card spark-card">
              <div style={{flex:1}}>
                <div className="text-xs text-gray-500">Expenses (spark)</div>
                <div className="spark-value">{formatMoney(totals.expenses)} KES</div>
              </div>
              <div style={{width:120, height:40}}>
                <ResponsiveContainer width="100%" height={36}>
                  <AreaChart data={aggregatedSeries}>
                    <Area dataKey="expenses" stroke="#DC2626" fillOpacity={0.12} fill="#DC2626" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card spark-card">
              <div style={{flex:1}}>
                <div className="text-xs text-gray-500">Net (spark)</div>
                <div className="spark-value">{formatMoney(totals.savings)} KES</div>
              </div>
              <div style={{width:120, height:40}}>
                <ResponsiveContainer width="100%" height={36}>
                  <AreaChart data={aggregatedSeries.map(s => ({ date: s.date, net: s.income - s.expenses }))}>
                    <Area dataKey="net" stroke="#3B82F6" fillOpacity={0.12} fill="#3B82F6" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent transactions */}
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-500">Recent transactions</div>
              <a href="/transactions" className="text-xs">View all</a>
            </div>
            <div>
              {recentTx.length === 0 && <div className="text-sm text-gray-500">No recent transactions</div>}
              {recentTx.length > 0 && (
                <ul className="space-y-2">
                  {recentTx.map((t:any) => (
                    <li key={t.id} className="flex items-center justify-between">
                      <div>
                        <div style={{fontWeight:600}}>{t.description || t.category_name || 'Transaction'}</div>
                        <div className="text-xs muted">{t.date} • {t.account_name || ''}</div>
                      </div>
                      <div style={{fontWeight:700, color: t.amount < 0 ? 'var(--danger-500)' : 'var(--success-500)'}}>{formatMoney(t.amount)} KES</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="card cursor-pointer" onClick={() => navigate(`/transactions?start=${range.startDate}&end=${range.endDate}&kind=EXPENSE`)}>
              <div className="text-xs text-gray-500 mb-1">Total Income</div>
              <div className="text-2xl font-bold">
                {formatMoney(totals.income)} KES
              </div>
              <div className="mt-2">
                {/* income vs expenses area chart */}
                <ResponsiveContainer width="100%" height={80}>
                  <AreaChart data={aggregatedSeries} onClick={(e:any) => { const payload = e?.activePayload?.[0]?.payload; if(payload?.date) navigate(`/transactions?start=${payload.date}&end=${payload.date}`) }}>
                    <defs>
                      <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16A34A" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#DC2626" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" hide />
                    <Tooltip formatter={(value: any) => formatMoney(value as string | number)} />
                    <Area type="monotone" dataKey="income" stroke="#16A34A" fill="url(#incomeGrad)" />
                    <Area type="monotone" dataKey="expenses" stroke="#DC2626" fill="url(#expenseGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <div className="text-xs text-gray-500 mb-1">Total Expenses</div>
              <div className="text-2xl font-bold text-red-600">
                {formatMoney(totals.expenses)} KES
              </div>
            </div>

            <div className="card">
              <div className="text-xs text-gray-500 mb-1">Net Savings</div>
              <div className={"text-2xl font-bold " + (totals.savings >= 0 ? "text-green-600" : "text-red-600")}>
                {formatMoney(totals.savings)} KES
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="card">
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
                          <Area type="monotone" dataKey="net" stroke="#3B82F6" fill="#3B82F6" onClick={(e:any) => { const payload = e?.payload; if(payload?.date) navigate(`/wealth?date=${payload.date}`) }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500">No net worth data yet. Add assets & liabilities.</div>
              )}
            </div>

            <div className="card">
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
                      <Bar dataKey="amount" fill="#F97316" onClick={(d:any) => { const categoryId = d?.payload?.id; navigate(`/transactions?category=${categoryId}&start=${range.startDate}&end=${range.endDate}`) }} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="card">
              <div className="text-xs text-gray-500 mb-1">Quick notes (future widgets)</div>
              <div className="text-sm text-gray-600">Here we’ll later add charts: cashflow over time, top spending categories, etc.</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
