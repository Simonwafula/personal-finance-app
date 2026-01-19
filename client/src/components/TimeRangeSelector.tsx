import { useState, useEffect, useContext } from "react";
import { TimeRangeContext } from "../contexts/TimeRangeContext";

export interface TimeRange {
  startDate: string;
  endDate: string;
}

interface Props {
  onChange?: (range: TimeRange) => void;
  initialStart?: string;
  initialEnd?: string;
}

function fmtDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function TimeRangeSelector({ onChange, initialStart, initialEnd }: Props) {
  // Use context directly to avoid the hook throwing an error
  const ctx = useContext(TimeRangeContext);
  const [preset, setPreset] = useState<string>("30d");
  const [start, setStart] = useState<string>(initialStart ?? ctx?.range.startDate ?? fmtDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)));
  const [end, setEnd] = useState<string>(initialEnd ?? ctx?.range.endDate ?? fmtDate(new Date()));

  useEffect(() => {
    if (ctx) {
      setStart(ctx.range.startDate);
      setEnd(ctx.range.endDate);
    }
  }, [ctx]);

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
    if (onChange) onChange({ startDate: startStr, endDate: endStr });
    else ctx?.setRange({ startDate: startStr, endDate: endStr });
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-wrap">
        <button aria-label="7 days" aria-pressed={preset === "7d"} onClick={() => applyPreset("7d")} className={`text-xs sm:text-sm px-2 py-1 rounded border transition-colors ${preset === "7d" ? "bg-[var(--primary-600)] text-white border-transparent" : "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:border-[var(--primary-400)] hover:text-[var(--text-main)]"}`}>
          7d
        </button>
        <button aria-label="30 days" aria-pressed={preset === "30d"} onClick={() => applyPreset("30d")} className={`text-xs sm:text-sm px-2 py-1 rounded border transition-colors ${preset === "30d" ? "bg-[var(--primary-600)] text-white border-transparent" : "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:border-[var(--primary-400)] hover:text-[var(--text-main)]"}`}>
          30d
        </button>
        <button aria-label="90 days" aria-pressed={preset === "90d"} onClick={() => applyPreset("90d")} className={`text-xs sm:text-sm px-2 py-1 rounded border transition-colors ${preset === "90d" ? "bg-[var(--primary-600)] text-white border-transparent" : "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:border-[var(--primary-400)] hover:text-[var(--text-main)]"}`}>
          90d
        </button>
        <button aria-label="1 year" aria-pressed={preset === "1y"} onClick={() => applyPreset("1y")} className={`text-xs sm:text-sm px-2 py-1 rounded border transition-colors ${preset === "1y" ? "bg-[var(--primary-600)] text-white border-transparent" : "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:border-[var(--primary-400)] hover:text-[var(--text-main)]"}`}>
          1y
        </button>
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        <label className="text-xs muted hidden sm:inline">Start</label>
        <input type="date" value={start} onChange={(e) => { setStart(e.target.value); setPreset("custom"); if (onChange) onChange({ startDate: e.target.value, endDate: end }); else ctx?.setRange({ startDate: e.target.value, endDate: end }); }} className="rounded px-2 py-1 text-sm bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--text-main)] max-w-[150px]" />
        <label className="text-xs muted hidden sm:inline">End</label>
        <input type="date" value={end} onChange={(e) => { setEnd(e.target.value); setPreset("custom"); if (onChange) onChange({ startDate: start, endDate: e.target.value }); else ctx?.setRange({ startDate: start, endDate: e.target.value }); }} className="rounded px-2 py-1 text-sm bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--text-main)] max-w-[150px]" />
      </div>
    </div>
  );
}
