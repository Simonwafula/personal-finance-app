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
import TimeRangeSelector from "../components/TimeRangeSelector";
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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Wealth</h3>

      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}

      {!loading && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-white shadow">
              <div className="text-xs text-gray-500 mb-1">Total Assets</div>
              <div className="text-2xl font-bold">{formatMoney(netWorth?.total_assets ?? 0)} KES</div>
            </div>

            <div className="p-4 rounded-lg bg-white shadow">
              <div className="text-xs text-gray-500 mb-1">Total Liabilities</div>
              <div className="text-2xl font-bold text-red-600">{formatMoney(netWorth?.total_liabilities ?? 0)} KES</div>
            </div>

            <div className="p-4 rounded-lg bg-white shadow">
              <div className="text-xs text-gray-500 mb-1">Net Worth</div>
              <div className="text-2xl font-bold">{formatMoney(netWorth?.net_worth ?? 0)} KES</div>
            </div>
          </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-end">
                <TimeRangeSelector />
              </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm font-medium mb-2">Add Asset</div>
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
                <div className="grid md:grid-cols-2 gap-3">
                  <input className="w-full border rounded px-2 py-1 text-sm" value={assetName} onChange={(e) => setAssetName(e.target.value)} placeholder="Asset name" required />
                  <input type="number" step="0.01" className="w-full border rounded px-2 py-1 text-sm" value={assetValue} onChange={(e) => setAssetValue(e.target.value)} />
                </div>
                <div className="mt-2">
                  <button className="btn-primary text-sm">Add Asset</button>
                </div>
              </form>

              <div className="mt-4">
                <div className="text-xs text-gray-500 mb-1">Assets</div>
                {assets.length === 0 && <div className="text-sm text-gray-500">No assets yet.</div>}
                {assets.length > 0 && (
                  <table className="min-w-full text-xs md:text-sm table-hover">
                    <thead className="bg-gray-50 table-sticky">
                      <tr>
                        <th className="px-2 py-1 text-left">Name</th>
                        <th className="px-2 py-1 text-right">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assets.map((a) => (
                        <tr key={a.id} className="border-t">
                          <td className="px-2 py-1">{a.name}</td>
                          <td className="px-2 py-1 text-right">{formatMoney(a.current_value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm font-medium mb-2">Add Liability</div>
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
                <div className="grid md:grid-cols-2 gap-3">
                  <input className="w-full border rounded px-2 py-1 text-sm" value={liabilityName} onChange={(e) => setLiabilityName(e.target.value)} placeholder="Liability name" required />
                  <input type="number" step="0.01" className="w-full border rounded px-2 py-1 text-sm" value={liabilityBalance} onChange={(e) => setLiabilityBalance(e.target.value)} />
                </div>
                <div className="grid md:grid-cols-2 gap-3 mt-2">
                  <input type="number" step="0.01" className="w-full border rounded px-2 py-1 text-sm" value={liabilityInterest} onChange={(e) => setLiabilityInterest(e.target.value)} placeholder="Interest rate" />
                  <input type="number" step="0.01" className="w-full border rounded px-2 py-1 text-sm" value={liabilityMinimum} onChange={(e) => setLiabilityMinimum(e.target.value)} placeholder="Minimum payment" />
                </div>
                <div className="mt-2">
                  <button className="btn-primary text-sm">Add Liability</button>
                </div>
              </form>

              <div className="mt-4">
                <div className="text-xs text-gray-500 mb-1">Liabilities</div>
                {liabilities.length === 0 && <div className="text-sm text-gray-500">No liabilities yet.</div>}
                {liabilities.length > 0 && (
                  <table className="min-w-full text-xs md:text-sm table-hover">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-1 text-left">Name</th>
                        <th className="px-2 py-1 text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {liabilities.map((l) => (
                        <tr key={l.id} className="border-t">
                          <td className="px-2 py-1">{l.name}</td>
                          <td className="px-2 py-1 text-right">{formatMoney(l.principal_balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="mt-4">
                {filteredSnapshots.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs text-gray-500 mb-1">Net worth snapshots</div>
                    <div style={{ width: "100%", height: 180 }}>
                      <ResponsiveContainer width="100%" height={140}>
                        <AreaChart data={filteredSnapshots.map(s => ({ date: s.date, net: Number(s.net_worth) }))}>
                          <XAxis dataKey="date" />
                          <Tooltip formatter={(v:any) => formatMoney(v as string | number)} />
                          <Area type="monotone" dataKey="net" stroke="#3B82F6" fill="#3B82F6" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
                <div className="mt-4">
                <button
                  className="btn-success text-sm mr-2"
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
                  Snapshot
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}