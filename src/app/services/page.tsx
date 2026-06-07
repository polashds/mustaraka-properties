import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services — Mustaraka Properties",
  description:
    "Full-service real estate in Bangladesh — residential sales, rentals, commercial properties, and expert consultancy.",
};

const services = [
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    title: "Residential Sales",
    body: "From compact city apartments to expansive villas, we match buyers with properties that suit their lifestyle and investment goals. Our sales advisors guide you through every legal and financial step.",
    points: ["Market valuation & pricing", "Buyer-seller negotiation", "Title & legal verification", "Post-sale support"],
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25Z" />
      </svg>
    ),
    title: "Residential Rentals",
    body: "Whether you are relocating for work or seeking a long-term home, we source rental properties across Dhaka, Chittagong, Sylhet, and Rajshahi — negotiating terms that protect your interests.",
    points: ["Curated rental listings", "Lease agreement review", "Landlord vetting", "Move-in coordination"],
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
      </svg>
    ),
    title: "Commercial Properties",
    body: "Office spaces, retail units, warehouses, and mixed-use developments — we understand the requirements of businesses and connect them with spaces that support growth.",
    points: ["Office & retail leasing", "Industrial & warehouse sourcing", "Mixed-use investment", "Commercial valuation"],
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    title: "Real Estate Consultancy",
    body: "Thinking of investing, developing, or restructuring your property portfolio? Our advisory service delivers data-driven market insights and bespoke strategy for individuals and developers alike.",
    points: ["Investment analysis", "Portfolio structuring", "Developer advisory", "Market research reports"],
  },
];

const whyUs = [
  { label: "No Hidden Fees", body: "Our pricing is clear from day one. You will never encounter surprise charges." },
  { label: "End-to-End Support", body: "From first viewing to key handover, a dedicated advisor is with you throughout." },
  { label: "Verified Listings Only", body: "Every property is physically inspected and legally verified before listing." },
  { label: "Local Market Depth", body: "Decades of relationships with developers, landlords, and legal professionals." },
];

export default function ServicesPage() {
  return (
    <div className="bg-brand-bg">
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(201,168,76,0.07)_0%,transparent_65%)]" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-8 bg-gold/40" />
            <p className="font-body text-[10px] font-medium tracking-[0.35em] text-gold uppercase">
              What We Offer
            </p>
            <span className="h-px w-8 bg-gold/40" />
          </div>
          <h1 className="font-heading font-light text-brand-text text-5xl sm:text-6xl leading-[1.08] mb-8">
            Full-Service<br />
            <span className="italic text-gold">Real Estate</span>
          </h1>
          <p className="font-body text-brand-muted text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Whether you are buying, selling, renting, or investing, Mustaraka Properties provides
            expert guidance tailored to your specific situation.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {services.map((s) => (
            <div key={s.title} className="border border-gold/15 bg-brand-surface p-8 hover:border-gold/30 transition-colors">
              <div className="text-gold mb-5">{s.icon}</div>
              <h2 className="font-heading font-light text-brand-text text-2xl mb-4">{s.title}</h2>
              <p className="font-body text-sm text-brand-muted leading-relaxed mb-6">{s.body}</p>
              <ul className="space-y-2">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 font-body text-sm text-brand-muted">
                    <span className="w-1 h-1 rounded-full bg-gold shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="bg-brand-surface border-t border-gold/10 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="h-px w-8 bg-gold/40" />
              <p className="font-body text-[10px] font-medium tracking-[0.35em] text-gold uppercase">
                The Difference
              </p>
              <span className="h-px w-8 bg-gold/40" />
            </div>
            <h2 className="font-heading font-light text-brand-text text-4xl">Why Mustaraka</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((w) => (
              <div key={w.label} className="border border-gold/15 bg-brand-bg p-7">
                <h3 className="font-heading font-light text-gold text-lg mb-3">{w.label}</h3>
                <p className="font-body text-sm text-brand-muted leading-relaxed">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 lg:px-8 py-24 text-center">
        <h2 className="font-heading font-light text-brand-text text-4xl mb-6">
          Ready to get started?
        </h2>
        <p className="font-body text-brand-muted mb-10 leading-relaxed">
          Speak with one of our advisors today. No obligation, no pressure — just expert guidance.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center px-10 py-4 bg-gold text-brand-bg font-body text-xs font-medium tracking-[0.2em] uppercase hover:bg-gold-light transition-colors duration-200"
        >
          Contact Us
        </Link>
      </section>
    </div>
  );
}
