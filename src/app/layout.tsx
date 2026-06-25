import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import PublicShell from "@/components/PublicShell";
import GA4Script from "@/components/analytics/GA4Script";
import MetaPixelScript from "@/components/analytics/MetaPixelScript";

const cormorant = Cormorant_Garamond({
  weight: ["300", "400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mustarakaproperties.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "Mustaraka Properties — Premium Real Estate in Bangladesh",
    template: "%s — Mustaraka Properties",
  },
  description:
    "Discover premium apartments, homes, and commercial spaces across Dhaka, Chittagong, Cox's Bazar, and Mymensingh.",
  openGraph: {
    type: "website",
    siteName: "Mustaraka Properties",
    title: "Mustaraka Properties — Premium Real Estate in Bangladesh",
    description:
      "Discover premium apartments, homes, and commercial spaces across Dhaka, Chittagong, Cox's Bazar, and Mymensingh.",
    url: BASE,
    images: [
      {
        url: `${BASE}/assets/logo.png`,
        width: 1200,
        height: 630,
        alt: "Mustaraka Properties — Premium Real Estate in Bangladesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mustaraka Properties — Premium Real Estate in Bangladesh",
    description:
      "Discover premium apartments, homes, and commercial spaces across Dhaka, Chittagong, Cox's Bazar, and Mymensingh.",
    images: [`${BASE}/assets/logo.png`],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Mustaraka Properties",
  url: BASE,
  telephone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
    ? `+${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`
    : undefined,
  description:
    "Premium real estate brokerage specialising in residential and commercial properties across Dhaka, Chittagong, Cox's Bazar, and Mymensingh.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "BD",
    addressRegion: "Dhaka",
  },
  areaServed: ["Dhaka", "Chittagong", "Cox's Bazar", "Mymensingh"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="bg-brand-bg text-brand-text font-body antialiased flex flex-col min-h-screen">
        <GA4Script />
        <MetaPixelScript />
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
