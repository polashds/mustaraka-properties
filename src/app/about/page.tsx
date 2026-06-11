import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us — Mustaraka Properties",
  description:
    "Learn about Mustaraka Properties, our founder, and our commitment to premium real estate in Bangladesh.",
};

const values = [
  {
    title: "Integrity",
    body: "Every transaction is conducted with full transparency. We never compromise on honesty — with our clients, our partners, or ourselves.",
  },
  {
    title: "Excellence",
    body: "We curate only the finest listings and deliver service that exceeds expectations at every step of the journey.",
  },
  {
    title: "Expertise",
    body: "Deep market knowledge built over years in Dhaka, Chittagong, Sylhet, and Rajshahi gives our clients a decisive advantage.",
  },
  {
    title: "Care",
    body: "Buying or renting a property is one of life's most significant decisions. We treat it with the weight it deserves.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-brand-bg">
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(201,168,76,0.07)_0%,transparent_65%)]" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-8 bg-gold/40" />
            <p className="font-body text-[10px] font-medium tracking-[0.35em] text-gold uppercase">
              Our Story
            </p>
            <span className="h-px w-8 bg-gold/40" />
          </div>
          <h1 className="font-heading font-light text-brand-text text-[1.75rem] sm:text-5xl md:text-6xl leading-[1.08] mb-8">
            Built on Trust,<br />
            <span className="italic text-gold">Driven by Purpose</span>
          </h1>
          <p className="font-body text-brand-muted text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Mustaraka Properties was founded with a single conviction: that every client deserves
            access to premium real estate with complete transparency and genuine care.
          </p>
        </div>
      </section>

      {/* Founder */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden border border-gold/20">
              <Image
                src="/assets/polash.jpg"
                alt="Polash — Founder, Mustaraka Properties"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Gold accent line */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border-b border-r border-gold/30" />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="h-px w-8 bg-gold/40" />
              <p className="font-body text-[10px] font-medium tracking-[0.35em] text-gold uppercase">
                Founder &amp; Principal
              </p>
            </div>
            <h2 className="font-heading font-light text-brand-text text-4xl">Polash</h2>
            <div className="space-y-4 font-body text-sm text-brand-muted leading-relaxed">
              <p>
                With over a decade of experience navigating Bangladesh&apos;s most competitive
                property markets, Polash established Mustaraka Properties to bridge the gap between
                discerning buyers and truly exceptional properties.
              </p>
              <p>
                His approach is rooted in patience, precision, and an unwavering commitment to his
                clients&apos; long-term interests — never the transaction. He believes that the
                right property, presented honestly, sells itself.
              </p>
              <p>
                Based in Dhaka, he personally oversees every listing and client relationship,
                ensuring that the Mustaraka standard is upheld without exception.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-brand-surface border-t border-gold/10 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="h-px w-8 bg-gold/40" />
              <p className="font-body text-[10px] font-medium tracking-[0.35em] text-gold uppercase">
                What We Stand For
              </p>
              <span className="h-px w-8 bg-gold/40" />
            </div>
            <h2 className="font-heading font-light text-brand-text text-4xl">Our Values</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="border border-gold/15 bg-brand-bg p-8 hover:border-gold/35 transition-colors"
              >
                <h3 className="font-heading font-light text-gold text-xl mb-4">{v.title}</h3>
                <p className="font-body text-sm text-brand-muted leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { value: "500+", label: "Properties Transacted" },
            { value: "12+", label: "Years of Experience" },
            { value: "4", label: "Cities Covered" },
            { value: "98%", label: "Client Satisfaction" },
          ].map((s) => (
            <div key={s.label} className="border border-gold/15 bg-brand-surface p-8">
              <p className="font-heading font-light text-gold text-4xl mb-2">{s.value}</p>
              <p className="font-body text-[11px] text-brand-muted tracking-[0.2em] uppercase">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
