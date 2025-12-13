import { useEffect, useState } from "react";
import {
  fetchNotificationsPage,
  markAsRead,
  markAllRead,
} from "../api/notifications";
import type { NotificationsPage as NotificationsPageType } from "../api/notifications";
import { Link } from "react-router-dom";

export default function NotificationsPage() {
  const [data, setData] = useState<NotificationsPageType | null>(null);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<string>("");
  const [category, setCategory] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const page = await fetchNotificationsPage({
        limit,
        offset,
        q: q || undefined,
        level: level || undefined,
        category: category || undefined,
        unread: unreadOnly || undefined,
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

  async function onMarkOne(id: number) {
    await markAsRead(id);
    load();
  }

  async function onMarkAll() {
    await markAllRead();
    load();
  }

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            🔔 Notifications
          </h1>
          <p className="text-base text-[var(--text-muted)] mt-2 font-medium">
            Stay updated with important alerts and reminders
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
          <button className="btn-primary" onClick={onMarkAll}>
            ✓ Mark All Read
          </button>
        </div>
      </div>

      <div className="card p-6">
        <form
          onSubmit={applyFilters}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
        >
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <input
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Title or message"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Level</label>
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="">All Levels</option>
              <option value="INFO">ℹ️ Info</option>
              <option value="SUCCESS">✅ Success</option>
              <option value="WARNING">⚠️ Warning</option>
              <option value="ERROR">❌ Error</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <input
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. budget, recurring"
            />
          </div>
          <div className="flex items-center gap-2 pb-2">
            <input
              id="unreadOnly"
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
              checked={unreadOnly}
              onChange={(e) => setUnreadOnly(e.target.checked)}
            />
            <label htmlFor="unreadOnly" className="text-sm font-medium cursor-pointer">
              Unread only
            </label>
          </div>
          <div>
            <button className="btn-primary w-full" type="submit">
              🔍 Apply Filters
            </button>
          </div>
        </form>
      </div>

      <div className="card animate-slide-in">
        {loading && (
          <div className="p-8 text-center">
            <div className="loading-spinner mx-auto mb-3" />
            <p className="text-sm text-[var(--text-muted)]">Loading notifications...</p>
          </div>
        )}
        {!loading && data && data.results.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <p className="text-lg font-medium mb-2">No notifications found</p>
            <p className="text-sm text-[var(--text-muted)]">You're all caught up!</p>
          </div>
        )}
        {!loading && data && data.results.length > 0 && (
          <div className="divide-y divide-[var(--border-subtle)]">
            {data.results.map((n) => (
              <div
                key={n.id}
                className={`px-6 py-4 transition-all hover:bg-[var(--surface-hover)] ${
                  !n.is_read ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${
                      n.level === "ERROR"
                        ? "bg-red-500 shadow-lg shadow-red-500/50"
                        : n.level === "WARNING"
                        ? "bg-yellow-500 shadow-lg shadow-yellow-500/50"
                        : n.level === "SUCCESS"
                        ? "bg-green-500 shadow-lg shadow-green-500/50"
                        : "bg-blue-500 shadow-lg shadow-blue-500/50"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <span className="font-semibold text-base flex-1">{n.title}</span>
                      {!n.is_read && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-500 text-white">
                          NEW
                        </span>
                      )}
                    </div>
                    {n.message && (
                      <p className="text-sm text-[var(--text-muted)] whitespace-pre-line mb-2">
                        {n.message}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                      <span>📅 {new Date(n.created_at).toLocaleString()}</span>
                      {n.category && <span>🏷️ {n.category}</span>}
                    </div>
                    {n.link_url && (
                      <Link 
                        to={n.link_url} 
                        className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
                      >
                        🔗 View Details →
                      </Link>
                    )}
                  </div>
                  {!n.is_read && (
                    <button
                      className="btn-secondary text-xs px-3 py-1.5 flex-shrink-0"
                      onClick={() => onMarkOne(n.id)}
                    >
                      ✓ Mark Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="px-6 py-4 bg-[var(--surface)] border-t border-[var(--border-subtle)] flex items-center justify-between">
          <button
            className="btn-secondary disabled:opacity-40"
            disabled={!canPrev}
            onClick={() => setOffset(Math.max(0, offset - limit))}
          >
            ← Previous
          </button>
          <div className="text-sm font-medium">
            {data ? (
              <span>
                Showing <span className="font-bold text-blue-600 dark:text-blue-400">{Math.min(data.count, offset + 1)}-{Math.min(data.count, offset + (data.results?.length || 0))}</span> of <span className="font-bold">{data.count}</span>
              </span>
            ) : (
              '0 of 0'
            )}
          </div>
          <button
            className="btn-secondary disabled:opacity-40"
            disabled={!canNext}
            onClick={() => setOffset(offset + limit)}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
