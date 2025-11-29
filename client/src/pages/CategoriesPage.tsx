// src/pages/CategoriesPage.tsx - Complete category and tag management
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchTags,
  createTag,
  updateTag,
  deleteTag,
  fetchTagAnalysis,
} from "../api/finance";
import { HiPlus, HiPencil, HiTrash, HiX, HiTag, HiFolder } from "react-icons/hi";
import { useTimeRange } from "../contexts/TimeRangeContext";
import type { Category, Tag, TagAnalysis } from "../api/types";

function formatMoney(value: string | number) {
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return value.toString();
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [tagAnalysis, setTagAnalysis] = useState<TagAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { range } = useTimeRange();

  // Category form state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryKind, setCategoryKind] = useState<Category["kind"]>("EXPENSE");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [savingCategory, setSavingCategory] = useState(false);

  // Tag form state
  const [showTagModal, setShowTagModal] = useState(false);
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#3B82F6");
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [savingTag, setSavingTag] = useState(false);

  // UI state
  const [showTagAnalysis, setShowTagAnalysis] = useState(false);
  const [activeTab, setActiveTab] = useState<"categories" | "tags">("categories");

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

  async function loadTags() {
    try {
      const data = await fetchTags();
      setAllTags(data);
    } catch (err) {
      console.error(err);
    }
  }

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

  useEffect(() => {
    loadCategories();
    loadTags();
  }, []);

  useEffect(() => {
    if (showTagAnalysis) {
      loadTagAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTagAnalysis, range.startDate, range.endDate]);

  // Category handlers
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

      await loadCategories();
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
      await loadCategories();
    } catch (err) {
      console.error(err);
      setError("Failed to delete category");
    }
  }

  function openEditCategory(cat: Category) {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setCategoryKind(cat.kind as Category["kind"]);
    setShowCategoryModal(true);
  }

  function openAddCategory() {
    setEditingCategory(null);
    setCategoryName("");
    setCategoryKind("EXPENSE");
    setShowCategoryModal(true);
  }

  // Tag handlers
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

      await loadTags();
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
      await loadTags();
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

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Categories & Tags
        </h3>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Organize your transactions with custom categories and tags
        </p>
      </div>

      {error && (
        <div className="card bg-red-50 border-red-200 text-red-700 text-sm p-4">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "categories"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
          }`}
        >
          <HiFolder className="inline mr-2" size={18} />
          Categories
        </button>
        <button
          onClick={() => setActiveTab("tags")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "tags"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
          }`}
        >
          <HiTag className="inline mr-2" size={18} />
          Tags
        </button>
      </div>

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold">Manage Categories</h4>
            <button onClick={openAddCategory} className="btn-primary inline-flex items-center gap-2">
              <HiPlus size={18} />
              Add Category
            </button>
          </div>

          {loading && <div className="skeleton h-32 rounded" />}

          {!loading && categories.length === 0 && (
            <div className="card text-center py-12">
              <p className="text-lg text-[var(--text-muted)] mb-2">No categories yet</p>
              <p className="text-sm text-[var(--text-muted)]">
                Click "Add Category" to create your first one
              </p>
            </div>
          )}

          {!loading && categories.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {["EXPENSE", "INCOME", "TRANSFER"].map((type) => {
                const typeCats = categories.filter((c) => c.kind === type);
                if (typeCats.length === 0) return null;
                
                return (
                  <div key={type} className="card space-y-2">
                    <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide pb-2 border-b">
                      {type === "EXPENSE" ? "Expenses" : type === "INCOME" ? "Income" : "Transfer"}
                      <span className="ml-2 text-blue-600">({typeCats.length})</span>
                    </div>
                    {typeCats.map((cat) => (
                      <div
                        key={cat.id}
                        className="flex items-center justify-between p-3 bg-[var(--surface)] rounded-lg hover:shadow-md transition-shadow group"
                      >
                        <span className="text-sm font-medium">{cat.name}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditCategory(cat)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <HiPencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <HiTrash size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tags Tab */}
      {activeTab === "tags" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold">Manage Tags</h4>
            <button onClick={openAddTag} className="btn-primary inline-flex items-center gap-2">
              <HiPlus size={18} />
              Add Tag
            </button>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-sm font-semibold">Your Tags</h5>
              <button
                onClick={() => setShowTagAnalysis(!showTagAnalysis)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                {showTagAnalysis ? "Hide" : "Show"} Analysis
              </button>
            </div>
            
            {allTags.length === 0 && (
              <div className="text-center py-8 text-[var(--text-muted)]">
                <p className="text-sm">No tags yet. Click "Add Tag" to create one.</p>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <div
                  key={tag.id}
                  className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium hover:shadow-md transition-shadow"
                  style={{ backgroundColor: tag.color + "20", color: tag.color }}
                >
                  <span>{tag.name}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditTag(tag)}
                      className="p-1 hover:opacity-70 transition-opacity"
                      title="Edit tag"
                    >
                      <HiPencil size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      className="p-1 hover:opacity-70 transition-opacity"
                      title="Delete tag"
                    >
                      <HiTrash size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Tag Analysis */}
            {showTagAnalysis && allTags.length > 0 && (
              <div className="border-t mt-6 pt-6">
                <div className="text-xs font-medium text-[var(--text-muted)] mb-3 uppercase tracking-wide">
                  Tag Usage Analysis ({range.startDate} to {range.endDate})
                </div>
                {tagAnalysis.length === 0 && (
                  <div className="text-sm text-[var(--text-muted)]">
                    No transactions with tags in this period.
                  </div>
                )}
                <div className="space-y-2">
                  {tagAnalysis.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-[var(--surface)] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-xs text-[var(--text-muted)]">
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
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowCategoryModal(false)}>
          <div className="card max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h4>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <HiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Food & Dining"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type *</label>
                <select
                  className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                  value={categoryKind}
                  onChange={(e) => setCategoryKind(e.target.value as Category["kind"])}
                >
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                  <option value="TRANSFER">Transfer</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
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

      {/* Tag Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowTagModal(false)}>
          <div className="card max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">
                {editingTag ? "Edit Tag" : "Add Tag"}
              </h4>
              <button
                onClick={() => setShowTagModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <HiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTag} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tag Name *
                </label>
                <input
                  type="text"
                  className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  placeholder="e.g. work, personal, vacation"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Color *</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    className="h-12 w-20 border-2 rounded-lg cursor-pointer"
                    value={tagColor}
                    onChange={(e) => setTagColor(e.target.value)}
                  />
                  <input
                    type="text"
                    className="flex-1 border-2 rounded-lg px-3 py-2.5 text-sm font-mono focus:border-blue-500 focus:outline-none transition-colors"
                    value={tagColor}
                    onChange={(e) => setTagColor(e.target.value)}
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
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
    </div>
  );
}
