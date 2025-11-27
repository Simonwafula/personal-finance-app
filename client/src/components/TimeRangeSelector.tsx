import { useState } from "react";

export interface TimeRange {
  startDate: string;
  endDate: string;
}

interface Props {
  onChange: (range: TimeRange) => void;
  initialStart?: string;
  initialEnd?: string;
}

function fmtDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function TimeRangeSelector({ onChange, initialStart, initialEnd }: Props) {
  const [preset, setPreset] = useState<string>("30d");
  const [start, setStart] = useState<string>(initialStart ?? fmtDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)));
  const [end, setEnd] = useState<string>(initialEnd ?? fmtDate(new Date()));

  function applyPreset(p: string) {
    setPreset(p);
    const now = new Date();
    let s = new Date();
    if (p === "7d") {
      s = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (p === "30d") {
      s = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (p === "90d") {
      s = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    } else if (p === "1y") {
      s = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    }
    const startStr = fmtDate(s);
    const endStr = fmtDate(now);
    setStart(startStr);
    setEnd(endStr);
    onChange({ startDate: startStr, endDate: endStr });
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button onClick={() => applyPreset("7d")} className={`px-2 py-1 rounded ${preset === "7d" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
          7d
        </button>
        <button onClick={() => applyPreset("30d")} className={`px-2 py-1 rounded ${preset === "30d" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
          30d
        </button>
        <button onClick={() => applyPreset("90d")} className={`px-2 py-1 rounded ${preset === "90d" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
          90d
        </button>
        <button onClick={() => applyPreset("1y")} className={`px-2 py-1 rounded ${preset === "1y" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
          1y
        </button>
      </div>

      <div className="flex gap-2 items-center">
        <label className="text-xs text-gray-500">Start</label>
        <input type="date" value={start} onChange={(e) => { setStart(e.target.value); setPreset("custom"); onChange({ startDate: e.target.value, endDate: end }); }} className="border rounded px-2 py-1 text-sm" />
        <label className="text-xs text-gray-500">End</label>
        <input type="date" value={end} onChange={(e) => { setEnd(e.target.value); setPreset("custom"); onChange({ startDate: start, endDate: e.target.value }); }} className="border rounded px-2 py-1 text-sm" />
      </div>
    </div>
  );
}
