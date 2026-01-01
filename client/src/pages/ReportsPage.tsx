// src/pages/ReportsPage.tsx - Financial Reports Generation
import { useState, useEffect, useMemo } from "react";
import { HiDocumentReport, HiDownload, HiCalendar, HiChartBar, HiFilter, HiChevronDown, HiChevronUp, HiDocumentText } from "react-icons/hi";
import { 
  fetchTransactionsPaged, 
  fetchAccounts, 
  fetchCategories, 
  fetchAggregatedTransactions 
} from "../api/finance";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import type { Transaction, Account, Category } from "../api/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function formatMoney(value: number) {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

type ReportPeriod = "month" | "quarter" | "year" | "custom";
type TransactionFilter = {
  kind: "ALL" | "INCOME" | "EXPENSE" | "TRANSFER";
  category: number | null;
  account: number | null;
  search: string;
};

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
  transactions: Transaction[];
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
  
  // Transaction list state
  const [showTransactions, setShowTransactions] = useState(false);
  const [txFilter, setTxFilter] = useState<TransactionFilter>({
    kind: "ALL",
    category: null,
    account: null,
    search: ""
  });
  const [txPage, setTxPage] = useState(1);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const txPerPage = 25;

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
      const [transactionsRes, accountsData, categoriesData, trendData] = await Promise.all([
        fetchTransactionsPaged({ start: dates.start, end: dates.end, limit: 5000 }),
        fetchAccounts(),
        fetchCategories(),
        fetchAggregatedTransactions({ start: dates.start, end: dates.end, group_by: period === "year" ? "month" : "day" })
      ]);

      setAccounts(accountsData);
      setCategories(categoriesData);

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
      const categoryLookup = new Map(categoriesData.map(c => [c.id, c]));
      
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
      const accountBalances = accountsData.map(acc => ({
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
        topExpenses,
        transactions
      });
      setTxPage(1); // Reset pagination when new report generated
    } catch (err: any) {
      setError(err.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  }

  // Filtered transactions with memoization
  const filteredTransactions = useMemo(() => {
    if (!reportData?.transactions) return [];
    
    return reportData.transactions.filter(tx => {
      // Kind filter
      if (txFilter.kind !== "ALL" && tx.kind !== txFilter.kind) return false;
      
      // Category filter
      if (txFilter.category !== null) {
        const catObj = tx.category as { id: number } | number | null;
        const catId = typeof catObj === 'number' ? catObj : catObj?.id;
        if (catId !== txFilter.category) return false;
      }
      
      // Account filter
      if (txFilter.account !== null && tx.account !== txFilter.account) return false;
      
      // Search filter
      if (txFilter.search) {
        const search = txFilter.search.toLowerCase();
        const desc = (tx.description || "").toLowerCase();
        const catName = (tx.category_name || "").toLowerCase();
        const accName = (tx.account_name || "").toLowerCase();
        if (!desc.includes(search) && !catName.includes(search) && !accName.includes(search)) return false;
      }
      
      return true;
    });
  }, [reportData?.transactions, txFilter]);

  const paginatedTransactions = useMemo(() => {
    const start = (txPage - 1) * txPerPage;
    return filteredTransactions.slice(start, start + txPerPage);
  }, [filteredTransactions, txPage]);

  const totalTxPages = Math.ceil(filteredTransactions.length / txPerPage);

  async function downloadCSV() {
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
      
      lines.push("=== ALL TRANSACTIONS ===");
      lines.push("Date,Account,Description,Category,Type,Amount");
      // Use filtered transactions if filter is active, otherwise all
      const txToExport = filteredTransactions.length !== reportData.transactions.length 
        ? filteredTransactions 
        : reportData.transactions;
      txToExport.forEach(tx => {
        const desc = (tx.description || "").replace(/"/g, '""');
        lines.push(`${tx.date},"${tx.account_name || ''}","${desc}","${tx.category_name || ''}",${tx.kind},${Number(tx.amount).toFixed(2)}`);
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

  async function downloadPDF() {
    if (!reportData) return;
    
    setGenerating(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(16, 185, 129); // emerald-500
      doc.text("Financial Report", pageWidth / 2, 20, { align: "center" });
      
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Period: ${reportData.period.label}`, pageWidth / 2, 28, { align: "center" });
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 34, { align: "center" });
      
      // Summary Section
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text("Summary", 14, 48);
      
      autoTable(doc, {
        startY: 52,
        head: [["Metric", "Value"]],
        body: [
          ["Total Income", `KES ${formatMoney(reportData.summary.totalIncome)}`],
          ["Total Expenses", `KES ${formatMoney(reportData.summary.totalExpenses)}`],
          ["Net Savings", `KES ${formatMoney(reportData.summary.netSavings)}`],
          ["Savings Rate", `${reportData.summary.savingsRate.toFixed(1)}%`],
          ["Total Transactions", reportData.summary.transactionCount.toString()],
        ],
        theme: "striped",
        headStyles: { fillColor: [16, 185, 129] },
        margin: { left: 14, right: 14 },
      });
      
      // Category Breakdown
      let yPos = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(14);
      doc.text("Expenses by Category", 14, yPos);
      
      autoTable(doc, {
        startY: yPos + 4,
        head: [["Category", "Amount", "Percentage"]],
        body: reportData.categoryBreakdown.map(cat => [
          cat.name,
          `KES ${formatMoney(cat.amount)}`,
          `${cat.percentage.toFixed(1)}%`
        ]),
        theme: "striped",
        headStyles: { fillColor: [16, 185, 129] },
        margin: { left: 14, right: 14 },
      });
      
      // Account Balances
      yPos = (doc as any).lastAutoTable.finalY + 10;
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(14);
      doc.text("Account Balances", 14, yPos);
      
      autoTable(doc, {
        startY: yPos + 4,
        head: [["Account", "Type", "Balance"]],
        body: reportData.accountBalances.map(acc => [
          acc.name,
          acc.type,
          `KES ${formatMoney(acc.balance)}`
        ]),
        theme: "striped",
        headStyles: { fillColor: [59, 130, 246] },
        margin: { left: 14, right: 14 },
      });
      
      // Transactions (new page)
      doc.addPage();
      doc.setFontSize(14);
      doc.text("Transactions", 14, 20);
      
      // Use filtered transactions if filter is active
      const txToExport = filteredTransactions.length !== reportData.transactions.length 
        ? filteredTransactions 
        : reportData.transactions;
      
      if (filteredTransactions.length !== reportData.transactions.length) {
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`(Filtered: ${filteredTransactions.length} of ${reportData.transactions.length} transactions)`, 14, 26);
        doc.setTextColor(0);
      }
      
      autoTable(doc, {
        startY: filteredTransactions.length !== reportData.transactions.length ? 30 : 24,
        head: [["Date", "Account", "Description", "Category", "Type", "Amount"]],
        body: txToExport.map(tx => [
          tx.date,
          tx.account_name || "",
          (tx.description || "").substring(0, 30),
          tx.category_name || "-",
          tx.kind,
          `${tx.kind === "EXPENSE" ? "-" : ""}KES ${formatMoney(Number(tx.amount))}`
        ]),
        theme: "striped",
        headStyles: { fillColor: [16, 185, 129] },
        margin: { left: 14, right: 14 },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          2: { cellWidth: 40 }, // Description
          5: { halign: "right" }, // Amount
        },
      });
      
      // Footer with page numbers
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
      }
      
      doc.save(`financial-report-${reportData.period.start}-to-${reportData.period.end}.pdf`);
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
          <div className="flex gap-2">
            <button
              onClick={downloadCSV}
              disabled={generating}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <HiDownload size={18} />
              {generating ? "..." : "CSV"}
            </button>
            <button
              onClick={downloadPDF}
              disabled={generating}
              className="btn-primary inline-flex items-center gap-2"
            >
              <HiDocumentText size={18} />
              {generating ? "..." : "PDF"}
            </button>
          </div>
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

          {/* All Transactions Section - Collapsible */}
          <div className="card overflow-hidden">
            <button
              onClick={() => setShowTransactions(!showTransactions)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <HiFilter className="text-emerald-600" size={20} />
                <div className="text-left">
                  <h3 className="font-semibold">All Transactions</h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    {reportData.transactions.length} transactions in this period
                    {filteredTransactions.length !== reportData.transactions.length && (
                      <span className="ml-2 text-emerald-600">({filteredTransactions.length} filtered)</span>
                    )}
                  </p>
                </div>
              </div>
              {showTransactions ? <HiChevronUp size={24} /> : <HiChevronDown size={24} />}
            </button>

            {showTransactions && (
              <div className="border-t border-[var(--border-subtle)]">
                {/* Filters */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-[var(--border-subtle)]">
                  <div className="flex flex-wrap gap-3 items-end">
                    {/* Search */}
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Search</label>
                      <input
                        type="text"
                        placeholder="Search description, category, account..."
                        value={txFilter.search}
                        onChange={e => {
                          setTxFilter(f => ({ ...f, search: e.target.value }));
                          setTxPage(1);
                        }}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm"
                      />
                    </div>
                    
                    {/* Type Filter */}
                    <div>
                      <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Type</label>
                      <select
                        value={txFilter.kind}
                        onChange={e => {
                          setTxFilter(f => ({ ...f, kind: e.target.value as any }));
                          setTxPage(1);
                        }}
                        className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm"
                      >
                        <option value="ALL">All Types</option>
                        <option value="INCOME">Income</option>
                        <option value="EXPENSE">Expense</option>
                        <option value="TRANSFER">Transfer</option>
                      </select>
                    </div>
                    
                    {/* Category Filter */}
                    <div>
                      <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Category</label>
                      <select
                        value={txFilter.category ?? ""}
                        onChange={e => {
                          setTxFilter(f => ({ ...f, category: e.target.value ? Number(e.target.value) : null }));
                          setTxPage(1);
                        }}
                        className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm"
                      >
                        <option value="">All Categories</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Account Filter */}
                    <div>
                      <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Account</label>
                      <select
                        value={txFilter.account ?? ""}
                        onChange={e => {
                          setTxFilter(f => ({ ...f, account: e.target.value ? Number(e.target.value) : null }));
                          setTxPage(1);
                        }}
                        className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-sm"
                      >
                        <option value="">All Accounts</option>
                        {accounts.map(a => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Clear Filters */}
                    {(txFilter.kind !== "ALL" || txFilter.category !== null || txFilter.account !== null || txFilter.search) && (
                      <button
                        onClick={() => {
                          setTxFilter({ kind: "ALL", category: null, account: null, search: "" });
                          setTxPage(1);
                        }}
                        className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>

                {/* Transaction Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border-subtle)] bg-gray-50 dark:bg-gray-800/30">
                        <th className="text-left py-3 px-4 text-[var(--text-muted)] font-medium">Date</th>
                        <th className="text-left py-3 px-4 text-[var(--text-muted)] font-medium">Account</th>
                        <th className="text-left py-3 px-4 text-[var(--text-muted)] font-medium">Description</th>
                        <th className="text-left py-3 px-4 text-[var(--text-muted)] font-medium">Category</th>
                        <th className="text-center py-3 px-4 text-[var(--text-muted)] font-medium">Type</th>
                        <th className="text-right py-3 px-4 text-[var(--text-muted)] font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTransactions.length > 0 ? (
                        paginatedTransactions.map(tx => (
                          <tr key={tx.id} className="border-b border-[var(--border-subtle)] hover:bg-gray-50 dark:hover:bg-gray-800/30">
                            <td className="py-3 px-4 whitespace-nowrap">{tx.date}</td>
                            <td className="py-3 px-4 whitespace-nowrap">{tx.account_name || "-"}</td>
                            <td className="py-3 px-4 max-w-xs truncate">{tx.description || "-"}</td>
                            <td className="py-3 px-4 whitespace-nowrap">{tx.category_name || "-"}</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                tx.kind === "INCOME" 
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                  : tx.kind === "EXPENSE"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              }`}>
                                {tx.kind}
                              </span>
                            </td>
                            <td className={`py-3 px-4 text-right font-medium whitespace-nowrap ${
                              tx.kind === "INCOME" ? "text-emerald-600" : tx.kind === "EXPENSE" ? "text-red-500" : "text-blue-600"
                            }`}>
                              {tx.kind === "EXPENSE" ? "-" : ""}KES {formatMoney(Number(tx.amount))}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-[var(--text-muted)]">
                            No transactions match your filters
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalTxPages > 1 && (
                  <div className="p-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                    <p className="text-sm text-[var(--text-muted)]">
                      Showing {((txPage - 1) * txPerPage) + 1} - {Math.min(txPage * txPerPage, filteredTransactions.length)} of {filteredTransactions.length}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTxPage(p => Math.max(1, p - 1))}
                        disabled={txPage === 1}
                        className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1.5 text-sm text-[var(--text-muted)]">
                        Page {txPage} of {totalTxPages}
                      </span>
                      <button
                        onClick={() => setTxPage(p => Math.min(totalTxPages, p + 1))}
                        disabled={txPage === totalTxPages}
                        className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* Summary Footer */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-[var(--border-subtle)]">
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div>
                      <span className="text-[var(--text-muted)]">Filtered Income: </span>
                      <span className="font-semibold text-emerald-600">
                        KES {formatMoney(filteredTransactions.filter(t => t.kind === "INCOME").reduce((s, t) => s + Number(t.amount), 0))}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)]">Filtered Expenses: </span>
                      <span className="font-semibold text-red-500">
                        KES {formatMoney(filteredTransactions.filter(t => t.kind === "EXPENSE").reduce((s, t) => s + Number(t.amount), 0))}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)]">Net: </span>
                      <span className={`font-semibold ${
                        filteredTransactions.filter(t => t.kind === "INCOME").reduce((s, t) => s + Number(t.amount), 0) -
                        filteredTransactions.filter(t => t.kind === "EXPENSE").reduce((s, t) => s + Number(t.amount), 0) >= 0
                          ? "text-emerald-600" : "text-red-500"
                      }`}>
                        KES {formatMoney(
                          filteredTransactions.filter(t => t.kind === "INCOME").reduce((s, t) => s + Number(t.amount), 0) -
                          filteredTransactions.filter(t => t.kind === "EXPENSE").reduce((s, t) => s + Number(t.amount), 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
