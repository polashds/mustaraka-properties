"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PostStatus } from "@prisma/client";
import { togglePostStatus, deletePost } from "@/lib/admin-actions";

interface Props {
  id: number;
  slug: string;
  status: PostStatus;
}

export default function PostActions({ id, status }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isPublished = status === PostStatus.Published;

  return (
    <div className="flex items-center gap-4">
      <a
        href={`/admin/blog/${id}/edit`}
        className="font-body text-xs text-gold hover:text-gold-light tracking-[0.1em] uppercase transition-colors"
      >
        Edit
      </a>

      <button
        disabled={isPending}
        onClick={() => startTransition(() => togglePostStatus(id, status))}
        className={`font-body text-xs tracking-[0.1em] uppercase transition-colors disabled:opacity-40 ${
          isPublished
            ? "text-amber-400 hover:text-amber-300"
            : "text-emerald-400 hover:text-emerald-300"
        }`}
      >
        {isPending ? "…" : isPublished ? "Unpublish" : "Publish"}
      </button>

      {confirmDelete ? (
        <span className="flex items-center gap-2">
          <button
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await deletePost(id);
                router.refresh();
              })
            }
            className="font-body text-xs text-red-400 hover:text-red-300 tracking-[0.1em] uppercase transition-colors disabled:opacity-40"
          >
            {isPending ? "…" : "Confirm"}
          </button>
          <button
            onClick={() => setConfirmDelete(false)}
            className="font-body text-xs text-brand-muted hover:text-brand-text tracking-[0.1em] uppercase transition-colors"
          >
            Cancel
          </button>
        </span>
      ) : (
        <button
          onClick={() => setConfirmDelete(true)}
          className="font-body text-xs text-brand-muted hover:text-red-400 tracking-[0.1em] uppercase transition-colors"
        >
          Delete
        </button>
      )}
    </div>
  );
}
