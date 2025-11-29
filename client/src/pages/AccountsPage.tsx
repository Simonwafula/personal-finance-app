// src/pages/AccountsPage.tsx
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { fetchAccounts, createAccount, updateAccount, deleteAccount } from "../api/finance";
import type { Account } from "../api/types";
import { HiPencil, HiTrash, HiX } from "react-icons/hi";

const ACCOUNT_TYPES = [
  "BANK",
  "MOBILE_MONEY",
  "CASH",
  "SACCO",
  "INVESTMENT",
  "LOAN",
  "CREDIT_CARD",
  "OTHER",
];

function formatMoney(value: string | number) {
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return value.toString();
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState("BANK");
  const [currency, setCurrency] = useState("KES");
  const [openingBalance, setOpeningBalance] = useState("0");
  const [institution, setInstitution] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadAccounts() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAccounts();
      setAccounts(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAccounts();
  }, []);

  function resetForm() {
    setName("");
    setAccountType("BANK");
    setCurrency("KES");
    setOpeningBalance("0");
    setInstitution("");
    setEditingId(null);
  }

  function editAccount(account: Account) {
    setEditingId(account.id);
    setName(account.name);
    setAccountType(account.account_type);
    setCurrency(account.currency);
    setOpeningBalance(String(account.opening_balance));
    setInstitution(account.institution || "");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      
      const payload = {
        name,
        account_type: accountType,
        currency,
        opening_balance: Number(openingBalance),
        institution,
      };

      if (editingId) {
        await updateAccount(editingId, payload);
      } else {
        await createAccount(payload);
      }
      
      resetForm();
      await loadAccounts();
    } catch (err) {
      console.error(err);
      setError(editingId ? "Failed to update account" : "Failed to create account");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this account?")) return;
    
    try {
      setError(null);
      await deleteAccount(id);
      await loadAccounts();
    } catch (err) {
      console.error(err);
      setError("Failed to delete account");
    }
  }

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Accounts
          </h3>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Manage your bank accounts, mobile money, and other financial accounts
          </p>
        </div>
      </div>

      {/* Create/Edit account form */}
      <form onSubmit={handleSubmit} className="card animate-slide-in">
        <div className="flex items-center justify-between mb-6">
          <div className="text-lg font-semibold">
            {editingId ? "✏️ Edit Account" : "➕ Add New Account"}
          </div>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <HiX size={20} />
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Account Name *</label>
            <input
              className="w-full border-2 rounded-lg px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., M-Pesa, KCB Savings"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Account Type *</label>
            <select
              className="w-full border-2 rounded-lg px-3 py-2 text-sm"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
            >
              {ACCOUNT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <input
              className="w-full border-2 rounded-lg px-3 py-2 text-sm"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              placeholder="KES"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Opening Balance</label>
            <input
              type="number"
              step="0.01"
              className="w-full border-2 rounded-lg px-3 py-2 text-sm"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Institution (Optional)
            </label>
            <input
              className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g., KCB Bank, Safaricom"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm animate-slide-in">
            {error}
          </div>
        )}

        <div className="flex gap-3 mt-6 pt-4 border-t border-[var(--border-subtle)]">
        <div className="flex gap-3 mt-6 pt-4 border-t border-[var(--border-subtle)]">
          <button type="submit" disabled={saving} className="btn-primary flex-1 sm:flex-none disabled:opacity-60">
            {saving ? "Saving…" : editingId ? "Update Account" : "Create Account"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Accounts list */}
      <div className="card">
        <div className="text-lg font-semibold mb-6 flex items-center gap-2">
          <span>💼</span>
          Your Accounts
          {!loading && accounts.length > 0 && (
            <span className="text-sm text-[var(--text-muted)] font-normal">
              ({accounts.length})
            </span>
          )}
        </div>

        {loading && <div className="skeleton h-32 rounded" />}

        {!loading && accounts.length === 0 && (
          <div className="text-center py-16 text-[var(--text-muted)]">
            <div className="text-5xl mb-4">🏦</div>
            <p className="text-lg mb-2 font-medium">No accounts yet</p>
            <p className="text-sm">Create your first account above to get started</p>
          </div>
        )}

        {/* Mobile cards */}
        {accounts.length > 0 && (
          <div className="block md:hidden space-y-3">
            {accounts.map((a) => (
              <div key={a.id} className="p-4 bg-[var(--surface)] rounded-lg space-y-3 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{a.name}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">
                      {a.institution || "—"}
                    </div>
                  </div>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {a.account_type.replace("_", " ")}
                  </span>
                </div>
                
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold">
                    {formatMoney(a.opening_balance)}
                  </div>
                  <div className="text-sm text-[var(--text-muted)]">
                    {a.currency}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2 border-t border-[var(--border-subtle)]">
                  <button
                    onClick={() => editAccount(a)}
                    className="btn-edit flex-1 inline-flex items-center justify-center gap-1"
                    title="Edit account"
                  >
                    <HiPencil size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="btn-delete flex-1 inline-flex items-center justify-center gap-1"
                    title="Delete account"
                  >
                    <HiTrash size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Desktop table */}
        {accounts.length > 0 && (
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[var(--surface)] sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Type</th>
                  <th className="px-4 py-3 text-right font-semibold">Balance</th>
                  <th className="px-4 py-3 text-left font-semibold">Currency</th>
                  <th className="px-4 py-3 text-left font-semibold">Institution</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {accounts.map((a) => (
                  <tr key={a.id} className="hover:bg-[var(--surface)] transition-colors">
                    <td className="px-4 py-3 font-medium">{a.name}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {a.account_type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatMoney(a.opening_balance)}
                    </td>
                    <td className="px-4 py-3">{a.currency}</td>
                    <td className="px-4 py-3">{a.institution || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => editAccount(a)}
                          className="btn-edit inline-flex items-center gap-1"
                          title="Edit account"
                        >
                          <HiPencil size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="btn-delete inline-flex items-center gap-1"
                          title="Delete account"
                        >
                          <HiTrash size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
