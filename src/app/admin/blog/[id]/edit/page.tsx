import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import PostForm from "../../_components/PostForm";

type Params = Promise<{ id: string }>;

export const metadata: Metadata = { title: "Edit Post — Admin" };

export default async function EditPostPage({ params }: { params: Params }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: { category: true },
  });
  if (!post) notFound();

  const defaultValues = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? "",
    body: post.body,
    status: post.status as "Draft" | "Published",
    featuredImage: post.featuredImage ?? "",
    category: post.category?.name ?? "",
  };

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 font-body text-xs text-brand-muted hover:text-gold transition-colors tracking-[0.15em] uppercase mb-6"
        >
          ← Posts
        </Link>
        <div className="flex items-center gap-4 mb-2">
          <span className="h-px w-8 bg-gold/40" />
          <p className="font-body text-[10px] font-medium tracking-[0.35em] text-gold uppercase">
            Edit
          </p>
        </div>
        <h1 className="font-heading font-light text-brand-text text-4xl truncate">{post.title}</h1>
      </div>
      <PostForm mode="edit" postId={post.id} defaultValues={defaultValues} />
    </div>
  );
}
