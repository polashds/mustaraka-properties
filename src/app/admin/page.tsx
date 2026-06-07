import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PropertyStatus } from "@prisma/client";

export const metadata: Metadata = {
  title: "Dashboard — Admin",
};

async function getStats() {
  const [total, published, draft] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { status: PropertyStatus.Published } }),
    prisma.property.count({ where: { status: PropertyStatus.Draft } }),
  ]);
  return { total, published, draft };
}

async function getRecentProperties() {
  return prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, title: true, status: true, city: true, createdAt: true },
  });
}

export default async function AdminDashboard() {
  const [stats, recent] = await Promise.all([getStats(), getRecentProperties()]);

  const statCards = [
    { label: "Total Properties", value: stats.total, href: "/admin/properties" },
    { label: "Published", value: stats.published, href: "/admin/properties?status=Published" },
    { label: "Draft", value: stats.draft, href: "/admin/properties?status=Draft" },
  ];

  return (
    <div className="space-y-10">
      {/* Page heading */}
      <div>
        <div className="flex items-center gap-4 mb-2">
          <span className="h-px w-8 bg-gold/40" />
          <p className="font-body text-[10px] font-medium tracking-[0.35em] text-gold uppercase">
            Overview
          </p>
        </div>
        <h1 className="font-heading font-light text-brand-text text-4xl">
          Dashboard
        </h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-brand-surface border border-gold/15 p-6 hover:border-gold/35 transition-colors group"
          >
            <p className="font-body text-[10px] tracking-[0.25em] text-brand-muted uppercase mb-3">
              {card.label}
            </p>
            <p className="font-heading font-light text-5xl text-brand-text group-hover:text-gold transition-colors">
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-4 bg-brand-surface border border-gold/15 p-5 hover:border-gold/35 transition-colors group"
        >
          <div className="w-10 h-10 border border-gold/30 flex items-center justify-center text-gold text-lg group-hover:bg-gold group-hover:text-brand-bg transition-colors">
            +
          </div>
          <div>
            <p className="font-body text-sm font-medium text-brand-text">
              Add New Property
            </p>
            <p className="font-body text-xs text-brand-muted mt-0.5">
              Create a new listing
            </p>
          </div>
        </Link>

        <Link
          href="/admin/properties"
          className="flex items-center gap-4 bg-brand-surface border border-gold/15 p-5 hover:border-gold/35 transition-colors group"
        >
          <div className="w-10 h-10 border border-gold/30 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-brand-bg transition-colors">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </div>
          <div>
            <p className="font-body text-sm font-medium text-brand-text">
              Manage Properties
            </p>
            <p className="font-body text-xs text-brand-muted mt-0.5">
              Edit, publish, or remove listings
            </p>
          </div>
        </Link>
      </div>

      {/* Recent properties */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-light text-brand-text text-2xl">
            Recent Properties
          </h2>
          <Link
            href="/admin/properties"
            className="font-body text-xs text-gold hover:text-gold-light tracking-[0.15em] uppercase transition-colors"
          >
            View All
          </Link>
        </div>

        <div className="border border-gold/15 divide-y divide-gold/10">
          {recent.length === 0 ? (
            <p className="font-body text-sm text-brand-muted p-6">
              No properties yet.{" "}
              <Link href="/admin/properties/new" className="text-gold hover:underline">
                Add the first one.
              </Link>
            </p>
          ) : (
            recent.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-5 py-4 hover:bg-brand-surface/50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-body text-sm text-brand-text truncate">{p.title}</p>
                  <p className="font-body text-xs text-brand-muted mt-0.5">{p.city}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <span
                    className={`font-body text-[10px] tracking-[0.2em] uppercase px-2 py-1 ${
                      p.status === PropertyStatus.Published
                        ? "text-emerald-400 bg-emerald-400/10"
                        : "text-brand-muted bg-brand-muted/10"
                    }`}
                  >
                    {p.status}
                  </span>
                  <Link
                    href={`/admin/properties/${p.id}/edit`}
                    className="font-body text-xs text-gold hover:text-gold-light tracking-[0.1em] uppercase transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
