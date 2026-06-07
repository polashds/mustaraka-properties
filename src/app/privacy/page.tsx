import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Mustaraka Properties",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-heading font-light text-brand-text text-xl">{title}</h2>
      <div className="font-body text-sm text-brand-muted leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="bg-brand-bg">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-24">
        <div className="flex items-center gap-4 mb-4">
          <span className="h-px w-8 bg-gold/40" />
          <p className="font-body text-[10px] font-medium tracking-[0.35em] text-gold uppercase">
            Legal
          </p>
        </div>
        <h1 className="font-heading font-light text-brand-text text-5xl mb-3">Privacy Policy</h1>
        <p className="font-body text-xs text-brand-muted mb-12">Last updated: June 2026</p>

        <div className="space-y-10">
          <Section title="1. Introduction">
            <p>
              Mustaraka Properties Ltd (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting your
              personal information. This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you visit our website or engage with our services.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p>We may collect the following categories of information:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>
                <strong className="text-brand-text">Contact information</strong> — name, email address, phone number
              </li>
              <li>
                <strong className="text-brand-text">Enquiry details</strong> — messages you send us regarding properties or services
              </li>
              <li>
                <strong className="text-brand-text">Usage data</strong> — pages visited, time spent, referral source (collected anonymously via analytics)
              </li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <p>We use collected information to:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Respond to your enquiries and provide the services you request</li>
              <li>Send property listings or updates you have explicitly requested</li>
              <li>Improve our website and service quality</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p>We do not sell, trade, or rent your personal information to third parties.</p>
          </Section>

          <Section title="4. Data Retention">
            <p>
              We retain your personal information for as long as necessary to fulfil the purposes
              outlined in this policy, unless a longer retention period is required by law. Enquiry
              records are typically retained for 24 months from the date of submission.
            </p>
          </Section>

          <Section title="5. Your Rights">
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data (subject to legal obligations)</li>
              <li>Withdraw consent at any time where processing is based on consent</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:info@mustarakaproperties.com" className="text-gold hover:underline">
                info@mustarakaproperties.com
              </a>
              .
            </p>
          </Section>

          <Section title="6. Cookies">
            <p>
              Our website may use cookies to enhance your browsing experience. You can instruct your
              browser to refuse all cookies or to indicate when a cookie is being sent. Please note
              that some features of our website may not function properly without cookies.
            </p>
          </Section>

          <Section title="7. Third-Party Links">
            <p>
              Our website may contain links to third-party websites. We are not responsible for the
              privacy practices of those websites and encourage you to review their privacy policies.
            </p>
          </Section>

          <Section title="8. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this
              page with a revised &ldquo;Last updated&rdquo; date. Your continued use of our website following any
              changes constitutes acceptance of the updated policy.
            </p>
          </Section>

          <Section title="9. Contact">
            <p>
              For questions or concerns about this Privacy Policy, please contact us at{" "}
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
