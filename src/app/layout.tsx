import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import PublicShell from "@/components/PublicShell";

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

export const metadata: Metadata = {
  title: "Mustaraka Properties — Premium Real Estate in Bangladesh",
  description:
    "Discover premium apartments, homes, and commercial spaces across Dhaka, Chittagong, Sylhet, and Rajshahi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="bg-brand-bg text-brand-text font-body antialiased flex flex-col min-h-screen">
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
