// src/pages/WealthPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchCurrentNetWorth,
  fetchAssets,
  createAsset,
  fetchLiabilities,
  createLiability,
  createNetWorthSnapshot,
  fetchNetWorthSnapshots,
} from "../api/wealth";
// TimeRangeSelector provided globally via Layout
import { useTimeRange } from "../contexts/TimeRangeContext";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { Asset, Liability, NetWorthCurrent } from "../api/types";

function formatMoney(value: string | number) {
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return value.toString();
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function WealthPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [netWorth, setNetWorth] = useState<NetWorthCurrent | null>(null);
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'assets' | 'liabilities'>('all');

  // asset form
  const [assetName, setAssetName] = useState("");
  const [assetValue, setAssetValue] = useState("0");

  // liability form
  const [liabilityName, setLiabilityName] = useState("");
  const [liabilityBalance, setLiabilityBalance] = useState("0");
  const [liabilityInterest, setLiabilityInterest] = useState("0");
  const [liabilityMinimum, setLiabilityMinimum] = useState("0");

  async function loadAll() {
    try {
      setLoading(true);
      const [assetsData, liabilitiesData, nw, snapshotsData] = await Promise.all([
        fetchAssets(),
        fetchLiabilities(),
        fetchCurrentNetWorth().catch(() => null),
        fetchNetWorthSnapshots().catch(() => []),
      ]);
      setAssets(assetsData);
      setLiabilities(liabilitiesData);
      if (nw) setNetWorth(nw);
      if (snapshotsData) setSnapshots(snapshotsData);
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
  const { range } = useTimeRange();

  const filteredSnapshots = snapshots.filter(s => {
    const d = new Date(s.date);
    if (range.startDate && d < new Date(range.startDate)) return false;
    if (range.endDate && d > new Date(range.endDate)) return false;
    return true;
  });

  function generateEmptyDaySeries(start: string, end: string) {
    const s = new Date(start);
    const e = new Date(end);
    const out: {date:string; net:number}[] = [];
    for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
      out.push({ date: d.toISOString().slice(0,10), net: 0 });
    }
    return out;
  }

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Wealth Tracker
          </h3>
          <p className="text-base text-[var(--text-muted)] mt-1 font-medium">
            Monitor your assets, liabilities, and net worth over time
          </p>
        </div>
      </div>

      {/* Tab Filter */}
      <div className="card p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                : 'text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text-main)]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === 'assets'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                : 'text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text-main)]'
            }`}
          >
            💰 Assets
          </button>
          <button
            onClick={() => setActiveTab('liabilities')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === 'liabilities'
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md'
                : 'text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text-main)]'
            }`}
          >
            📉 Liabilities
          </button>
        </div>
      </div>

      {loading && <div className="skeleton h-64 rounded" />}
      {error && (
        <div className="card bg-red-50 border-red-200 text-red-700 text-sm p-4 animate-slide-in">
          {error}
        </div>
      )}

      {!loading && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide">Total Assets</div>
                <span className="text-3xl">💰</span>
              </div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {formatMoney(netWorth?.total_assets ?? 0)}
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1">KES</div>
            </div>

            <div className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide">Total Liabilities</div>
                <span className="text-3xl">📉</span>
              </div>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {formatMoney(netWorth?.total_liabilities ?? 0)}
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1">KES</div>
            </div>

            <div className="card hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide">Net Worth</div>
                <span className="text-3xl">📊</span>
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {formatMoney(netWorth?.net_worth ?? 0)}
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1">KES</div>
            </div>
          </div>

            <div className="grid gap-4 md:grid-cols-2">
          {/* Net Worth Chart */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="text-lg font-semibold flex items-center gap-2">
                <span>📈</span>
                Net Worth Trend
              </div>
              <button
                className="btn-primary text-sm"
                onClick={async () => {
                  try {
                    await createNetWorthSnapshot();
                    await loadAll();
                  } catch (err) {
                    console.error(err);
                    setError("Failed to create snapshot");
                  }
                }}
              >
                Take Snapshot
              </button>
            </div>
            <div style={{ width: "100%", height: 240 }}>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={(filteredSnapshots.length > 0 ? filteredSnapshots : generateEmptyDaySeries(range.startDate, range.endDate)).map((s:any) => ({ date: s.date, net: Number(s.net_worth ?? s.net) }))}>
                  <defs>
                    <linearGradient id="wealthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="var(--text-muted)" />
                  <Tooltip 
                    formatter={(v:any) => formatMoney(v as string | number)}
                    contentStyle={{
                      background: 'var(--surface)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(20px)',
                    }}
                  />
                  <Area type="monotone" dataKey="net" stroke="#3B82F6" strokeWidth={2} fill="url(#wealthGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {(activeTab === 'all' || activeTab === 'assets') && (
            <div className="space-y-6">
            <div className="card animate-slide-in bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10 border-2">
              <div className="text-lg font-semibold mb-6 flex items-center gap-2">
                <span>➕</span>
                Add Asset
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await createAsset({ name: assetName, current_value: assetValue } as Partial<Asset>);
                    setAssetName("");
                    setAssetValue("0");
                    await loadAll();
                  } catch (err) {
                    console.error(err);
                    setError("Failed to create asset");
                  }
                }}
              >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Asset Name *</label>
                      <input 
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400" 
                        value={assetName} 
                        onChange={(e) => setAssetName(e.target.value)} 
                        placeholder="e.g., House, Car, Savings"
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Value *</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400" 
                        value={assetValue} 
                        onChange={(e) => setAssetValue(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                </div>
                  <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
                    <button className="btn-primary">Add Asset</button>
                </div>
              </form>

                <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
                  <div className="text-sm font-semibold mb-3 text-[var(--text-muted)] uppercase tracking-wide">
                    Your Assets {assets.length > 0 && `(${assets.length})`}
                  </div>
                  {assets.length === 0 && (
                    <div className="text-center py-8 text-[var(--text-muted)]">
                      <div className="text-4xl mb-2">🏦</div>
                      <p className="text-sm">No assets yet</p>
                    </div>
                  )}
                {assets.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                      <thead className="bg-[var(--surface)] sticky top-0">
                      <tr>
                          <th className="px-4 py-3 text-left font-semibold">Name</th>
                          <th className="px-4 py-3 text-right font-semibold">Value</th>
                      </tr>
                    </thead>
                      <tbody className="divide-y divide-[var(--border-subtle)]">
                      {assets.map((a) => (
                          <tr key={a.id} className="hover:bg-[var(--surface)] transition-colors">
                            <td className="px-4 py-3 font-medium">{a.name}</td>
                            <td className="px-4 py-3 text-right font-semibold">{formatMoney(a.current_value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                    </div>
                )}
              </div>
            </div>

            {/* Wealth Building Tips */}
            <div className="card bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-900/10 dark:to-blue-900/10 border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">🎯</span>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Wealth Building Insights</h3>
                  <p className="text-sm text-[var(--text-muted)]">Grow your net worth strategically</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <Link to="/blog/diversify-assets" className="flex gap-2 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 group">
                  <span className="text-green-600 dark:text-green-400 font-bold">•</span>
                  <div>
                    <p><strong>Diversify Assets:</strong> Spread investments across different asset classes to reduce risk.</p>
                    <span className="text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Read full guide →</span>
                  </div>
                </Link>
                <Link to="/blog/track-net-worth" className="flex gap-2 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 group">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  <div>
                    <p><strong>Track Net Worth:</strong> Take regular snapshots to monitor your financial progress over time.</p>
                    <span className="text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Read full guide →</span>
                  </div>
                </Link>
                <Link to="/blog/reduce-liabilities" className="flex gap-2 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 group">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                  <div>
                    <p><strong>Reduce Liabilities:</strong> Focus on paying off high-interest debt to accelerate wealth building.</p>
                    <span className="text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Read full guide →</span>
                  </div>
                </Link>
                <Link to="/blog/appreciating-assets" className="flex gap-2 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 group">
                  <span className="text-orange-600 dark:text-orange-400 font-bold">•</span>
                  <div>
                    <p><strong>Appreciate vs Depreciate:</strong> Invest in assets that gain value over time, not just things that lose value.</p>
                    <span className="text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Read full guide →</span>
                  </div>
                </Link>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
                <Link to="/blog" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  View All Financial Tips →
                </Link>
              </div>
            </div>
            </div>
            )}

            {(activeTab === 'all' || activeTab === 'liabilities') && (
            <div className="space-y-6">
          <div className="card animate-slide-in bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-900/10 dark:to-orange-900/10 border-2">
            <div className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span>➕</span>
              Add Liability
            </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await createLiability({
                      name: liabilityName,
                      principal_balance: liabilityBalance,
                      interest_rate: liabilityInterest,
                      minimum_payment: liabilityMinimum,
                    } as Partial<Liability>);
                    setLiabilityName("");
                    setLiabilityBalance("0");
                    setLiabilityInterest("0");
                    setLiabilityMinimum("0");
                    await loadAll();
                  } catch (err) {
                    console.error(err);
                    setError("Failed to create liability");
                  }
                }}
              >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-2">Liability Name *</label>
                      <input 
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400" 
                        value={liabilityName} 
                        onChange={(e) => setLiabilityName(e.target.value)} 
                        placeholder="e.g., Mortgage, Car Loan, Credit Card"
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Principal Balance *</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400" 
                        value={liabilityBalance} 
                        onChange={(e) => setLiabilityBalance(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Interest Rate (%)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400" 
                        value={liabilityInterest} 
                        onChange={(e) => setLiabilityInterest(e.target.value)} 
                        placeholder="5.5"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Minimum Payment</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400" 
                      value={liabilityMinimum} 
                      onChange={(e) => setLiabilityMinimum(e.target.value)} 
                      placeholder="0.00"
                    />
                  </div>
                  <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
                    <button className="btn-primary">Add Liability</button>
                  </div>
              </form>

                <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
                  <div className="text-sm font-semibold mb-3 text-[var(--text-muted)] uppercase tracking-wide">
                    Your Liabilities {liabilities.length > 0 && `(${liabilities.length})`}
                  </div>
                  {liabilities.length === 0 && (
                    <div className="text-center py-8 text-[var(--text-muted)]">
                      <div className="text-4xl mb-2">💳</div>
                      <p className="text-sm">No liabilities yet</p>
                    </div>
                  )}
                {liabilities.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                      <thead className="bg-[var(--surface)]">
                      <tr>
                          <th className="px-4 py-3 text-left font-semibold">Name</th>
                          <th className="px-4 py-3 text-right font-semibold">Balance</th>
                      </tr>
                    </thead>
                      <tbody className="divide-y divide-[var(--border-subtle)]">
                      {liabilities.map((l) => (
                          <tr key={l.id} className="hover:bg-[var(--surface)] transition-colors">
                            <td className="px-4 py-3 font-medium">{l.name}</td>
                            <td className="px-4 py-3 text-right font-semibold text-red-600 dark:text-red-400">{formatMoney(l.principal_balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                    </div>
                )}
              </div>
            </div>
            </div>
            )}
          </div>
          </div>
        </>
      )}
    </div>
  );
}