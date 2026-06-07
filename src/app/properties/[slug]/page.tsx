import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import ImageGallery from "@/components/ImageGallery";
import InquiryForm from "@/components/InquiryForm";

type Params = Promise<{ slug: string }>;

async function getProperty(slug: string) {
  return prisma.property.findUnique({
    where: { slug },
    include: { images: { orderBy: { id: "asc" } } },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) return {};
  return {
    title: `${property.title} — Mustaraka Properties`,
    description: property.description.slice(0, 155),
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) notFound();

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const waMessage = encodeURIComponent(
    `Hello, I am interested in: ${property.title}`
  );
  const waHref = waNumber
    ? `https://wa.me/${waNumber}?text=${waMessage}`
    : null;

  const price = property.price.toNumber();

  const details = [
    property.bedrooms != null && { label: "Bedrooms", value: property.bedrooms },
    property.bathrooms != null && { label: "Bathrooms", value: property.bathrooms },
    property.area != null && {
      label: "Area",
      value: `${property.area.toLocaleString()} sqft`,
    },
    { label: "Type", value: property.type },
    { label: "Listing", value: `For ${property.listingType}` },
    { label: "City", value: property.city },
  ].filter(Boolean) as { label: string; value: string | number }[];

  return (
    <div className="bg-brand-bg min-h-screen">
      {/* Gallery — full width */}
      <div className="bg-brand-surface">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 pt-8 pb-6">
          <ImageGallery images={property.images} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Back link */}
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 font-body text-xs text-brand-muted hover:text-gold transition-colors duration-150 tracking-[0.15em] uppercase mb-10"
        >
          <span aria-hidden>&#8592;</span> All Properties
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">
          {/* Left — property details */}
          <div>
            {/* Eyebrow */}
            <p className="font-body text-[10px] text-brand-muted uppercase tracking-[0.3em] mb-4">
              {property.type} &middot; {property.city}
            </p>

            {/* Title */}
            <h1 className="font-heading font-light text-brand-text text-3xl sm:text-4xl md:text-[2.6rem] leading-[1.1] mb-6">
              {property.title}
            </h1>

            {/* Chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="border border-gold/30 text-gold font-body text-[10px] font-medium tracking-[0.18em] uppercase px-3 py-1.5">
                For {property.listingType}
              </span>
              <span className="border border-brand-muted/20 text-brand-muted font-body text-[10px] font-medium tracking-[0.18em] uppercase px-3 py-1.5">
                {property.type}
              </span>
              {property.hot && (
                <span className="bg-gold text-brand-bg font-body text-[10px] font-semibold tracking-[0.18em] uppercase px-3 py-1.5">
                  Hot
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-10">
              <h2 className="font-heading font-light text-brand-text text-xl mb-4">
                About this property
              </h2>
              <p className="font-body text-sm text-brand-muted leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Property details grid */}
            <div>
              <h2 className="font-heading font-light text-brand-text text-xl mb-5">
                Property Details
              </h2>
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {details.map(({ label, value }) => (
                  <div
                    key={label}
                    className="border border-gold/10 bg-brand-surface px-4 py-4"
                  >
                    <dt className="font-body text-[10px] text-brand-muted uppercase tracking-[0.2em] mb-1">
                      {label}
                    </dt>
                    <dd className="font-heading font-light text-brand-text text-lg">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Address */}
            <p className="mt-8 font-body text-xs text-brand-muted tracking-wide">
              <span className="text-brand-muted/50 uppercase tracking-[0.2em] text-[10px]">
                Address&nbsp;&nbsp;
              </span>
              {property.address}
            </p>
          </div>

          {/* Right — sidebar */}
          <aside className="lg:sticky lg:top-28 self-start space-y-6">
            {/* Price */}
            <div className="border border-gold/20 bg-brand-surface px-6 py-6">
              <p className="font-body text-[10px] text-brand-muted uppercase tracking-[0.25em] mb-2">
                Asking price
              </p>
              <p className="font-heading font-light text-gold text-4xl">
                {formatPrice(price)}
              </p>
            </div>

            {/* WhatsApp button */}
            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-whatsapp hover:brightness-110 text-white font-body text-sm font-medium tracking-[0.15em] uppercase transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
                WhatsApp Enquiry
              </a>
            )}

            {/* Inquiry form */}
            <div className="border border-gold/10 bg-brand-surface px-6 py-6">
              <h3 className="font-heading font-light text-brand-text text-xl mb-5">
                Send an Enquiry
              </h3>
              <InquiryForm propertyTitle={property.title} propertyId={property.id} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
