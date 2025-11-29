// src/pages/WealthPage.tsx
import { useEffect, useState } from "react";
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
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Monitor your assets, liabilities, and net worth over time
          </p>
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
            <div className="card animate-slide-in">
              <div className="text-lg font-semibold mb-4 flex items-center gap-2">
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
                        className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors" 
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
                        className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors" 
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

              <div className="card animate-slide-in">
                <div className="text-lg font-semibold mb-4 flex items-center gap-2">
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
                        className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors" 
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
                        className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors" 
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
                        className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors" 
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
                      className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors" 
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
        </>
      )}
    </div>
  );
}