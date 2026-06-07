import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { PostStatus } from "@prisma/client";

export const metadata: Metadata = {
  title: "Blog — Mustaraka Properties",
  description:
    "Insights, market updates, and guides on Bangladesh real estate from the Mustaraka Properties team.",
};

async function getPosts() {
  return prisma.post.findMany({
    where: { status: PostStatus.Published },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="bg-brand-bg">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(201,168,76,0.07)_0%,transparent_65%)]" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-8 bg-gold/40" />
            <p className="font-body text-[10px] font-medium tracking-[0.35em] text-gold uppercase">
              Insights &amp; Guides
            </p>
            <span className="h-px w-8 bg-gold/40" />
          </div>
          <h1 className="font-heading font-light text-brand-text text-5xl sm:text-6xl leading-[1.08]">
            The Mustaraka <span className="italic text-gold">Blog</span>
          </h1>
        </div>
      </section>

      {/* Posts */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        {posts.length === 0 ? (
          <p className="text-center font-body text-brand-muted py-16">
            No posts published yet — check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col border border-gold/15 bg-brand-surface hover:border-gold/35 transition-colors overflow-hidden"
              >
                {/* Featured image */}
                {post.featuredImage ? (
                  <div className="aspect-video relative overflow-hidden bg-brand-bg">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-brand-bg flex items-center justify-center border-b border-gold/10">
                    <span className="text-gold/20 text-5xl font-heading font-light">M</span>
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  {/* Category + date */}
                  <div className="flex items-center gap-3 mb-3">
                    {post.category && (
                      <span className="font-body text-[9px] tracking-[0.25em] uppercase text-gold border border-gold/30 px-2 py-0.5">
                        {post.category.name}
                      </span>
                    )}
                    <span className="font-body text-[10px] text-brand-muted">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>

                  <h2 className="font-heading font-light text-brand-text text-xl leading-snug mb-3 group-hover:text-gold transition-colors">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="font-body text-sm text-brand-muted leading-relaxed line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                  )}

                  <p className="mt-4 font-body text-xs text-gold tracking-[0.15em] uppercase">
                    Read More →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
