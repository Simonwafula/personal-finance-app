// src/pages/DebtPlannerPage.tsx
import { useEffect, useState } from "react";
import {
  fetchDebtPlans,
  createDebtPlan,
  fetchDebtSchedule,
} from "../api/debt";
import type { DebtPlan, DebtScheduleRow } from "../api/types";

function formatMoney(value: string | number) {
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return value.toString();
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function DebtPlannerPage() {
  const [plans, setPlans] = useState<DebtPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<DebtScheduleRow[]>([]);
  const [creating, setCreating] = useState(false);
  const [strategy, setStrategy] = useState<DebtPlan["strategy"]>("AVALANCHE");
  const [monthly, setMonthly] = useState("0");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const data = await fetchDebtPlans();
      setPlans(data);
      if (data.length > 0 && selectedId == null) {
        setSelectedId(data[0].id);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load debt plans");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!selectedId) {
      setSchedule([]);
      return;
    }
    async function loadSchedule() {
      try {
        const s = await fetchDebtSchedule(selectedId as number);
        setSchedule(s || []);
      } catch (err) {
        console.error(err);
        setSchedule([]);
      }
    }
    loadSchedule();
  }, [selectedId]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Debt Planner</h3>

      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="bg-white rounded-lg shadow p-4 max-w-xl">
        <div className="text-sm font-medium mb-2">Create Debt Plan</div>
        <form onSubmit={async (e) => {
          e.preventDefault();
          setCreating(true);
          try {
            await createDebtPlan({ strategy, monthly_amount_available: Number(monthly), start_date: startDate });
            setStrategy("AVALANCHE");
            setMonthly("0");
            setStartDate(new Date().toISOString().slice(0, 10));
            await load();
          } catch (err) {
            console.error(err);
            setError("Failed to create plan");
          } finally { setCreating(false); }
        }}>
          <div className="grid md:grid-cols-3 gap-3">
            <select value={strategy} onChange={(e) => setStrategy(e.target.value as any)} className="w-full border rounded px-2 py-1 text-sm">
              <option value="AVALANCHE">Avalanche</option>
              <option value="SNOWBALL">Snowball</option>
            </select>
            <input type="number" step="0.01" className="w-full border rounded px-2 py-1 text-sm" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
            <input type="date" className="w-full border rounded px-2 py-1 text-sm" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="mt-2"><button className="px-3 py-2 rounded text-white bg-blue-600" disabled={creating}>{creating ? 'Creating…' : 'Create Plan'}</button></div>
        </form>
      </div>

      {/* Plan list and schedule */}
      <div className="flex gap-4">
        <div className="bg-white rounded-lg shadow p-3 md:w-1/3">
          <div className="text-xs text-gray-500 mb-2">Plans</div>
          {plans.map(p => (
            <div key={p.id} className={`mb-1`}> 
              <button onClick={() => setSelectedId(p.id)} className={`w-full text-left px-3 py-2 rounded-md text-sm ${selectedId === p.id ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <div className="font-medium">{p.strategy}</div>
                <div className="text-[11px] text-gray-500">{p.start_date} • {formatMoney(Number(p.monthly_amount_available))}</div>
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-3 flex-1">
          <div className="text-xs text-gray-500 mb-2">Schedule</div>
          {schedule.length === 0 && <div className="text-sm text-gray-500">No schedule yet. Select a plan.</div>}
          {schedule.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs md:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-1 text-left">Month</th>
                    <th className="px-2 py-1 text-left">Liability</th>
                    <th className="px-2 py-1 text-right">Starting</th>
                    <th className="px-2 py-1 text-right">Interest</th>
                    <th className="px-2 py-1 text-right">Payment</th>
                    <th className="px-2 py-1 text-right">Principal</th>
                    <th className="px-2 py-1 text-right">Ending</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((s, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-2 py-1">{s.month}</td>
                      <td className="px-2 py-1">{s.liability_name}</td>
                      <td className="px-2 py-1 text-right">{formatMoney(s.starting_balance)}</td>
                      <td className="px-2 py-1 text-right">{formatMoney(s.interest)}</td>
                      <td className="px-2 py-1 text-right">{formatMoney(s.payment)}</td>
                      <td className="px-2 py-1 text-right">{formatMoney(s.principal)}</td>
                      <td className="px-2 py-1 text-right">{formatMoney(s.ending_balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}