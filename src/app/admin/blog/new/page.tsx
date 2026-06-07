import { Metadata } from "next";
import Link from "next/link";
import PostForm from "../_components/PostForm";

export const metadata: Metadata = { title: "New Post — Admin" };

export default function NewPostPage() {
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
            Create
          </p>
        </div>
        <h1 className="font-heading font-light text-brand-text text-4xl">New Post</h1>
      </div>
      <PostForm mode="create" />
    </div>
  );
}
