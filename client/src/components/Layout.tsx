// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchCurrentUser, type CurrentUser } from "../api/auth";

// TODO: Add nav items to sidebar

export default function Layout() {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const u = await fetchCurrentUser();
        setUser(u);
      } catch {
        setUser(null);
      }
    }
    loadUser();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* sidebar ... */}

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Finance Dashboard</h2>
          <div className="text-xs text-gray-500 space-x-3 flex items-center">
            {user ? (
              <>
                <span>Signed in as {user.username || user.email}</span>
                <a
                  href="http://127.0.0.1:8000/accounts/logout/"
                  className="px-2 py-1 rounded bg-gray-200"
                >
                  Logout
                </a>
              </>
            ) : (
              <a
                href="http://127.0.0.1:8000/accounts/google/login/"
                className="px-2 py-1 rounded bg-blue-600 text-white"
              >
                Login with Google
              </a>
            )}
          </div>
        </header>

        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
