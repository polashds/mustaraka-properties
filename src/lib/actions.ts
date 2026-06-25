"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { LeadSource } from "@prisma/client";
import { z } from "zod";
import { sendCAPIEvent } from "@/lib/capi";

const InquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  message: z.string().optional(),
  propertyId: z.coerce.number().int().positive().optional(),
});

const ContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  message: z.string().optional(),
});

async function getRequestMeta() {
  const h = await headers();
  return {
    clientIp: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? undefined,
    clientUserAgent: h.get("user-agent") ?? undefined,
    fbc: h.get("cookie")?.match(/_fbc=([^;]+)/)?.[1],
    fbp: h.get("cookie")?.match(/_fbp=([^;]+)/)?.[1],
    referer: h.get("referer") ?? undefined,
  };
}

function fireWebhook(payload: Record<string, unknown>) {
  const url = process.env.N8N_LEAD_WEBHOOK_URL;
  if (!url) return;
  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

export async function submitInquiry(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email") || undefined,
    phone: formData.get("phone") || undefined,
    message: formData.get("message") || undefined,
    propertyId: formData.get("propertyId") || undefined,
  };

  const parsed = InquirySchema.safeParse(raw);
  if (!parsed.success) return { success: false };

  const lead = await prisma.lead.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      message: parsed.data.message || null,
      source: LeadSource.Property,
      propertyId: parsed.data.propertyId ?? null,
    },
  });

  fireWebhook({
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    message: lead.message,
    source: lead.source,
    propertyId: lead.propertyId,
    createdAt: lead.createdAt,
  });

  const meta = await getRequestMeta();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mustarakaproperties.com";
  void sendCAPIEvent({
    eventName: "Lead",
    eventSourceUrl: meta.referer ?? `${siteUrl}/properties`,
    userData: {
      email: parsed.data.email,
      phone: parsed.data.phone,
      clientIp: meta.clientIp,
      clientUserAgent: meta.clientUserAgent,
      fbc: meta.fbc,
      fbp: meta.fbp,
    },
  });

  return { success: true };
}

export async function submitContact(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email") || undefined,
    phone: formData.get("phone") || undefined,
    message: formData.get("message") || undefined,
  };

  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) return { success: false };

  const lead = await prisma.lead.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      message: parsed.data.message || null,
      source: LeadSource.Contact,
    },
  });

  fireWebhook({
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    message: lead.message,
    source: lead.source,
    createdAt: lead.createdAt,
  });

  const meta = await getRequestMeta();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mustarakaproperties.com";
  const eventSourceUrl = meta.referer ?? `${siteUrl}/contact`;
  const userData = {
    email: parsed.data.email,
    phone: parsed.data.phone,
    clientIp: meta.clientIp,
    clientUserAgent: meta.clientUserAgent,
    fbc: meta.fbc,
    fbp: meta.fbp,
  };

  void sendCAPIEvent({ eventName: "Lead", eventSourceUrl, userData });
  void sendCAPIEvent({ eventName: "Contact", eventSourceUrl, userData });

  return { success: true };
}
