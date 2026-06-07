"use client";

import { signOut } from "next-auth/react";

export default function AdminLogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="font-body text-xs font-medium text-brand-muted hover:text-red-400 tracking-[0.15em] uppercase transition-colors"
    >
      Logout
    </button>
  );
}
