export function trackGA4Lead() { if (typeof window === "undefined") return; window.gtag?.("event", "generate_lead"); }
export function trackPixelLead() { if (typeof window === "undefined") return; window.fbq?.("track", "Lead"); }
export function trackPixelViewContent(name?: string) { if (typeof window === "undefined") return; window.fbq?.("track", "ViewContent", name ? { content_name: name } : undefined); }
export function trackContact() { if (typeof window === "undefined") return; window.fbq?.("track", "Contact"); window.gtag?.("event", "contact"); }
