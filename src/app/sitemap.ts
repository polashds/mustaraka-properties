import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { PostStatus, PropertyStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mustarakaproperties.com";

const staticRoutes: MetadataRoute.Sitemap = [
  { url: BASE, changeFrequency: "weekly", priority: 1 },
  { url: `${BASE}/properties`, changeFrequency: "daily", priority: 0.9 },
  { url: `${BASE}/blog`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE}/services`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE}/faq`, changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  { url: `${BASE}/terms`, changeFrequency: "yearly", priority: 0.3 },
  { url: `${BASE}/disclaimer`, changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, posts] = await Promise.all([
    prisma.property.findMany({
      where: { status: PropertyStatus.Published },
      select: { slug: true, updatedAt: true },
    }),
    prisma.post.findMany({
      where: { status: PostStatus.Published },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const propertyRoutes: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${BASE}/properties/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...propertyRoutes, ...blogRoutes];
}
