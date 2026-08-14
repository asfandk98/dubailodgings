"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { getBlogCategories, getBlogPost, saveBlogPost, generateBlogContent, type BlogCategory } from "@/lib/admin";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";

interface FormState {
  title: string;
  blog_category_id: string;
  excerpt: string;
  content: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  publish_date: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url: string;
  tags: string;
}

const EMPTY_FORM: FormState = {
  title: "", blog_category_id: "", excerpt: "", content: "",
  status: "draft", featured: false, publish_date: "",
  meta_title: "", meta_description: "", meta_keywords: "", canonical_url: "", tags: "",
};

export default function BlogPostForm({ postId }: { postId?: string }) {
  const router = useRouter();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredPreview, setFeaturedPreview] = useState<string | null>(null);
  const [ogImage, setOgImage] = useState<File | null>(null);
  const [ogPreview, setOgPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!postId);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    getBlogCategories()
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!postId) return;
    getBlogPost(postId)
      .then((res) => {
        const data = res.data;
        setForm({
          title: data.title ?? "",
          blog_category_id: String(data.blog_category_id ?? ""),
          excerpt: data.excerpt ?? "",
          content: data.content ?? "",
          status: data.status ?? "draft",
          featured: !!data.featured,
          publish_date: data.publish_date?.split("T")[0] ?? "",
          meta_title: data.meta_title ?? "",
          meta_description: data.meta_description ?? "",
          meta_keywords: data.meta_keywords ?? "",
          canonical_url: data.canonical_url ?? "",
          tags: data.tags ?? "",
        });
        if (data.featured_image) setFeaturedPreview(toAbsoluteImageUrl(data.featured_image));
        if (data.og_image) setOgPreview(toAbsoluteImageUrl(data.og_image));
      })
      .catch(() => toast.error("Failed to load post"))
      .finally(() => setLoading(false));
  }, [postId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name, value } = target;
    const checked = target instanceof HTMLInputElement ? target.checked : undefined;
    setForm((prev) => ({
      ...prev,
      [name]: target instanceof HTMLInputElement && target.type === "checkbox" ? checked : value,
    }));
  };

  const handleGenerate = async () => {
    if (!form.title.trim()) {
      toast.error("Enter a title first — the AI needs it to generate content");
      return;
    }
    setGenerating(true);
    const toastId = toast.loading("✨ AI is writing your blog post…");
    try {
      const selectedCategory = categories.find((c) => String(c.id) === form.blog_category_id);
      const { data: generated } = await generateBlogContent(form.title, selectedCategory?.name);
      setForm((prev) => ({
        ...prev,
        excerpt: generated.excerpt ?? prev.excerpt,
        content: generated.content ?? prev.content,
        meta_title: generated.meta_title ?? prev.meta_title,
        meta_description: generated.meta_description ?? prev.meta_description,
        meta_keywords: generated.meta_keywords ?? prev.meta_keywords,
        tags: generated.tags ?? prev.tags,
      }));
      toast.success("✨ Blog post generated! Review and edit before publishing.", { id: toastId });
    } catch {
      toast.error("AI generation failed. Confirm POST /admin/blog/generate exists on your backend.", { id: toastId });
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.content.trim()) {
      toast.error("Content is required");
      return;
    }
    setSaving(true);

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (featuredImage) fd.append("featured_image", featuredImage);
    if (ogImage) fd.append("og_image", ogImage);

    try {
      await saveBlogPost(postId ?? null, fd);
      toast.success(postId ? "Post updated!" : "Post created!");
      router.push("/admin/blog");
    } catch {
      toast.error("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const ImageUpload = ({
    preview,
    setFile,
    setPreview,
    label,
    hint,
  }: {
    preview: string | null;
    setFile: (f: File | null) => void;
    setPreview: (p: string | null) => void;
    label: string;
    hint: string;
  }) => (
    <div className="space-y-2">
      <label className="text-xs text-on-surface-variant font-medium block">{label}</label>
      <p className="text-xs text-on-surface-variant/60">{hint}</p>
      <label className="block cursor-pointer">
        <div className="border-2 border-dashed border-outline-variant hover:border-primary rounded-lg p-5 text-center transition">
          {preview ? (
            <div className="relative inline-block">
              <img src={preview} className="h-32 rounded-lg object-cover" alt={label} />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setFile(null);
                  setPreview(null);
                }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-error rounded-full flex items-center justify-center text-on-error"
              >
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            </div>
          ) : (
            <div className="text-on-surface-variant">
              <span className="material-symbols-outlined text-2xl mb-2 block">upload</span>
              <p className="text-xs">Click to upload PNG, JPG up to 2MB</p>
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setFile(f);
            setPreview(URL.createObjectURL(f));
          }}
        />
      </label>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6 pb-16">
      <div className="flex items-center justify-end mb-2">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          <span className={`material-symbols-outlined text-lg ${generating ? "animate-spin" : ""}`}>
            {generating ? "progress_activity" : "auto_awesome"}
          </span>
          {generating ? "Generating…" : "Generate with AI"}
        </button>
      </div>

      <div className="bg-violet-50 border border-violet-200 rounded-lg px-4 py-3 flex items-start gap-3">
        <span className="material-symbols-outlined text-violet-500 text-lg shrink-0 mt-0.5">auto_awesome</span>
        <p className="text-xs text-violet-700 leading-relaxed">
          <strong>How to use AI:</strong> Enter a title (and optionally select a category), then click <strong>&quot;Generate with AI&quot;</strong>.
          Review everything before publishing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Section title="Post Details">
          <Field label="Title *">
            <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Best Luxury Hotels in Dubai Marina 2026" className="admin-input" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <select name="blog_category_id" value={form.blog_category_id} onChange={handleChange} className="admin-input">
                <option value="">— No Category —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Publish Date">
              <input type="date" name="publish_date" value={form.publish_date} onChange={handleChange} className="admin-input" />
            </Field>
          </div>

          <Field label="Excerpt">
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} placeholder="Short summary shown in listings… (AI will fill this)" className="admin-input resize-none" />
          </Field>
        </Section>

        <Section title="Content">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-on-surface-variant">AI generates HTML content — you can edit it below</p>
            {form.content && <span className="text-xs text-green-700">✓ {form.content.replace(/<[^>]*>/g, "").length} characters</span>}
          </div>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={16}
            placeholder="Write your blog post here… or click Generate with AI above ✨"
            className="admin-input resize-none font-mono text-xs leading-relaxed"
          />
        </Section>

        <Section title="Publish Settings">
          <div className="grid grid-cols-2 gap-6">
            <Field label="Status *">
              <select name="status" value={form.status} onChange={handleChange} className="admin-input">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
            <Field label="Tags (comma separated)">
              <input name="tags" value={form.tags} onChange={handleChange} placeholder="AI will suggest tags… or add your own" className="admin-input" />
            </Field>
          </div>

          <div className="flex items-center gap-8 pt-2">
            <Toggle
              label="Active"
              description="Visible to readers"
              active={form.status === "published"}
              onToggle={() => setForm((p) => ({ ...p, status: p.status === "published" ? "draft" : "published" }))}
            />
            <Toggle label="Featured" description="Show in featured section" active={form.featured} onToggle={() => setForm((p) => ({ ...p, featured: !p.featured }))} />
          </div>
        </Section>

        <Section title="Images">
          <div className="grid grid-cols-2 gap-6">
            <ImageUpload preview={featuredPreview} setFile={setFeaturedImage} setPreview={setFeaturedPreview} label="Featured Image" hint="PNG, JPG up to 2MB" />
            <ImageUpload preview={ogPreview} setFile={setOgImage} setPreview={setOgPreview} label="OG Image" hint="Recommended: 1200×630px" />
          </div>
        </Section>

        <Section title="SEO Settings">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Meta Title">
              <input name="meta_title" value={form.meta_title} onChange={handleChange} placeholder="SEO page title…" className="admin-input" />
            </Field>
            <Field label="Canonical URL">
              <input name="canonical_url" value={form.canonical_url} onChange={handleChange} placeholder="https://…" className="admin-input" />
            </Field>
          </div>
          <Field label="Meta Description">
            <textarea name="meta_description" value={form.meta_description} onChange={handleChange} rows={2} placeholder="160 character description for search engines…" className="admin-input resize-none" />
          </Field>
          <Field label="Meta Keywords">
            <input name="meta_keywords" value={form.meta_keywords} onChange={handleChange} placeholder="keyword1, keyword2…" className="admin-input" />
          </Field>
        </Section>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="flex-1 bg-primary text-on-primary py-3 rounded-lg font-label-caps hover:bg-secondary transition disabled:opacity-50">
            {saving ? "Saving…" : postId ? "UPDATE POST" : "PUBLISH POST"}
          </button>
          <button type="button" onClick={() => router.push("/admin/blog")} className="px-6 py-3 border border-outline-variant text-on-surface-variant rounded-lg hover:bg-surface-container-low transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-outline-variant rounded-xl p-5 space-y-4">
      <h2 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-on-surface-variant">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, description, active, onToggle }: { label: string; description: string; active: boolean; onToggle: () => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer" onClick={onToggle}>
      <div className={`w-10 h-5 rounded-full transition-colors relative ${active ? "bg-primary" : "bg-surface-container-high"}`}>
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${active ? "translate-x-5" : "translate-x-0.5"}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-primary">{label}</p>
        <p className="text-xs text-on-surface-variant">{description}</p>
      </div>
    </label>
  );
}