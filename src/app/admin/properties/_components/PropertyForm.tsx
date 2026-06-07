"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { createProperty, updateProperty } from "@/lib/admin-actions";

// ── Zod schema ────────────────────────────────────────────────────────────────

const nullablePositiveInt = z
  .union([z.number().int().positive(), z.nan(), z.null(), z.undefined()])
  .transform((v) => (v == null || (typeof v === "number" && isNaN(v)) ? null : v))
  .optional()
  .nullable();

const nullablePositiveFloat = z
  .union([z.number().positive(), z.nan(), z.null(), z.undefined()])
  .transform((v) => (v == null || (typeof v === "number" && isNaN(v)) ? null : v))
  .optional()
  .nullable();

const nullableFloat = z
  .union([z.number(), z.nan(), z.null(), z.undefined()])
  .transform((v) => (v == null || (typeof v === "number" && isNaN(v)) ? null : v))
  .optional()
  .nullable();

const PropertyFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  description: z.string().min(10, "At least 10 characters"),
  price: z.number({ message: "Enter a valid price" }).positive("Must be positive"),
  type: z.enum(["Apartment", "House", "Commercial", "Land"]),
  listingType: z.enum(["Sale", "Rent"]),
  status: z.enum(["Draft", "Published"]),
  bedrooms: nullablePositiveInt,
  bathrooms: nullablePositiveInt,
  area: nullablePositiveFloat,
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  latitude: nullableFloat,
  longitude: nullableFloat,
  featured: z.boolean(),
  hot: z.boolean(),
});

type PropertyFormValues = z.infer<typeof PropertyFormSchema>;

interface ExistingImage {
  url: string;
  alt: string;
}

interface PropertyFormProps {
  mode: "create" | "edit";
  propertyId?: number;
  defaultValues?: Partial<PropertyFormValues>;
  existingImages?: ExistingImage[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="font-body text-xs text-red-400 mt-1">{msg}</p>;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-body text-[11px] tracking-[0.2em] text-brand-muted uppercase mb-1.5">
      {children}
    </label>
  );
}

const inputCls =
  "w-full bg-brand-bg border border-gold/20 px-4 py-2.5 font-body text-sm text-brand-text placeholder-brand-muted/40 focus:outline-none focus:border-gold/50 transition-colors";

const selectCls =
  "w-full bg-brand-bg border border-gold/20 px-4 py-2.5 font-body text-sm text-brand-text focus:outline-none focus:border-gold/50 transition-colors cursor-pointer";

// Set empty numeric inputs to NaN → null via transform
const numericOpts = { valueAsNumber: true } as const;

// ── Component ─────────────────────────────────────────────────────────────────

