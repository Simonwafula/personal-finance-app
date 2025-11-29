// src/pages/CategoriesPage.tsx
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  fetchCategories,
  createCategory,
} from "../api/finance";
import type { Category } from "../api/types";

const KINDS: Array<Category["kind"]> = ["INCOME", "EXPENSE", "TRANSFER"];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form
  const [name, setName] = useState("");
  const [kind, setKind] = useState<Category["kind"]>("EXPENSE");
  const [parentId, setParentId] = useState<number | "">("");

  async function loadCategories() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name) return;

    try {
      setSaving(true);
      setError(null);
      await createCategory({
        name,
        kind,
        parent: parentId ? (parentId as number) : null,
      });
      setName("");
      setParentId("");
      await loadCategories();
    } catch (err) {
      console.error(err);
      setError("Failed to create category");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Categories</h3>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-4 space-y-3 max-w-xl"
      >
        <div className="text-sm font-medium">Add Category</div>

        <div className="grid md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">Name</label>
            <input
              className="w-full border rounded px-2 py-1 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Kind</label>
            <select
              className="w-full border rounded px-2 py-1 text-sm"
              value={kind}
              onChange={(e) => setKind(e.target.value as Category["kind"])}
            >
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs text-gray-500 mb-1">
              Parent (optional, for grouping)
            </label>
            <select
              className="w-full border rounded px-2 py-1 text-sm"
              value={parentId}
              onChange={(e) =>
                setParentId(e.target.value ? Number(e.target.value) : "")
              }
            >
              <option value="">— None —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.kind})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary text-sm"
        >
          {saving ? "Saving…" : "Save Category"}
        </button>

        {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
      </form>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-sm font-medium mb-2">Existing Categories</div>
        {loading && <div>Loading…</div>}
        {!loading && categories.length === 0 && (
          <div className="text-sm text-gray-500">No categories yet.</div>
        )}
        {categories.length > 0 && (
          <table className="min-w-full text-xs md:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-1 text-left">Name</th>
                <th className="px-2 py-1 text-left">Kind</th>
                <th className="px-2 py-1 text-left">Parent</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-t">
                  <td className="px-2 py-1">{cat.name}</td>
                  <td className="px-2 py-1">{cat.kind}</td>
                  <td className="px-2 py-1">
                    {cat.parent
                      ? categories.find((p) => p.id === cat.parent)?.name ?? "-"
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
