import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { LeadSource } from "@prisma/client";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

interface GeminiResponse {
  reply: string;
  lead: { name: string; phone: string } | null;
}

const FALLBACK_REPLY =
  "I'm having trouble connecting right now. For immediate help, please WhatsApp us at +8801721926800 or email info@mustarakaproperties.com — we'll respond promptly.";

function fireWebhook(payload: Record<string, unknown>) {
  const url = process.env.N8N_LEAD_WEBHOOK_URL;
  if (!url) return;
  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

function extractJson(raw: string): unknown {
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed);
  } catch {}
  const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (match) {
    try {
      return JSON.parse(match[1]);
    } catch {}
  }
  return null;
}

async function buildListingsContext(): Promise<string> {
  try {
    const props = await prisma.property.findMany({
      where: { status: "Published" },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 25,
      select: {
        title: true,
        type: true,
        listingType: true,
        city: true,
        price: true,
        bedrooms: true,
        bathrooms: true,
        area: true,
        slug: true,
      },
    });

    if (!props.length) return "No properties are currently listed.";

    return (
      "CURRENT INVENTORY (reference these and link as /properties/[slug]):\n" +
      props
        .map((p) => {
          const parts: string[] = [
            `• ${p.title}`,
            `${p.type} for ${p.listingType}`,
            p.city,
            `BDT ${Number(p.price).toLocaleString()}`,
          ];
          if (p.bedrooms != null) parts.push(`${p.bedrooms}BR`);
          if (p.bathrooms != null) parts.push(`${p.bathrooms}BA`);
          if (p.area != null) parts.push(`${p.area} sqft`);
          parts.push(`/properties/${p.slug}`);
          return parts.join(" | ");
        })
        .join("\n")
    );
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  let messages: ChatMessage[] = [];

  try {
    const body = await req.json();
    if (Array.isArray(body.messages)) {
      messages = body.messages;
    } else if (typeof body.message === "string" && body.message) {
      messages = [{ role: "user", text: body.message }];
    }
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "no user message" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ reply: FALLBACK_REPLY });
  }

  const listingsContext = await buildListingsContext();

  const systemInstruction = `You are the virtual property assistant for Mustaraka Properties Ltd — a premium real-estate company in Bangladesh.
Be warm, professional, and concise.

Company details:
- Name: Mustaraka Properties Ltd
- Locations: Dhaka, Chittagong, Cox's Bazar, Mymensingh
- Services: property sales, rentals, investment advisory, property management
- WhatsApp: +8801721926800
- Email: info@mustarakaproperties.com

${listingsContext}

Guidelines:
1. Answer questions about buying, renting, areas, prices, and the purchase/rental process in Bangladesh.
2. Recommend and link actual listings from the inventory above using their /properties/[slug] path.
3. If a property type or location isn't in the current inventory, say so and offer to take the visitor's details so the team can follow up.
4. Always invite serious buyers or renters to connect via WhatsApp: +8801721926800.
5. Keep replies concise — 2–4 sentences unless the visitor asks for more detail.
6. Reply in English by default. If the visitor writes in Bengali, reply in Bengali.

LEAD CAPTURE: When the visitor provides both a NAME and a PHONE NUMBER in any message, set the "lead" field.

IMPORTANT — You must reply with ONLY a valid JSON object in exactly this shape, no extra text:
{"reply": "<your response>", "lead": null}

When you detect name + phone:
{"reply": "<your response acknowledging you've passed their details to the team>", "lead": {"name": "<name>", "phone": "<phone>"}}`;

  // Gemini requires contents to start with "user"; skip any leading assistant messages
  const firstUserIdx = messages.findIndex((m) => m.role === "user");
  const contents = messages.slice(firstUserIdx).map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.text }],
  }));

  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.4,
            maxOutputTokens: 512,
          },
        }),
      }
    );

    if (!res.ok) {
      console.error("Gemini API error", res.status, await res.text());
      return NextResponse.json({ reply: FALLBACK_REPLY });
    }

    const data = await res.json();
    const rawText: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let reply = FALLBACK_REPLY;
    let capturedLead: GeminiResponse["lead"] = null;

    const parsed = extractJson(rawText) as GeminiResponse | null;
    if (parsed && typeof parsed.reply === "string") {
      reply = parsed.reply;
      if (
        parsed.lead &&
        typeof parsed.lead.name === "string" &&
        typeof parsed.lead.phone === "string" &&
        parsed.lead.name.trim() &&
        parsed.lead.phone.trim()
      ) {
        capturedLead = parsed.lead;
      }
    } else if (rawText) {
      reply = rawText;
    }

    if (capturedLead) {
      try {
        const lastUserMessage = [...messages]
          .reverse()
          .find((m) => m.role === "user")?.text;
        const lead = await prisma.lead.create({
          data: {
            name: capturedLead.name.trim(),
            phone: capturedLead.phone.trim(),
            message: lastUserMessage ?? null,
            source: LeadSource.Chatbot,
          },
        });
        fireWebhook({
          id: lead.id,
          name: lead.name,
          phone: lead.phone,
          message: lead.message,
          source: lead.source,
          createdAt: lead.createdAt,
        });
      } catch (e) {
        console.error("Chatbot lead creation failed", e);
      }
    }

    return NextResponse.json({ reply });
  } catch (e) {
    console.error("Chat route error", e);
    return NextResponse.json({ reply: FALLBACK_REPLY });
  }
}
