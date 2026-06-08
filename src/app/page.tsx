export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PropertyStatus, PropertyType, ListingType } from "@prisma/client";
import { formatPrice } from "@/lib/format";
import PropertyCard from "@/components/PropertyCard";
import OpenChatButton from "@/components/OpenChatButton";
import HomeLeadForm from "@/components/HomeLeadForm";

// ── Types ─────────────────────────────────────────────────────────────────────

type PropRow = {
  id: number;
  slug: string;
  title: string;
  price: { toNumber: () => number };
  type: PropertyType;
  listingType: ListingType;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  city: string;
  hot: boolean;
  featured: boolean;
  images: Array<{ url: string; alt: string }>;
};

// ── Data fetching ─────────────────────────────────────────────────────────────

async function queryProperties(where: Record<string, unknown>, take: number): Promise<PropRow[]> {
  try {
    return await prisma.property.findMany({
      where,
      orderBy: [{ featured: "desc" }, { hot: "desc" }, { createdAt: "desc" }],
      take,
      select: {
        id: true, slug: true, title: true, price: true, type: true, listingType: true,
        bedrooms: true, bathrooms: true, area: true, city: true, hot: true, featured: true,
        images: { take: 1, orderBy: { id: "asc" }, select: { url: true, alt: true } },
      },
    }) as PropRow[];
  } catch {
    return [];
  }
}

// ── Services data ─────────────────────────────────────────────────────────────

const SERVICES = [
  {
    icon: "◎",
    title: "Property Search",
    body: "We source and match properties tailored to your preferences, timeline, and investment goals across Bangladesh.",
  },
  {
    icon: "⟷",
    title: "Buying & Selling",
    body: "Expert guidance through every step of the transaction, from negotiation to final handover — stress-free.",
  },
  {
    icon: "◈",
    title: "Investment Advisory",
    body: "Data-driven market insights to help you identify high-yield opportunities in emerging and established markets.",
  },
];

// ── Stat bar data ─────────────────────────────────────────────────────────────

const STATS = [
  { value: "500+", label: "Properties Listed" },
  { value: "৳120Cr+", label: "Deals Closed" },
  { value: "1,200+", label: "Happy Clients" },
  { value: "8", label: "Districts Covered" },
];

// ── Category section config ───────────────────────────────────────────────────

const CATEGORIES = [
  { type: PropertyType.Apartment, label: "Residential", title: "Apartments", link: "/properties?type=Apartment" },
  { type: PropertyType.House,     label: "Residential", title: "Houses & Villas", link: "/properties?type=House" },
  { type: PropertyType.Commercial, label: "Commercial",  title: "Commercial Spaces", link: "/properties?type=Commercial" },
  { type: PropertyType.Land,      label: "Land & Plots", title: "Land & Plots", link: "/properties?type=Land" },
];

// ── Featured portrait card ────────────────────────────────────────────────────

function FeaturedCard({ p }: { p: PropRow }) {
  const img = p.images[0] ?? null;
  const placeholderIcon =
    p.type === PropertyType.Apartment ? "🏢" :
    p.type === PropertyType.House ? "🏡" :
    p.type === PropertyType.Commercial ? "🏗️" : "🌿";

  return (
    <Link
      href={`/properties/${p.slug}`}
      className="group relative block overflow-hidden bg-brand-surface"
      style={{ aspectRatio: "3 / 4" }}
    >
      {/* Image or placeholder */}
      <div className="absolute inset-0">
        {img ? (
          <Image
            src={img.url}
            alt={img.alt}
            fill
            sizes="(min-width: 640px) 33vw, 100vw"
            className="object-cover transition-transform duration-[600ms] group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2a2410] to-[#1a1a1a] flex items-center justify-center text-6xl opacity-60 transition-transform duration-[600ms] group-hover:scale-105">
            {placeholderIcon}
          </div>
        )}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Hot badge */}
      {p.hot && (
        <span className="absolute top-4 left-4 z-10 bg-gold text-brand-bg font-body text-[10px] font-semibold tracking-[0.15em] uppercase px-2.5 py-1">
          HOT
        </span>
      )}

      {/* Info panel — slides up on hover */}
      <div className="absolute inset-x-0 bottom-0 p-7 translate-y-2.5 group-hover:translate-y-0 transition-transform duration-300 ease-out">
        <p className="font-body text-[10px] text-gold tracking-[0.3em] uppercase mb-2">
          {p.type} · For {p.listingType}
        </p>
        <h3 className="font-heading text-[22px] font-normal text-white leading-snug mb-1.5 line-clamp-2">
          {p.title}
        </h3>
        <p className="font-body text-xs text-white/50 mb-4">{p.city}</p>
        <p className="font-heading text-[26px] text-gold font-light">
          {formatPrice(p.price.toNumber())}
        </p>
      </div>
    </Link>
  );
}

