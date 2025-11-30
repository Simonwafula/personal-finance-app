import { useTimeRange } from '../contexts/TimeRangeContext';

function fmtDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function isPresetActive(range: { startDate: string; endDate: string }, days: number) {
  try {
    const s = new Date(range.startDate);
    const e = new Date(range.endDate);
    const diff = Math.round(Math.abs((e.getTime() - s.getTime()) / (24 * 60 * 60 * 1000)));
    // Accept a tolerance of 1 day
    if (days === 365) return Math.abs(diff - 365) <= 1;
    return Math.abs(diff - days) <= 1;
  } catch {
    return false;
  }
}

function applyPresetRange(setRange: (r: { startDate: string; endDate: string }) => void, days: number) {
  const end = new Date();
  const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  setRange({ startDate: fmtDate(start), endDate: fmtDate(end) });
}

export default function TimeFilterBar() {
  const { range, setRange } = useTimeRange();

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Date Range Display */}
        <div className="text-sm text-gray-600">
          <span className="font-medium">{range.startDate}</span>
          {' → '}
          <span className="font-medium">{range.endDate}</span>
        </div>

        {/* Preset Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => applyPresetRange(setRange, 7)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              isPresetActive(range, 7)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            7d
          </button>
          <button
            onClick={() => applyPresetRange(setRange, 30)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              isPresetActive(range, 30)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            30d
          </button>
          <button
            onClick={() => applyPresetRange(setRange, 90)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              isPresetActive(range, 90)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            90d
          </button>
          <button
            onClick={() => applyPresetRange(setRange, 365)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              isPresetActive(range, 365)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            1y
          </button>
        </div>
      </div>
    </div>
  );
}
