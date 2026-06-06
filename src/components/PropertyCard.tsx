import Image from "next/image";
import Link from "next/link";
import { PropertyType, ListingType } from "@prisma/client";
import { formatPrice } from "@/lib/format";

interface Props {
  slug: string;
  title: string;
  price: number;
  type: PropertyType;
  listingType: ListingType;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  city: string;
  hot: boolean;
  featured: boolean;
  firstImage: { url: string; alt: string } | null;
}

export default function PropertyCard({
  slug,
  title,
  price,
  type,
  listingType,
  bedrooms,
  bathrooms,
  area,
  city,
  hot,
  featured,
  firstImage,
}: Props) {
  return (
    <Link href={`/properties/${slug}`} className="group block">
      <div className="relative overflow-hidden aspect-[4/3] bg-brand-surface">
        {hot && (
          <span className="absolute top-3 left-3 z-10 bg-gold text-brand-bg font-body text-[10px] font-semibold tracking-[0.15em] uppercase px-2.5 py-1">
            HOT
          </span>
        )}
        {featured && !hot && (
          <span className="absolute top-3 left-3 z-10 border border-gold text-gold bg-brand-bg/80 font-body text-[10px] font-semibold tracking-[0.15em] uppercase px-2.5 py-1">
            FEATURED
          </span>
        )}
        {firstImage ? (
          <Image
            src={firstImage.url}
            alt={firstImage.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-brand-muted text-xs font-body tracking-widest uppercase">
            No image
          </div>
        )}
        <span className="absolute bottom-3 right-3 z-10 bg-brand-bg/80 border border-gold/20 text-gold/90 font-body text-[10px] font-medium tracking-[0.15em] uppercase px-2.5 py-1">
          For {listingType}
        </span>
      </div>

      <div className="px-5 py-5 bg-brand-surface border border-t-0 border-gold/10 group-hover:border-gold/30 transition-colors duration-200">
        <p className="font-body text-[10px] text-brand-muted uppercase tracking-[0.22em] mb-2">
          {type} &middot; {city}
        </p>
        <h3 className="font-heading font-light text-brand-text text-[1.2rem] leading-snug mb-3 line-clamp-2 group-hover:text-gold transition-colors duration-200">
          {title}
        </h3>
        <p className="font-body font-medium text-gold text-xl mb-4">
          {formatPrice(price)}
        </p>
        <div className="flex items-center gap-5 font-body text-xs text-brand-muted">
          {bedrooms != null && <span>{bedrooms} Bed</span>}
          {bathrooms != null && <span>{bathrooms} Bath</span>}
          {area != null && <span>{area.toLocaleString()} sqft</span>}
        </div>
      </div>
    </Link>
  );
}
