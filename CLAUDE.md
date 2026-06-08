@AGENTS.md
# Mustaraka Properties — Build Guide for Claude Code

## What this is
A premium real-estate website for Mustaraka Properties Ltd (Dhaka, Bangladesh).
Public site + admin panel. English now, Bengali-ready later.

## CRITICAL working rule
Build ONLY the current phase I ask for. Do not jump ahead or try to build the
whole platform at once. Keep changes small and reviewable. After each task,
tell me exactly how to run/verify it. Ask before adding new dependencies.

## Stack
- Next.js (App Router) + TypeScript. Prefer Server Components.
- Tailwind CSS + shadcn/ui. Use the brand tokens below — no random colors.
- Prisma ORM + PostgreSQL (local dev DB in docker-compose.dev.yml; DATABASE_URL in .env).
- Auth.js for admin login (credentials, hashed passwords) — added in the Admin phase.
- Validate inputs with zod. No `any`.

## Brand (use exactly)
- Gold (primary accent): #C9A84C
- Gold light: #E8CC7A
- Background (near-black): #0A0A0A
- Surface: #1E1E1E
- Text: #F0EDE8
- Muted text: #8A8580
- Border: rgba(201,168,76,0.2)
- WhatsApp green: #2d7a2d
- Headings font: "Cormorant Garamond" (serif) — use for titles, prices, property names. Italic gold for accent words.
- Body/UI font: "DM Sans" (sans-serif)
- Load both via next/font/google.
- Aesthetic: dark luxury, generous spacing, thin gold hairline borders, subtle gold glow, grid-based property cards. Think Sotheby's / Bayut, premium and calm.
- Logo: /public/assets/Optimized Logo<Logo.png>   <-- EDIT THIS
- Locations served: Dhaka, Chittagong, Cox's Bazar, Mymensingh
- Email: info@mustarakaproperties.com
- WhatsApp number: 
8801721926800

## Navigation
Home · Properties · Services · About · Contact

## Folder layout
- src/app/(public)/...  public pages
- src/app/(admin)/admin/...  protected admin
- src/app/api/...  route handlers
- src/components/...  shared UI
- src/lib/...  db client, auth, helpers
- prisma/schema.prisma  models

## Property model fields (for the Properties phase)
title, slug, description, price, type (Apartment/House/Commercial/Land),
listingType (Sale/Rent), status (Draft/Published), bedrooms, bathrooms, area (sqft),
address, city, latitude, longitude, featured (bool), hot (bool), + related PropertyImage(url, alt).

## Roadmap (build in this order — one phase at a time)
- Phase 0: Foundation — fonts + brand tokens wired in, global layout (header/nav/footer), homepage hero. (DONE FIRST)
- Phase 1: Properties — Prisma Property model + seed, /properties listing with filters, /properties/[slug] detail with gallery + WhatsApp button.
- Phase 2: Admin — Auth.js login, dashboard, Property CRUD, image upload.
- Phase 3: Content — About, Services, Contact (lead saved to DB), FAQ, Blog (model + admin + public), legal pages.
- Phase 4: SEO + integrations — metadata, sitemap.xml, robots.txt, JSON-LD, WhatsApp CTAs everywhere, lead -> n8n webhook, inert AI-chatbot slot.
- Phase 5 (later): CRM/leads pipeline, agents & roles, automation, analytics, deploy to VPS behind Traefik.

## Deployment target (later)
Docker container behind Traefik on the VPS at mustarakaproperties.com, Postgres in the same stack.