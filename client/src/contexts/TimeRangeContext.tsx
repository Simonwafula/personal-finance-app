import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export interface TimeRange {
  startDate: string;
  endDate: string;
}

interface TimeRangeContextType {
  range: TimeRange;
  setRange: (r: TimeRange) => void;
}

function fmtDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

const TimeRangeContext = createContext<TimeRangeContextType | null>(null);

export function TimeRangeProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const qs = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const initialStart = qs.get("start") || fmtDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const initialEnd = qs.get("end") || fmtDate(new Date());
  const [range, setRangeState] = useState<TimeRange>({ startDate: initialStart, endDate: initialEnd });

  // Sync range if location.search is changed externally (eg. setSearchParams in other pages)
  useEffect(() => {
    const s = qs.get("start");
    const e = qs.get("end");
    if (s || e) {
      setRangeState({ startDate: s || range.startDate, endDate: e || range.endDate });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  function setRange(r: TimeRange) {
    setRangeState(r);
    const params = new URLSearchParams(location.search);
    params.set("start", r.startDate);
    params.set("end", r.endDate);
    navigate({ search: params.toString() }, { replace: true });
  }

  return <TimeRangeContext.Provider value={{ range, setRange }}>{children}</TimeRangeContext.Provider>;
}

export function useTimeRange() {
  const ctx = useContext(TimeRangeContext);
  if (!ctx) throw new Error("useTimeRange must be used within TimeRangeProvider");
  return ctx;
}
