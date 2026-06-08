"use client";

import { useState, useTransition, useRef } from "react";
import { submitContact } from "@/lib/actions";

const inputCls =
  "w-full bg-brand-bg border border-gold/15 text-brand-text placeholder:text-brand-muted/40 font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/50 transition-colors";
const labelCls =
  "block font-body text-[10px] tracking-[0.2em] uppercase text-brand-muted mb-1.5";

export default function HomeLeadForm() {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(false);
    const fd = new FormData(e.currentTarget);

    const intent = fd.get("intent") as string;
    const propType = fd.get("propType") as string;
    const location = fd.get("location") as string;
    const budget = fd.get("budget") as string;
    const timeline = fd.get("timeline") as string;
    const additional = (fd.get("additional") as string).trim();

    const parts: string[] = [];
    if (intent) parts.push(`Intent: ${intent}`);
    if (propType) parts.push(`Type: ${propType}`);
    if (location) parts.push(`Location: ${location}`);
    if (budget) parts.push(`Budget: ${budget}`);
    if (timeline) parts.push(`Timeline: ${timeline}`);
    const message = [parts.join(" | "), additional].filter(Boolean).join("\n\n");

    const submitFd = new FormData();
    submitFd.set("name", (fd.get("name") as string).trim());
    submitFd.set("phone", (fd.get("phone") as string).trim());
    submitFd.set("email", (fd.get("email") as string).trim());
    submitFd.set("message", message);

    startTransition(async () => {
      try {
        const result = await submitContact(submitFd);
        if (result?.success) {
          setDone(true);
          formRef.current?.reset();
        } else {
          setServerError(true);
        }
      } catch {
        setServerError(true);
      }
    });
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
        <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center text-3xl">
          ✓
        </div>
        <div>
          <p className="font-heading text-2xl font-light text-brand-text mb-2">
            Request Received
          </p>
          <p className="font-body text-sm text-brand-muted leading-relaxed max-w-xs">
            Our team will reach out within 24 hours with curated listings that match your brief.
          </p>
        </div>
        <button
          onClick={() => setDone(false)}
          className="font-body text-[10px] tracking-[0.2em] uppercase text-gold hover:text-gold-light transition-colors"
        >
          Submit another request &rarr;
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label htmlFor="hl-name" className={labelCls}>
            Full Name <span className="text-gold">*</span>
          </label>
          <input
            id="hl-name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className={inputCls}
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="hl-phone" className={labelCls}>
            Phone / WhatsApp <span className="text-gold">*</span>
          </label>
          <input
            id="hl-phone"
            name="phone"
            type="tel"
            required
            placeholder="+880 1700 000000"
            className={inputCls}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="hl-email" className={labelCls}>
            Email Address
          </label>
          <input
            id="hl-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className={inputCls}
          />
        </div>

        {/* Intent */}
        <div>
          <label htmlFor="hl-intent" className={labelCls}>
            I Want To
          </label>
          <select id="hl-intent" name="intent" className={inputCls + " cursor-pointer"}>
            <option value="">Select intent</option>
            <option>Buy a property</option>
            <option>Rent a property</option>
            <option>Sell my property</option>
            <option>Invest in real estate</option>
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label htmlFor="hl-propType" className={labelCls}>
            Property Type
          </label>
          <select id="hl-propType" name="propType" className={inputCls + " cursor-pointer"}>
            <option value="">Any type</option>
            <option>Apartment</option>
            <option>House / Villa</option>
            <option>Commercial</option>
            <option>Land / Plot</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="hl-location" className={labelCls}>
            Location Preference
          </label>
          <select id="hl-location" name="location" className={inputCls + " cursor-pointer"}>
            <option value="">Any location</option>
            <option>Dhaka</option>
            <option>Chittagong</option>
            <option>Cox&apos;s Bazar</option>
            <option>Mymensingh</option>
          </select>
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="hl-budget" className={labelCls}>
            Budget Range
          </label>
          <select id="hl-budget" name="budget" className={inputCls + " cursor-pointer"}>
            <option value="">Flexible</option>
            <option>Under ৳50 Lac</option>
            <option>৳50 Lac – ৳1 Cr</option>
            <option>৳1 Cr – ৳3 Cr</option>
            <option>৳3 Cr – ৳10 Cr</option>
            <option>Above ৳10 Cr</option>
          </select>
        </div>

        {/* Timeline */}
        <div>
          <label htmlFor="hl-timeline" className={labelCls}>
            How Soon?
          </label>
          <select id="hl-timeline" name="timeline" className={inputCls + " cursor-pointer"}>
            <option value="">No rush</option>
            <option>Within 1 month</option>
            <option>1–3 months</option>
            <option>3–6 months</option>
            <option>6+ months</option>
          </select>
        </div>

        {/* Additional requirements */}
        <div className="sm:col-span-2">
          <label htmlFor="hl-additional" className={labelCls}>
            Additional Requirements
          </label>
          <textarea
            id="hl-additional"
            name="additional"
            rows={3}
            placeholder="Bedrooms, specific area, must-haves, anything else…"
            className={inputCls + " resize-none"}
          />
        </div>

        {/* Submit */}
        <div className="sm:col-span-2">
          {serverError && (
            <p className="font-body text-xs text-red-400 mb-3">
              Something went wrong — please try again or WhatsApp us directly.
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full py-4 bg-gold hover:bg-gold-light disabled:opacity-60 text-brand-bg font-body text-[11px] font-semibold tracking-[0.25em] uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(201,168,76,0.3)]"
          >
            {pending ? "Sending…" : "Send My Brief"}
          </button>
        </div>
      </div>
    </form>
  );
}
