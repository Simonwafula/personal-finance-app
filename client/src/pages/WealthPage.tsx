// src/pages/WealthPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchCurrentNetWorth,
  fetchAssets,
  createAsset,
  updateAsset,
  deleteAsset,
  fetchLiabilities,
  createLiability,
  updateLiability,
  deleteLiability,
  createNetWorthSnapshot,
  fetchNetWorthSnapshots,
  syncAssetsFromAccounts,
} from "../api/wealth";
import { getSavingsSummary, type SavingsSummary } from "../api/savings";
import { getInvestmentSummary, type InvestmentSummary } from "../api/investments";
import { useTimeRange } from "../contexts/TimeRangeContext";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { Asset, Liability, NetWorthCurrent } from "../api/types";
import { HiPlus, HiPencil, HiTrash, HiX, HiRefresh } from "react-icons/hi";

function formatMoney(value: string | number) {
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return value.toString();
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function WealthPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [netWorth, setNetWorth] = useState<NetWorthCurrent | null>(null);
  const [snapshots, setSnapshots] = useState<{date: string; net_worth: number | string}[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsSummary | null>(null);
  const [investmentsSummary, setInvestmentsSummary] = useState<InvestmentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "assets" | "liabilities">("overview");

  // Form visibility state
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showLiabilityForm, setShowLiabilityForm] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState<number | null>(null);
  const [editingLiabilityId, setEditingLiabilityId] = useState<number | null>(null);

  // Asset form
  const [assetName, setAssetName] = useState("");
  const [assetValue, setAssetValue] = useState("0");
  const [assetType, setAssetType] = useState("OTHER");

  // Liability form
  const [liabilityName, setLiabilityName] = useState("");
  const [liabilityBalance, setLiabilityBalance] = useState("0");
  const [liabilityInterest, setLiabilityInterest] = useState("0");
  const [liabilityMinimum, setLiabilityMinimum] = useState("0");

  const { range } = useTimeRange();

  async function loadAll() {
    try {
      setLoading(true);
      const [assetsData, liabilitiesData, nw, snapshotsData, savingsSummary, invSummary] = await Promise.all([
        fetchAssets(),
        fetchLiabilities(),
        fetchCurrentNetWorth().catch(() => null),
        fetchNetWorthSnapshots().catch(() => []),
        getSavingsSummary().catch(() => null),
        getInvestmentSummary().catch(() => null),
      ]);
      setAssets(assetsData);
      setLiabilities(liabilitiesData);
      if (nw) setNetWorth(nw);
      if (snapshotsData) setSnapshots(snapshotsData);
      if (savingsSummary) setSavingsGoals(savingsSummary);
      if (invSummary) setInvestmentsSummary(invSummary);
    } catch (err) {
      console.error(err);
      setError("Failed to load wealth data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  const filteredSnapshots = snapshots.filter((s) => {
    const d = new Date(s.date);
    if (range.startDate && d < new Date(range.startDate)) return false;
    if (range.endDate && d > new Date(range.endDate)) return false;
    return true;
  });

  function resetAssetForm() {
    setAssetName("");
    setAssetValue("0");
    setAssetType("OTHER");
    setEditingAssetId(null);
    setShowAssetForm(false);
  }

  function resetLiabilityForm() {
    setLiabilityName("");
    setLiabilityBalance("0");
    setLiabilityInterest("");
    setLiabilityMinimum("");
    setEditingLiabilityId(null);
    setShowLiabilityForm(false);
  }

  function editAsset(a: Asset) {
    setEditingAssetId(a.id);
    setAssetName(a.name);
    setAssetValue(String(a.current_value));
    setAssetType(a.asset_type || "OTHER");
    setShowAssetForm(true);
  }

  function editLiability(l: Liability) {
    setEditingLiabilityId(l.id);
    setLiabilityName(l.name);
    setLiabilityBalance(String(l.principal_balance));
    setLiabilityInterest(l.interest_rate ? String(l.interest_rate) : "");
    setLiabilityMinimum(l.minimum_payment ? String(l.minimum_payment) : "");
    setShowLiabilityForm(true);
  }

  const typeEmoji: Record<string, string> = {
    STOCK: "📈",
    BOND: "📊",
    MMF: "💰",
    LAND: "🏞️",
    VEHICLE: "🚗",
    BUSINESS: "🏪",
    PENSION: "👴",
    INSURANCE: "🛡️",
    OTHER: "💼",
  };

  const totalAssets = Number(netWorth?.total_assets ?? 0);
  const totalLiabilities = Number(netWorth?.total_liabilities ?? 0);
  const netWorthValue = Number(netWorth?.net_worth ?? 0);

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Wealth Tracker
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            Monitor your assets, liabilities, and net worth
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                setLoading(true);
                const result = await syncAssetsFromAccounts();
                await loadAll();
                alert(`✅ Synced ${result.created + result.updated} accounts!\nCreated: ${result.created} | Updated: ${result.updated}`);
              } catch (err) {
                console.error(err);
                setError("Failed to sync accounts");
              } finally {
                setLoading(false);
              }
            }}
            className="btn-secondary inline-flex items-center gap-1.5 text-sm"
            disabled={loading}
          >
            <HiRefresh size={16} />
            <span className="hidden sm:inline">Sync Accounts</span>
          </button>
          <button
            onClick={async () => {
              try {
                await createNetWorthSnapshot();
                await loadAll();
              } catch (err) {
                console.error(err);
                setError("Failed to create snapshot");
              }
            }}
            className="btn-primary inline-flex items-center gap-1.5 text-sm"
          >
            📸
            <span className="hidden sm:inline">Take Snapshot</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm p-3">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">
            Dismiss
          </button>
        </div>
      )}

      {loading && <div className="skeleton h-32 rounded" />}

      {!loading && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Total Assets */}
            <div className="card p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Assets</span>
                <span className="text-xl">💰</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                {formatMoney(totalAssets)}
              </div>
              {netWorth?.breakdown && (
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-xs space-y-0.5">
                  <div className="flex justify-between text-[var(--text-muted)]">
                    <span>Manual</span>
                    <span>{formatMoney(netWorth.breakdown.assets_manual)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--text-muted)]">
                    <span>Accounts</span>
                    <span>{formatMoney(netWorth.breakdown.account_balances)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Total Liabilities */}
            <div className="card p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Liabilities</span>
                <span className="text-xl">📉</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">
                {formatMoney(totalLiabilities)}
              </div>
              <Link to="/debt" className="block mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-xs text-blue-600 hover:underline">
                View Debt Planner →
              </Link>
            </div>

            {/* Net Worth */}
            <div className="card p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Net Worth</span>
                <span className="text-xl">📊</span>
              </div>
              <div className={`text-xl sm:text-2xl font-bold ${netWorthValue >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}`}>
                {formatMoney(netWorthValue)}
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-[var(--text-muted)]">
                Assets − Liabilities
              </div>
            </div>

            {/* Savings Goals */}
            <Link to="/savings" className="card p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Savings</span>
                <span className="text-xl">🎯</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                {formatMoney(savingsGoals?.total_saved ?? 0)}
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-[var(--text-muted)]">
                {savingsGoals?.total_goals ?? 0} goals • {(savingsGoals?.average_progress ?? 0).toFixed(0)}%
              </div>
            </Link>

            {/* Investments */}
            <Link to="/investments" className="card p-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Investments</span>
                <span className="text-xl">📈</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatMoney(investmentsSummary?.total_current_value ?? 0)}
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs">
                <span className="text-[var(--text-muted)]">{investmentsSummary?.investment_count ?? 0} holdings</span>
                {investmentsSummary && (
                  <span className={investmentsSummary.total_gain_loss >= 0 ? "text-green-600 ml-1" : "text-red-600 ml-1"}>
                    {investmentsSummary.total_gain_loss >= 0 ? "+" : ""}
                    {investmentsSummary.total_gain_loss_percentage.toFixed(1)}%
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Net Worth Chart */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <span>📈</span>
                Net Worth Trend
              </h3>
              <span className="text-xs text-[var(--text-muted)]">
                {filteredSnapshots.length} snapshot{filteredSnapshots.length !== 1 ? "s" : ""}
              </span>
            </div>
            {filteredSnapshots.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-muted)]">
                <div className="text-3xl mb-2">📸</div>
                <p className="text-sm mb-2">No snapshots yet</p>
                <p className="text-xs">Click "Take Snapshot" to start tracking your net worth over time</p>
              </div>
            ) : (
              <div style={{ width: "100%", height: 200 }}>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={filteredSnapshots.map((s) => ({ date: s.date, net: Number(s.net_worth ?? 0) }))}>
                    <defs>
                      <linearGradient id="wealthGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(v) => formatMoney(v as number)}
                      contentStyle={{
                        background: "var(--surface)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "8px",
                      }}
                    />
                    <Area type="monotone" dataKey="net" stroke="#3B82F6" strokeWidth={2} fill="url(#wealthGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="card p-1.5">
            <div className="flex gap-1">
              {(["overview", "assets", "liabilities"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                    activeTab === tab
                      ? tab === "assets"
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow"
                        : tab === "liabilities"
                        ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow"
                      : "text-[var(--text-muted)] hover:bg-[var(--surface)]"
                  }`}
                >
                  {tab === "overview" && "📊 Overview"}
                  {tab === "assets" && `💰 Assets (${assets.length})`}
                  {tab === "liabilities" && `📉 Liabilities (${liabilities.length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid md:grid-cols-2 gap-4">
              {/* Quick Assets List */}
              <div className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">💰 Top Assets</h3>
                  <button onClick={() => setActiveTab("assets")} className="text-xs text-blue-600 hover:underline">
                    View all →
                  </button>
                </div>
                {assets.length === 0 ? (
                  <p className="text-sm text-[var(--text-muted)] py-4 text-center">No assets yet</p>
                ) : (
                  <div className="space-y-2">
                    {assets.slice(0, 5).map((a) => (
                      <div key={a.id} className="flex items-center justify-between p-2 bg-[var(--surface)] rounded-lg">
                        <div className="flex items-center gap-2">
                          <span>{typeEmoji[a.asset_type || "OTHER"]}</span>
                          <span className="text-sm font-medium truncate max-w-[150px]">{a.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-green-600">{formatMoney(a.current_value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Liabilities List */}
              <div className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">📉 Top Liabilities</h3>
                  <button onClick={() => setActiveTab("liabilities")} className="text-xs text-blue-600 hover:underline">
                    View all →
                  </button>
                </div>
                {liabilities.length === 0 ? (
                  <p className="text-sm text-[var(--text-muted)] py-4 text-center">No liabilities yet 🎉</p>
                ) : (
                  <div className="space-y-2">
                    {liabilities.slice(0, 5).map((l) => (
                      <div key={l.id} className="flex items-center justify-between p-2 bg-[var(--surface)] rounded-lg">
                        <span className="text-sm font-medium truncate max-w-[150px]">{l.name}</span>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-red-600">{formatMoney(l.principal_balance)}</span>
                          {Number(l.interest_rate || 0) > 0 && (
                            <span className="text-xs text-[var(--text-muted)] ml-1">@ {l.interest_rate}%</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Assets Tab */}
          {activeTab === "assets" && (
            <div className="space-y-4">
              {/* Add Asset Button / Form */}
              {!showAssetForm ? (
                <button
                  onClick={() => setShowAssetForm(true)}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <HiPlus size={18} />
                  Add Asset
                </button>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      if (editingAssetId) {
                        await updateAsset(editingAssetId, { name: assetName, current_value: assetValue, asset_type: assetType } as Partial<Asset>);
                      } else {
                        await createAsset({ name: assetName, current_value: assetValue, asset_type: assetType } as Partial<Asset>);
                      }
                      resetAssetForm();
                      await loadAll();
                    } catch (err) {
                      console.error(err);
                      setError(editingAssetId ? "Failed to update asset" : "Failed to create asset");
                    }
                  }}
                  className="card p-4 space-y-4 animate-slide-in bg-green-50/50 dark:bg-green-900/10"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{editingAssetId ? "Edit Asset" : "Add New Asset"}</h4>
                    <button type="button" onClick={resetAssetForm} className="text-[var(--text-muted)] hover:text-[var(--text)]">
                      <HiX size={20} />
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Asset Name *</label>
                      <input
                        value={assetName}
                        onChange={(e) => setAssetName(e.target.value)}
                        placeholder="e.g., Safaricom Shares"
                        required
                        className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Type</label>
                      <select
                        value={assetType}
                        onChange={(e) => setAssetType(e.target.value)}
                        className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                      >
                        <option value="OTHER">💼 Other</option>
                        <option value="STOCK">📈 Stock/Shares</option>
                        <option value="BOND">📊 Bond</option>
                        <option value="MMF">💰 Money Market</option>
                        <option value="LAND">🏞️ Land/Property</option>
                        <option value="VEHICLE">🚗 Vehicle</option>
                        <option value="BUSINESS">🏪 Business</option>
                        <option value="PENSION">👴 Pension</option>
                        <option value="INSURANCE">🛡️ Insurance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Current Value *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={assetValue}
                        onChange={(e) => setAssetValue(e.target.value)}
                        placeholder="0.00"
                        required
                        className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="btn-primary">
                      {editingAssetId ? "Update" : "Add Asset"}
                    </button>
                    <button type="button" onClick={resetAssetForm} className="btn-secondary">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Assets List */}
              {assets.length === 0 && !showAssetForm ? (
                <div className="card text-center py-12">
                  <div className="text-4xl mb-3">🏦</div>
                  <p className="font-medium mb-1">No assets yet</p>
                  <p className="text-sm text-[var(--text-muted)] mb-4">Add your first asset to start tracking your wealth</p>
                </div>
              ) : (
                <div className="card p-0 overflow-hidden">
                  {/* Desktop Table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-[var(--surface)] border-b border-[var(--border-subtle)]">
                        <tr>
                          <th className="text-left px-4 py-3 font-medium">Asset</th>
                          <th className="text-left px-4 py-3 font-medium">Type</th>
                          <th className="text-right px-4 py-3 font-medium">Value</th>
                          <th className="text-right px-4 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assets.map((a) => (
                          <tr key={a.id} className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--surface)]">
                            <td className="px-4 py-3 font-medium">{a.name}</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                {typeEmoji[a.asset_type || "OTHER"]} {a.asset_type?.replace("_", " ") || "Other"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-green-600">{formatMoney(a.current_value)}</td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex gap-1 justify-end">
                                <button onClick={() => editAsset(a)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded">
                                  <HiPencil size={14} />
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm(`Delete "${a.name}"?`)) {
                                      await deleteAsset(a.id);
                                      await loadAll();
                                    }
                                  }}
                                  className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                                >
                                  <HiTrash size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-[var(--surface)] border-t border-[var(--border-subtle)]">
                        <tr>
                          <td colSpan={2} className="px-4 py-3 font-semibold">Total</td>
                          <td className="px-4 py-3 text-right font-bold text-green-600 text-lg">{formatMoney(totalAssets)}</td>
                          <td />
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="sm:hidden divide-y divide-[var(--border-subtle)]">
                    {assets.map((a) => (
                      <div key={a.id} className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span>{typeEmoji[a.asset_type || "OTHER"]}</span>
                            <span className="font-medium">{a.name}</span>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => editAsset(a)} className="p-1 text-blue-600">
                              <HiPencil size={14} />
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm(`Delete "${a.name}"?`)) {
                                  await deleteAsset(a.id);
                                  await loadAll();
                                }
                              }}
                              className="p-1 text-red-600"
                            >
                              <HiTrash size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="text-right font-semibold text-green-600">{formatMoney(a.current_value)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Liabilities Tab */}
          {activeTab === "liabilities" && (
            <div className="space-y-4">
              {/* Add Liability Button / Form */}
              {!showLiabilityForm ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowLiabilityForm(true)}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <HiPlus size={18} />
                    Add Liability
                  </button>
                  <Link to="/debt" className="btn-secondary inline-flex items-center gap-2">
                    📊 Full Debt Planner
                  </Link>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      if (editingLiabilityId) {
                        await updateLiability(editingLiabilityId, {
                          name: liabilityName,
                          principal_balance: liabilityBalance,
                          interest_rate: liabilityInterest ? Number(liabilityInterest) : null,
                          minimum_payment: liabilityMinimum ? Number(liabilityMinimum) : null,
                        } as Partial<Liability>);
                      } else {
                        await createLiability({
                          name: liabilityName,
                          principal_balance: liabilityBalance,
                          interest_rate: liabilityInterest ? Number(liabilityInterest) : null,
                          minimum_payment: liabilityMinimum ? Number(liabilityMinimum) : null,
                        } as Partial<Liability>);
                      }
                      resetLiabilityForm();
                      await loadAll();
                    } catch (err) {
                      console.error(err);
                      setError(editingLiabilityId ? "Failed to update liability" : "Failed to create liability");
                    }
                  }}
                  className="card p-4 space-y-4 animate-slide-in bg-red-50/50 dark:bg-red-900/10"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{editingLiabilityId ? "Edit Liability" : "Add New Liability"}</h4>
                    <button type="button" onClick={resetLiabilityForm} className="text-[var(--text-muted)] hover:text-[var(--text)]">
                      <HiX size={20} />
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Liability Name *</label>
                      <input
                        value={liabilityName}
                        onChange={(e) => setLiabilityName(e.target.value)}
                        placeholder="e.g., Car Loan, Mortgage"
                        required
                        className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Balance *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={liabilityBalance}
                        onChange={(e) => setLiabilityBalance(e.target.value)}
                        placeholder="0.00"
                        required
                        className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Interest Rate (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={liabilityInterest}
                        onChange={(e) => setLiabilityInterest(e.target.value)}
                        placeholder="12.5"
                        className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Min. Payment</label>
                      <input
                        type="number"
                        step="0.01"
                        value={liabilityMinimum}
                        onChange={(e) => setLiabilityMinimum(e.target.value)}
                        placeholder="0.00"
                        className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="btn-primary">
                      {editingLiabilityId ? "Update" : "Add Liability"}
                    </button>
                    <button type="button" onClick={resetLiabilityForm} className="btn-secondary">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Liabilities List */}
              {liabilities.length === 0 && !showLiabilityForm ? (
                <div className="card text-center py-12">
                  <div className="text-4xl mb-3">🎉</div>
                  <p className="font-medium mb-1">No liabilities</p>
                  <p className="text-sm text-[var(--text-muted)]">You're debt-free! Keep it up!</p>
                </div>
              ) : (
                <div className="card p-0 overflow-hidden">
                  {/* Desktop Table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-[var(--surface)] border-b border-[var(--border-subtle)]">
                        <tr>
                          <th className="text-left px-4 py-3 font-medium">Liability</th>
                          <th className="text-right px-4 py-3 font-medium">Balance</th>
                          <th className="text-right px-4 py-3 font-medium">Rate</th>
                          <th className="text-right px-4 py-3 font-medium">Min. Payment</th>
                          <th className="text-right px-4 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {liabilities.map((l) => (
                          <tr key={l.id} className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--surface)]">
                            <td className="px-4 py-3 font-medium">{l.name}</td>
                            <td className="px-4 py-3 text-right font-semibold text-red-600">{formatMoney(l.principal_balance)}</td>
                            <td className="px-4 py-3 text-right">{Number(l.interest_rate || 0) > 0 ? `${l.interest_rate}%` : "-"}</td>
                            <td className="px-4 py-3 text-right">{Number(l.minimum_payment || 0) > 0 ? formatMoney(l.minimum_payment) : "-"}</td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex gap-1 justify-end">
                                <button onClick={() => editLiability(l)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded">
                                  <HiPencil size={14} />
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm(`Delete "${l.name}"?`)) {
                                      await deleteLiability(l.id);
                                      await loadAll();
                                    }
                                  }}
                                  className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                                >
                                  <HiTrash size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-[var(--surface)] border-t border-[var(--border-subtle)]">
                        <tr>
                          <td className="px-4 py-3 font-semibold">Total</td>
                          <td className="px-4 py-3 text-right font-bold text-red-600 text-lg">{formatMoney(totalLiabilities)}</td>
                          <td colSpan={3} />
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="sm:hidden divide-y divide-[var(--border-subtle)]">
                    {liabilities.map((l) => (
                      <div key={l.id} className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{l.name}</span>
                          <div className="flex gap-1">
                            <button onClick={() => editLiability(l)} className="p-1 text-blue-600">
                              <HiPencil size={14} />
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm(`Delete "${l.name}"?`)) {
                                  await deleteLiability(l.id);
                                  await loadAll();
                                }
                              }}
                              className="p-1 text-red-600"
                            >
                              <HiTrash size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[var(--text-muted)]">
                            {Number(l.interest_rate || 0) > 0 && `${l.interest_rate}% interest`}
                          </span>
                          <span className="font-semibold text-red-600">{formatMoney(l.principal_balance)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
