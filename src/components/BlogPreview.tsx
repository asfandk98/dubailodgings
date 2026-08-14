import Link from "next/link";
import { getPublicBlogPosts } from "@/lib/api";
import { toAbsoluteImageUrl } from "@/lib/resolveImage";

function getCategory(post: { category?: { name?: string } | string }): string {
  if (typeof post.category === "string") return post.category;
  return post.category?.name ?? "JOURNAL";
}

function getImage(post: { image?: string; image_url?: string; featured_image?: string }): string | null {
  return (
    toAbsoluteImageUrl(post.image_url) ??
    toAbsoluteImageUrl(post.image) ??
    toAbsoluteImageUrl(post.featured_image) ??
    null
  );
}

export default async function BlogPreview() {
  const posts = (await getPublicBlogPosts()).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="bg-primary-container text-on-primary py-section-gap-lg">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h3 className="font-display-lg-mobile md:font-display-lg text-white mb-4">Travel Insights</h3>
            <p className="text-on-primary-container max-w-xl">
              Curated guides and tips for the discerning traveler navigating the wonders of the UAE.
            </p>
          </div>
          <Link
            href="/blog"
            className="bg-transparent border-2 border-secondary-fixed text-secondary-fixed px-6 py-2 rounded-lg font-bold hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-all"
          >
            Read Journal
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => {
            const image = getImage(post);
            return (
              <Link key={post.id} href={`/blog/${post.slug ?? post.id}`} className="group cursor-pointer block">
                <div className="aspect-[4/3] rounded-lg overflow-hidden mb-6">
                  {image ? (
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={image}
                      alt={post.title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary text-3xl">📝</div>
                  )}
                </div>
                <p className="font-label-caps text-secondary-fixed mb-3">{getCategory(post).toUpperCase()}</p>
                <h4 className="font-headline-md text-[20px] mb-3 group-hover:text-secondary-fixed transition-colors">
                  {post.title}
                </h4>
                <p className="text-on-primary-container text-body-sm line-clamp-2">{post.excerpt}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}