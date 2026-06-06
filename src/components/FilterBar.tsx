"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { PropertyType, ListingType } from "@prisma/client";
import { CITIES } from "@/lib/constants";

const PRICE_RANGES = [
  { label: "Any price", value: "" },
  { label: "Under ৳ 1 Cr", value: "lt10" },
  { label: "৳ 1–1.5 Cr", value: "10to15" },
  { label: "৳ 1.5–2 Cr", value: "15to20" },
  { label: "Above ৳ 2 Cr", value: "gt20" },
] as const;

export default function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const type = searchParams.get("type") ?? "";
  const city = searchParams.get("city") ?? "";
  const listing = searchParams.get("listing") ?? "";
  const beds = searchParams.get("beds") ?? "";
  const price = searchParams.get("price") ?? "";
  const hasFilters = !!(type || city || listing || beds || price);

  const selectClass =
    "bg-brand-surface border border-gold/20 text-brand-muted hover:border-gold/40 font-body text-xs px-4 py-2 cursor-pointer focus:outline-none focus:border-gold/50 transition-colors duration-150 h-9";

  return (
    <div className="sticky top-20 z-40 bg-brand-bg/95 backdrop-blur-md border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Sale / Rent tabs */}
          <div className="flex border border-gold/20 h-9">
            {(["", "Sale", "Rent"] as const).map((val) => (
              <button
                key={val || "all"}
                onClick={() => update("listing", val)}
                className={`px-4 font-body text-xs font-medium tracking-[0.12em] uppercase transition-colors duration-150 ${
                  listing === val
                    ? "bg-gold text-brand-bg"
                    : "text-brand-muted hover:text-gold"
                }`}
              >
                {val || "All"}
              </button>
            ))}
          </div>

          <select
            value={type}
            onChange={(e) => update("type", e.target.value)}
            className={selectClass}
          >
            <option value="">All Types</option>
            {Object.values(PropertyType).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={city}
            onChange={(e) => update("city", e.target.value)}
            className={selectClass}
          >
            <option value="">All Cities</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={beds}
            onChange={(e) => update("beds", e.target.value)}
            className={selectClass}
          >
            <option value="">Any Beds</option>
            {["1", "2", "3", "4"].map((n) => (
              <option key={n} value={n}>
                {n}+ Beds
              </option>
            ))}
          </select>

          <select
            value={price}
            onChange={(e) => update("price", e.target.value)}
            className={selectClass}
          >
            {PRICE_RANGES.map(({ label, value }) => (
              <option key={value || "any"} value={value}>
                {label}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button
              onClick={() => router.push(pathname)}
              className="font-body text-xs text-brand-muted hover:text-gold underline underline-offset-2 transition-colors duration-150 ml-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
