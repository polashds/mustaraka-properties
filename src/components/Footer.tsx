import Image from "next/image";
import Link from "next/link";
import { navLinks } from "@/lib/nav";
import { WHATSAPP_HREF, COMPANY_EMAIL } from "@/lib/constants";

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/faq", label: "FAQ" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-bg border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="space-y-5 md:col-span-1">
            <Image
              src="/assets/logo.png"
              alt="Mustaraka Properties"
              width={140}
              height={40}
              className="h-9 w-auto object-contain"
            />
            <p className="text-brand-muted text-sm leading-relaxed max-w-xs">
              Premium real estate solutions across Bangladesh&apos;s most
              prestigious locations.
            </p>
            <p className="text-gold/60 font-body text-xs tracking-[0.25em] uppercase">
              Dhaka · Chittagong · Sylhet · Rajshahi
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-5">
            <h4 className="font-body text-gold text-xs font-medium tracking-[0.25em] uppercase">
              Navigate
            </h4>
            <ul className="space-y-3">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-brand-muted text-sm hover:text-gold transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-5">
            <h4 className="font-body text-gold text-xs font-medium tracking-[0.25em] uppercase">
              Legal
            </h4>
            <ul className="space-y-3">
              {legalLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-brand-muted text-sm hover:text-gold transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h4 className="font-body text-gold text-xs font-medium tracking-[0.25em] uppercase">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-brand-muted">
              <li>
                <a
                  href={`mailto:${COMPANY_EMAIL}`}
                  className="hover:text-gold transition-colors duration-200"
                >
                  {COMPANY_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_HREF}
                  className="hover:text-whatsapp transition-colors duration-200"
                >
                  WhatsApp Enquiry
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-gold/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-brand-muted text-xs">
            © 2026 Mustaraka Properties Ltd. All rights reserved.
          </p>
          <p className="font-body text-brand-muted text-xs">
            Crafted by <span className="text-gold">ByteFlow AI Labs</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