// ── Category section ──────────────────────────────────────────────────────────

function CategorySection({
  label, title, link, properties,
}: {
  label: string; title: string; link: string; properties: PropRow[];
}) {
  return (
    <section className="py-20 border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="font-body text-[10px] tracking-[0.45em] text-gold uppercase mb-3">
              {label}
            </p>
            <h2 className="font-heading font-light text-brand-text text-3xl sm:text-4xl">
              {title}
            </h2>
          </div>
          <Link
            href={link}
            className="font-body text-[10px] tracking-[0.2em] uppercase text-gold hover:text-gold-light transition-colors border-b border-gold/30 hover:border-gold pb-0.5"
          >
            View all {title} →
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const published = { status: PropertyStatus.Published };

  const [featured, apartments, houses, commercial, land] = await Promise.all([
    queryProperties(published, 3),
    queryProperties({ ...published, type: PropertyType.Apartment }, 3),
    queryProperties({ ...published, type: PropertyType.House }, 3),
    queryProperties({ ...published, type: PropertyType.Commercial }, 3),
    queryProperties({ ...published, type: PropertyType.Land }, 3),
  ]);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative flex h-screen min-h-[640px] items-center justify-center overflow-hidden bg-brand-bg">
        {/* Radial glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_40%,rgba(201,168,76,0.06)_0%,transparent_60%)]" />
        {/* Gold grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative z-10 text-center max-w-[900px] mx-auto px-6 lg:px-10">
          {/* Eyebrow */}
          <p className="font-body text-[11px] tracking-[0.45em] text-gold uppercase mb-7">
            Dhaka · Chittagong · Cox&#39;s Bazar · Mymensingh
          </p>

          {/* Headline */}
          <h1 className="font-heading font-light text-brand-text leading-[1.02] text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] mb-8">
            Find Your{" "}
            <em className="italic text-gold">Perfect</em>
            <br />
            Property in Bangladesh
          </h1>

          {/* Subline */}
          <p className="font-body text-[15px] text-brand-muted leading-[1.8] max-w-[500px] mx-auto mb-12">
            Bangladesh&apos;s premium real estate brokerage. Residential, commercial, and
            investment properties curated for discerning clients.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/properties"
              className="px-10 py-4 bg-gold hover:bg-gold-light text-brand-bg font-body text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(201,168,76,0.3)]"
            >
              Explore Properties
            </Link>
            <OpenChatButton className="px-10 py-4 bg-transparent text-brand-text font-body text-[11px] font-normal tracking-[0.2em] uppercase border border-white/25 hover:border-gold hover:text-gold transition-all duration-300 cursor-pointer" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="font-body text-[10px] tracking-[0.3em] uppercase text-brand-muted/60">
            Scroll
          </span>
          <div className="w-px h-14 bg-gradient-to-b from-gold/50 to-transparent" />
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────────── */}
      <div className="bg-brand-surface border-t border-b border-gold/20 py-8 px-6 lg:px-[60px]">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-around gap-8">
          {STATS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-8">
              <div className="text-center">
                <div className="font-heading font-light text-gold text-[40px] leading-none">
                  {s.value}
                </div>
                <div className="font-body text-[10px] text-brand-muted tracking-[0.22em] uppercase mt-1.5">
                  {s.label}
                </div>
              </div>
              {i < STATS.length - 1 && (
                <div className="hidden sm:block w-px h-12 bg-gold/20" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Featured listings ──────────────────────────────────────────────── */}
      <section className="py-24 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section header */}
          <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
            <div>
              <p className="font-body text-[10px] tracking-[0.45em] text-gold uppercase mb-4">
                Featured Listings
              </p>
              <h2 className="font-heading font-light text-brand-text text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.1] max-w-[500px]">
                Exceptional{" "}
                <em className="italic text-gold">Properties</em>
                <br />
                Across Bangladesh
              </h2>
            </div>
            <Link
              href="/properties"
              className="font-body text-[10px] tracking-[0.2em] uppercase text-gold hover:text-gold-light transition-colors border-b border-gold/30 hover:border-gold pb-0.5"
            >
              View all listings →
            </Link>
          </div>

          {/* Portrait grid */}
          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0.5">
              {featured.map((p) => (
                <FeaturedCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <div className="border border-gold/10 py-20 text-center">
              <p className="font-body text-sm text-brand-muted">
                No featured listings yet — check back soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Category sections ──────────────────────────────────────────────── */}
      <div className="bg-brand-bg">
        {CATEGORIES.map(({ type, label, title, link }) => {
          const props =
            type === PropertyType.Apartment ? apartments :
            type === PropertyType.House ? houses :
            type === PropertyType.Commercial ? commercial : land;

          if (props.length === 0) return null;

          return (
            <CategorySection
              key={type}
              label={label}
              title={title}
              link={link}
              properties={props}
            />
          );
        })}
      </div>

      {/* ── What We Offer ──────────────────────────────────────────────────── */}
      <section className="bg-[#111111] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section header */}
          <p className="font-body text-[10px] tracking-[0.45em] text-gold uppercase mb-4">
            What We Offer
          </p>
          <h2 className="font-heading font-light text-brand-text text-4xl sm:text-5xl leading-[1.1] max-w-[500px]">
            Complete Real Estate{" "}
            <em className="italic text-gold">Solutions</em>
          </h2>

          {/* Service cards — gap-px on gold background creates hairline dividers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gold/15 mt-16">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="bg-[#111111] hover:bg-brand-surface p-10 lg:p-12 transition-colors duration-300 group"
              >
                <div className="text-3xl text-gold/60 group-hover:text-gold mb-8 transition-colors duration-300 font-heading">
                  {s.icon}
                </div>
                <h3 className="font-heading text-[22px] font-normal text-brand-text mb-4">
                  {s.title}
                </h3>
                <p className="font-body text-[14px] text-brand-muted leading-[1.85]">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lead capture ───────────────────────────────────────────────────── */}
      <section className="bg-brand-surface py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: text */}
          <div className="lg:sticky lg:top-28">
            <p className="font-body text-[10px] tracking-[0.45em] text-gold uppercase mb-4">
              Get Matched Today
            </p>
            <h2 className="font-heading font-light text-brand-text text-4xl sm:text-5xl leading-[1.1] max-w-[380px]">
              Tell Us What You&apos;re{" "}
              <em className="italic text-gold">Looking For</em>
            </h2>
            <div className="w-14 h-px bg-gold my-7" />
            <p className="font-body text-[15px] text-brand-muted leading-[1.85] max-w-[420px]">
              Share your brief and our AI matchmaker + expert team will curate
              the best-fit properties within 24 hours — no pressure, no spam.
            </p>
            <div className="flex flex-wrap gap-2 mt-8">
              {["Free Consultation", "No Hidden Fees", "24 hr Response"].map((b) => (
                <span
                  key={b}
                  className="inline-block px-3 py-1.5 bg-gold/8 border border-gold/25 text-gold font-body text-[10px] tracking-[0.2em] uppercase"
                >
                  {b}
                </span>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <div className="mt-10 pt-10 border-t border-gold/10">
              <p className="font-body text-xs text-brand-muted mb-3">
                Prefer to chat directly?
              </p>
              <a
                href="https://wa.me/8801721926800"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-3 bg-whatsapp/10 hover:bg-whatsapp/20 border border-whatsapp/30 text-[#4ade80] font-body text-xs tracking-[0.15em] uppercase transition-colors duration-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* Right: form */}
          <div>
            <HomeLeadForm />
          </div>
        </div>
      </section>
    </>
  );
}
