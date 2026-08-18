import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicBlogPost } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

function getCategory(
  category?: { name?: string } | string
): string {
  if (typeof category === "string") return category;
  return category?.name ?? "JOURNAL";
}

export default async function BlogDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const post = await getPublicBlogPost(slug);

  if (!post) {
    notFound();
  }

  const image =
    toAbsoluteImageUrl(post.image_url) ??
    toAbsoluteImageUrl(post.image) ??
    toAbsoluteImageUrl(post.featured_image) ??
    null;

  const category = getCategory(post.category);

  const publishedDate = post.publish_date
    ? new Date(post.publish_date).toLocaleDateString("en-AE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : post.created_at
      ? new Date(post.created_at).toLocaleDateString("en-AE", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null;

  return (

  
    <div className="min-h-screen bg-surface text-on-surface">
  <Header />
      {/* ================= HERO ================= */}
      <section className="relative pt-20">
        <div className="relative h-[420px] md:h-[520px] overflow-hidden">

          {image ? (
            <img
              src={image}
              alt={post.alt ?? post.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-primary-container" />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Hero Content */}
          <div className="relative z-10 h-full max-w-container-max mx-auto px-gutter flex items-end pb-12 md:pb-16">
            <div className="max-w-4xl">

              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  arrow_back
                </span>
                <span className="font-label-caps text-[11px] tracking-widest">
                  BACK TO JOURNAL
                </span>
              </Link>

              <div className="mb-4">
                <span className="font-label-caps text-secondary-fixed tracking-widest">
                  {category.toUpperCase()}
                </span>
              </div>

              <h1 className="font-display-lg-mobile md:font-display-lg text-white text-4xl md:text-6xl leading-tight">
                {post.title}
              </h1>

              {publishedDate && (
                <p className="mt-5 text-white/80 text-sm">
                  {publishedDate}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= ARTICLE ================= */}
      <main className="max-w-4xl mx-auto px-gutter py-12 md:py-20">

        {post.excerpt && (
          <p className="text-xl md:text-2xl leading-relaxed text-on-surface-variant mb-12 font-light">
            {post.excerpt}
          </p>
        )}

        {post.content ? (
          <article
            className="
              prose
              prose-lg
              max-w-none

              prose-headings:text-primary
              prose-headings:font-display-lg-mobile

              prose-p:text-on-surface-variant
              prose-p:leading-relaxed

              prose-a:text-secondary
              prose-a:no-underline
              hover:prose-a:underline

              prose-strong:text-primary

              prose-li:text-on-surface-variant

              prose-blockquote:border-secondary
              prose-blockquote:text-on-surface-variant
            "
            dangerouslySetInnerHTML={{
              __html: post.content,
            }}
          />
        ) : (
          <div className="py-12 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-4">
              article
            </span>

            <p>
              This article does not have any content yet.
            </p>
          </div>
        )}

        {/* ================= BACK TO BLOG ================= */}
        <div className="mt-16 pt-8 border-t border-outline-variant">
          <Link
            href="/blog"
            className="
              inline-flex
              items-center
              gap-3
              border-2
              border-secondary
              text-secondary
              px-6
              py-3
              font-label-caps
              text-[11px]
              tracking-widest
              hover:bg-secondary
              hover:text-on-primary
              transition-all
            "
          >
            <span className="material-symbols-outlined text-[20px]">
              arrow_back
            </span>

            BACK TO JOURNAL
          </Link>
        </div>
      </main>
          <Footer />
    </div>
  );
}