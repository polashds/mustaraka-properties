"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import ChatWidget from "./ChatWidget";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const isAdmin = segment === "admin";

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <ChatWidget />
    </>
  );
}
