import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PropertyStatus } from "@prisma/client";
import { formatPrice } from "@/lib/format";
import PropertyActions from "./_components/PropertyActions";

export const metadata: Metadata = {
  title: "Properties — Admin",
};

type SearchParams = Promise<{ status?: string }>;

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status } = await searchParams;

  const properties = await prisma.property.findMany({
    where:
      status === "Published"
        ? { status: PropertyStatus.Published }
        : status === "Draft"
        ? { status: PropertyStatus.Draft }
        : undefined,
    include: { images: { take: 1, orderBy: { id: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <span className="h-px w-8 bg-gold/40" />
            <p className="font-body text-[10px] font-medium tracking-[0.35em] text-gold uppercase">
              Management
            </p>
          </div>
          <h1 className="font-heading font-light text-brand-text text-4xl">
            Properties
          </h1>
        </div>
        <Link
          href="/admin/properties/new"
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-brand-bg font-body text-xs font-medium tracking-[0.15em] uppercase hover:bg-gold-light transition-colors"
        >
          <span>+ Add Property</span>
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-gold/15">
        {[
          { label: "All", value: undefined },
          { label: "Published", value: "Published" },
          { label: "Draft", value: "Draft" },
        ].map((tab) => {
          const href =
            tab.value ? `/admin/properties?status=${tab.value}` : "/admin/properties";
          const active = status === tab.value || (!status && !tab.value);
          return (
            <Link
              key={tab.label}
              href={href}
              className={`font-body text-xs tracking-[0.15em] uppercase px-4 py-2.5 border-b-2 -mb-px transition-colors ${
                active
                  ? "border-gold text-gold"
                  : "border-transparent text-brand-muted hover:text-brand-text"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      {properties.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-heading font-light text-3xl text-brand-muted mb-3">
            No properties found
          </p>
          <Link
            href="/admin/properties/new"
            className="font-body text-sm text-gold hover:underline"
          >
            Add the first property
          </Link>
        </div>
      ) : (
        <div className="border border-gold/15 overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gold/15 bg-brand-surface/50">
                {["Property", "Type", "City", "Price", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="text-left font-body text-[10px] tracking-[0.25em] text-brand-muted uppercase px-5 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {properties.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-brand-surface/30 transition-colors"
                >
                  <td className="px-5 py-4 max-w-[260px]">
                    <p className="font-body text-sm text-brand-text truncate">
                      {p.title}
                    </p>
                    <p className="font-body text-[11px] text-brand-muted mt-0.5 truncate">
                      {p.slug}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-body text-xs text-brand-muted">
                      {p.type}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-body text-xs text-brand-muted">
                      {p.city}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-body text-xs text-brand-text">
                      {formatPrice(p.price.toNumber())}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`font-body text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 ${
                        p.status === PropertyStatus.Published
                          ? "text-emerald-400 bg-emerald-400/10"
                          : "text-brand-muted bg-brand-muted/10"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <PropertyActions
                      id={p.id}
                      status={p.status}
                      slug={p.slug}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
