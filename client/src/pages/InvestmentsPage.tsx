// src/pages/InvestmentsPage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getInvestments,
  createInvestment,
  updateInvestment,
  deleteInvestment,
  getInvestmentSummary,
  updateInvestmentPrice,
} from "../api/investments";
import type { Investment, InvestmentSummary, CreateInvestmentData } from "../api/investments";
import { HiPlus, HiPencil, HiTrash, HiX, HiRefresh, HiTrendingUp, HiTrendingDown } from "react-icons/hi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// Group investment types by their behavior
type InvestmentCategory = "price_based" | "fixed_income" | "deposit_based" | "property" | "insurance" | "other";

const INVESTMENT_TYPES = [
  { value: "STOCK", label: "Stock", icon: "📈", category: "price_based" as InvestmentCategory },
  { value: "ETF", label: "ETF", icon: "🔄", category: "price_based" as InvestmentCategory },
  { value: "MUTUAL_FUND", label: "Mutual Fund", icon: "📊", category: "price_based" as InvestmentCategory },
  { value: "CRYPTO", label: "Cryptocurrency", icon: "🪙", category: "price_based" as InvestmentCategory },
  { value: "BOND", label: "Bond", icon: "📜", category: "fixed_income" as InvestmentCategory },
  { value: "TBILL", label: "Treasury Bill", icon: "🏛️", category: "fixed_income" as InvestmentCategory },
  { value: "TBOND", label: "Treasury Bond", icon: "🏦", category: "fixed_income" as InvestmentCategory },
  { value: "MMF", label: "Money Market Fund", icon: "💵", category: "deposit_based" as InvestmentCategory },
  { value: "FIXED_DEPOSIT", label: "Fixed Deposit", icon: "🔒", category: "deposit_based" as InvestmentCategory },
  { value: "SACCO", label: "SACCO", icon: "🤝", category: "deposit_based" as InvestmentCategory },
  { value: "PENSION", label: "Pension", icon: "👴", category: "deposit_based" as InvestmentCategory },
  { value: "REAL_ESTATE", label: "Real Estate", icon: "🏠", category: "property" as InvestmentCategory },
  { value: "INSURANCE_ENDOWMENT", label: "Insurance - Endowment", icon: "🛡️", category: "insurance" as InvestmentCategory },
  { value: "INSURANCE_WHOLE_LIFE", label: "Insurance - Whole Life", icon: "❤️", category: "insurance" as InvestmentCategory },
  { value: "INSURANCE_EDUCATION", label: "Insurance - Education Plan", icon: "🎓", category: "insurance" as InvestmentCategory },
  { value: "INSURANCE_INVESTMENT", label: "Insurance - Investment Linked", icon: "💎", category: "insurance" as InvestmentCategory },
  { value: "OTHER", label: "Other", icon: "📦", category: "other" as InvestmentCategory },
];

function getInvestmentCategory(type: string): InvestmentCategory {
  return INVESTMENT_TYPES.find((t) => t.value === type)?.category || "other";
}

const TYPE_COLORS: Record<string, string> = {
  STOCK: "#3B82F6",
  BOND: "#10B981",
  MMF: "#8B5CF6",
  TBILL: "#F59E0B",
  TBOND: "#F97316",
  MUTUAL_FUND: "#6366F1",
  ETF: "#EC4899",
  SACCO: "#14B8A6",
  CRYPTO: "#EAB308",
  REAL_ESTATE: "#059669",
  FIXED_DEPOSIT: "#06B6D4",
  PENSION: "#F43F5E",
  INSURANCE_ENDOWMENT: "#7C3AED",
  INSURANCE_WHOLE_LIFE: "#D946EF",
  INSURANCE_EDUCATION: "#0EA5E9",
  INSURANCE_INVESTMENT: "#84CC16",
  OTHER: "#6B7280",
};

