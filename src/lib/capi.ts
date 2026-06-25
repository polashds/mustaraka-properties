import crypto from "crypto";

const PIXEL_ID = process.env.META_PIXEL_ID;
const TOKEN = process.env.META_CAPI_TOKEN;

function sha256(value: string) {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

type UserData = {
  email?: string | null;
  phone?: string | null;
  clientIp?: string;
  clientUserAgent?: string;
  fbc?: string;
  fbp?: string;
};

type CAPIEvent = {
  eventName: string;
  eventSourceUrl: string;
  userData?: UserData;
  customData?: Record<string, unknown>;
};

export async function sendCAPIEvent({
  eventName,
  eventSourceUrl,
  userData = {},
  customData,
}: CAPIEvent): Promise<void> {
  if (!PIXEL_ID || !TOKEN) return;

  const user_data: Record<string, unknown> = {};
  if (userData.email) user_data.em = sha256(userData.email);
  if (userData.phone) user_data.ph = sha256(userData.phone.replace(/\D/g, ""));
  if (userData.clientIp) user_data.client_ip_address = userData.clientIp;
  if (userData.clientUserAgent) user_data.client_user_agent = userData.clientUserAgent;
  if (userData.fbc) user_data.fbc = userData.fbc;
  if (userData.fbp) user_data.fbp = userData.fbp;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: eventSourceUrl,
        action_source: "website",
        user_data,
        ...(customData && { custom_data: customData }),
      },
    ],
  };

  await fetch(
    `https://graph.facebook.com/v20.0/${PIXEL_ID}/events?access_token=${TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  ).catch(() => {});
}
