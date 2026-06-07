import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PostStatus } from "@prisma/client";
import PostActions from "./_components/PostActions";

export const metadata: Metadata = { title: "Blog — Admin" };

async function getPosts() {
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

export default async function AdminBlogPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <span className="h-px w-8 bg-gold/40" />
            <p className="font-body text-[10px] font-medium tracking-[0.35em] text-gold uppercase">
              Content
            </p>
          </div>
          <h1 className="font-heading font-light text-brand-text text-4xl">Blog Posts</h1>
        </div>
        <Link
          href="/admin/blog/new"
          className="px-5 py-2.5 bg-gold text-brand-bg font-body text-xs font-medium tracking-[0.15em] uppercase hover:bg-gold-light transition-colors shrink-0 mt-2"
        >
          + New Post
        </Link>
      </div>

      {/* Table */}
      {posts.length === 0 ? (
        <p className="font-body text-sm text-brand-muted py-8">
          No posts yet.{" "}
          <Link href="/admin/blog/new" className="text-gold hover:underline">
            Write the first one.
          </Link>
        </p>
      ) : (
        <div className="border border-gold/15 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gold/15 bg-brand-surface/50">
                {["Title", "Category", "Status", "Date", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 font-body text-[10px] tracking-[0.2em] uppercase text-brand-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/8">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-brand-surface/40 transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-body text-sm text-brand-text">{post.title}</p>
                    <p className="font-body text-[10px] text-brand-muted/60 mt-0.5">{post.slug}</p>
                  </td>
                  <td className="px-4 py-4 font-body text-xs text-brand-muted">
                    {post.category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`font-body text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 ${
                        post.status === PostStatus.Published
                          ? "text-emerald-400 bg-emerald-400/10"
                          : "text-brand-muted bg-brand-muted/10"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-body text-xs text-brand-muted whitespace-nowrap">
                    {post.createdAt.toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-4">
                    <PostActions id={post.id} slug={post.slug} status={post.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