function formatMoney(value: string | number) {
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return "0.00";
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function getTypeIcon(type: string) {
  return INVESTMENT_TYPES.find((t) => t.value === type)?.icon || "📦";
}

function getTypeLabel(type: string) {
  return INVESTMENT_TYPES.find((t) => t.value === type)?.label || type;
}

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [summary, setSummary] = useState<InvestmentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "by-type">("all");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateInvestmentData>({
    name: "",
    symbol: "",
    investment_type: "STOCK",
    purchase_date: new Date().toISOString().split("T")[0],
    purchase_price: "",
    quantity: "1",
    purchase_fees: "0",
    current_price: "",
    interest_rate: "",
    maturity_date: "",
    // Bond fields
    bond_type: "",
    payment_frequency: "NONE",
    next_payment_date: "",
    tax_rate: "0",
    face_value: "",
    // Real estate fields
    monthly_rent: "0",
    monthly_costs: "0",
    property_tax_annual: "0",
    occupancy_status: "",
    // Insurance fields
    sum_assured: "",
    premium_frequency: "NONE",
    premium_amount: "0",
    surrender_value: "",
    // SACCO fields
    dividend_rate: "0",
    loan_interest_rebate: "0",
    // Common
    platform: "",
    notes: "",
  });

  // Update price modal
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [priceUpdateInvestment, setPriceUpdateInvestment] = useState<Investment | null>(null);
  const [newPrice, setNewPrice] = useState("");

  async function fetchData() {
    try {
      setLoading(true);
      const [investmentsData, summaryData] = await Promise.all([
        getInvestments(),
        getInvestmentSummary(),
      ]);
      setInvestments(investmentsData);
      setSummary(summaryData);
      setError(null);
    } catch (err) {
      console.error("Error fetching investments:", err);
      setError("Failed to load investments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function resetForm() {
    setFormData({
      name: "",
      symbol: "",
      investment_type: "STOCK",
      purchase_date: new Date().toISOString().split("T")[0],
      purchase_price: "",
      quantity: "1",
      purchase_fees: "0",
      current_price: "",
      interest_rate: "",
      maturity_date: "",
      bond_type: "",
      payment_frequency: "NONE",
      next_payment_date: "",
      tax_rate: "0",
      face_value: "",
      monthly_rent: "0",
      monthly_costs: "0",
      property_tax_annual: "0",
      occupancy_status: "",
      sum_assured: "",
      premium_frequency: "NONE",
      premium_amount: "0",
      surrender_value: "",
      dividend_rate: "0",
      loan_interest_rebate: "0",
      platform: "",
      notes: "",
    });
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(investment: Investment) {
    setEditingId(investment.id);
    setFormData({
      name: investment.name,
      symbol: investment.symbol || "",
      investment_type: investment.investment_type,
      purchase_date: investment.purchase_date,
      purchase_price: investment.purchase_price,
      quantity: investment.quantity,
      purchase_fees: investment.purchase_fees,
      current_price: investment.current_price,
      interest_rate: investment.interest_rate || "",
      maturity_date: investment.maturity_date || "",
      // Bond fields
      bond_type: investment.bond_type || "",
      payment_frequency: investment.payment_frequency || "NONE",
      next_payment_date: investment.next_payment_date || "",
      tax_rate: investment.tax_rate || "0",
      face_value: investment.face_value || "",
      // Real estate fields
      monthly_rent: investment.monthly_rent || "0",
      monthly_costs: investment.monthly_costs || "0",
      property_tax_annual: investment.property_tax_annual || "0",
      occupancy_status: investment.occupancy_status || "",
      // Insurance fields
      sum_assured: investment.sum_assured || "",
      premium_frequency: investment.premium_frequency || "NONE",
      premium_amount: investment.premium_amount || "0",
      surrender_value: investment.surrender_value || "",
      // SACCO fields
      dividend_rate: investment.dividend_rate || "0",
      loan_interest_rebate: investment.loan_interest_rebate || "0",
      // Common
      platform: investment.platform || "",
      notes: investment.notes || "",
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingId) {
        await updateInvestment(editingId, formData);
      } else {
        await createInvestment(formData);
      }
      resetForm();
      fetchData();
    } catch (err) {
      console.error("Error saving investment:", err);
      setError("Failed to save investment");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this investment?")) return;
    try {
      await deleteInvestment(id);
      fetchData();
    } catch (err) {
      console.error("Error deleting investment:", err);
      setError("Failed to delete investment");
    }
  }

  function openPriceUpdate(investment: Investment) {
    setPriceUpdateInvestment(investment);
    setNewPrice(investment.current_price);
    setShowPriceModal(true);
  }

  async function handlePriceUpdate() {
    if (!priceUpdateInvestment || !newPrice) return;
    try {
      await updateInvestmentPrice(priceUpdateInvestment.id, parseFloat(newPrice));
      setShowPriceModal(false);
      setPriceUpdateInvestment(null);
      setNewPrice("");
      fetchData();
    } catch (err) {
      console.error("Error updating price:", err);
      setError("Failed to update price");
    }
  }

  // Prepare pie chart data
  const pieData = summary
    ? Object.entries(summary.by_type).map(([type, data]) => ({
        name: getTypeLabel(type),
        value: data.current_value,
        color: TYPE_COLORS[type] || TYPE_COLORS.OTHER,
      }))
    : [];

  if (loading) {
    return (
      <div className="app-container py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">📈 Investments</h1>
          <p className="text-sm text-[var(--text-muted)]">Track and manage your investment portfolio</p>
        </div>
        <div className="flex gap-2">
          <Link to="/wealth" className="btn btn-secondary text-sm">
            ← Back to Wealth
          </Link>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="btn btn-primary flex items-center gap-2"
          >
            {showForm ? <HiX className="w-4 h-4" /> : <HiPlus className="w-4 h-4" />}
            {showForm ? "Cancel" : "Add Investment"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <HiX className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-4">
            <div className="text-sm text-[var(--text-muted)] mb-1">💰 Total Invested</div>
            <div className="text-xl font-bold">{formatMoney(summary.total_invested)}</div>
          </div>
          <div className="card p-4">
            <div className="text-sm text-[var(--text-muted)] mb-1">📊 Current Value</div>
            <div className="text-xl font-bold">{formatMoney(summary.total_current_value)}</div>
          </div>
          <div className="card p-4">
            <div className="text-sm text-[var(--text-muted)] mb-1 flex items-center gap-1">
              {summary.total_gain_loss >= 0 ? (
                <HiTrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <HiTrendingDown className="w-4 h-4 text-red-600" />
              )}
              Gain/Loss
            </div>
            <div className={`text-xl font-bold ${summary.total_gain_loss >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatMoney(summary.total_gain_loss)}
            </div>
          </div>
          <div className="card p-4">
            <div className="text-sm text-[var(--text-muted)] mb-1">📈 Return</div>
            <div className={`text-xl font-bold ${summary.total_gain_loss_percentage >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatPercent(summary.total_gain_loss_percentage)}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            {editingId ? <HiPencil className="w-4 h-4" /> : <HiPlus className="w-4 h-4" />}
            {editingId ? "Edit Investment" : "Add New Investment"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info - Always shown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Investment Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder={
                    getInvestmentCategory(formData.investment_type) === "price_based" ? "e.g., Safaricom Shares" :
                    getInvestmentCategory(formData.investment_type) === "fixed_income" ? "e.g., KCB Bond 2025" :
                    getInvestmentCategory(formData.investment_type) === "property" ? "e.g., Karen Apartment" :
                    getInvestmentCategory(formData.investment_type) === "insurance" ? "e.g., Jubilee Education Plan" :
                    "Investment name"
                  }
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type *</label>
                <select
                  value={formData.investment_type}
                  onChange={(e) => setFormData({ ...formData, investment_type: e.target.value })}
                  required
                  className="input w-full"
                >
                  <optgroup label="📈 Price-Based">
                    {INVESTMENT_TYPES.filter(t => t.category === "price_based").map((type) => (
                      <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="📜 Fixed Income">
                    {INVESTMENT_TYPES.filter(t => t.category === "fixed_income").map((type) => (
                      <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="💰 Deposit/Contribution Based">
                    {INVESTMENT_TYPES.filter(t => t.category === "deposit_based").map((type) => (
                      <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🏠 Property">
                    {INVESTMENT_TYPES.filter(t => t.category === "property").map((type) => (
                      <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🛡️ Insurance">
                    {INVESTMENT_TYPES.filter(t => t.category === "insurance").map((type) => (
                      <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="📦 Other">
                    {INVESTMENT_TYPES.filter(t => t.category === "other").map((type) => (
                      <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Platform/Broker</label>
                <input
                  type="text"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  placeholder={
                    getInvestmentCategory(formData.investment_type) === "price_based" ? "e.g., NSE, Binance" :
                    getInvestmentCategory(formData.investment_type) === "fixed_income" ? "e.g., Central Bank, KCB" :
                    getInvestmentCategory(formData.investment_type) === "insurance" ? "e.g., Jubilee, Britam" :
                    "Platform name"
                  }
                  className="input w-full"
                />
              </div>
            </div>

            {/* Category-specific hint */}
            <div className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-lg p-3 text-sm">
              {getInvestmentCategory(formData.investment_type) === "price_based" && (
                <p className="text-[var(--text-muted)]">
                  📈 <strong>Price-Based Investment:</strong> Track by price per unit × quantity. Gain/loss calculated from price changes.
                </p>
              )}
              {getInvestmentCategory(formData.investment_type) === "fixed_income" && (
                <p className="text-[var(--text-muted)]">
                  📜 <strong>Fixed Income:</strong> Track by face value, interest/coupon rate, and maturity date. Returns are predictable.
                </p>
              )}
              {getInvestmentCategory(formData.investment_type) === "deposit_based" && (
                <p className="text-[var(--text-muted)]">
                  💰 <strong>Deposit/Contribution Based:</strong> Track total deposits and current value. Interest rate determines growth.
                </p>
              )}
              {getInvestmentCategory(formData.investment_type) === "property" && (
                <p className="text-[var(--text-muted)]">
                  🏠 <strong>Property:</strong> Track purchase price vs current market value. Consider rental income if applicable.
                </p>
              )}
              {getInvestmentCategory(formData.investment_type) === "insurance" && (
                <p className="text-[var(--text-muted)]">
                  🛡️ <strong>Insurance Product:</strong> Track premiums paid, sum assured, and current surrender/maturity value.
                </p>
              )}
              {getInvestmentCategory(formData.investment_type) === "other" && (
                <p className="text-[var(--text-muted)]">
                  📦 <strong>Other Investment:</strong> Use general fields to track your investment.
                </p>
              )}
            </div>

            {/* Dynamic Fields based on category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* PRICE-BASED: Stocks, ETFs, Mutual Funds, Crypto */}
              {getInvestmentCategory(formData.investment_type) === "price_based" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Symbol/Ticker</label>
                    <input
                      type="text"
                      value={formData.symbol}
                      onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                      placeholder="e.g., SCOM, BTC"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Purchase Date *</label>
                    <input
                      type="date"
                      value={formData.purchase_date}
                      onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                      required
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price Per Unit *</label>
                    <input
                      type="number"
                      value={formData.purchase_price}
                      onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                      required
                      step="0.01"
                      min="0"
                      placeholder="Purchase price per share/unit"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Quantity *</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      required
                      step="0.0001"
                      min="0"
                      placeholder="Number of shares/units"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Price *</label>
                    <input
                      type="number"
                      value={formData.current_price}
                      onChange={(e) => setFormData({ ...formData, current_price: e.target.value })}
                      required
                      step="0.01"
                      min="0"
                      placeholder="Current price per share/unit"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Transaction Fees</label>
                    <input
                      type="number"
                      value={formData.purchase_fees}
                      onChange={(e) => setFormData({ ...formData, purchase_fees: e.target.value })}
                      step="0.01"
                      min="0"
                      placeholder="Broker/exchange fees"
                      className="input w-full"
                    />
                  </div>
                </>
              )}

              {/* FIXED INCOME: Bonds, T-Bills, T-Bonds */}
              {getInvestmentCategory(formData.investment_type) === "fixed_income" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Bond Type *</label>
                    <select
                      value={formData.bond_type}
                      onChange={(e) => {
                        const bondType = e.target.value;
                        // Auto-set tax rate based on bond type
                        const taxRate = bondType === "INFRASTRUCTURE" ? "0" : "15";
                        setFormData({ ...formData, bond_type: bondType, tax_rate: taxRate });
                      }}
                      required
                      className="input w-full"
                    >
                      <option value="">Select bond type...</option>
                      <option value="INFRASTRUCTURE">🏗️ Infrastructure Bond (Tax-Free)</option>
                      <option value="GOVERNMENT">🏛️ Government Bond</option>
                      <option value="CORPORATE">🏢 Corporate Bond</option>
                      <option value="MUNICIPAL">🏘️ Municipal Bond</option>
                      <option value="OTHER">📄 Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Purchase Date *</label>
                    <input
                      type="date"
                      value={formData.purchase_date}
                      onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                      required
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Face Value *</label>
                    <input
                      type="number"
                      value={formData.face_value}
                      onChange={(e) => setFormData({ ...formData, face_value: e.target.value, quantity: e.target.value })}
                      required
                      step="0.01"
                      min="0"
                      placeholder="Par/Face value (e.g., 100,000)"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Purchase Price *</label>
                    <input
                      type="number"
                      value={formData.purchase_price}
                      onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                      required
                      step="0.01"
                      min="0"
                      placeholder="Amount paid (may differ from face value)"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Coupon Rate (%) *</label>
                    <input
                      type="number"
                      value={formData.interest_rate}
                      onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
                      required
                      step="0.001"
                      min="0"
                      max="100"
                      placeholder="Annual coupon rate"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Payment Frequency *</label>
                    <select
                      value={formData.payment_frequency}
                      onChange={(e) => setFormData({ ...formData, payment_frequency: e.target.value })}
                      required
                      className="input w-full"
                    >
                      <option value="SEMI_ANNUAL">Semi-Annual (every 6 months)</option>
                      <option value="QUARTERLY">Quarterly</option>
                      <option value="ANNUAL">Annual</option>
                      <option value="MONTHLY">Monthly</option>
                      <option value="AT_MATURITY">At Maturity (Zero Coupon)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Next Payment Date</label>
                    <input
                      type="date"
                      value={formData.next_payment_date}
                      onChange={(e) => setFormData({ ...formData, next_payment_date: e.target.value })}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Maturity Date *</label>
                    <input
                      type="date"
                      value={formData.maturity_date}
                      onChange={(e) => setFormData({ ...formData, maturity_date: e.target.value })}
                      required
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Withholding Tax (%)</label>
                    <input
                      type="number"
                      value={formData.tax_rate}
                      onChange={(e) => setFormData({ ...formData, tax_rate: e.target.value })}
                      step="0.01"
                      min="0"
                      max="100"
                      placeholder="0 for infra bonds, 15 for others"
                      className="input w-full"
                    />
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {formData.bond_type === "INFRASTRUCTURE" ? "✅ Infrastructure bonds are tax-free" : "Standard 15% WHT on interest"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Market Value</label>
                    <input
                      type="number"
                      value={formData.current_price}
                      onChange={(e) => setFormData({ ...formData, current_price: e.target.value })}
                      step="0.01"
                      min="0"
                      placeholder="Leave blank if holding to maturity"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Bond Reference/ISIN</label>
                    <input
                      type="text"
                      value={formData.symbol}
                      onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                      placeholder="e.g., IFB1/2023/15"
                      className="input w-full"
                    />
                  </div>
                </>
              )}

              {/* DEPOSIT BASED: MMF, Fixed Deposit, SACCO, Pension */}
              {getInvestmentCategory(formData.investment_type) === "deposit_based" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date *</label>
                    <input
                      type="date"
                      value={formData.purchase_date}
                      onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                      required
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {formData.investment_type === "SACCO" ? "Total Deposits/Shares *" : 
                       formData.investment_type === "PENSION" ? "Total Contributions *" : 
                       "Principal Amount *"}
                    </label>
                    <input
                      type="number"
                      value={formData.purchase_price}
                      onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                      required
                      step="0.01"
                      min="0"
                      placeholder="Total amount deposited"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Value *</label>
                    <input
                      type="number"
                      value={formData.current_price}
                      onChange={(e) => setFormData({ ...formData, current_price: e.target.value })}
                      required
                      step="0.01"
                      min="0"
                      placeholder="Current balance/value"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {formData.investment_type === "SACCO" ? "Dividend Rate (%)" : "Interest Rate (%)"}
                    </label>
                    <input
                      type="number"
                      value={formData.investment_type === "SACCO" ? formData.dividend_rate : formData.interest_rate}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        [formData.investment_type === "SACCO" ? "dividend_rate" : "interest_rate"]: e.target.value 
                      })}
                      step="0.01"
                      min="0"
                      max="100"
                      placeholder={formData.investment_type === "SACCO" ? "Annual dividend on deposits" : "Annual interest rate"}
                      className="input w-full"
                    />
                  </div>
                  {formData.investment_type === "SACCO" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">Loan Interest Rebate (%)</label>
                        <input
                          type="number"
                          value={formData.loan_interest_rebate}
                          onChange={(e) => setFormData({ ...formData, loan_interest_rebate: e.target.value })}
                          step="0.01"
                          min="0"
                          max="100"
                          placeholder="Interest rebate on loans taken"
                          className="input w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Member Number</label>
                        <input
                          type="text"
                          value={formData.symbol}
                          onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                          placeholder="SACCO membership number"
                          className="input w-full"
                        />
                      </div>
                    </>
                  )}
                  {formData.investment_type === "FIXED_DEPOSIT" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">Maturity Date *</label>
                        <input
                          type="date"
                          value={formData.maturity_date}
                          onChange={(e) => setFormData({ ...formData, maturity_date: e.target.value })}
                          required
                          className="input w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Payment Frequency</label>
                        <select
                          value={formData.payment_frequency}
                          onChange={(e) => setFormData({ ...formData, payment_frequency: e.target.value })}
                          className="input w-full"
                        >
                          <option value="AT_MATURITY">At Maturity</option>
                          <option value="MONTHLY">Monthly</option>
                          <option value="QUARTERLY">Quarterly</option>
                          <option value="ANNUAL">Annual</option>
                        </select>
                      </div>
                    </>
                  )}
                  {formData.investment_type === "MMF" && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Account/Reference Number</label>
                      <input
                        type="text"
                        value={formData.symbol}
                        onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                        placeholder="e.g., CIC MMF account number"
                        className="input w-full"
                      />
                    </div>
                  )}
                </>
              )}

              {/* PROPERTY: Real Estate */}
              {getInvestmentCategory(formData.investment_type) === "property" && (
                <>
                  <div className="sm:col-span-2 lg:col-span-3 border-b border-[var(--border-subtle)] pb-2 mb-2">
                    <h4 className="font-medium text-sm">🏠 Property Details</h4>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Purchase Date *</label>
                    <input
                      type="date"
                      value={formData.purchase_date}
                      onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                      required
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Purchase Price *</label>
                    <input
                      type="number"
                      value={formData.purchase_price}
                      onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                      required
                      step="0.01"
                      min="0"
                      placeholder="Total purchase price"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Market Value *</label>
                    <input
                      type="number"
                      value={formData.current_price}
                      onChange={(e) => setFormData({ ...formData, current_price: e.target.value })}
                      required
                      step="0.01"
                      min="0"
                      placeholder="Estimated current value"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Acquisition Costs</label>
                    <input
                      type="number"
                      value={formData.purchase_fees}
                      onChange={(e) => setFormData({ ...formData, purchase_fees: e.target.value })}
                      step="0.01"
                      min="0"
                      placeholder="Legal fees, stamp duty, commission"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Occupancy Status</label>
                    <select
                      value={formData.occupancy_status}
                      onChange={(e) => setFormData({ ...formData, occupancy_status: e.target.value })}
                      className="input w-full"
                    >
                      <option value="">Not Applicable</option>
                      <option value="OCCUPIED">🟢 Occupied</option>
                      <option value="VACANT">🔴 Vacant</option>
                      <option value="PARTIALLY">🟡 Partially Occupied</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title/LR Number</label>
                    <input
                      type="text"
                      value={formData.symbol}
                      onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                      placeholder="e.g., LR No. 1234/5"
                      className="input w-full"
                    />
                  </div>
                  
                  <div className="sm:col-span-2 lg:col-span-3 border-b border-[var(--border-subtle)] pb-2 mb-2 mt-4">
                    <h4 className="font-medium text-sm">💰 Rental Income (Monthly)</h4>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Monthly Rent</label>
                    <input
                      type="number"
                      value={formData.monthly_rent}
                      onChange={(e) => setFormData({ ...formData, monthly_rent: e.target.value })}
                      step="0.01"
                      min="0"
                      placeholder="Gross monthly rent"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Monthly Costs</label>
                    <input
                      type="number"
                      value={formData.monthly_costs}
                      onChange={(e) => setFormData({ ...formData, monthly_costs: e.target.value })}
                      step="0.01"
                      min="0"
                      placeholder="Maintenance, management, insurance"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Annual Property Tax/Rates</label>
                    <input
                      type="number"
                      value={formData.property_tax_annual}
                      onChange={(e) => setFormData({ ...formData, property_tax_annual: e.target.value })}
                      step="0.01"
                      min="0"
                      placeholder="Land rates, property tax"
                      className="input w-full"
                    />
                  </div>
                  
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium mb-1">Location/Description</label>
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="e.g., 3BR Apartment in Karen, Nairobi"
                      className="input w-full"
                    />
                  </div>
                  
                  {/* Real Estate Preview */}
                  {formData.monthly_rent && parseFloat(String(formData.monthly_rent)) > 0 && (
                    <div className="sm:col-span-2 lg:col-span-3 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-lg p-3">
                      <h4 className="text-sm font-medium mb-2">📊 Rental Analysis</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-[var(--text-muted)]">Gross Annual</span>
                          <div className="font-semibold">{formatMoney(parseFloat(String(formData.monthly_rent)) * 12)}</div>
                        </div>
                        <div>
                          <span className="text-[var(--text-muted)]">Annual Costs</span>
                          <div className="font-semibold text-red-600">
                            -{formatMoney(parseFloat(String(formData.monthly_costs || 0)) * 12 + parseFloat(String(formData.property_tax_annual || 0)))}
                          </div>
                        </div>
                        <div>
                          <span className="text-[var(--text-muted)]">Net Annual</span>
                          <div className="font-semibold text-green-600">
                            {formatMoney(
                              parseFloat(String(formData.monthly_rent)) * 12 - 
                              parseFloat(String(formData.monthly_costs || 0)) * 12 - 
                              parseFloat(String(formData.property_tax_annual || 0))
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-[var(--text-muted)]">Net Yield</span>
                          <div className="font-semibold">
                            {formData.purchase_price ? (
                              ((parseFloat(String(formData.monthly_rent)) * 12 - 
                                parseFloat(String(formData.monthly_costs || 0)) * 12 - 
                                parseFloat(String(formData.property_tax_annual || 0))) / 
                                parseFloat(String(formData.purchase_price)) * 100).toFixed(2) + "%"
                            ) : "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* INSURANCE: All insurance products */}
              {getInvestmentCategory(formData.investment_type) === "insurance" && (
                <>
                  <div className="sm:col-span-2 lg:col-span-3 border-b border-[var(--border-subtle)] pb-2 mb-2">
                    <h4 className="font-medium text-sm">🛡️ Policy Details</h4>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Policy Start Date *</label>
                    <input
                      type="date"
                      value={formData.purchase_date}
                      onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                      required
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Policy Number *</label>
                    <input
                      type="text"
                      value={formData.symbol}
                      onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                      required
                      placeholder="Insurance policy number"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Sum Assured *</label>
                    <input
                      type="number"
                      value={formData.sum_assured}
                      onChange={(e) => setFormData({ ...formData, sum_assured: e.target.value })}
                      required
                      step="0.01"
                      min="0"
                      placeholder="Death benefit / Maturity benefit"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Maturity Date</label>
                    <input
                      type="date"
                      value={formData.maturity_date}
                      onChange={(e) => setFormData({ ...formData, maturity_date: e.target.value })}
                      className="input w-full"
                    />
                  </div>
                  
                  <div className="sm:col-span-2 lg:col-span-3 border-b border-[var(--border-subtle)] pb-2 mb-2 mt-4">
                    <h4 className="font-medium text-sm">💳 Premium Details</h4>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Premium Amount *</label>
                    <input
                      type="number"
                      value={formData.premium_amount}
                      onChange={(e) => setFormData({ ...formData, premium_amount: e.target.value })}
                      required
                      step="0.01"
                      min="0"
                      placeholder="Amount per payment"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Premium Frequency *</label>
                    <select
                      value={formData.premium_frequency}
                      onChange={(e) => setFormData({ ...formData, premium_frequency: e.target.value })}
                      required
                      className="input w-full"
                    >
                      <option value="MONTHLY">Monthly</option>
                      <option value="QUARTERLY">Quarterly</option>
                      <option value="SEMI_ANNUAL">Semi-Annual</option>
                      <option value="ANNUAL">Annual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Total Premiums Paid *</label>
                    <input
                      type="number"
                      value={formData.purchase_price}
                      onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                      required
                      step="0.01"
                      min="0"
                      placeholder="Total premiums paid to date"
                      className="input w-full"
                    />
                  </div>
                  
                  <div className="sm:col-span-2 lg:col-span-3 border-b border-[var(--border-subtle)] pb-2 mb-2 mt-4">
                    <h4 className="font-medium text-sm">💰 Current Value</h4>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Surrender Value</label>
                    <input
                      type="number"
                      value={formData.surrender_value}
                      onChange={(e) => setFormData({ ...formData, surrender_value: e.target.value, current_price: e.target.value })}
                      step="0.01"
                      min="0"
                      placeholder="Current cash/surrender value"
                      className="input w-full"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Beneficiaries, riders, etc."
                      className="input w-full"
                    />
                  </div>
                  
                  {/* Insurance Preview */}
                  {formData.sum_assured && formData.purchase_price && (
                    <div className="sm:col-span-2 lg:col-span-3 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-lg p-3">
                      <h4 className="text-sm font-medium mb-2">📊 Policy Analysis</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-[var(--text-muted)]">Sum Assured</span>
                          <div className="font-semibold">{formatMoney(formData.sum_assured)}</div>
                        </div>
                        <div>
                          <span className="text-[var(--text-muted)]">Premiums Paid</span>
                          <div className="font-semibold">{formatMoney(formData.purchase_price)}</div>
                        </div>
                        <div>
                          <span className="text-[var(--text-muted)]">Surrender Value</span>
                          <div className="font-semibold">{formatMoney(formData.surrender_value || 0)}</div>
                        </div>
                        <div>
                          <span className="text-[var(--text-muted)]">Coverage Ratio</span>
                          <div className="font-semibold">
                            {(parseFloat(String(formData.sum_assured)) / parseFloat(String(formData.purchase_price))).toFixed(1)}x
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* OTHER: Generic fields */}
              {getInvestmentCategory(formData.investment_type) === "other" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date *</label>
                    <input
                      type="date"
                      value={formData.purchase_date}
                      onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                      required
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount Invested *</label>
                    <input
                      type="number"
                      value={formData.purchase_price}
                      onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                      required
                      step="0.01"
                      min="0"
                      placeholder="Total invested"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Value *</label>
                    <input
                      type="number"
                      value={formData.current_price}
                      onChange={(e) => setFormData({ ...formData, current_price: e.target.value })}
                      required
                      step="0.01"
                      min="0"
                      placeholder="Current value"
                      className="input w-full"
                    />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Describe this investment..."
                      className="input w-full"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Preview - Dynamic based on category */}
            {formData.purchase_price && formData.current_price && (
              <div className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-lg p-4">
                <h4 className="text-sm font-medium mb-2">Summary Preview</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-[var(--text-muted)]">
                      {getInvestmentCategory(formData.investment_type) === "price_based" ? "Total Invested" :
                       getInvestmentCategory(formData.investment_type) === "fixed_income" ? "Purchase Price" :
                       getInvestmentCategory(formData.investment_type) === "insurance" ? "Premiums Paid" :
                       "Amount Invested"}
                    </span>
                    <div className="font-semibold">
                      {formatMoney(
                        getInvestmentCategory(formData.investment_type) === "price_based"
                          ? parseFloat(String(formData.purchase_price)) * parseFloat(String(formData.quantity || "1")) + parseFloat(String(formData.purchase_fees || "0"))
                          : parseFloat(String(formData.purchase_price)) + parseFloat(String(formData.purchase_fees || "0"))
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)]">Current Value</span>
                    <div className="font-semibold">
                      {formatMoney(
                        getInvestmentCategory(formData.investment_type) === "price_based"
                          ? parseFloat(String(formData.current_price)) * parseFloat(String(formData.quantity || "1"))
                          : parseFloat(String(formData.current_price))
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)]">Gain/Loss</span>
                    {(() => {
                      const invested = getInvestmentCategory(formData.investment_type) === "price_based"
                        ? parseFloat(String(formData.purchase_price)) * parseFloat(String(formData.quantity || "1")) + parseFloat(String(formData.purchase_fees || "0"))
                        : parseFloat(String(formData.purchase_price)) + parseFloat(String(formData.purchase_fees || "0"));
                      const current = getInvestmentCategory(formData.investment_type) === "price_based"
                        ? parseFloat(String(formData.current_price)) * parseFloat(String(formData.quantity || "1"))
                        : parseFloat(String(formData.current_price));
                      const gain = current - invested;
                      return (
                        <div className={`font-semibold ${gain >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {gain >= 0 ? "+" : ""}{formatMoney(gain)}
                        </div>
                      );
                    })()}
                  </div>
                  {getInvestmentCategory(formData.investment_type) === "fixed_income" && formData.interest_rate && (
                    <div>
                      <span className="text-[var(--text-muted)]">Annual Interest</span>
                      <div className="font-semibold text-green-600">
                        +{formatMoney(parseFloat(String(formData.quantity || formData.purchase_price)) * parseFloat(String(formData.interest_rate)) / 100)}
                      </div>
                    </div>
                  )}
                  {getInvestmentCategory(formData.investment_type) === "insurance" && formData.quantity && (
                    <div>
                      <span className="text-[var(--text-muted)]">Sum Assured</span>
                      <div className="font-semibold">{formatMoney(formData.quantity)}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingId ? "Update Investment" : "Add Investment"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[var(--border-subtle)]">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "all"
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
          }`}
        >
          All Investments ({investments.length})
        </button>
        <button
          onClick={() => setActiveTab("by-type")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "by-type"
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
          }`}
        >
          By Type
        </button>
      </div>

      {/* Content */}
      {activeTab === "all" ? (
        <>
          {investments.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-semibold mb-1">No investments yet</h3>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Start tracking your portfolio by adding your first investment
              </p>
              <button onClick={() => setShowForm(true)} className="btn btn-primary">
                <HiPlus className="w-4 h-4 mr-1" />
                Add Investment
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[var(--surface)] border-b border-[var(--border-subtle)]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase">
                        Investment
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase">
                        Type
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase">
                        Invested
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase">
                        Current
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase">
                        Gain/Loss
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase">
                        Return
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {investments.map((inv) => (
                      <tr key={inv.id} className="hover:bg-[var(--surface)] transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium">{inv.name}</div>
                          {inv.symbol && <div className="text-xs text-[var(--text-muted)]">{inv.symbol}</div>}
                          {inv.platform && <div className="text-xs text-[var(--text-muted)]">{inv.platform}</div>}
                          {/* Show extra details based on type */}
                          {getInvestmentCategory(inv.investment_type) === "fixed_income" && inv.interest_rate && (
                            <div className="text-xs text-blue-600">{inv.interest_rate}% coupon | {inv.tax_rate || 0}% tax</div>
                          )}
                          {getInvestmentCategory(inv.investment_type) === "property" && inv.net_rental_yield !== undefined && (
                            <div className="text-xs text-green-600">Yield: {inv.net_rental_yield.toFixed(2)}%</div>
                          )}
                          {getInvestmentCategory(inv.investment_type) === "insurance" && inv.sum_assured && (
                            <div className="text-xs text-purple-600">Sum: {formatMoney(inv.sum_assured)}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${TYPE_COLORS[inv.investment_type] || TYPE_COLORS.OTHER}20`,
                              color: TYPE_COLORS[inv.investment_type] || TYPE_COLORS.OTHER,
                            }}
                          >
                            {getTypeIcon(inv.investment_type)} {inv.investment_type_display}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-medium">{formatMoney(inv.total_invested)}</td>
                        <td className="px-4 py-3 text-right font-medium">{formatMoney(inv.current_value)}</td>
                        <td className={`px-4 py-3 text-right font-medium ${inv.gain_loss >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {formatMoney(inv.gain_loss)}
                        </td>
                        <td className={`px-4 py-3 text-right font-medium ${inv.gain_loss_percentage >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {formatPercent(inv.gain_loss_percentage)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => openPriceUpdate(inv)}
                              className="p-1.5 text-purple-600 hover:bg-purple-50 rounded"
                              title="Update Price"
                            >
                              <HiRefresh className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(inv)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <HiPencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(inv.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <HiTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {investments.map((inv) => (
                  <div key={inv.id} className="card p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{inv.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${TYPE_COLORS[inv.investment_type] || TYPE_COLORS.OTHER}20`,
                              color: TYPE_COLORS[inv.investment_type] || TYPE_COLORS.OTHER,
                            }}
                          >
                            {getTypeIcon(inv.investment_type)} {inv.investment_type_display}
                          </span>
                          {inv.symbol && <span className="text-xs text-[var(--text-muted)]">{inv.symbol}</span>}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openPriceUpdate(inv)} className="p-1.5 text-purple-600 hover:bg-purple-50 rounded">
                          <HiRefresh className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleEdit(inv)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                          <HiPencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(inv.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-[var(--text-muted)]">Invested</span>
                        <div className="font-semibold">{formatMoney(inv.total_invested)}</div>
                      </div>
                      <div>
                        <span className="text-[var(--text-muted)]">Current</span>
                        <div className="font-semibold">{formatMoney(inv.current_value)}</div>
                      </div>
                      <div>
                        <span className="text-[var(--text-muted)]">Gain/Loss</span>
                        <div className={`font-semibold ${inv.gain_loss >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {formatMoney(inv.gain_loss)}
                        </div>
                      </div>
                      <div>
                        <span className="text-[var(--text-muted)]">Return</span>
                        <div className={`font-semibold ${inv.gain_loss_percentage >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {formatPercent(inv.gain_loss_percentage)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Category-specific details */}
                    {getInvestmentCategory(inv.investment_type) === "fixed_income" && inv.interest_rate && (
                      <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] text-xs grid grid-cols-2 gap-2">
                        <div><span className="text-[var(--text-muted)]">Coupon:</span> {inv.interest_rate}%</div>
                        {inv.tax_rate && <div><span className="text-[var(--text-muted)]">Tax:</span> {inv.tax_rate}%</div>}
                        {inv.payment_frequency_display && <div><span className="text-[var(--text-muted)]">Freq:</span> {inv.payment_frequency_display}</div>}
                        {inv.maturity_date && <div><span className="text-[var(--text-muted)]">Maturity:</span> {inv.maturity_date}</div>}
                      </div>
                    )}
                    
                    {getInvestmentCategory(inv.investment_type) === "property" && inv.net_rental_yield !== undefined && (
                      <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] text-xs grid grid-cols-2 gap-2">
                        {inv.monthly_rent && parseFloat(inv.monthly_rent) > 0 && (
                          <div><span className="text-[var(--text-muted)]">Monthly Rent:</span> {formatMoney(inv.monthly_rent)}</div>
                        )}
                        {inv.annual_income !== undefined && (
                          <div><span className="text-[var(--text-muted)]">Annual Income:</span> {formatMoney(inv.annual_income)}</div>
                        )}
                        <div><span className="text-[var(--text-muted)]">Net Yield:</span> <span className={inv.net_rental_yield >= 0 ? "text-green-600" : "text-red-600"}>{inv.net_rental_yield.toFixed(2)}%</span></div>
                        {inv.occupancy_status_display && <div><span className="text-[var(--text-muted)]">Status:</span> {inv.occupancy_status_display}</div>}
                      </div>
                    )}
                    
                    {getInvestmentCategory(inv.investment_type) === "insurance" && inv.sum_assured && (
                      <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] text-xs grid grid-cols-2 gap-2">
                        <div><span className="text-[var(--text-muted)]">Sum Assured:</span> {formatMoney(inv.sum_assured)}</div>
                        {inv.surrender_value && <div><span className="text-[var(--text-muted)]">Surrender:</span> {formatMoney(inv.surrender_value)}</div>}
                        {inv.premium_amount && parseFloat(inv.premium_amount) > 0 && (
                          <div><span className="text-[var(--text-muted)]">Premium:</span> {formatMoney(inv.premium_amount)}/{inv.premium_frequency || 'month'}</div>
                        )}
                        {inv.maturity_date && <div><span className="text-[var(--text-muted)]">Maturity:</span> {inv.maturity_date}</div>}
                      </div>
                    )}
                    
                    {getInvestmentCategory(inv.investment_type) === "deposit_based" && (
                      <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] text-xs grid grid-cols-2 gap-2">
                        {inv.interest_rate && <div><span className="text-[var(--text-muted)]">Interest:</span> {inv.interest_rate}%</div>}
                        {inv.dividend_rate && parseFloat(inv.dividend_rate) > 0 && (
                          <div><span className="text-[var(--text-muted)]">Dividend:</span> {inv.dividend_rate}%</div>
                        )}
                        {inv.loan_interest_rebate && parseFloat(inv.loan_interest_rebate) > 0 && (
                          <div><span className="text-[var(--text-muted)]">Loan Rebate:</span> {inv.loan_interest_rebate}%</div>
                        )}
                        {inv.maturity_date && <div><span className="text-[var(--text-muted)]">Maturity:</span> {inv.maturity_date}</div>}
                      </div>
                    )}
                    
                    {getInvestmentCategory(inv.investment_type) === "price_based" && inv.quantity && (
                      <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] text-xs grid grid-cols-2 gap-2">
                        <div><span className="text-[var(--text-muted)]">Units:</span> {parseFloat(inv.quantity).toLocaleString()}</div>
                        <div><span className="text-[var(--text-muted)]">Price:</span> {formatMoney(inv.current_price)}</div>
                      </div>
                    )}
                    
                    {inv.platform && (
                      <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
                        Platform: {inv.platform}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        /* By Type Tab */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Chart */}
          <div className="card p-4">
            <h3 className="font-semibold mb-4">Portfolio Allocation</h3>
            {pieData.length > 0 ? (
              <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      paddingAngle={2}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatMoney(value)}
                      contentStyle={{
                        background: "var(--surface)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8 text-[var(--text-muted)]">No data</div>
            )}
            {/* Legend */}
            <div className="mt-4 space-y-2">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{formatMoney(item.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Type Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {summary &&
              Object.entries(summary.by_type).map(([type, data]) => (
                <div key={type} className="card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: `${TYPE_COLORS[type] || TYPE_COLORS.OTHER}20`,
                        color: TYPE_COLORS[type] || TYPE_COLORS.OTHER,
                      }}
                    >
                      {getTypeIcon(type)} {getTypeLabel(type)}
                    </span>
                    <span className="text-sm text-[var(--text-muted)]">{data.count} holdings</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Invested</span>
                      <span className="font-medium">{formatMoney(data.invested)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Current Value</span>
                      <span className="font-medium">{formatMoney(data.current_value)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Gain/Loss</span>
                      <span className={`font-medium ${data.gain_loss >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatMoney(data.gain_loss)} ({formatPercent((data.gain_loss / data.invested) * 100 || 0)})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Price Update Modal */}
      {showPriceModal && priceUpdateInvestment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Update Price</h3>
              <button onClick={() => setShowPriceModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text)]">
                <HiX className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Update current price for <strong>{priceUpdateInvestment.name}</strong>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">New Price</label>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                step="0.01"
                min="0"
                className="input w-full"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowPriceModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handlePriceUpdate} className="btn btn-primary">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
