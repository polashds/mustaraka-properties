"use client";

import { useTransition } from "react";
import { LeadStatus } from "@prisma/client";
import { updateLeadStatus } from "@/lib/admin-actions";

const next: Record<LeadStatus, { status: LeadStatus; label: string }> = {
  New: { status: LeadStatus.Read, label: "Mark Read" },
  Read: { status: LeadStatus.Archived, label: "Archive" },
  Archived: { status: LeadStatus.New, label: "Restore" },
};

export default function LeadStatusButton({ id, current }: { id: number; current: LeadStatus }) {
  const [isPending, startTransition] = useTransition();
  const action = next[current];

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => updateLeadStatus(id, action.status))}
      className="font-body text-[10px] tracking-[0.15em] uppercase text-gold hover:text-gold-light transition-colors disabled:opacity-40"
    >
      {isPending ? "…" : action.label}
    </button>
  );
}
