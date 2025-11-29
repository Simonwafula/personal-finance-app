import { useEffect, useRef, useState } from "react";
import { HiBell, HiCheck } from "react-icons/hi";
import {
  fetchNotifications,
  fetchUnreadCount,
  markAllRead,
  markAsRead,
} from "../api/notifications";
import type { NotificationItem } from "../api/notifications";
import { Link } from "react-router-dom";

export default function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const loadingRef = useRef(false);

  async function refreshCounts() {
    try {
      const c = await fetchUnreadCount();
      setUnread(c);
    } catch (e) {
      // ignore
    }
  }

  async function refreshList() {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const data = await fetchNotifications();
      setItems(data.slice(0, 10));
    } finally {
      loadingRef.current = false;
    }
  }

  useEffect(() => {
    refreshCounts();
    const id = setInterval(refreshCounts, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (open) refreshList();
  }, [open]);

  async function onMarkAllRead() {
    await markAllRead();
    setItems((prev) => prev.map((i) => ({ ...i, is_read: true })));
    setUnread(0);
  }

  async function onMarkOne(id: number) {
    await markAsRead(id);
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, is_read: true } : i))
    );
    setUnread((u) => Math.max(0, u - 1));
  }

  return (
    <div className="relative">
      <button
        className="icon-btn relative"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        title="Notifications"
      >
        <HiBell size={18} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center text-[10px] leading-none min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] z-[70]">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]/80 backdrop-blur shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-subtle)]">
              <div className="font-semibold">Notifications</div>
              <button className="text-xs underline" onClick={onMarkAllRead}>
                Mark all read
              </button>
            </div>
            <div className="max-h-96 overflow-auto">
              {items.length === 0 ? (
                <div className="p-4 text-sm muted">No notifications</div>
              ) : (
                items.map((n) => (
                  <div
                    key={n.id}
                    className={`px-3 py-2 border-b border-[var(--border-subtle)] ${
                      n.is_read ? "opacity-70" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2">
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
                        <div className="text-sm font-medium">{n.title}</div>
                        {n.message && (
                          <div className="text-xs muted whitespace-pre-line">
                            {n.message}
                          </div>
                        )}
                        <div className="text-[10px] muted mt-1">
                          {new Date(n.created_at).toLocaleString()}
                        </div>
                        {n.link_url && (
                          <Link
                            to={n.link_url}
                            className="text-xs underline mt-1 inline-block"
                            onClick={() => setOpen(false)}
                          >
                            View
                          </Link>
                        )}
                      </div>
                      {!n.is_read && (
                        <button
                          className="icon-btn"
                          onClick={() => onMarkOne(n.id)}
                          title="Mark read"
                          aria-label="Mark read"
                        >
                          <HiCheck size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
