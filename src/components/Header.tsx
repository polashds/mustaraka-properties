"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/nav";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-brand-bg/95 backdrop-blur-md border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/assets/logo.png"
              alt="Mustaraka Properties"
              width={160}
              height={44}
              className="h-11 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-body text-xs font-medium text-brand-muted hover:text-gold tracking-[0.15em] uppercase transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center px-5 py-2.5 border border-gold/40 text-gold font-body text-xs font-medium tracking-[0.15em] uppercase hover:bg-gold hover:text-brand-bg transition-colors duration-200 shrink-0"
          >
            List Property
          </Link>

          {/* Hamburger button — mobile only */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-[6px] w-10 h-10 shrink-0"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <span
              className={`block w-6 h-[1.5px] bg-brand-text origin-center transition-all duration-300 ${
                open ? "translate-y-[7.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block w-4 h-[1.5px] bg-brand-text transition-all duration-300 ${
                open ? "opacity-0 scale-x-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-[1.5px] bg-brand-text origin-center transition-all duration-300 ${
                open ? "-translate-y-[7.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`md:hidden fixed inset-0 z-[55] bg-black/60 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile nav drawer */}
      <nav
        id="mobile-nav"
        aria-label="Mobile navigation"
        className={`md:hidden fixed top-0 right-0 bottom-0 z-[60] w-[280px] bg-brand-bg border-l border-gold/20 flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 h-20 border-b border-gold/20 shrink-0">
          <Link href="/" onClick={() => setOpen(false)}>
            <Image
              src="/assets/logo.png"
              alt="Mustaraka Properties"
              width={120}
              height={33}
              className="h-8 w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="w-9 h-9 flex items-center justify-center text-brand-muted hover:text-gold transition-colors"
            aria-label="Close menu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M1 1L15 15M15 1L1 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <div className="flex flex-col px-6 py-6 flex-1 overflow-y-auto">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="font-body text-sm font-medium text-brand-muted hover:text-gold tracking-[0.15em] uppercase transition-colors duration-200 py-4 border-b border-gold/10 last:border-0"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="px-6 pb-8 shrink-0">
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center px-5 py-3.5 border border-gold/40 text-gold font-body text-xs font-medium tracking-[0.15em] uppercase hover:bg-gold hover:text-brand-bg transition-colors duration-200"
          >
            List Property
          </Link>
        </div>
      </nav>
    </>
  );
}
