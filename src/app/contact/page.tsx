import { Metadata } from "next";
import { COMPANY_EMAIL, WHATSAPP_HREF } from "@/lib/constants";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — Mustaraka Properties",
  description:
    "Get in touch with Mustaraka Properties. We are happy to help with buying, selling, renting, or any property enquiry.",
};

export default function ContactPage() {
  return (
    <div className="bg-brand-bg">
      {/* Hero */}
      <section className="relative py-24 lg:py-28 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(201,168,76,0.07)_0%,transparent_65%)]" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-8 bg-gold/40" />
            <p className="font-body text-[10px] font-medium tracking-[0.35em] text-gold uppercase">
              Get in Touch
            </p>
            <span className="h-px w-8 bg-gold/40" />
          </div>
          <h1 className="font-heading font-light text-brand-text text-5xl sm:text-6xl leading-[1.08] mb-6">
            We&apos;d Love to<br />
            <span className="italic text-gold">Hear From You</span>
          </h1>
          <p className="font-body text-brand-muted text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Whether you have a property in mind or just a question, our team is ready to help.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16">
          {/* Form */}
          <div>
            <h2 className="font-heading font-light text-brand-text text-2xl mb-8">
              Send a Message
            </h2>
            <ContactForm />
          </div>

          {/* Contact details */}
          <aside className="space-y-8 lg:pt-14">
            <div className="border border-gold/15 bg-brand-surface p-8 space-y-6">
              <div>
                <p className="font-body text-[10px] tracking-[0.25em] text-gold uppercase mb-2">
                  Email
                </p>
                <a
                  href={`mailto:${COMPANY_EMAIL}`}
                  className="font-body text-sm text-brand-text hover:text-gold transition-colors"
                >
                  {COMPANY_EMAIL}
                </a>
              </div>

              <div>
                <p className="font-body text-[10px] tracking-[0.25em] text-gold uppercase mb-2">
                  WhatsApp
                </p>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-brand-text hover:text-gold transition-colors"
                >
                  Message us on WhatsApp
                </a>
              </div>

              <div>
                <p className="font-body text-[10px] tracking-[0.25em] text-gold uppercase mb-2">
                  Response Time
                </p>
                <p className="font-body text-sm text-brand-muted">
                  Within one business day
                </p>
              </div>

              <div>
                <p className="font-body text-[10px] tracking-[0.25em] text-gold uppercase mb-2">
                  Office Hours
                </p>
                <p className="font-body text-sm text-brand-muted">
                  Saturday – Thursday<br />
                  9:00 AM – 7:00 PM (BST)
                </p>
              </div>
            </div>

            <div className="border border-gold/15 bg-brand-surface p-8">
              <p className="font-body text-[10px] tracking-[0.25em] text-gold uppercase mb-3">
                Locations
              </p>
              <p className="font-body text-sm text-brand-muted leading-relaxed">
                Dhaka · Chittagong · Sylhet · Rajshahi
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
