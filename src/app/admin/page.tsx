import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PropertyStatus, LeadStatus } from "@prisma/client";

export const metadata: Metadata = {
  title: "Dashboard — Admin",
};

async function getStats() {
  const [totalProperties, published, draft, totalLeads, newLeads] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { status: PropertyStatus.Published } }),
    prisma.property.count({ where: { status: PropertyStatus.Draft } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: LeadStatus.New } }),
  ]);
  return { totalProperties, published, draft, totalLeads, newLeads };
}

async function getRecentProperties() {
  return prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, title: true, status: true, city: true },
  });
}

async function getRecentLeads() {
  return prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { property: { select: { title: true } } },
  });
}

export default async function AdminDashboard() {
  const [stats, recentProperties, recentLeads] = await Promise.all([
    getStats(),
    getRecentProperties(),
    getRecentLeads(),
  ]);

  const propertyCards = [
    { label: "Total Properties", value: stats.totalProperties, href: "/admin/properties" },
    { label: "Published", value: stats.published, href: "/admin/properties?status=Published" },
    { label: "Draft", value: stats.draft, href: "/admin/properties?status=Draft" },
  ];

  const leadCards = [
    { label: "Total Leads", value: stats.totalLeads, href: "/admin/leads" },
    { label: "New Leads", value: stats.newLeads, href: "/admin/leads", highlight: stats.newLeads > 0 },
  ];

  return (
    <div className="space-y-10">
      {/* Heading */}
      <div>
        <div className="flex items-center gap-4 mb-2">
          <span className="h-px w-8 bg-gold/40" />
          <p className="font-body text-[10px] font-medium tracking-[0.35em] text-gold uppercase">
            Overview
          </p>
        </div>
        <h1 className="font-heading font-light text-brand-text text-4xl">Dashboard</h1>
      </div>

      {/* Property stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {propertyCards.map((card) => (
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

      {/* Lead stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {leadCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-brand-surface border border-gold/15 p-6 hover:border-gold/35 transition-colors group"
          >
            <p className="font-body text-[10px] tracking-[0.25em] text-brand-muted uppercase mb-3">
              {card.label}
            </p>
            <p className={`font-heading font-light text-5xl transition-colors ${
              card.highlight ? "text-gold" : "text-brand-text"
            } group-hover:text-gold`}>
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/admin/properties/new", icon: "+", title: "Add New Property", sub: "Create a new listing" },
          { href: "/admin/blog/new", icon: "✎", title: "New Blog Post", sub: "Publish content" },
          { href: "/admin/leads", icon: "✉", title: "View Leads", sub: `${stats.newLeads} new enquiries` },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="flex items-center gap-4 bg-brand-surface border border-gold/15 p-5 hover:border-gold/35 transition-colors group"
          >
            <div className="w-10 h-10 border border-gold/30 flex items-center justify-center text-gold text-lg group-hover:bg-gold group-hover:text-brand-bg transition-colors shrink-0">
              {a.icon}
            </div>
            <div>
              <p className="font-body text-sm font-medium text-brand-text">{a.title}</p>
              <p className="font-body text-xs text-brand-muted mt-0.5">{a.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent properties */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-light text-brand-text text-2xl">Recent Properties</h2>
          <Link
            href="/admin/properties"
            className="font-body text-xs text-gold hover:text-gold-light tracking-[0.15em] uppercase transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="border border-gold/15 divide-y divide-gold/10">
          {recentProperties.length === 0 ? (
            <p className="font-body text-sm text-brand-muted p-6">
              No properties yet.{" "}
              <Link href="/admin/properties/new" className="text-gold hover:underline">
                Add the first one.
              </Link>
            </p>
          ) : (
            recentProperties.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-4 hover:bg-brand-surface/50 transition-colors">
                <div className="min-w-0">
                  <p className="font-body text-sm text-brand-text truncate">{p.title}</p>
                  <p className="font-body text-xs text-brand-muted mt-0.5">{p.city}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <span className={`font-body text-[10px] tracking-[0.2em] uppercase px-2 py-1 ${
                    p.status === PropertyStatus.Published
                      ? "text-emerald-400 bg-emerald-400/10"
                      : "text-brand-muted bg-brand-muted/10"
                  }`}>
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

      {/* Recent leads */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-light text-brand-text text-2xl">Recent Leads</h2>
          <Link
            href="/admin/leads"
            className="font-body text-xs text-gold hover:text-gold-light tracking-[0.15em] uppercase transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="border border-gold/15 divide-y divide-gold/10">
          {recentLeads.length === 0 ? (
            <p className="font-body text-sm text-brand-muted p-6">No leads yet.</p>
          ) : (
            recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between px-5 py-4 hover:bg-brand-surface/50 transition-colors">
                <div className="min-w-0">
                  <p className="font-body text-sm text-brand-text">{lead.name}</p>
                  <p className="font-body text-xs text-brand-muted mt-0.5">
                    {lead.email ?? lead.phone ?? "—"}
                    {lead.property && ` · ${lead.property.title}`}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className={`font-body text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 ${
                    lead.status === LeadStatus.New
                      ? "text-gold bg-gold/10"
                      : lead.status === LeadStatus.Read
                        ? "text-emerald-400 bg-emerald-400/10"
                        : "text-brand-muted bg-brand-muted/10"
                  }`}>
                    {lead.status}
                  </span>
                  <span className="font-body text-[10px] text-brand-muted">
                    {lead.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
