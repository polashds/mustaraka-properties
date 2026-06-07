"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { PropertyStatus } from "@prisma/client";
import { deleteProperty, togglePropertyStatus } from "@/lib/admin-actions";

export default function PropertyActions({
  id,
  status,
  slug,
}: {
  id: number;
  status: PropertyStatus;
  slug: string;
}) {
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleToggle() {
    startTransition(async () => {
      await togglePropertyStatus(id, status);
    });
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    startTransition(async () => {
      await deleteProperty(id);
    });
  }

  const isPublished = status === PropertyStatus.Published;

  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/admin/properties/${id}/edit`}
        className="font-body text-[11px] tracking-[0.1em] uppercase text-gold hover:text-gold-light transition-colors"
      >
        Edit
      </Link>

      <button
        onClick={handleToggle}
        disabled={pending}
        className={`font-body text-[11px] tracking-[0.1em] uppercase transition-colors disabled:opacity-40 ${
          isPublished
            ? "text-brand-muted hover:text-amber-400"
            : "text-emerald-400/80 hover:text-emerald-400"
        }`}
        title={isPublished ? "Set to Draft" : "Publish"}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </button>

      <button
        onClick={handleDelete}
        disabled={pending}
        className={`font-body text-[11px] tracking-[0.1em] uppercase transition-colors disabled:opacity-40 ${
          confirmDelete
            ? "text-red-400 font-medium"
            : "text-brand-muted hover:text-red-400"
        }`}
        title={confirmDelete ? "Click again to confirm deletion" : "Delete"}
      >
        {confirmDelete ? "Confirm?" : "Delete"}
      </button>
    </div>
  );
}
