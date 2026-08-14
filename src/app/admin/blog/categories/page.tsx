"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { getBlogCategories, createBlogCategory, updateBlogCategory, deleteBlogCategory, type BlogCategory } from "@/lib/admin";

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogCategory | null>(null);
  const [form, setForm] = useState({ name: "", description: "", status: "active" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getBlogCategories()
      .then((res) => setCategories(res.data))
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "", status: "active" });
    setShowForm(true);
  };

  const openEdit = (cat: BlogCategory) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description ?? "", status: cat.status ?? "active" });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const { data } = await updateBlogCategory(editing.id, form);
        setCategories((prev) => prev.map((c) => (c.id === data.id ? data : c)));
        toast.success("Category updated");
      } else {
        const { data } = await createBlogCategory(form);
        setCategories((prev) => [data, ...prev]);
        toast.success("Category created");
      }
      setShowForm(false);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string | number) => {
    if (!confirm("Delete this category? Posts in it won't be deleted.")) return;
    try {
      await deleteBlogCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <>
      <AdminTopBar title="Blog Categories" subtitle={`${categories.length} categories`} />
      <div className="flex-1 overflow-y-auto p-gutter">
        <div className="space-y-6 max-w-3xl">
          <div className="flex justify-end">
            <button onClick={openCreate} className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary transition">
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Category
            </button>
          </div>

          {showForm && (
            <div className="bg-white border border-secondary rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-primary">{editing ? "Edit Category" : "New Category"}</h2>
                <button onClick={() => setShowForm(false)} className="text-on-surface-variant hover:text-primary transition">
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-on-surface-variant font-medium">Name *</label>
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Travel Tips" className="admin-input" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-on-surface-variant font-medium">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  placeholder="Short description of this category…"
                  className="admin-input resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setForm((p) => ({ ...p, status: p.status === "active" ? "inactive" : "active" }))}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.status === "active" ? "bg-primary" : "bg-surface-container-high"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.status === "active" ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
                <span className="text-sm text-on-surface-variant">{form.status === "active" ? "Active" : "Inactive"}</span>
              </div>

              <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary transition disabled:opacity-50">
                <span className="material-symbols-outlined text-lg">check</span>
                {saving ? "Saving…" : editing ? "Update" : "Create"}
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-6 h-6 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="bg-white border border-outline-variant rounded-xl overflow-hidden">
              <table className="w-full text-sm zebra-table">
                <thead>
                  <tr className="border-b border-outline-variant text-on-surface-variant text-xs uppercase tracking-wider">
                    <th className="text-left px-6 py-4">Name</th>
                    <th className="text-left px-6 py-4">Description</th>
                    <th className="text-left px-6 py-4">Posts</th>
                    <th className="text-left px-6 py-4">Status</th>
                    <th className="text-right px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-admin-data">
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-on-surface-variant">No categories yet</td>
                    </tr>
                  ) : (
                    categories.map((cat) => (
                      <tr key={cat.id}>
                        <td className="px-6 py-4 font-medium text-primary">{cat.name}</td>
                        <td className="px-6 py-4 text-on-surface-variant max-w-xs truncate">{cat.description ?? "—"}</td>
                        <td className="px-6 py-4 text-on-surface-variant">{cat.posts_count ?? 0}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${cat.status === "active" ? "bg-green-100 text-green-800" : "bg-surface-container-highest text-on-surface-variant"}`}>
                            {cat.status ?? "active"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEdit(cat)} className="text-primary hover:text-secondary transition">
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button onClick={() => remove(cat.id)} className="text-primary hover:text-error transition">
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}