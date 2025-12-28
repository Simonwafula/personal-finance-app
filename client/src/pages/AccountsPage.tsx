// src/pages/AccountsPage.tsx
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
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
    <div className="space-y-6 pb-20 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            💼 Accounts
          </h1>
          <p className="text-base text-[var(--text-muted)] mt-2 font-medium">
            Manage your bank accounts, mobile money, and financial institutions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-sm font-semibold">
            {accounts.length} {accounts.length === 1 ? 'Account' : 'Accounts'}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Create/Edit account form - takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="card animate-slide-in sticky top-6 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 border-2">
            <div className="flex items-center justify-between mb-6">
              <div className="text-lg font-semibold flex items-center gap-2">
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
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., M-Pesa, KCB Savings"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Account Type *</label>
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
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
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
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
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Institution (Optional)
            </label>
            <input
              className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3.5 text-base bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
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

      {/* Account Management Tips */}
      <div className="card bg-gradient-to-br from-cyan-50/50 to-teal-50/50 dark:from-cyan-900/10 dark:to-teal-900/10 border border-cyan-200 dark:border-cyan-800">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-3xl">🏦</span>
          <div>
            <h3 className="font-semibold text-lg mb-1">Account Management Tips</h3>
            <p className="text-sm text-[var(--text-muted)]">Optimize your banking setup</p>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <Link to="/blog/separate-accounts" className="flex gap-2 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 group">
            <span className="text-green-600 dark:text-green-400 font-bold">•</span>
            <div>
              <p><strong>Separate Accounts:</strong> Keep different accounts for savings, spending, and bills to stay organized.</p>
              <span className="text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Read full guide →</span>
            </div>
          </Link>
          <Link to="/blog/track-opening-balance" className="flex gap-2 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 group">
            <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
            <div>
              <p><strong>Track Opening Balance:</strong> Record accurate starting balances for precise financial tracking.</p>
              <span className="text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Read full guide →</span>
            </div>
          </Link>
          <Link to="/blog/monitor-accounts-regularly" className="flex gap-2 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 group">
            <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
            <div>
              <p><strong>Monitor Regularly:</strong> Check your accounts weekly to catch unauthorized transactions early.</p>
              <span className="text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Read full guide →</span>
            </div>
          </Link>
          <Link to="/blog/mobile-money-security" className="flex gap-2 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 group">
            <span className="text-orange-600 dark:text-orange-400 font-bold">•</span>
            <div>
              <p><strong>Mobile Money Security:</strong> Use strong PINs and enable transaction notifications for M-Pesa/Airtel Money.</p>
              <span className="text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Read full guide →</span>
            </div>
          </Link>
        </div>
        <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
          <Link to="/blog" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View All Financial Tips →
          </Link>
        </div>
      </div>
        </div>

        {/* Accounts list - takes 3 columns */}
        <div className="lg:col-span-3">
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
                    {formatMoney(a.current_balance)}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {a.currency}
                  </div>
                </div>
                
                <div className="text-xs text-[var(--text-muted)] flex items-center gap-2">
                  <span>Opening: {formatMoney(a.opening_balance)}</span>
                  {parseFloat(a.current_balance) !== parseFloat(a.opening_balance) && (
                    <span className={parseFloat(a.current_balance) > parseFloat(a.opening_balance) ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                      {parseFloat(a.current_balance) > parseFloat(a.opening_balance) ? "↑" : "↓"}
                      {formatMoney(Math.abs(parseFloat(a.current_balance) - parseFloat(a.opening_balance)))}
                    </span>
                  )}
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
                  <th className="px-4 py-3 text-right font-semibold">Opening Balance</th>
                  <th className="px-4 py-3 text-right font-semibold">Current Balance</th>
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
                    <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400">
                      {formatMoney(a.opening_balance)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-lg">
                      {formatMoney(a.current_balance)}
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
      </div>
    </div>
  );
}
