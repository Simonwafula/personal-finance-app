// src/pages/TransactionsPage.tsx
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
// TimeRangeSelector provided globally via Layout
import { useTimeRange } from "../contexts/TimeRangeContext";
import type { FormEvent } from "react";
import {
  fetchTransactionsPaged,
  fetchAccounts,
  fetchCategories,
  fetchTags,
  createTransaction,
  createCategory,
  updateCategory,
  deleteCategory,
  createTag,
  updateTag,
  deleteTag,
  fetchTagAnalysis,
  importTransactionsCsv,
  exportTransactionsCsv,
} from "../api/finance";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type {
  Transaction,
  Account,
  Category,
  Tag,
  TagAnalysis,
  TransactionKind,
} from "../api/types";

function formatMoney(value: string | number) {
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return value.toString();
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [aggregatedSeries, setAggregatedSeries] = useState<{date:string;income:number;expenses:number}[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [tagAnalysis, setTagAnalysis] = useState<TagAnalysis[]>([]);

  const [loading, setLoading] = useState(false);
  const [pageLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [loadingRefs, setLoadingRefs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [accountId, setAccountId] = useState<number | "">("");
  const [kind, setKind] = useState<TransactionKind>("EXPENSE");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10) // today
  );
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResult, setImportResult] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [searchParams] = useSearchParams();
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const { range } = useTimeRange();
  const [filterCategory, setFilterCategory] = useState<number | "">(searchParams.get("category") ? Number(searchParams.get("category")) : "");
  const [filterKind, setFilterKind] = useState<TransactionKind | "">((searchParams.get("kind") as TransactionKind) || "");

  // Category management state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryKind, setCategoryKind] = useState<TransactionKind>("EXPENSE");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [savingCategory, setSavingCategory] = useState(false);

  // Tag management state
  const [showTagModal, setShowTagModal] = useState(false);
  const [showTagAnalysis, setShowTagAnalysis] = useState(false);
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#3B82F6");
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [savingTag, setSavingTag] = useState(false);

  async function loadRefs() {
    try {
      setLoadingRefs(true);
      const [accs, cats, existingTags] = await Promise.all([
        fetchAccounts(),
        fetchCategories(),
        fetchTags(),
      ]);
      setAccounts(accs);
      setAllTags(existingTags);
      
      // Predefined expense categories
      const predefinedExpenseCategories = [
        "Food & Dining",
        "Transportation",
        "Shopping",
        "Entertainment",
        "Bills & Utilities",
        "Healthcare",
        "Education",
        "Personal Care",
        "Travel",
        "Insurance",
        "Rent/Mortgage",
        "Groceries",
        "Other"
      ];

      const predefinedIncomeCategories = [
        "Salary",
        "Freelance",
        "Business",
        "Investment",
        "Gift",
        "Other Income"
      ];

      // Create missing predefined categories
      if (cats.length === 0) {
        const expensePromises = predefinedExpenseCategories.map(name =>
          createCategory({ name, kind: "EXPENSE" }).catch(err => console.error(`Failed to create ${name}:`, err))
        );
        const incomePromises = predefinedIncomeCategories.map(name =>
          createCategory({ name, kind: "INCOME" }).catch(err => console.error(`Failed to create ${name}:`, err))
        );
        await Promise.all([...expensePromises, ...incomePromises]);
        
        // Reload categories after creating
        const updatedCats = await fetchCategories();
        setCategories(updatedCats);
      } else {
        setCategories(cats);
      }
      
      if (accs.length > 0 && accountId === "") {
        setAccountId(accs[0].id);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load accounts/categories");
    } finally {
      setLoadingRefs(false);
    }
  }

  async function loadTransactions() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTransactionsPaged({ start: range.startDate, end: range.endDate, limit: pageLimit, offset });
      // DRF LimitOffsetPagination returns results + count
      const items = data.results ?? data;
      setTransactions(items);
      setTotalCount(typeof data.count === 'number' ? data.count : null);
      applyFilters(items, range.startDate, range.endDate, filterCategory, filterKind);
    } catch (err) {
      console.error(err);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }

  // Load aggregated data for the mini chart top of the transactions page
  useEffect(() => {
    async function loadAggregated() {
      try {
        const { fetchAggregatedTransactions } = await import('../api/finance');
        const res = await fetchAggregatedTransactions({ start: range.startDate, end: range.endDate, group_by: 'day' });
        setAggregatedSeries((res.series && res.series.length > 0) ? res.series : generateEmptyDaySeries(range.startDate, range.endDate));
      } catch (err) {
        console.error(err);
      }
    }
    loadAggregated();
  }, [range.startDate, range.endDate]);

  function generateEmptyDaySeries(start: string, end: string) {
    const s = new Date(start);
    const e = new Date(end);
    const out: {date:string;income:number;expenses:number}[] = [];
    for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
      out.push({ date: d.toISOString().slice(0,10), income: 0, expenses: 0 });
    }
    return out;
  }

  function applyFilters(
    txs: Transaction[],
    start?: string | null,
    end?: string | null,
    category?: number | "",
    kindF?: TransactionKind | ""
  ) {
    let filtered = txs.slice();
    if (start) {
      const s = new Date(start);
      filtered = filtered.filter((t) => new Date(t.date) >= s);
    }
    if (end) {
      const e = new Date(end);
      filtered = filtered.filter((t) => new Date(t.date) <= e);
    }
    if (category) {
      filtered = filtered.filter((t) => t.category === category);
    }
    if (kindF) {
      filtered = filtered.filter((t) => t.kind === kindF);
    }
    setFilteredTransactions(filtered);
  }

  useEffect(() => {
    loadRefs();
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFilterCategory(searchParams.get("category") ? Number(searchParams.get("category")) : "");
    setFilterKind((searchParams.get("kind") as TransactionKind) || "");
    applyFilters(transactions, range.startDate, range.endDate, searchParams.get("category") ? Number(searchParams.get("category")) : "", (searchParams.get("kind") as TransactionKind) || "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    // reload when pagination offset changes
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!accountId || !amount) return;

    try {
      setSaving(true);
      setError(null);

      await createTransaction({
        account: accountId as number,
        date,
        amount: Number(amount),
        kind,
        category: categoryId ? (categoryId as number) : null,
        description,
        tags,
      });

      // Clear some fields for quick entry
      setAmount("");
      setDescription("");
      setTags("");

      await loadTransactions();
      // reload aggregated series after creating a new transaction
      try {
        const { fetchAggregatedTransactions } = await import('../api/finance');
        const res = await fetchAggregatedTransactions({ start: range.startDate, end: range.endDate });
        setAggregatedSeries(res.series || []);
      } catch (err) {}
      // notify other pages a transaction was created so they can re-fetch
      window.dispatchEvent(new Event('transactionsUpdated'));
    } catch (err) {
      console.error(err);
      setError("Failed to create transaction");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveCategory(e: FormEvent) {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      setSavingCategory(true);
      setError(null);

      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: categoryName,
          kind: categoryKind,
        });
      } else {
        await createCategory({
          name: categoryName,
          kind: categoryKind,
        });
      }

      // Reload categories
      const cats = await fetchCategories();
      setCategories(cats);

      // Reset form
      setCategoryName("");
      setCategoryKind("EXPENSE");
      setEditingCategory(null);
      setShowCategoryModal(false);
    } catch (err) {
      console.error(err);
      setError("Failed to save category");
    } finally {
      setSavingCategory(false);
    }
  }

  async function handleDeleteCategory(categoryId: number) {
    if (!confirm("Delete this category? Transactions using it will have no category.")) return;

    try {
      setError(null);
      await deleteCategory(categoryId);
      
      // Reload categories
      const cats = await fetchCategories();
      setCategories(cats);
      
      // Reload transactions in case any used this category
      await loadTransactions();
    } catch (err) {
      console.error(err);
      setError("Failed to delete category");
    }
  }

  function openEditCategory(cat: Category) {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setCategoryKind(cat.kind as TransactionKind);
    setShowCategoryModal(true);
  }

  function openAddCategory() {
    setEditingCategory(null);
    setCategoryName("");
    setCategoryKind("EXPENSE");
    setShowCategoryModal(true);
  }

  // Tag management functions
  async function loadTagAnalysis() {
    try {
      const data = await fetchTagAnalysis({
        start: range.startDate,
        end: range.endDate,
      });
      setTagAnalysis(data.tags);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSaveTag(e: FormEvent) {
    e.preventDefault();
    if (!tagName.trim()) return;

    try {
      setSavingTag(true);
      setError(null);

      if (editingTag) {
        await updateTag(editingTag.id, {
          name: tagName,
          color: tagColor,
        });
      } else {
        await createTag({
          name: tagName,
          color: tagColor,
        });
      }

      // Reload tags
      const updatedTags = await fetchTags();
      setAllTags(updatedTags);

      // Reset form
      setTagName("");
      setTagColor("#3B82F6");
      setEditingTag(null);
      setShowTagModal(false);
    } catch (err) {
      console.error(err);
      setError("Failed to save tag");
    } finally {
      setSavingTag(false);
    }
  }

  async function handleDeleteTag(tagId: number) {
    if (!confirm("Delete this tag?")) return;

    try {
      setError(null);
      await deleteTag(tagId);
      
      // Reload tags
      const updatedTags = await fetchTags();
      setAllTags(updatedTags);
      
      // Reload analysis if shown
      if (showTagAnalysis) {
        await loadTagAnalysis();
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete tag");
    }
  }

  function openEditTag(tag: Tag) {
    setEditingTag(tag);
    setTagName(tag.name);
    setTagColor(tag.color);
    setShowTagModal(true);
  }

  function openAddTag() {
    setEditingTag(null);
    setTagName("");
    setTagColor("#3B82F6");
    setShowTagModal(true);
  }

  useEffect(() => {
    if (showTagAnalysis) {
      loadTagAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTagAnalysis, range.startDate, range.endDate]);

  const filteredCategories = categories.filter(
    (c) => c.kind === kind || c.kind === "EXPENSE" || c.kind === "INCOME"
  );

  return (
    <div className="space-y-4">
      {/* Category Management Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCategoryModal(false)}>
          <div className="card max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h4>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Food & Dining"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Type</label>
                <select
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={categoryKind}
                  onChange={(e) => setCategoryKind(e.target.value as TransactionKind)}
                >
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                  <option value="TRANSFER">Transfer</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={savingCategory}
                  className="btn-primary flex-1"
                >
                  {savingCategory ? "Saving…" : editingCategory ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tag Management Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowTagModal(false)}>
          <div className="card max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">
                {editingTag ? "Edit Tag" : "Add Tag"}
              </h4>
              <button
                onClick={() => setShowTagModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTag} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Tag Name
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  placeholder="e.g. work, personal, vacation"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    className="h-10 w-20 border rounded cursor-pointer"
                    value={tagColor}
                    onChange={(e) => setTagColor(e.target.value)}
                  />
                  <input
                    type="text"
                    className="flex-1 border rounded px-3 py-2 text-sm font-mono"
                    value={tagColor}
                    onChange={(e) => setTagColor(e.target.value)}
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={savingTag}
                  className="btn-primary flex-1"
                >
                  {savingTag ? "Saving…" : editingTag ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowTagModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Transactions</h3>
        <div className="flex gap-2">
          <button
            onClick={openAddTag}
            className="btn-secondary text-sm"
          >
            + Add Tag
          </button>
          <button
            onClick={openAddCategory}
            className="btn-primary text-sm"
          >
            + Add Category
          </button>
        </div>
      </div>

      {/* TimeRangeSelector is provided globally in the header/layout */}

      {/* Tags Management & Analysis Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold">Tags</h4>
          <button
            onClick={() => setShowTagAnalysis(!showTagAnalysis)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            {showTagAnalysis ? "Hide" : "Show"} Analysis
          </button>
        </div>
        
        {/* Tag list */}
        <div className="flex flex-wrap gap-2 mb-3">
          {allTags.length === 0 && (
            <div className="text-sm text-gray-500">
              No tags yet. Click "+ Add Tag" to create one.
            </div>
          )}
          {allTags.map((tag) => (
            <div
              key={tag.id}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm"
              style={{ backgroundColor: tag.color + "20", color: tag.color }}
            >
              <span>{tag.name}</span>
              <button
                onClick={() => openEditTag(tag)}
                className="hover:opacity-70"
                title="Edit tag"
              >
                ✎
              </button>
              <button
                onClick={() => handleDeleteTag(tag.id)}
                className="hover:opacity-70"
                title="Delete tag"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Tag Analysis */}
        {showTagAnalysis && (
          <div className="border-t pt-3">
            <div className="text-xs font-medium text-gray-600 mb-2">
              Tag Analysis ({range.startDate} to {range.endDate})
            </div>
            {tagAnalysis.length === 0 && (
              <div className="text-sm text-gray-500">
                No transactions with tags in this period.
              </div>
            )}
            <div className="space-y-2">
              {tagAnalysis.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-xs text-gray-500">
                      ({item.count} transaction{item.count !== 1 ? "s" : ""})
                    </span>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatMoney(item.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Categories Management Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold">Manage Categories</h4>
        </div>
        
        <div className="grid md:grid-cols-3 gap-3">
          {categories.length === 0 && (
            <div className="text-sm text-gray-500 col-span-3">
              No categories yet. They will be created automatically on first load.
            </div>
          )}
          
          {["EXPENSE", "INCOME", "TRANSFER"].map((type) => {
            const typeCats = categories.filter((c) => c.kind === type);
            if (typeCats.length === 0) return null;
            
            return (
              <div key={type}>
                <div className="text-xs font-medium text-gray-600 mb-2">
                  {type === "EXPENSE" ? "Expenses" : type === "INCOME" ? "Income" : "Transfer"}
                </div>
                <div className="space-y-1">
                  {typeCats.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-sm">{cat.name}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEditCategory(cat)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* mini aggregated chart */}
      <div className="pt-2">
        <div className="card">
          <div className="text-xs text-gray-500 mb-1">Cashflow</div>
          <div style={{ width: '100%', height: 80 }}>
            <ResponsiveContainer width='100%' height={80}>
              <AreaChart data={aggregatedSeries}>
                <XAxis dataKey='date' hide />
                <Tooltip formatter={(v:any) => formatMoney(v)} />
                <Area type='monotone' dataKey='income' stroke='#16A34A' fill='#16A34A' />
                <Area type='monotone' dataKey='expenses' stroke='#DC2626' fill='#DC2626' />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CSV import/export controls */}
      <div className="card p-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Import / Export</div>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="text/csv"
              className="hidden"
              onChange={() => setImportResult(null)}
            />
            <button
              className="btn-secondary text-sm"
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              Choose CSV
            </button>
            <button
              className="btn-primary text-sm"
              onClick={async () => {
                const f = fileInputRef.current?.files?.[0];
                if (!f) {
                  setImportResult({ error: "Please select a CSV file first." });
                  return;
                }
                try {
                  setImporting(true);
                  setImportResult(null);
                  const res = await importTransactionsCsv(f);
                  setImportResult({ success: res });
                  await loadTransactions();
                } catch (err: any) {
                  setImportResult({ error: err?.message || String(err) });
                } finally {
                  setImporting(false);
                }
              }}
              type="button"
              disabled={importing}
            >
              {importing ? "Uploading…" : "Upload CSV"}
            </button>

            <button
              className="btn-secondary text-sm"
              onClick={async () => {
                try {
                  setExporting(true);
                  const blob = await exportTransactionsCsv({ start: range.startDate, end: range.endDate });
                  const url = window.URL.createObjectURL(new Blob([blob]));
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "transactions.csv";
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  window.URL.revokeObjectURL(url);
                } catch (err: any) {
                  setError(err?.message || "Failed to export CSV");
                } finally {
                  setExporting(false);
                }
              }}
              type="button"
              disabled={exporting}
            >
              {exporting ? "Preparing…" : "Export CSV"}
            </button>
          </div>
        </div>

        {importResult && (
          <div className="mt-2 text-xs">
            {importResult.error && (
              <div className="text-red-600">Error: {String(importResult.error)}</div>
            )}
            {importResult.success && (
              <div className="text-green-600">Imported: {importResult.success.created ?? 'done'}</div>
            )}
          </div>
        )}
      </div>

      {/* Add transaction form */}
      <form
        onSubmit={handleSubmit}
        className="card space-y-3"
      >
        <div className="text-sm font-medium mb-1">Add Transaction</div>

        {loadingRefs && (
          <div className="text-xs text-gray-500">Loading accounts…</div>
        )}

        <div className="grid md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Date</label>
            <input
              type="date"
              className="w-full border rounded px-2 py-1 text-sm"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Account</label>
            <select
              className="w-full border rounded px-2 py-1 text-sm"
              value={accountId}
              onChange={(e) =>
                setAccountId(e.target.value ? Number(e.target.value) : "")
              }
              required
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Type</label>
            <select
              className="w-full border rounded px-2 py-1 text-sm"
              value={kind}
              onChange={(e) => setKind(e.target.value as TransactionKind)}
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Category (optional)
            </label>
            <select
              className="w-full border rounded px-2 py-1 text-sm"
              value={categoryId}
              onChange={(e) =>
                setCategoryId(e.target.value ? Number(e.target.value) : "")
              }
            >
              <option value="">— None —</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.kind})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              className="w-full border rounded px-2 py-1 text-sm"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">
              Description
            </label>
            <input
              className="w-full border rounded px-2 py-1 text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Lunch at Java, rent, salary..."
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Tags (optional)
          </label>
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    const currentTags = tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [];
                    if (currentTags.includes(tag.name)) {
                      setTags(currentTags.filter(t => t !== tag.name).join(", "));
                    } else {
                      setTags([...currentTags, tag.name].join(", "));
                    }
                  }}
                  className={`px-2 py-1 rounded-full text-xs transition-opacity ${
                    tags.split(",").map(t => t.trim()).includes(tag.name)
                      ? "opacity-100 ring-2"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: tag.color + "20",
                    color: tag.color,
                  }}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
          <input
            className="w-full border rounded px-2 py-1 text-sm"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="comma,separated,tags"
          />
        </div>

        <button
          type="submit"
          disabled={saving || accounts.length === 0}
          className="btn-primary text-sm disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Transaction"}
        </button>

        {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
      </form>

      {/* Transactions table */}
      {loading && <div className="skeleton h-8 rounded" />}

      {!loading && filteredTransactions.length === 0 && (
        <div className="text-sm text-gray-500">
          No transactions yet. Use the form above to add some.
        </div>
      )}
      {filteredTransactions.length > 0 && (
          <div className="overflow-x-auto card table-hover">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 table-sticky">
              <tr>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Account</th>
                <th className="px-3 py-2 text-left">Category</th>
                <th className="px-3 py-2 text-right">Amount</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">Description</th>
                <th className="px-3 py-2 text-left">Tags</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => {
                const txTags = tx.tags ? tx.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
                const tagColors = Object.fromEntries(allTags.map(t => [t.name, t.color]));
                
                return (
                  <tr key={tx.id} className="border-t">
                    <td className="px-3 py-2">{tx.date}</td>
                    <td className="px-3 py-2">{tx.account_name}</td>
                    <td className="px-3 py-2">
                      {tx.category_name ?? (
                        <span className="text-gray-400">–</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {formatMoney(tx.amount)}
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-100">
                        {tx.kind}
                      </span>
                    </td>
                    <td className="px-3 py-2">{tx.description}</td>
                    <td className="px-3 py-2">
                      {txTags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {txTags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-block px-2 py-0.5 rounded-full text-xs"
                              style={{
                                backgroundColor: (tagColors[tag] || "#3B82F6") + "20",
                                color: tagColors[tag] || "#3B82F6",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">–</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-3">
        <div className="text-sm text-gray-500">{totalCount !== null ? `${offset + 1}-${Math.min(offset + pageLimit, totalCount)} of ${totalCount}` : ''}</div>
        <div className="flex gap-2">
          <button className="hud-btn" onClick={() => setOffset(Math.max(0, offset - pageLimit))} disabled={offset === 0}>Prev</button>
          <button className="hud-btn" onClick={() => setOffset(offset + pageLimit)} disabled={totalCount !== null && offset + pageLimit >= (totalCount)}>Next</button>
        </div>
      </div>
    </div>
  );
}
