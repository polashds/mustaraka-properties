"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window { gtag: (...args: unknown[]) => void; dataLayer: unknown[]; }
}

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

export default function GA4Script() {
  const pathname = usePathname();
  useEffect(() => { window.gtag?.("event", "page_view", { page_path: pathname }); }, [pathname]);
  if (!GA4_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA4_ID}', { send_page_view: false });
      `}</Script>
    </>
  );
}
