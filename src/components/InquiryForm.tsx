"use client";

import { useState, useTransition } from "react";
import { submitInquiry } from "@/lib/actions";

interface Props {
  propertyTitle: string;
}

export default function InquiryForm({ propertyTitle }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("property", propertyTitle);
    startTransition(async () => {
      await submitInquiry(formData);
      setSubmitted(true);
    });
  }

  if (submitted) {
    return (
      <div className="py-10 text-center border border-gold/20 bg-brand-surface">
        <p className="font-heading font-light text-2xl text-gold mb-2">
          Thank you
        </p>
        <p className="font-body text-sm text-brand-muted">
          Your inquiry has been received. We will be in touch shortly.
        </p>
      </div>
    );
  }

  const field =
    "w-full bg-brand-bg border border-gold/15 text-brand-text font-body text-sm px-4 py-3 placeholder:text-brand-muted/50 focus:outline-none focus:border-gold/50 transition-colors duration-150";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        name="name"
        placeholder="Full Name *"
        required
        className={field}
      />
      <input
        type="email"
        name="email"
        placeholder="Email Address *"
        required
        className={field}
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        className={field}
      />
      <textarea
        name="message"
        placeholder="Your message..."
        rows={4}
        className={`${field} resize-none`}
      />
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3.5 bg-gold hover:bg-gold-light text-brand-bg font-body text-sm font-medium tracking-[0.15em] uppercase transition-colors duration-200 disabled:opacity-60"
      >
        {isPending ? "Sending…" : "Send Inquiry"}
      </button>
    </form>
  );
}
