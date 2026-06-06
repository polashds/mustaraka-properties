import Image from "next/image";
import Link from "next/link";
import { navLinks } from "@/lib/nav";

export default function Header() {
  return (
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

        {/* CTA button */}
        <Link
          href="/contact"
          className="hidden md:inline-flex items-center px-5 py-2.5 border border-gold/40 text-gold font-body text-xs font-medium tracking-[0.15em] uppercase hover:bg-gold hover:text-brand-bg transition-colors duration-200 shrink-0"
        >
          List Property
        </Link>
      </div>
    </header>
  );
}
