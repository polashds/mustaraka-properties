import { Metadata } from "next";
import Link from "next/link";
import PropertyForm from "../_components/PropertyForm";

export const metadata: Metadata = {
  title: "New Property — Admin",
};

export default function NewPropertyPage() {
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
            New Listing
          </p>
        </div>
        <h1 className="font-heading font-light text-brand-text text-4xl">
          Add Property
        </h1>
      </div>

      <PropertyForm mode="create" />
    </div>
  );
}
