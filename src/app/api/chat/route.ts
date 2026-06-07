import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message } = await req.json().catch(() => ({ message: "" }));

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }

  // Placeholder — wire to an AI provider (e.g. Anthropic, OpenAI) when ready.
  const reply =
    "Thank you for your message. A member of our team will be in touch shortly. " +
    "For immediate assistance, please WhatsApp or call us directly.";

  return NextResponse.json({ reply });
}
