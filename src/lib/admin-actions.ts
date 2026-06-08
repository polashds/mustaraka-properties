"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";
import { auth, signOut } from "@/auth";
import { PropertyStatus, PropertyType, ListingType, LeadStatus, PostStatus } from "@prisma/client";
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

const LAND_AREA_UNITS = ["Katha", "Decimal", "Bigha", "sqft"] as const;

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
  floor: z.coerce.number().int().nonnegative().optional().nullable(),
  parking: z.coerce.number().int().nonnegative().optional().nullable(),
  landAreaUnit: z.enum(LAND_AREA_UNITS).optional().nullable(),
  roadWidth: z.coerce.number().positive().optional().nullable(),
  landUse: z.string().optional().nullable(),
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
     "bedrooms","bathrooms","area","floor","parking","landAreaUnit","roadWidth","landUse",
     "address","city","latitude","longitude","featured","hot"].map((k) => [k, formData.get(k)])
  );

  ["bedrooms","bathrooms","area","floor","parking","roadWidth","latitude","longitude"].forEach((k) => {
    if (raw[k] === "" || raw[k] === null) raw[k] = null;
  });
  if (raw["landAreaUnit"] === "" || raw["landAreaUnit"] === null) raw["landAreaUnit"] = null;
  if (raw["landUse"] === "" || raw["landUse"] === null) raw["landUse"] = null;

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
     "bedrooms","bathrooms","area","floor","parking","landAreaUnit","roadWidth","landUse",
     "address","city","latitude","longitude","featured","hot"].map((k) => [k, formData.get(k)])
  );

  ["bedrooms","bathrooms","area","floor","parking","roadWidth","latitude","longitude"].forEach((k) => {
    if (raw[k] === "" || raw[k] === null) raw[k] = null;
  });
  if (raw["landAreaUnit"] === "" || raw["landAreaUnit"] === null) raw["landAreaUnit"] = null;
  if (raw["landUse"] === "" || raw["landUse"] === null) raw["landUse"] = null;

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

// ── Lead status ───────────────────────────────────────────────────────────────

export async function updateLeadStatus(id: number, status: LeadStatus) {
  await requireAdmin();
  await prisma.lead.update({ where: { id }, data: { status } });
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

// ── Post validation ───────────────────────────────────────────────────────────

const PostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  excerpt: z.string().optional(),
  body: z.string().min(1, "Body is required"),
  status: z.enum(["Draft", "Published"]),
  featuredImage: z.string().optional(),
  category: z.string().optional(),
});

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

async function upsertCategory(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const slug = slugify(trimmed);
  const cat = await prisma.category.upsert({
    where: { slug },
    update: { name: trimmed },
    create: { name: trimmed, slug },
  });
  return cat.id;
}

// ── Create post ───────────────────────────────────────────────────────────────

export async function createPost(formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(
    ["title","slug","excerpt","body","status","featuredImage","category"]
      .map((k) => [k, formData.get(k)])
  );

  const parsed = PostSchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const categoryId = parsed.data.category ? await upsertCategory(parsed.data.category) : null;

  await prisma.post.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt || null,
      body: parsed.data.body,
      status: parsed.data.status as PostStatus,
      featuredImage: parsed.data.featuredImage || null,
      categoryId,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

// ── Update post ───────────────────────────────────────────────────────────────

export async function updatePost(id: number, formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(
    ["title","slug","excerpt","body","status","featuredImage","category"]
      .map((k) => [k, formData.get(k)])
  );

  const parsed = PostSchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const categoryId = parsed.data.category ? await upsertCategory(parsed.data.category) : null;

  await prisma.post.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt || null,
      body: parsed.data.body,
      status: parsed.data.status as PostStatus,
      featuredImage: parsed.data.featuredImage || null,
      categoryId,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${parsed.data.slug}`);
  redirect("/admin/blog");
}

// ── Delete post ───────────────────────────────────────────────────────────────

export async function deletePost(id: number) {
  await requireAdmin();
  await prisma.post.delete({ where: { id } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

// ── Toggle post status ────────────────────────────────────────────────────────

export async function togglePostStatus(id: number, current: PostStatus) {
  await requireAdmin();
  const next = current === PostStatus.Published ? PostStatus.Draft : PostStatus.Published;
  await prisma.post.update({ where: { id }, data: { status: next } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
