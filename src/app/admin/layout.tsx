import type { Metadata } from "next";
import AdminLayoutShell from "./_components/AdminLayoutShell";

export const metadata: Metadata = {
  title: "Admin — Mustaraka Properties",
};

// Route protection is handled by proxy.ts — all /admin/* routes except
// /admin/login redirect to login when unauthenticated.
// This layout only provides the visual chrome (nav/shell).
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
