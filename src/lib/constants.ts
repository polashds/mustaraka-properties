export const COMPANY_EMAIL = "info@mustarakaproperties.com";

export const WHATSAPP_HREF = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}`;

export const CITIES = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi"] as const;
export type City = (typeof CITIES)[number];
