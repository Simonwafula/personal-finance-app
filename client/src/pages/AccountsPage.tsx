// src/pages/AccountsPage.tsx
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { fetchAccounts, createAccount, updateAccount, deleteAccount } from "../api/finance";
import type { Account } from "../api/types";
import { HiPencil, HiTrash, HiX, HiPlus, HiChevronDown, HiExternalLink } from "react-icons/hi";

const ACCOUNT_TYPES = [
  { value: "BANK", label: "Bank Account", icon: "🏦" },
  { value: "MOBILE_MONEY", label: "Mobile Money", icon: "📱" },
  { value: "CASH", label: "Cash", icon: "💵" },
  { value: "SACCO", label: "SACCO", icon: "🤝" },
  { value: "INVESTMENT", label: "Investment", icon: "📈" },
  { value: "LOAN", label: "Loan", icon: "💳" },
  { value: "CREDIT_CARD", label: "Credit Card", icon: "💳" },
  { value: "OTHER", label: "Other", icon: "📁" },
];

function getAccountIcon(type: string) {
  return ACCOUNT_TYPES.find(t => t.value === type)?.icon || "📁";
}

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
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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
    setShowForm(false);
  }

  function editAccount(account: Account) {
    setEditingId(account.id);
    setName(account.name);
    setAccountType(account.account_type);
    setCurrency(account.currency);
    setOpeningBalance(String(account.opening_balance));
    setInstitution(account.institution || "");
    setShowForm(true);
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
    if (!confirm("Are you sure you want to delete this account? All transactions linked to this account will also be deleted.")) return;
    
    try {
      setDeletingId(id);
      setError(null);
      await deleteAccount(id);
      await loadAccounts();
    } catch (err) {
      console.error(err);
      setError("Failed to delete account");
    } finally {
      setDeletingId(null);
    }
  }

  // Calculate liquidity - immediate access cash (excludes investments, loans, credit cards)
  const liquidAccountTypes = ['BANK', 'MOBILE_MONEY', 'CASH', 'SACCO'];
  const liquidAccounts = accounts.filter(a => liquidAccountTypes.includes(a.account_type));
  const totalLiquidity = liquidAccounts.reduce((sum, a) => sum + Number(a.current_balance || a.opening_balance), 0);
  const totalAllAccounts = accounts.reduce((sum, a) => sum + Number(a.current_balance || a.opening_balance), 0);

  return (
    <div className="space-y-4 pb-20 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Accounts
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            Manage your bank accounts, mobile money, and wallets
          </p>
        </div>
        <button
          onClick={() => { setEditingId(null); setShowForm(!showForm); }}
          className="btn-primary inline-flex items-center gap-2"
        >
          <HiPlus size={18} />
          <span>Add Account</span>
        </button>
      </div>

      {error && (
        <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm p-3">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      {!loading && accounts.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="card p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">💵</span>
              <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Available Cash</span>
            </div>
            <div className="text-xl font-bold text-emerald-600">{currency} {formatMoney(totalLiquidity)}</div>
            <div className="text-xs text-[var(--text-muted)]">{liquidAccounts.length} liquid account{liquidAccounts.length !== 1 ? 's' : ''}</div>
          </div>
          
          <div className="card p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🏦</span>
              <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Total Balance</span>
            </div>
            <div className="text-xl font-bold text-blue-600">{currency} {formatMoney(totalAllAccounts)}</div>
            <div className="text-xs text-[var(--text-muted)]">{accounts.length} total account{accounts.length !== 1 ? 's' : ''}</div>
          </div>

          <div className="card p-3 col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">📊</span>
              <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">By Type</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {ACCOUNT_TYPES.map(type => {
                const count = accounts.filter(a => a.account_type === type.value).length;
                return count > 0 ? (
                  <span key={type.value} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800">
                    {type.icon} {count}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card p-4 space-y-4 animate-slide-in">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{editingId ? 'Edit Account' : 'Add Account'}</h4>
            <button type="button" onClick={resetForm} className="text-[var(--text-muted)] hover:text-[var(--text)]">
              <HiX size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Name *</label>
              <input
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., M-Pesa, KCB Savings"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Type *</label>
              <select
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
              >
                {ACCOUNT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.icon} {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Opening Balance</label>
              <input
                type="number"
                step="0.01"
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Currency</label>
              <input
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="KES"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">Institution</label>
              <input
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g., KCB, Safaricom"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1 sm:flex-none disabled:opacity-60">
              {saving ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Accounts List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Your Accounts</h4>
          {accounts.length > 0 && (
            <span className="text-sm text-[var(--text-muted)]">{accounts.length} total</span>
          )}
        </div>

        {loading && <div className="skeleton h-32 rounded" />}

        {!loading && accounts.length === 0 && (
          <div className="text-center py-8 text-[var(--text-muted)]">
            <div className="text-4xl mb-3">🏦</div>
            <p className="mb-1">No accounts yet</p>
            <p className="text-sm mb-4">Create your first account to start tracking</p>
            <button onClick={() => setShowForm(true)} className="btn-primary text-sm">
              <HiPlus size={16} className="inline mr-1" /> Add Account
            </button>
          </div>
        )}

        {/* Account Cards Grid */}
        {accounts.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {accounts.map((a) => {
              const balanceChange = parseFloat(a.current_balance) - parseFloat(a.opening_balance);
              const icon = getAccountIcon(a.account_type);
              
              return (
                <div key={a.id} className="p-4 bg-[var(--surface)] rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{icon}</span>
                      <div>
                        <div className="font-semibold">{a.name}</div>
                        <div className="text-xs text-[var(--text-muted)]">
                          {a.institution || a.account_type.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      {a.account_type.replace("_", " ")}
                    </span>
                  </div>
                  
                  <div className="flex items-baseline gap-2 mb-2">
                    <div className="text-2xl font-bold">{a.currency} {formatMoney(a.current_balance)}</div>
                  </div>
                  
                  <div className="text-xs text-[var(--text-muted)] flex items-center gap-2 mb-3">
                    <span>Opened: {formatMoney(a.opening_balance)}</span>
                    {balanceChange !== 0 && (
                      <span className={balanceChange > 0 ? "text-green-600" : "text-red-600"}>
                        {balanceChange > 0 ? "↑" : "↓"} {formatMoney(Math.abs(balanceChange))}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2 pt-2 border-t border-[var(--border-subtle)]">
                    <Link
                      to={`/transactions?account=${a.id}`}
                      className="flex-1 text-center py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                    >
                      View Transactions
                    </Link>
                    <button
                      onClick={() => editAccount(a)}
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-[var(--text-muted)]"
                      title="Edit"
                    >
                      <HiPencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      disabled={deletingId === a.id}
                      className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 disabled:opacity-50"
                      title="Delete"
                    >
                      <HiTrash size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tips - Hidden on mobile */}
      <div className="hidden lg:block card bg-gradient-to-br from-cyan-50/50 to-teal-50/50 dark:from-cyan-900/10 dark:to-teal-900/10">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <span>💡</span> Quick Tips
        </h4>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
            <strong>Separate Accounts:</strong> Keep different accounts for savings, spending, and bills.
          </div>
          <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
            <strong>Track Accurately:</strong> Record accurate opening balances for precise tracking.
          </div>
        </div>
      </div>
    </div>
  );
}
