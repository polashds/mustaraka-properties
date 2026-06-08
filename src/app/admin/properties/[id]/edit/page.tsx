import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import PropertyForm from "../../_components/PropertyForm";

export const metadata: Metadata = {
  title: "Edit Property — Admin",
};

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const propertyId = parseInt(id, 10);

  if (isNaN(propertyId)) notFound();

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: { images: { orderBy: { id: "asc" } } },
  });

  if (!property) notFound();

  const defaultValues = {
    title: property.title,
    slug: property.slug,
    description: property.description,
    price: property.price.toNumber(),
    type: property.type as "Apartment" | "House" | "Commercial" | "Land",
    listingType: property.listingType as "Sale" | "Rent",
    status: property.status as "Draft" | "Published",
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    floor: property.floor,
    parking: property.parking,
    landAreaUnit: property.landAreaUnit as "Katha" | "Decimal" | "Bigha" | "sqft" | null,
    roadWidth: property.roadWidth,
    landUse: property.landUse,
    address: property.address,
    city: property.city,
    latitude: property.latitude,
    longitude: property.longitude,
    featured: property.featured,
    hot: property.hot,
  };

  const existingImages = property.images.map((img) => ({
    url: img.url,
    alt: img.alt,
  }));

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Link
            href="/admin/properties"
            className="font-body text-xs text-brand-muted hover:text-gold tracking-[0.1em] uppercase transition-colors"
          >
            ← Properties
          </Link>
        </div>
        <div className="flex items-center gap-4 mb-2">
          <span className="h-px w-8 bg-gold/40" />
          <p className="font-body text-[10px] font-medium tracking-[0.35em] text-gold uppercase">
            Edit Listing
          </p>
        </div>
        <h1 className="font-heading font-light text-brand-text text-4xl truncate">
          {property.title}
        </h1>
      </div>

      <PropertyForm
        mode="edit"
        propertyId={propertyId}
        defaultValues={defaultValues}
        existingImages={existingImages}
      />
    </div>
  );
}
