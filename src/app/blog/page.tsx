import Link from "next/link";
import { getPublicBlogPosts } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
function getCategory(
  category?: { name?: string } | string
): string {
  if (typeof category === "string") return category;
  return category?.name ?? "JOURNAL";
}

function getImage(post: {
  image?: string;
  image_url?: string;
  featured_image?: string;
}): string | null {
  return (
    toAbsoluteImageUrl(post.image_url) ??
    toAbsoluteImageUrl(post.image) ??
    toAbsoluteImageUrl(post.featured_image) ??
    null
  );
}

export default async function BlogPage() {
  const posts = await getPublicBlogPosts();

  return (
    <div className="min-h-screen bg-surface text-on-surface">
<Header />
      {/* ================= HEADER ================= */}
      <header className="pt-20">
        <div className="bg-primary-container text-on-primary py-20 md:py-28">
          <div className="max-w-container-max mx-auto px-gutter">

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-on-primary-container hover:text-secondary-fixed transition-colors mb-8"
            >
              <span className="material-symbols-outlined">
                arrow_back
              </span>

              <span className="font-label-caps text-[11px] tracking-widest">
                BACK HOME
              </span>
            </Link>

            <p className="font-label-caps text-secondary-fixed tracking-widest mb-4">
              DUBAI LODGINGS JOURNAL
            </p>

            <h1 className="font-display-lg-mobile md:font-display-lg text-white text-4xl md:text-6xl mb-6">
              Travel Insights
            </h1>

            <p className="text-on-primary-container text-lg max-w-2xl leading-relaxed">
              Curated guides, travel inspiration and insider insights
              for discovering exceptional stays and experiences across
              the UAE.
            </p>

          </div>
        </div>
      </header>

      {/* ================= POSTS ================= */}
      <main className="max-w-container-max mx-auto px-gutter py-16 md:py-24">

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-5xl text-outline mb-5">
              article
            </span>

            <h2 className="font-headline-md text-2xl text-primary mb-3">
              No journal entries yet
            </h2>

            <p className="text-on-surface-variant">
              Our travel guides and insights will appear here soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {posts.map((post) => {
              const image = getImage(post);
              const slug = post.slug ?? String(post.id);

              return (
                <article
                  key={post.id}
                  className="group"
                >
                  <Link
                    href={`/blog/${slug}`}
                    className="block"
                  >

                    {/* Image */}
                    <div className="aspect-[4/3] overflow-hidden rounded-lg mb-6 bg-surface-container">

                      {image ? (
                        <img
                          src={image}
                          alt={post.alt ?? post.title}
                          className="
                            w-full
                            h-full
                            object-cover
                            transition-transform
                            duration-500
                            group-hover:scale-105
                          "
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary-container text-white">
                          <span className="material-symbols-outlined text-5xl">
                            article
                          </span>
                        </div>
                      )}

                    </div>

                    {/* Category */}
                    <p className="font-label-caps text-secondary text-[11px] tracking-widest mb-3">
                      {getCategory(post).toUpperCase()}
                    </p>

                    {/* Title */}
                    <h2 className="
                      font-headline-md
                      text-[22px]
                      text-primary
                      mb-3
                      group-hover:text-secondary
                      transition-colors
                    ">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="
                        text-on-surface-variant
                        text-body-sm
                        leading-relaxed
                        line-clamp-3
                      ">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Read */}
                    <div className="
                      mt-5
                      inline-flex
                      items-center
                      gap-2
                      text-secondary
                      font-label-caps
                      text-[10px]
                      tracking-widest
                    ">
                      READ ARTICLE

                      <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    </div>

                  </Link>
                </article>
              );
            })}
<Footer />
          </div>
        )}

      </main>

    </div>
  );
}