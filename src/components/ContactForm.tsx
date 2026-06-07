"use client";

import { useState, useTransition } from "react";
import { submitContact } from "@/lib/actions";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await submitContact(formData);
      setSubmitted(true);
    });
  }

  if (submitted) {
    return (
      <div className="py-16 text-center border border-gold/20 bg-brand-surface">
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="h-px w-8 bg-gold/40" />
          <p className="font-body text-[10px] font-medium tracking-[0.35em] text-gold uppercase">
            Message Received
          </p>
          <span className="h-px w-8 bg-gold/40" />
        </div>
        <h2 className="font-heading font-light text-brand-text text-3xl mb-3">
          Thank you
        </h2>
        <p className="font-body text-sm text-brand-muted max-w-sm mx-auto">
          We have received your message and will be in touch within one business day.
        </p>
      </div>
    );
  }

  const field =
    "w-full bg-brand-bg border border-gold/15 text-brand-text font-body text-sm px-4 py-3.5 placeholder:text-brand-muted/50 focus:outline-none focus:border-gold/50 transition-colors duration-150";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-body text-[11px] tracking-[0.2em] text-brand-muted uppercase mb-1.5">
            Full Name *
          </label>
          <input type="text" name="name" required placeholder="Your name" className={field} />
        </div>
        <div>
          <label className="block font-body text-[11px] tracking-[0.2em] text-brand-muted uppercase mb-1.5">
            Phone
          </label>
          <input type="tel" name="phone" placeholder="+880 1xxx xxxxxx" className={field} />
        </div>
      </div>

      <div>
        <label className="block font-body text-[11px] tracking-[0.2em] text-brand-muted uppercase mb-1.5">
          Email Address
        </label>
        <input type="email" name="email" placeholder="you@example.com" className={field} />
      </div>

      <div>
        <label className="block font-body text-[11px] tracking-[0.2em] text-brand-muted uppercase mb-1.5">
          Message
        </label>
        <textarea
          name="message"
          rows={5}
          placeholder="Tell us how we can help…"
          className={`${field} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-4 bg-gold hover:bg-gold-light text-brand-bg font-body text-sm font-medium tracking-[0.2em] uppercase transition-colors duration-200 disabled:opacity-60"
      >
        {isPending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
