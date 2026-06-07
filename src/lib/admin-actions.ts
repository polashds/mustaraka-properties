"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";
import { auth, signOut } from "@/auth";
import { PropertyStatus, PropertyType, ListingType } from "@prisma/client";
import { z } from "zod";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
}

// ── Image upload ─────────────────────────────────────────────────────────────

export async function uploadImages(formData: FormData): Promise<string[]> {
  await requireAdmin();

  const files = formData.getAll("images") as File[];
  const urls: string[] = [];

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  for (const file of files) {
    if (!file.size) continue;
    const ext = path.extname(file.name) || ".jpg";
    const filename = `${randomUUID()}${ext}`;
    const filepath = path.join(uploadDir, filename);
    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));
    urls.push(`/uploads/${filename}`);
  }

  return urls;
}

// ── Property validation ───────────────────────────────────────────────────────

const PropertySchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  type: z.enum(["Apartment", "House", "Commercial", "Land"]),
  listingType: z.enum(["Sale", "Rent"]),
  status: z.enum(["Draft", "Published"]),
  bedrooms: z.coerce.number().int().positive().optional().nullable(),
  bathrooms: z.coerce.number().int().positive().optional().nullable(),
  area: z.coerce.number().positive().optional().nullable(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  featured: z.preprocess((v) => v === true || v === "true", z.boolean()),
  hot: z.preprocess((v) => v === true || v === "true", z.boolean()),
});

// ── Create property ──────────────────────────────────────────────────────────

export async function createProperty(formData: FormData) {
  await requireAdmin();

  // Upload new images first
  const imgFormData = new FormData();
  const files = formData.getAll("images") as File[];
  files.forEach((f) => imgFormData.append("images", f));
  const newImageUrls = await uploadImages(imgFormData);

  const imageAlts = formData.getAll("imageAlts") as string[];
  const images = newImageUrls.map((url, i) => ({
    url,
    alt: imageAlts[i] || "",
  }));

  const raw = Object.fromEntries(
    ["title","slug","description","price","type","listingType","status",
     "bedrooms","bathrooms","area","address","city","latitude","longitude",
     "featured","hot"].map((k) => [k, formData.get(k)])
  );

  // Treat empty strings as null for optional numerics
  ["bedrooms","bathrooms","area","latitude","longitude"].forEach((k) => {
    if (raw[k] === "" || raw[k] === null) raw[k] = null;
  });

  const parsed = PropertySchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  await prisma.property.create({
    data: {
      ...parsed.data,
      type: parsed.data.type as PropertyType,
      listingType: parsed.data.listingType as ListingType,
      status: parsed.data.status as PropertyStatus,
      price: parsed.data.price,
      images: { create: images },
    },
  });

  revalidatePath("/admin/properties");
  revalidatePath("/properties");
  redirect("/admin/properties");
}

// ── Update property ──────────────────────────────────────────────────────────

export async function updateProperty(id: number, formData: FormData) {
  await requireAdmin();

  // Upload any new image files
  const imgFormData = new FormData();
  const files = formData.getAll("newImages") as File[];
  files.forEach((f) => imgFormData.append("images", f));
  const newImageUrls = await uploadImages(imgFormData);

  const raw = Object.fromEntries(
    ["title","slug","description","price","type","listingType","status",
     "bedrooms","bathrooms","area","address","city","latitude","longitude",
     "featured","hot"].map((k) => [k, formData.get(k)])
  );

  ["bedrooms","bathrooms","area","latitude","longitude"].forEach((k) => {
    if (raw[k] === "" || raw[k] === null) raw[k] = null;
  });

  const parsed = PropertySchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  // Rebuild images: keep existing (passed as JSON), add new ones
  const existingImagesJson = formData.get("existingImages") as string;
  const existingImages: { url: string; alt: string }[] = existingImagesJson
    ? JSON.parse(existingImagesJson)
    : [];

  const newImageAlts = formData.getAll("newImageAlts") as string[];
  const newImages = newImageUrls.map((url, i) => ({
    url,
    alt: newImageAlts[i] || "",
  }));

  const allImages = [...existingImages, ...newImages];

  await prisma.$transaction([
    prisma.propertyImage.deleteMany({ where: { propertyId: id } }),
    prisma.property.update({
      where: { id },
      data: {
        ...parsed.data,
        type: parsed.data.type as PropertyType,
        listingType: parsed.data.listingType as ListingType,
        status: parsed.data.status as PropertyStatus,
        price: parsed.data.price,
        images: { create: allImages },
      },
    }),
  ]);

  revalidatePath("/admin/properties");
  revalidatePath("/properties");
  revalidatePath(`/properties/${parsed.data.slug}`);
  redirect("/admin/properties");
}

// ── Delete property ──────────────────────────────────────────────────────────

export async function deleteProperty(id: number) {
  await requireAdmin();
  await prisma.property.delete({ where: { id } });
  revalidatePath("/admin/properties");
  revalidatePath("/properties");
}

// ── Toggle status ────────────────────────────────────────────────────────────

export async function togglePropertyStatus(id: number, currentStatus: PropertyStatus) {
  await requireAdmin();
  const next =
    currentStatus === PropertyStatus.Published
      ? PropertyStatus.Draft
      : PropertyStatus.Published;

  await prisma.property.update({ where: { id }, data: { status: next } });
  revalidatePath("/admin/properties");
  revalidatePath("/properties");
}

// ── Logout ───────────────────────────────────────────────────────────────────

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
