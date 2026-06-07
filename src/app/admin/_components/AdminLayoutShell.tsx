"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AdminLogoutButton from "./AdminLogoutButton";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/properties", label: "Properties" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/", label: "View Site", external: true },
];

export default function AdminLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const segment = useSelectedLayoutSegment();
  const isLogin = segment === "login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-brand-bg">
      {/* Top bar */}
      <header className="border-b border-gold/20 bg-brand-surface/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="shrink-0">
              <Image
                src="/assets/logo.png"
                alt="Mustaraka Properties"
                width={130}
                height={36}
                className="h-9 w-auto object-contain opacity-90"
                priority
              />
            </Link>
            <span className="hidden sm:block font-body text-[10px] tracking-[0.3em] text-gold/60 uppercase border-l border-gold/20 pl-6">
              Admin Panel
            </span>
          </div>

          <nav className="flex items-center gap-5">
            {navItems.map((item) =>
              item.external ? (
                <Link
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  className="font-body text-xs font-medium text-brand-muted hover:text-gold tracking-[0.15em] uppercase transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-body text-xs font-medium text-brand-muted hover:text-gold tracking-[0.15em] uppercase transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
            <AdminLogoutButton />
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
