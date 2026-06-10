// ── Site configuration ───────────────────────────────────────────────────
// Every external link / endpoint is configurable via env (.env.example).

const env = import.meta.env;

export const SITE = {
  url: env.VITE_SITE_URL || "https://arkan.ai",
  whatsapp: env.VITE_WHATSAPP || "201007725744",
  email: env.VITE_EMAIL || "hello@arkan.ai",
  calendar: env.VITE_CALENDAR_URL || "https://calendar.app.google/35V4etCwYoD5poM77",
  leadWebhook: env.VITE_LEAD_WEBHOOK_URL || "",
};

export const waLink = (text) =>
  `https://wa.me/${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
