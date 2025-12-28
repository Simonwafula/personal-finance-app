// src/pages/ReportsPage.tsx - Financial Reports Generation
import { useState, useEffect } from "react";
import { HiDocumentReport, HiDownload, HiCalendar, HiChartBar } from "react-icons/hi";
import { 
  fetchTransactionsPaged, 
  fetchAccounts, 
  fetchCategories, 
  fetchAggregatedTransactions 
} from "../api/finance";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import type { Transaction } from "../api/types";

function formatMoney(value: number) {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

type ReportPeriod = "month" | "quarter" | "year" | "custom";

interface ReportData {
  period: { start: string; end: string; label: string };
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
    savingsRate: number;
    transactionCount: number;
  };
  categoryBreakdown: { name: string; amount: number; percentage: number; color: string }[];
  accountBalances: { name: string; balance: number; type: string }[];
  trendData: { date: string; income: number; expenses: number }[];
  topExpenses: { description: string; amount: number; category: string; date: string }[];
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#6366F1'];

export default function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>("month");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  function getPeriodDates(p: ReportPeriod): { start: string; end: string; label: string } {
    const now = new Date();
    
    if (p === "month") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return {
        start: start.toISOString().slice(0, 10),
        end: end.toISOString().slice(0, 10),
        label: start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };
    }
    
    if (p === "quarter") {
      const quarter = Math.floor(now.getMonth() / 3);
      const start = new Date(now.getFullYear(), quarter * 3, 1);
      const end = new Date(now.getFullYear(), quarter * 3 + 3, 0);
      return {
        start: start.toISOString().slice(0, 10),
        end: end.toISOString().slice(0, 10),
        label: `Q${quarter + 1} ${now.getFullYear()}`
      };
    }
    
    if (p === "year") {
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear(), 11, 31);
      return {
        start: start.toISOString().slice(0, 10),
        end: end.toISOString().slice(0, 10),
        label: `Year ${now.getFullYear()}`
      };
    }
    
    // Custom
    return {
      start: customStart || now.toISOString().slice(0, 10),
      end: customEnd || now.toISOString().slice(0, 10),
      label: `${customStart} to ${customEnd}`
    };
  }

  async function generateReport() {
    setLoading(true);
    setError(null);
    
    try {
      const dates = getPeriodDates(period);
      
      // Fetch all needed data
      const [transactionsRes, accounts, categories, trendData] = await Promise.all([
        fetchTransactionsPaged({ start: dates.start, end: dates.end, limit: 1000 }),
        fetchAccounts(),
        fetchCategories(),
        fetchAggregatedTransactions({ start: dates.start, end: dates.end, group_by: period === "year" ? "month" : "day" })
      ]);

      const transactions: Transaction[] = transactionsRes.results || transactionsRes;
      
      // Calculate summary
      const totalIncome = transactions
        .filter(t => t.kind === "INCOME")
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const totalExpenses = transactions
        .filter(t => t.kind === "EXPENSE")
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const netSavings = totalIncome - totalExpenses;
      const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

      // Category breakdown for expenses
      const categoryMap = new Map<number, { name: string; amount: number }>();
      const categoryLookup = new Map(categories.map(c => [c.id, c]));
      
      transactions
        .filter(t => t.kind === "EXPENSE" && t.category)
        .forEach(t => {
          const catObj = t.category as { id: number; name: string } | number | null;
          const catId = typeof catObj === 'number' ? catObj : (catObj as { id: number })?.id;
          if (!catId) return;
          const cat = categoryLookup.get(catId);
          const existing = categoryMap.get(catId) || { name: cat?.name || "Unknown", amount: 0 };
          existing.amount += Number(t.amount);
          categoryMap.set(catId, existing);
        });

      const categoryBreakdown = Array.from(categoryMap.entries())
        .map(([, data], idx) => ({
          name: data.name,
          amount: data.amount,
          percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
          color: COLORS[idx % COLORS.length]
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 8);

      // Account balances
      const accountBalances = accounts.map(acc => ({
        name: acc.name,
        balance: Number(acc.current_balance || acc.opening_balance || 0),
        type: acc.account_type
      }));

      // Top expenses
      const topExpenses = transactions
        .filter(t => t.kind === "EXPENSE")
        .sort((a, b) => Number(b.amount) - Number(a.amount))
        .slice(0, 10)
        .map(t => {
          const catObj = t.category as { id: number; name: string } | number | null;
          const catName = typeof catObj === 'object' && catObj ? catObj.name : categoryLookup.get(catObj as number)?.name || "-";
          return {
            description: t.description || "No description",
            amount: Number(t.amount),
            category: catName,
            date: t.date
          };
        });

      setReportData({
        period: dates,
        summary: {
          totalIncome,
          totalExpenses,
          netSavings,
          savingsRate,
          transactionCount: transactions.length
        },
        categoryBreakdown,
        accountBalances,
        trendData: trendData.series || [],
        topExpenses
      });
    } catch (err: any) {
      setError(err.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  }

  async function downloadReport() {
    if (!reportData) return;
    
    setGenerating(true);
    try {
      // Generate CSV report
      const lines: string[] = [];
      lines.push("FINANCIAL REPORT");
      lines.push(`Period: ${reportData.period.label}`);
      lines.push(`Generated: ${new Date().toISOString()}`);
      lines.push("");
      
      lines.push("=== SUMMARY ===");
      lines.push(`Total Income,${reportData.summary.totalIncome.toFixed(2)}`);
      lines.push(`Total Expenses,${reportData.summary.totalExpenses.toFixed(2)}`);
      lines.push(`Net Savings,${reportData.summary.netSavings.toFixed(2)}`);
      lines.push(`Savings Rate,${reportData.summary.savingsRate.toFixed(1)}%`);
      lines.push(`Total Transactions,${reportData.summary.transactionCount}`);
      lines.push("");
      
      lines.push("=== EXPENSES BY CATEGORY ===");
      lines.push("Category,Amount,Percentage");
      reportData.categoryBreakdown.forEach(cat => {
        lines.push(`${cat.name},${cat.amount.toFixed(2)},${cat.percentage.toFixed(1)}%`);
      });
      lines.push("");
      
      lines.push("=== ACCOUNT BALANCES ===");
      lines.push("Account,Type,Balance");
      reportData.accountBalances.forEach(acc => {
        lines.push(`${acc.name},${acc.type},${acc.balance.toFixed(2)}`);
      });
      lines.push("");
      
      lines.push("=== TOP EXPENSES ===");
      lines.push("Date,Description,Category,Amount");
      reportData.topExpenses.forEach(exp => {
        lines.push(`${exp.date},"${exp.description}",${exp.category},${exp.amount.toFixed(2)}`);
      });
      
      const csv = lines.join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `financial-report-${reportData.period.start}-to-${reportData.period.end}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
    }
  }

  useEffect(() => {
    generateReport();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-2">
            <HiDocumentReport className="text-emerald-600" size={24} />
            Financial Reports
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Generate detailed financial summaries and insights</p>
        </div>
        {reportData && (
          <button
            onClick={downloadReport}
            disabled={generating}
            className="btn-primary inline-flex items-center gap-2"
          >
            <HiDownload size={18} />
            {generating ? "Generating..." : "Download Report"}
          </button>
        )}
      </div>

      {/* Period Selection */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium mb-2 text-[var(--text-muted)]">Report Period</label>
            <div className="flex gap-2">
              {(["month", "quarter", "year", "custom"] as ReportPeriod[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    period === p
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-[var(--text-muted)] hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {period === "custom" && (
            <>
              <div>
                <label className="block text-xs font-medium mb-2 text-[var(--text-muted)]">Start Date</label>
                <input
                  type="date"
                  value={customStart}
                  onChange={e => setCustomStart(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2 text-[var(--text-muted)]">End Date</label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={e => setCustomEnd(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                />
              </div>
            </>
          )}
          
          <button
            onClick={generateReport}
            disabled={loading}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <HiChartBar size={18} />
            {loading ? "Generating..." : "Generate Report"}
          </button>
        </div>
      </div>

      {error && (
        <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="card p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-3"></div>
          <p className="text-[var(--text-muted)]">Generating report...</p>
        </div>
      )}

      {reportData && !loading && (
        <>
          {/* Period Label */}
          <div className="flex items-center gap-2 text-lg font-semibold">
            <HiCalendar className="text-emerald-600" />
            <span>{reportData.period.label}</span>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="card p-4">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Total Income</p>
              <p className="text-2xl font-bold text-emerald-600">KES {formatMoney(reportData.summary.totalIncome)}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Total Expenses</p>
              <p className="text-2xl font-bold text-red-500">KES {formatMoney(reportData.summary.totalExpenses)}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Net Savings</p>
              <p className={`text-2xl font-bold ${reportData.summary.netSavings >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                KES {formatMoney(reportData.summary.netSavings)}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Savings Rate</p>
              <p className={`text-2xl font-bold ${reportData.summary.savingsRate >= 20 ? 'text-emerald-600' : reportData.summary.savingsRate >= 0 ? 'text-amber-500' : 'text-red-500'}`}>
                {reportData.summary.savingsRate.toFixed(1)}%
              </p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Transactions</p>
              <p className="text-2xl font-bold text-blue-600">{reportData.summary.transactionCount}</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Trend Chart */}
            <div className="card p-4">
              <h3 className="font-semibold mb-4">Income vs Expenses Trend</h3>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <AreaChart data={reportData.trendData}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => d?.slice(5) || ''} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: number) => `KES ${formatMoney(v)}`} />
                    <Area type="monotone" dataKey="income" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Income" />
                    <Area type="monotone" dataKey="expenses" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} name="Expenses" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Pie Chart */}
            <div className="card p-4">
              <h3 className="font-semibold mb-4">Expenses by Category</h3>
              {reportData.categoryBreakdown.length > 0 ? (
                <div className="flex items-center gap-4">
                  <div style={{ width: 180, height: 180 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={reportData.categoryBreakdown}
                          dataKey="amount"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={false}
                        >
                          {reportData.categoryBreakdown.map((entry, idx) => (
                            <Cell key={idx} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number) => `KES ${formatMoney(v)}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2 text-sm">
                    {reportData.categoryBreakdown.slice(0, 6).map((cat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                        <span className="flex-1 truncate">{cat.name}</span>
                        <span className="text-[var(--text-muted)]">{cat.percentage.toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-[var(--text-muted)] py-8">No expense data for this period</p>
              )}
            </div>
          </div>

          {/* Account Balances */}
          <div className="card p-4">
            <h3 className="font-semibold mb-4">Account Balances</h3>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <BarChart data={reportData.accountBalances} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
                  <Tooltip formatter={(v: number) => `KES ${formatMoney(v)}`} />
                  <Bar dataKey="balance" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Expenses Table */}
          <div className="card p-4">
            <h3 className="font-semibold mb-4">Top 10 Expenses</h3>
            {reportData.topExpenses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border-subtle)]">
                      <th className="text-left py-2 px-3 text-[var(--text-muted)]">Date</th>
                      <th className="text-left py-2 px-3 text-[var(--text-muted)]">Description</th>
                      <th className="text-left py-2 px-3 text-[var(--text-muted)]">Category</th>
                      <th className="text-right py-2 px-3 text-[var(--text-muted)]">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.topExpenses.map((exp, idx) => (
                      <tr key={idx} className="border-b border-[var(--border-subtle)]">
                        <td className="py-2 px-3">{exp.date}</td>
                        <td className="py-2 px-3 max-w-xs truncate">{exp.description}</td>
                        <td className="py-2 px-3">{exp.category}</td>
                        <td className="py-2 px-3 text-right font-medium text-red-500">KES {formatMoney(exp.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-[var(--text-muted)] py-8">No expenses for this period</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
