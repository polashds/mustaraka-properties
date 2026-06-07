import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer — Mustaraka Properties",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-heading font-light text-brand-text text-xl">{title}</h2>
      <div className="font-body text-sm text-brand-muted leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function DisclaimerPage() {
  return (
    <div className="bg-brand-bg">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-24">
        <div className="flex items-center gap-4 mb-4">
          <span className="h-px w-8 bg-gold/40" />
          <p className="font-body text-[10px] font-medium tracking-[0.35em] text-gold uppercase">
            Legal
          </p>
        </div>
        <h1 className="font-heading font-light text-brand-text text-5xl mb-3">Disclaimer</h1>
        <p className="font-body text-xs text-brand-muted mb-12">Last updated: June 2026</p>

        <div className="space-y-10">
          <Section title="1. General Information Only">
            <p>
              The information contained on this website is provided for general informational
              purposes only. It does not constitute professional legal, financial, or investment
              advice. You should not act upon any information on this Site without seeking
              independent professional advice relevant to your specific circumstances.
            </p>
          </Section>

          <Section title="2. Property Information">
            <p>
              While Mustaraka Properties Ltd takes reasonable care to ensure the accuracy of
              property listings, descriptions, prices, and photographs, we cannot guarantee that
              all information is current, complete, or error-free. Property details are supplied
              by vendors and landlords and may change without notice.
            </p>
            <p>
              All prices displayed are indicative and subject to change. Photographs may not
              accurately represent the current condition of the property. Buyers and tenants are
              strongly advised to physically inspect any property before making any commitment.
            </p>
          </Section>

          <Section title="3. No Guarantee of Outcome">
            <p>
              Engaging our services does not guarantee a successful property transaction. Market
              conditions, legal circumstances, and third-party factors outside our control may
              affect the outcome of any transaction.
            </p>
          </Section>

          <Section title="4. Market Data">
            <p>
              Any market data, price estimates, or investment projections referenced on this Site
              are based on publicly available information and our advisors&apos; professional judgement.
              Past performance of property markets does not guarantee future results.
            </p>
          </Section>

          <Section title="5. External Links">
            <p>
              This Site may contain links to external websites. These links are provided for
              convenience only. Mustaraka Properties Ltd is not responsible for the content or
              accuracy of any external site.
            </p>
          </Section>

          <Section title="6. Limitation of Liability">
            <p>
              To the maximum extent permitted by applicable law, Mustaraka Properties Ltd expressly
              disclaims all warranties, express or implied, including but not limited to implied
              warranties of merchantability, fitness for a particular purpose, and non-infringement.
              We shall not be liable for any direct, indirect, incidental, or consequential loss
              arising from reliance on information provided on this Site.
            </p>
          </Section>

          <Section title="7. Contact">
            <p>
              For questions about this Disclaimer, please contact us at{" "}
              <a href="mailto:info@mustarakaproperties.com" className="text-gold hover:underline">
                info@mustarakaproperties.com
              </a>
              .
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}
