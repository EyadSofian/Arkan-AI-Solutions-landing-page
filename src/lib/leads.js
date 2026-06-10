import { SITE } from "../config.js";

/**
 * Submit a lead to the configured webhook.
 * Throws a typed error — the UI must surface failure honestly and offer
 * the WhatsApp/email fallback. Success is ONLY a 2xx response.
 *
 * @throws {{ type: "config" | "network" | "http", status?: number }}
 */
export async function submitLead(data) {
  if (!SITE.leadWebhook) {
    const err = new Error("Lead webhook is not configured (VITE_LEAD_WEBHOOK_URL).");
    err.type = "config";
    throw err;
  }

  const payload = {
    source: "arkan-landing",
    submittedAt: new Date().toISOString(),
    page: window.location.href,
    language: document.documentElement.lang || "ar",
    ...data,
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  let res;
  try {
    res = await fetch(SITE.leadWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (cause) {
    const err = new Error("Network failure while submitting lead.");
    err.type = "network";
    err.cause = cause;
    throw err;
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const err = new Error(`Lead endpoint responded ${res.status}.`);
    err.type = "http";
    err.status = res.status;
    throw err;
  }
  return true;
}

/** Compose a readable WhatsApp message from the form answers (fallback channel). */
export function leadToWhatsAppText(data, labels) {
  const lines = [
    labels.intro,
    "",
    `${labels.name}: ${data.name || "—"}`,
    `${labels.company}: ${data.company || "—"}`,
    `${labels.email}: ${data.email || "—"}`,
  ];
  if (data.phone) lines.push(`${labels.phone}: ${data.phone}`);
  if (data.industry) lines.push(`${labels.industry}: ${data.industry}`);
  if (data.goals?.length) lines.push(`${labels.goals}: ${data.goals.join("، ")}`);
  if (data.systems?.length) lines.push(`${labels.systems}: ${data.systems.join("، ")}`);
  if (data.bottleneck) lines.push(`${labels.bottleneck}: ${data.bottleneck}`);
  if (data.contactPref) lines.push(`${labels.contactPref}: ${data.contactPref}`);
  if (data.timing) lines.push(`${labels.timing}: ${data.timing}`);
  return lines.join("\n");
}
