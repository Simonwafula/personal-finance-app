import { useEffect, useState } from "react";
import { fetchActivityLogsPage, type ActivityLogPage } from "../api/activity";

const ACTION_OPTIONS = [
  { value: "", label: "All actions" },
  { value: "transaction.created", label: "Transaction created" },
  { value: "transaction.updated", label: "Transaction updated" },
  { value: "transaction.deleted", label: "Transaction deleted" },
  { value: "transaction.import.csv", label: "CSV import" },
  { value: "transaction.import.pdf", label: "PDF import" },
];

function formatAction(action: string) {
  const match = ACTION_OPTIONS.find((opt) => opt.value === action);
  return match ? match.label : action.replace(/\./g, " ");
}

export default function ActivityPage() {
  const [data, setData] = useState<ActivityLogPage | null>(null);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [action, setAction] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const page = await fetchActivityLogsPage({
        limit,
        offset,
        action: action || undefined,
        start: start || undefined,
        end: end || undefined,
      });
      setData(page);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, offset]);

  function applyFilters(e: React.FormEvent) {
    e.preventDefault();
    setOffset(0);
    load();
  }

  const canPrev = offset > 0;
  const canNext = !!data && offset + limit < data.count;

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Activity
          </h1>
          <p className="text-base text-[var(--text-muted)] mt-2 font-medium">
            Recent changes and imports across your account
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-800"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      <div className="card p-6">
        <form onSubmit={applyFilters} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2">Action</label>
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800"
              value={action}
              onChange={(e) => setAction(e.target.value)}
            >
              {ACTION_OPTIONS.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Start date</label>
            <input
              type="date"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End date</label>
            <input
              type="date"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <button className="btn-primary w-full" type="submit">
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      <div className="card animate-slide-in">
        {loading && (
          <div className="p-8 text-center">
            <div className="loading-spinner mx-auto mb-3" />
            <p className="text-sm text-[var(--text-muted)]">Loading activity...</p>
          </div>
        )}
        {!loading && data && data.results.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-lg font-medium mb-2">No activity yet</p>
            <p className="text-sm text-[var(--text-muted)]">Start by adding or importing transactions.</p>
          </div>
        )}
        {!loading && data && data.results.length > 0 && (
          <div className="divide-y divide-[var(--border-subtle)]">
            {data.results.map((item) => (
              <div key={item.id} className="px-6 py-4 flex items-start gap-4">
                <div className="mt-1 w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/40" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-base">{item.summary}</span>
                    <span className="text-xs text-[var(--text-muted)] px-2 py-1 rounded-full border border-[var(--border-subtle)]">
                      {formatAction(item.action)}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {new Date(item.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {data && data.count > limit && (
        <div className="flex items-center justify-between">
          <button
            className="btn-secondary text-sm"
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={!canPrev}
          >
            Previous
          </button>
          <div className="text-sm text-[var(--text-muted)]">
            Page {Math.floor(offset / limit) + 1} of {Math.ceil(data.count / limit)}
          </div>
          <button
            className="btn-secondary text-sm"
            onClick={() => setOffset(offset + limit)}
            disabled={!canNext}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
