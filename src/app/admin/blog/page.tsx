"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { getBlogPosts, deleteBlogPost, type BlogPost } from "@/lib/admin";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";

const STATUS_STYLES: Record<string, string> = {
  published: "bg-green-100 text-green-800",
  draft: "bg-surface-container-highest text-on-surface-variant",
  archived: "bg-violet-100 text-violet-800",
};

export default function BlogPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<{ total?: number; last_page?: number }>({});

  const fetchPosts = () => {
    setLoading(true);
    getBlogPosts(page)
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          setPosts(data.data);
          setMeta(data.meta ?? {});
        }
      })
      .catch(() => toast.error("Failed to load posts"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const remove = async (id: string | number) => {
    if (!confirm("Delete this post?")) return;
    try {
      await deleteBlogPost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const fmt = (d?: string) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—");

  return (
    <>
      <AdminTopBar title="Blog Posts" subtitle={`${meta.total ?? posts.length} posts`} />
      <div className="flex-1 overflow-y-auto p-gutter">
        <div className="flex justify-end gap-3 mb-6">
          <Link href="/admin/blog/categories" className="border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary px-4 py-2.5 rounded-lg text-sm font-medium transition">
            Categories
          </Link>
          <Link href="/admin/blog/create" className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary transition">
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Post
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-outline-variant overflow-hidden">
          <table className="w-full text-left zebra-table">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-3 font-label-caps text-on-surface-variant">Title</th>
                <th className="px-6 py-3 font-label-caps text-on-surface-variant">Category</th>
                <th className="px-6 py-3 font-label-caps text-on-surface-variant">Status</th>
                <th className="px-6 py-3 font-label-caps text-on-surface-variant">Featured</th>
                <th className="px-6 py-3 font-label-caps text-on-surface-variant">Date</th>
                <th className="px-6 py-3 font-label-caps text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-admin-data text-primary">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="w-6 h-6 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-on-surface-variant">No posts yet</td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {toAbsoluteImageUrl(post.featured_image) ? (
                          <img src={toAbsoluteImageUrl(post.featured_image)!} className="w-10 h-10 rounded-lg object-cover" alt={post.title} />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-xl">📝</div>
                        )}
                        <div>
                          <p className="font-medium line-clamp-1">{post.title}</p>
                          <p className="text-xs text-on-surface-variant line-clamp-1">{post.excerpt ?? ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{post.category?.name ?? "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${STATUS_STYLES[post.status] ?? STATUS_STYLES.draft}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {post.featured ? (
                        <span className="flex items-center gap-1 text-secondary text-xs">
                          <span className="material-symbols-outlined text-sm">star</span> Featured
                        </span>
                      ) : (
                        <span className="text-on-surface-variant/50 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant text-xs">{fmt(post.publish_date ?? post.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/blog/${post.id}/edit`} className="text-primary hover:text-secondary">
                          <span className="material-symbols-outlined">edit</span>
                        </Link>
                        <button onClick={() => remove(post.id)} className="text-primary hover:text-error">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {(meta.last_page ?? 0) > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: meta.last_page ?? 0 }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg text-sm transition ${p === page ? "bg-primary text-on-primary" : "bg-white border border-outline-variant text-on-surface-variant hover:border-primary"}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}