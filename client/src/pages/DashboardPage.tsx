// src/pages/DashboardPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAggregatedTransactions, fetchTopCategories, fetchAccounts } from "../api/finance";
import { fetchTransactions } from "../api/finance";
import { fetchCurrentNetWorth, fetchNetWorthSnapshots } from "../api/wealth";
import { getSavingsSummary, type SavingsSummary } from "../api/savings";
import { getInvestmentSummary, type InvestmentSummary } from "../api/investments";
import type { Account } from "../api/types";
import { useTimeRange } from "../contexts/TimeRangeContext";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts";
import type { NetWorthCurrent } from "../api/types";
import { HiHome, HiPlus, HiRefresh } from "react-icons/hi";

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
  const [liquidity, setLiquidity] = useState<number>(0);
  const [savingsGoals, setSavingsGoals] = useState<SavingsSummary | null>(null);
  const [investmentsSummary, setInvestmentsSummary] = useState<InvestmentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { range } = useTimeRange();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [nw, nws, accountsData, savingsSummary, invSummary] = await Promise.all([
          fetchCurrentNetWorth().catch(() => null),
          fetchNetWorthSnapshots().catch(() => []),
          fetchAccounts().catch(() => [] as Account[]),
          getSavingsSummary().catch(() => null),
          getInvestmentSummary().catch(() => null),
        ]);

        if (savingsSummary) setSavingsGoals(savingsSummary);
        if (invSummary) setInvestmentsSummary(invSummary);

        // Calculate liquidity (immediate access cash)
        const liquidTypes = ['BANK', 'MOBILE_MONEY', 'CASH', 'SACCO'];
        const totalLiquidity = accountsData
          .filter((a: Account) => liquidTypes.includes(a.account_type))
          .reduce((sum: number, a: Account) => sum + Number(a.current_balance || a.opening_balance), 0);
        setLiquidity(totalLiquidity);

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

  // Helper to format date range nicely
  const formatDateRange = (start: string, end: string) => {
    const startD = new Date(start);
    const endD = new Date(end);
    const sameYear = startD.getFullYear() === endD.getFullYear();
    const sameMonth = sameYear && startD.getMonth() === endD.getMonth();
    
    if (sameMonth) {
      return `${startD.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${endD.getDate()}, ${endD.getFullYear()}`;
    }
    if (sameYear) {
      return `${startD.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endD.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${endD.getFullYear()}`;
    }
    return `${startD.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${endD.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <HiHome className="text-indigo-600" />
            Dashboard
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {formatDateRange(range.startDate, range.endDate)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/transactions?action=add')}
            className="btn-primary inline-flex items-center gap-2 text-sm shadow-lg shadow-indigo-500/20"
          >
            <HiPlus size={16} />
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </button>
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary p-2"
            title="Refresh"
          >
            <HiRefresh size={18} />
          </button>
        </div>
      </div>

      {loading && (
        <div className="kpi-grid">
          <div className="skeleton h-32 rounded-xl" />
          <div className="skeleton h-32 rounded-xl" />
          <div className="skeleton h-32 rounded-xl" />
          <div className="skeleton h-32 rounded-xl" />
        </div>
      )}

      {error && (
        <div className="card-elevated p-4 bg-red-500/10 border-red-500/20 animate-slide-in">
          <div className="flex items-center justify-between">
            <div className="text-red-400">{error}</div>
            <button className="btn-secondary" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* Enhanced KPI Cards */}
          <div className="kpi-grid">
            {/* Income Card */}
            <div className="kpi-card neu-stat-card">
              <div className="kpi-label">Total Income</div>
              <div className="kpi-value" style={{ color: 'var(--success-400)' }}>
                {formatMoney(totals.income)}
              </div>
              <div className="text-xs text-[var(--text-muted)] mb-3">KES</div>
              <div style={{height:60}}>
                <ResponsiveContainer width="100%" height={60}>
                  <AreaChart data={aggregatedSeries}>
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--success-400)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--success-400)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area
                      dataKey="income"
                      stroke="var(--success-400)"
                      strokeWidth={2}
                      fill="url(#incomeGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Expenses Card */}
            <div className="kpi-card neu-stat-card">
              <div className="kpi-label">Total Expenses</div>
              <div className="kpi-value" style={{ color: 'var(--danger-400)' }}>
                {formatMoney(totals.expenses)}
              </div>
              <div className="text-xs text-[var(--text-muted)] mb-3">KES</div>
              <div style={{height:60}}>
                <ResponsiveContainer width="100%" height={60}>
                  <AreaChart data={aggregatedSeries}>
                    <defs>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--danger-400)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--danger-400)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area
                      dataKey="expenses"
                      stroke="var(--danger-400)"
                      strokeWidth={2}
                      fill="url(#expenseGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Net Cash Flow Card */}
            <div className="kpi-card neu-stat-card">
              <div className="kpi-label">Net Cash Flow</div>
              <div className="kpi-value" style={{ color: totals.savings >= 0 ? 'var(--primary-400)' : 'var(--danger-400)' }}>
                {formatMoney(totals.savings)}
              </div>
              <div className="text-xs text-[var(--text-muted)] mb-3">KES</div>
              <div style={{height:60}}>
                <ResponsiveContainer width="100%" height={60}>
                  <AreaChart data={aggregatedSeries.map(s => ({ date: s.date, net: s.income - s.expenses }))}>
                    <defs>
                      <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary-400)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--primary-400)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area
                      dataKey="net"
                      stroke="var(--primary-400)"
                      strokeWidth={2}
                      fill="url(#netGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Liquidity Card - Available Cash */}
            <div className="kpi-card neu-stat-card cursor-pointer" onClick={() => navigate('/accounts')}>
              <div className="kpi-label">💵 Available Cash</div>
              <div className="kpi-value" style={{ color: 'var(--success-400)' }}>
                {formatMoney(liquidity)}
              </div>
              <div className="text-xs text-[var(--text-muted)] mb-3">KES</div>
              <div className="text-xs text-[var(--text-muted)]">
                Immediate access funds
              </div>
            </div>

            {/* Net Worth Card */}
            {netWorth && (
              <div className="kpi-card neu-stat-card cursor-pointer" onClick={() => navigate('/wealth')}>
                <div className="kpi-label">Net Worth</div>
                <div className="kpi-value" style={{ color: 'var(--accent-400)' }}>
                  {formatMoney(netWorth.net_worth)}
                </div>
                <div className="text-xs text-[var(--text-muted)] mb-3">KES</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="kpi-change positive">
                    ↑ Assets: {formatMoney(netWorth.total_assets)}
                  </span>
                  <span className="kpi-change negative">
                    ↓ Debt: {formatMoney(netWorth.total_liabilities)}
                  </span>
                </div>
              </div>
            )}

            {/* Savings Goals Card */}
            {savingsGoals && savingsGoals.total_goals > 0 && (
              <div className="kpi-card neu-stat-card cursor-pointer" onClick={() => navigate('/savings')}>
                <div className="kpi-label">🎯 Savings Goals</div>
                <div className="kpi-value" style={{ color: 'var(--primary-400)' }}>
                  {formatMoney(savingsGoals.total_saved)}
                </div>
                <div className="text-xs text-[var(--text-muted)] mb-3">KES saved</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">
                    {savingsGoals.total_goals} goal{savingsGoals.total_goals !== 1 ? 's' : ''}
                  </span>
                  <span className="kpi-change positive">
                    {savingsGoals.average_progress.toFixed(0)}% avg
                  </span>
                </div>
              </div>
            )}

            {/* Investments Card */}
            {investmentsSummary && investmentsSummary.investment_count > 0 && (
              <div className="kpi-card neu-stat-card cursor-pointer" onClick={() => navigate('/investments')}>
                <div className="kpi-label">📈 Investments</div>
                <div className="kpi-value" style={{ color: 'var(--accent-400)' }}>
                  {formatMoney(investmentsSummary.total_current_value)}
                </div>
                <div className="text-xs text-[var(--text-muted)] mb-3">KES value</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">
                    {investmentsSummary.investment_count} holding{investmentsSummary.investment_count !== 1 ? 's' : ''}
                  </span>
                  <span className={`kpi-change ${investmentsSummary.total_gain_loss >= 0 ? 'positive' : 'negative'}`}>
                    {investmentsSummary.total_gain_loss >= 0 ? '+' : ''}{investmentsSummary.total_gain_loss_percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="card-elevated">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Recent Transactions</h3>
              <button
                onClick={() => navigate('/transactions')}
                className="text-sm font-semibold text-[var(--primary-400)] hover:text-[var(--primary-500)] transition-colors"
              >
                View all →
              </button>
            </div>
            <div>
              {recentTx.length === 0 && (
                <div className="text-center py-8 text-[var(--text-muted)]">
                  No recent transactions
                </div>
              )}
              {recentTx.length > 0 && (
                <div className="space-y-3">
                  {recentTx.map((t:any) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-glass)] hover:bg-[var(--surface-hover)] transition-all cursor-pointer"
                      onClick={() => navigate('/transactions')}
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-[var(--text-main)]">
                          {t.description || t.category_name || 'Transaction'}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">
                          {t.date} • {t.account_name || ''}
                        </div>
                      </div>
                      <div
                        className="text-lg font-bold"
                        style={{
                          color: t.amount < 0 ? 'var(--danger-400)' : 'var(--success-400)'
                        }}
                      >
                        {t.amount < 0 ? '-' : '+'}{formatMoney(Math.abs(t.amount))} KES
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Cashflow Chart */}
            <div className="chart-container">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">Cashflow Trend</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Income vs Expenses over time
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart
                  data={aggregatedSeries}
                  onClick={(e:any) => {
                    const payload = e?.activePayload?.[0]?.payload;
                    if(payload?.date) navigate(`/transactions?start=${payload.date}&end=${payload.date}`)
                  }}
                >
                  <defs>
                    <linearGradient id="chartIncomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--success-400)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--success-400)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="chartExpenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--danger-400)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--danger-400)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    stroke="var(--text-muted)"
                    fontSize={11}
                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '12px',
                      padding: '12px',
                      backdropFilter: 'blur(20px)',
                    }}
                    labelStyle={{ color: 'var(--text-main)', fontWeight: 600 }}
                    itemStyle={{ color: 'var(--text-muted)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="var(--success-400)"
                    strokeWidth={2}
                    fill="url(#chartIncomeGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="var(--danger-400)"
                    strokeWidth={2}
                    fill="url(#chartExpenseGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-container">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">Top Expense Categories</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Breakdown by spending category
                  </p>
                </div>
              </div>
              {categorySeries.length === 0 && (
                <div className="text-center py-12 text-[var(--text-muted)]">
                  No category data available
                </div>
              )}
              {categorySeries.length > 0 && (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    layout="vertical"
                    data={categorySeries}
                    onClick={(d:any) => {
                      const categoryId = d?.activePayload?.[0]?.payload?.id;
                      if (categoryId) navigate(`/transactions?category=${categoryId}&start=${range.startDate}&end=${range.endDate}`)
                    }}
                  >
                    <defs>
                      <linearGradient id="categoryBarGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="var(--accent-400)" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="var(--accent-500)" stopOpacity={1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.3} />
                    <XAxis type="number" stroke="var(--text-muted)" fontSize={11} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={120}
                      stroke="var(--text-muted)"
                      fontSize={11}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--surface)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px',
                        padding: '12px',
                        backdropFilter: 'blur(20px)',
                      }}
                      labelStyle={{ color: 'var(--text-main)', fontWeight: 600 }}
                      itemStyle={{ color: 'var(--text-muted)' }}
                      formatter={(v: any) => formatMoney(v as string | number)}
                    />
                    <Bar
                      dataKey="amount"
                      fill="url(#categoryBarGrad)"
                      radius={[0, 8, 8, 0]}
                      cursor="pointer"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Net Worth Trend */}
          {netWorth && snapshots.length > 0 && (
            <div className="chart-container">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">Net Worth Over Time</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Historical net worth snapshots
                  </p>
                </div>
                <button
                  onClick={() => navigate('/wealth')}
                  className="text-sm font-semibold text-[var(--primary-400)] hover:text-[var(--primary-500)] transition-colors"
                >
                  Manage →
                </button>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart
                  data={snapshots.map((s:any) => ({
                    date: s.date,
                    net: Number(s.net_worth),
                    assets: Number(s.total_assets),
                    liabilities: Number(s.total_liabilities)
                  })).sort((a,b)=>a.date.localeCompare(b.date))}
                  onClick={(e:any) => {
                    const payload = e?.activePayload?.[0]?.payload;
                    if (payload?.date) navigate(`/wealth?date=${payload.date}`)
                  }}
                >
                  <defs>
                    <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary-400)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary-400)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    stroke="var(--text-muted)"
                    fontSize={11}
                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '12px',
                      padding: '12px',
                      backdropFilter: 'blur(20px)',
                    }}
                    labelStyle={{ color: 'var(--text-main)', fontWeight: 600 }}
                    itemStyle={{ color: 'var(--text-muted)' }}
                    formatter={(v: any) => formatMoney(v as string | number)}
                  />
                  <Area
                    type="monotone"
                    dataKey="net"
                    stroke="var(--primary-400)"
                    strokeWidth={2}
                    fill="url(#netWorthGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}
