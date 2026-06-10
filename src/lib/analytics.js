// Lightweight analytics hook — no dependency, no PII.
// Events flow to window.dataLayer (GTM-compatible) and Plausible when present.

export function track(event, props = {}) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...props });
    if (typeof window.plausible === "function") {
      window.plausible(event, { props });
    }
    if (import.meta.env.DEV) {
      console.debug("[analytics]", event, props);
    }
  } catch {
    /* analytics must never break the page */
  }
}
