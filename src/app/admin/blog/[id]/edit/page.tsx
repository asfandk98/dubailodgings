import AdminTopBar from "@/components/admin/AdminTopBar";
import BlogPostForm from "@/components/admin/BlogPostForm";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <AdminTopBar title="Edit Post" subtitle="Update your blog post" />
      <div className="flex-1 overflow-y-auto p-gutter">
        <BlogPostForm postId={id} />
      </div>
    </>
  );
}