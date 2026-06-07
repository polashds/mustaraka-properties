import { Suspense } from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
import { PropertyType, ListingType, PropertyStatus, Prisma } from "@prisma/client";
import FilterBar from "@/components/FilterBar";
import PropertyCard from "@/components/PropertyCard";

export const metadata: Metadata = {
  title: "Properties — Mustaraka Properties",
  description:
    "Browse premium apartments, houses, and commercial spaces across Dhaka, Chittagong, Sylhet & Rajshahi.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function fetchProperties(params: Awaited<SearchParams>) {
  const { type, city, listing, beds, price } = params;

  const where: Prisma.PropertyWhereInput = {
    status: PropertyStatus.Published,
  };

  if (typeof type === "string" && type && (Object.values(PropertyType) as string[]).includes(type)) {
    where.type = type as PropertyType;
  }
  if (typeof city === "string" && city) {
    where.city = city;
  }
  if (typeof listing === "string" && listing && (Object.values(ListingType) as string[]).includes(listing)) {
    where.listingType = listing as ListingType;
  }
  if (typeof beds === "string" && beds) {
    const n = parseInt(beds, 10);
    if (!isNaN(n)) where.bedrooms = { gte: n };
  }
  if (typeof price === "string" && price) {
    if (price === "lt10") where.price = { lt: "10000000" };
    else if (price === "10to15") where.price = { gte: "10000000", lte: "15000000" };
    else if (price === "15to20") where.price = { gte: "15000000", lte: "20000000" };
    else if (price === "gt20") where.price = { gte: "20000000" };
  }

  return prisma.property.findMany({
    where,
    include: { images: { take: 1, orderBy: { id: "asc" } } },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const properties = await fetchProperties(params);

  return (
    <div className="bg-brand-bg min-h-screen">
      {/* Page header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-14 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="h-px w-8 bg-gold/40" />
          <p className="font-body text-xs font-medium tracking-[0.35em] text-gold uppercase">
            Our Portfolio
          </p>
        </div>
        <h1 className="font-heading font-light text-brand-text text-4xl md:text-5xl">
          Properties
        </h1>
      </div>

      {/* Filter bar — useSearchParams inside requires Suspense */}
      <Suspense
        fallback={
          <div className="sticky top-20 z-40 bg-brand-bg/95 border-b border-gold/10 h-[53px]" />
        }
      >
        <FilterBar />
      </Suspense>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {properties.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-heading font-light text-3xl text-brand-muted mb-3">
              No properties found
            </p>
            <p className="font-body text-sm text-brand-muted">
              Try adjusting your filters.
            </p>
          </div>
        ) : (
          <>
            <p className="font-body text-[10px] text-brand-muted mb-8 tracking-[0.3em] uppercase">
              {properties.length}{" "}
              {properties.length === 1 ? "Property" : "Properties"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((p) => (
                <PropertyCard
                  key={p.id}
                  slug={p.slug}
                  title={p.title}
                  price={p.price.toNumber()}
                  type={p.type}
                  listingType={p.listingType}
                  bedrooms={p.bedrooms}
                  bathrooms={p.bathrooms}
                  area={p.area}
                  city={p.city}
                  hot={p.hot}
                  featured={p.featured}
                  firstImage={p.images[0] ?? null}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
