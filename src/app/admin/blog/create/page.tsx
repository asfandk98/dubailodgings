import AdminTopBar from "@/components/admin/AdminTopBar";
import BlogPostForm from "@/components/admin/BlogPostForm";

export default function CreateBlogPostPage() {
  return (
    <>
      <AdminTopBar title="New Blog Post" subtitle="Fill in the details or let AI write it for you" />
      <div className="flex-1 overflow-y-auto p-gutter">
        <BlogPostForm />
      </div>
    </>
  );
}