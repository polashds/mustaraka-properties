import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ — Mustaraka Properties",
  description:
    "Frequently asked questions about buying, renting, and selling property in Bangladesh with Mustaraka Properties.",
};

const faqs = [
  {
    q: "What areas does Mustaraka Properties cover?",
    a: "We operate across Bangladesh's four major cities: Dhaka, Chittagong, Sylhet, and Rajshahi. Within each city we cover all key neighbourhoods, from established central areas to emerging residential zones.",
  },
  {
    q: "How do I start looking for a property?",
    a: "Browse our listings at /properties, or contact us directly with your requirements. Our advisors will curate a shortlist of suitable properties and arrange viewings at your convenience.",
  },
  {
    q: "Are all listed properties verified?",
    a: "Yes. Every property on our platform is physically inspected by our team and undergoes basic legal verification before listing. We confirm ownership documents and check for encumbrances before recommending any property to a buyer.",
  },
  {
    q: "What fees does Mustaraka Properties charge?",
    a: "Our standard brokerage fee is disclosed upfront before any agreement is signed. There are no hidden charges. The exact fee depends on the transaction type (sale vs. rental) and property value — your advisor will explain this clearly at your first consultation.",
  },
  {
    q: "Can you help with legal and documentation work?",
    a: "We work closely with a network of trusted lawyers and legal advisors who can assist with Bainanama (sale agreements), deed registration, mutation, and other documentation. We can connect you with the right professional for your situation.",
  },
  {
    q: "How long does it take to buy a property in Bangladesh?",
    a: "A straightforward purchase from offer acceptance to registration typically takes 4–8 weeks, depending on the readiness of both parties and the complexity of the documentation. Your advisor will give you a realistic timeline at the outset.",
  },
  {
    q: "Do you handle commercial properties?",
    a: "Yes. We assist businesses and investors with office leasing, retail unit acquisition, warehousing, and mixed-use developments. Our commercial advisors have specific expertise in corporate relocation and investment property.",
  },
  {
    q: "I want to list my property for sale or rent. How do I start?",
    a: "Contact us via the form on our Contact page or WhatsApp us directly. One of our advisors will visit the property, conduct a market appraisal, and explain the listing process. There is no upfront cost to list.",
  },
  {
    q: "What is the difference between a deed and a bainanama?",
    a: "A bainanama is a sale agreement — a legally binding contract between buyer and seller that outlines terms, price, and timeline before the full sale deed is executed. The sale deed (registered at the Sub-Registrar's office) is the final document that transfers ownership. Both are essential in a property transaction.",
  },
  {
    q: "Can foreigners or NRBs buy property in Bangladesh?",
    a: "Non-Resident Bangladeshis (NRBs) can purchase property in Bangladesh. Foreign nationals face certain restrictions and should consult a specialist lawyer. We can connect you with legal advisors who handle NRB and foreign investment cases regularly.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function FaqPage() {
  return (
    <div className="bg-brand-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(201,168,76,0.07)_0%,transparent_65%)]" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-8 bg-gold/40" />
            <p className="font-body text-[10px] font-medium tracking-[0.35em] text-gold uppercase">
              Help Centre
            </p>
            <span className="h-px w-8 bg-gold/40" />
          </div>
          <h1 className="font-heading font-light text-brand-text text-5xl sm:text-6xl leading-[1.08] mb-6">
            Frequently Asked<br />
            <span className="italic text-gold">Questions</span>
          </h1>
          <p className="font-body text-brand-muted text-base md:text-lg leading-relaxed">
            Can&apos;t find what you need?{" "}
            <Link href="/contact" className="text-gold hover:underline">
              Contact us directly.
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ accordion */}
      <section className="max-w-3xl mx-auto px-6 lg:px-8 pb-24">
        <div className="divide-y divide-gold/10 border-t border-gold/10">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden"
            >
              <summary className="flex items-start justify-between gap-4">
                <span className="font-heading font-light text-brand-text text-lg leading-snug">
                  {item.q}
                </span>
                <span className="text-gold text-xl shrink-0 mt-0.5 group-open:rotate-45 transition-transform duration-200">
                  +
                </span>
              </summary>
              <p className="mt-4 font-body text-sm text-brand-muted leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