export default function PropertyForm({
  mode,
  propertyId,
  defaultValues,
  existingImages = [],
}: PropertyFormProps) {
  const [images, setImages] = useState<ExistingImage[]>(existingImages);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(PropertyFormSchema),
    defaultValues: {
      status: "Draft",
      featured: false,
      hot: false,
      ...defaultValues,
    },
  });

  // Auto-generate slug from title (create mode, while slug empty)
  const titleValue = watch("title");
  function handleTitleBlur() {
    if (mode === "create") {
      const current = watch("slug");
      if (!current) {
        setValue("slug", slugify(titleValue || ""), { shouldValidate: true });
      }
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setNewFiles((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeExisting(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function removeNew(idx: number) {
    URL.revokeObjectURL(newPreviews[idx]);
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  }

  async function onSubmit(data: PropertyFormValues) {
    setSubmitting(true);
    setServerError("");

    const fd = new FormData();

    // Scalar fields
    (Object.keys(data) as Array<keyof PropertyFormValues>).forEach((key) => {
      const val = data[key];
      if (val !== null && val !== undefined) {
        fd.append(key, String(val));
      }
    });

    if (mode === "create") {
      newFiles.forEach((f) => fd.append("images", f));
      newFiles.forEach(() => fd.append("imageAlts", ""));
      const result = await createProperty(fd);
      if (result?.errors) setServerError("Please fix the errors above.");
    } else if (mode === "edit" && propertyId !== undefined) {
      fd.append("existingImages", JSON.stringify(images));
      newFiles.forEach((f) => fd.append("newImages", f));
      newFiles.forEach(() => fd.append("newImageAlts", ""));
      const result = await updateProperty(propertyId, fd);
      if (result?.errors) setServerError("Please fix the errors above.");
    }

    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* ── Core details ── */}
      <section className="bg-brand-surface border border-gold/15 p-6 space-y-5">
        <h2 className="font-heading font-light text-brand-text text-xl mb-1">
          Core Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label>Title *</Label>
            <input
              {...register("title")}
              onBlur={handleTitleBlur}
              className={inputCls}
              placeholder="Imperium Eskaton — Premium 3-Bed"
            />
            <FieldError msg={errors.title?.message} />
          </div>

          <div>
            <Label>Slug *</Label>
            <input
              {...register("slug")}
              className={inputCls}
              placeholder="imperium-eskaton-premium-3bed"
            />
            <FieldError msg={errors.slug?.message} />
          </div>
        </div>

        <div>
          <Label>Description *</Label>
          <textarea
            {...register("description")}
            rows={5}
            className={`${inputCls} resize-y`}
            placeholder="Describe the property in detail…"
          />
          <FieldError msg={errors.description?.message} />
        </div>
      </section>

      {/* ── Pricing & Classification ── */}
      <section className="bg-brand-surface border border-gold/15 p-6 space-y-5">
        <h2 className="font-heading font-light text-brand-text text-xl mb-1">
          Pricing &amp; Classification
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <Label>Price (BDT) *</Label>
            <input
              {...register("price", numericOpts)}
              type="number"
              step="1"
              className={inputCls}
              placeholder="18500000"
            />
            <FieldError msg={errors.price?.message} />
          </div>

          <div>
            <Label>Property Type *</Label>
            <select {...register("type")} className={selectCls}>
              <option value="">Select…</option>
              {["Apartment", "House", "Commercial", "Land"].map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            <FieldError msg={errors.type?.message} />
          </div>

          <div>
            <Label>Listing Type *</Label>
            <select {...register("listingType")} className={selectCls}>
              <option value="">Select…</option>
              {["Sale", "Rent"].map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            <FieldError msg={errors.listingType?.message} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <Label>Bedrooms</Label>
            <input
              {...register("bedrooms", numericOpts)}
              type="number"
              min="1"
              className={inputCls}
              placeholder="3"
            />
            <FieldError msg={errors.bedrooms?.message} />
          </div>
          <div>
            <Label>Bathrooms</Label>
            <input
              {...register("bathrooms", numericOpts)}
              type="number"
              min="1"
              className={inputCls}
              placeholder="2"
            />
            <FieldError msg={errors.bathrooms?.message} />
          </div>
          <div>
            <Label>Area (sq ft)</Label>
            <input
              {...register("area", numericOpts)}
              type="number"
              step="0.01"
              className={inputCls}
              placeholder="1850"
            />
            <FieldError msg={errors.area?.message} />
          </div>
        </div>
      </section>

      {/* ── Location ── */}
      <section className="bg-brand-surface border border-gold/15 p-6 space-y-5">
        <h2 className="font-heading font-light text-brand-text text-xl mb-1">
          Location
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label>Address *</Label>
            <input
              {...register("address")}
              className={inputCls}
              placeholder="Eskaton Garden Road, Dhaka 1000"
            />
            <FieldError msg={errors.address?.message} />
          </div>
          <div>
            <Label>City *</Label>
            <select {...register("city")} className={selectCls}>
              <option value="">Select…</option>
              {["Dhaka", "Chittagong", "Sylhet", "Rajshahi"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <FieldError msg={errors.city?.message} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label>Latitude</Label>
            <input
              {...register("latitude", numericOpts)}
              type="number"
              step="any"
              className={inputCls}
              placeholder="23.7415"
            />
          </div>
          <div>
            <Label>Longitude</Label>
            <input
              {...register("longitude", numericOpts)}
              type="number"
              step="any"
              className={inputCls}
              placeholder="90.3963"
            />
          </div>
        </div>
      </section>

      {/* ── Images ── */}
      <section className="bg-brand-surface border border-gold/15 p-6 space-y-4">
        <h2 className="font-heading font-light text-brand-text text-xl mb-1">
          Images
        </h2>

        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <div className="aspect-video relative overflow-hidden border border-gold/15">
                  <Image
                    src={img.url}
                    alt={img.alt || "Property image"}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeExisting(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-600/80 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {newPreviews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {newPreviews.map((src, i) => (
              <div key={i} className="relative group">
                <div className="aspect-video relative overflow-hidden border border-gold/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`New ${i + 1}`} className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => removeNew(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-600/80 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                <span className="absolute bottom-1 left-1 font-body text-[9px] text-white/70 bg-black/50 px-1">
                  New
                </span>
              </div>
            ))}
          </div>
        )}

        <label className="flex items-center gap-3 border border-dashed border-gold/25 px-5 py-4 cursor-pointer hover:border-gold/50 transition-colors">
          <svg className="text-gold/60 shrink-0" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.338-2.32 5.5 5.5 0 0 1 5.072 6.095A4.5 4.5 0 0 1 17.25 19.5H6.75Z" />
          </svg>
          <span className="font-body text-sm text-brand-muted">
            Click to upload images (JPG, PNG, WEBP)
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={handleFileChange}
          />
        </label>
      </section>

      {/* ── Status & Flags ── */}
      <section className="bg-brand-surface border border-gold/15 p-6 space-y-5">
        <h2 className="font-heading font-light text-brand-text text-xl mb-1">
          Status &amp; Flags
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <Label>Status *</Label>
            <select {...register("status")} className={selectCls}>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>

          <div className="flex items-center gap-8 pt-6">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" {...register("featured")} className="w-4 h-4 accent-gold" />
              <span className="font-body text-sm text-brand-muted">Featured</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" {...register("hot")} className="w-4 h-4 accent-gold" />
              <span className="font-body text-sm text-brand-muted">Hot</span>
            </label>
          </div>
        </div>
      </section>

      {serverError && (
        <p className="font-body text-sm text-red-400">{serverError}</p>
      )}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3 bg-gold text-brand-bg font-body text-xs font-medium tracking-[0.15em] uppercase hover:bg-gold-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Saving…" : mode === "create" ? "Create Property" : "Save Changes"}
        </button>
        <a
          href="/admin/properties"
          className="font-body text-xs text-brand-muted hover:text-brand-text tracking-[0.15em] uppercase transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
