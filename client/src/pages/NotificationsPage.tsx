import { useEffect, useMemo, useState } from "react";
import {
  fetchNotificationsPage,
  NotificationsPage as NotificationsPageType,
  markAsRead,
  markAllRead,
} from "../api/notifications";
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Notifications</h1>
        <div className="flex items-center gap-2">
          <button className="btn-secondary" onClick={onMarkAll}>
            Mark all read
          </button>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="input"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <form
        onSubmit={applyFilters}
        className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end"
      >
        <div>
          <label className="label">Search</label>
          <input
            className="input w-full"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Title or message"
          />
        </div>
        <div>
          <label className="label">Level</label>
          <select
            className="input w-full"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="">All</option>
            <option value="INFO">Info</option>
            <option value="SUCCESS">Success</option>
            <option value="WARNING">Warning</option>
            <option value="ERROR">Error</option>
          </select>
        </div>
        <div>
          <label className="label">Category</label>
          <input
            className="input w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. budget, recurring"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="unreadOnly"
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => setUnreadOnly(e.target.checked)}
          />
          <label htmlFor="unreadOnly" className="label m-0">
            Unread only
          </label>
        </div>
        <div>
          <button className="btn-primary w-full" type="submit">
            Apply
          </button>
        </div>
      </form>

      <div className="card">
        <div className="card-body p-0">
          {loading && <div className="p-4">Loading…</div>}
          {!loading && data && data.results.length === 0 && (
            <div className="p-4 muted">No notifications found</div>
          )}
          {!loading && data && data.results.length > 0 && (
            <ul>
              {data.results.map((n) => (
                <li
                  key={n.id}
                  className="px-4 py-3 border-b border-[var(--border-subtle)]"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 w-2 h-2 rounded-full ${
                        n.level === "ERROR"
                          ? "bg-red-500"
                          : n.level === "WARNING"
                          ? "bg-yellow-500"
                          : n.level === "SUCCESS"
                          ? "bg-green-500"
                          : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="font-medium flex items-center gap-2">
                        <span>{n.title}</span>
                        {!n.is_read && (
                          <span className="badge">New</span>
                        )}
                      </div>
                      {n.message && (
                        <div className="muted text-sm whitespace-pre-line">
                          {n.message}
                        </div>
                      )}
                      <div className="text-[10px] muted mt-1">
                        {new Date(n.created_at).toLocaleString()} ● {n.category}
                      </div>
                      {n.link_url && (
                        <Link to={n.link_url} className="text-sm underline">
                          View
                        </Link>
                      )}
                    </div>
                    {!n.is_read && (
                      <button
                        className="btn-secondary"
                        onClick={() => onMarkOne(n.id)}
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-3 flex items-center justify-between">
          <button
            className="btn-secondary"
            disabled={!canPrev}
            onClick={() => setOffset(Math.max(0, offset - limit))}
          >
            Previous
          </button>
          <div className="text-sm">
            {data ? `${Math.min(data.count, offset + 1)}–${Math.min(
              data.count,
              offset + (data.results?.length || 0)
            )} of ${data.count}` : "0 of 0"}
          </div>
          <button
            className="btn-secondary"
            disabled={!canNext}
            onClick={() => setOffset(offset + limit)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
