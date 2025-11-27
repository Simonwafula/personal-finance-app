// src/pages/AccountsPage.tsx
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { fetchAccounts, createAccount } from "../api/finance";
import type { Account } from "../api/types";

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await createAccount({
        name,
        account_type: accountType,
        currency,
        opening_balance: Number(openingBalance),
        institution,
      });
      setName("");
      setOpeningBalance("0");
      setInstitution("");
      await loadAccounts();
    } catch (err) {
      console.error(err);
      setError("Failed to create account");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Accounts</h3>

      {/* Create account form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-4 space-y-3 max-w-xl"
      >
        <div className="text-sm font-medium">Add Account</div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Name</label>
            <input
              className="w-full border rounded px-2 py-1 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Account Type
            </label>
            <select
              className="w-full border rounded px-2 py-1 text-sm"
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
            <label className="block text-xs text-gray-500 mb-1">Currency</label>
            <input
              className="w-full border rounded px-2 py-1 text-sm"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Opening Balance
            </label>
            <input
              type="number"
              className="w-full border rounded px-2 py-1 text-sm"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">
              Institution (optional)
            </label>
            <input
              className="w-full border rounded px-2 py-1 text-sm"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Account"}
        </button>

        {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
      </form>

      {/* Accounts list */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-sm font-medium mb-2">Existing Accounts</div>

        {loading && <div>Loading…</div>}

        {!loading && accounts.length === 0 && (
          <div className="text-sm text-gray-500">No accounts yet.</div>
        )}

        {accounts.length > 0 && (
          <table className="min-w-full text-xs md:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-1 text-left">Name</th>
                <th className="px-2 py-1 text-left">Type</th>
                <th className="px-2 py-1 text-right">Opening Balance</th>
                <th className="px-2 py-1 text-left">Currency</th>
                <th className="px-2 py-1 text-left">Institution</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="px-2 py-1">{a.name}</td>
                  <td className="px-2 py-1">{a.account_type}</td>
                  <td className="px-2 py-1 text-right">
                    {formatMoney(a.opening_balance)}
                  </td>
                  <td className="px-2 py-1">{a.currency}</td>
                  <td className="px-2 py-1">{a.institution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
