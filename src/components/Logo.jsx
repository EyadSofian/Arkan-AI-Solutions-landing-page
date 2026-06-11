// Arkan mark — "Atelier" system.
// أركان = the pillars a structure stands on. The mark is four rising columns
// on a baseline; the tallest (the keystone) carries the clay accent.
// Everything else uses currentColor so the lockup adapts to its surface.

import { useI18n } from "../lib/i18n.jsx";

export function ArkanMark({ size = 34 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block" }}
    >
      {/* registration corners — the blueprint motif */}
      <g stroke="currentColor" strokeWidth="1.4" opacity="0.32" strokeLinecap="round">
        <path d="M2 6 V2 H6" />
        <path d="M34 2 H38 V6" />
        <path d="M38 34 V38 H34" />
        <path d="M6 38 H2 V34" />
      </g>
      {/* four pillars (الأركان), rising left→right */}
      <g>
        <rect x="9"  y="22" width="3.4" height="10" rx="1.2" fill="currentColor" />
        <rect x="15" y="17" width="3.4" height="15" rx="1.2" fill="currentColor" />
        <rect x="21" y="12" width="3.4" height="20" rx="1.2" fill="currentColor" opacity="0.78" />
        <rect x="27" y="7"  width="3.4" height="25" rx="1.2" fill="var(--accent)" />
      </g>
      {/* baseline */}
      <rect x="8" y="32.5" width="24" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

export function LogoLockup({ size = 34, tone = "ink" }) {
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const color = tone === "band" ? "var(--band-ink)" : "var(--ink)";
  const subColor = tone === "band" ? "var(--band-faint)" : "var(--text-muted)";

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 11, color }}>
      <ArkanMark size={size} />
      <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            fontFamily: isAr ? "var(--ar-display)" : "var(--en-display)",
            fontWeight: 600,
            fontSize: size * 0.56,
            letterSpacing: isAr ? "0" : "-0.02em",
            color,
          }}
        >
          {isAr ? "أركان" : "Arkan"}
        </span>
        <span
          style={{
            fontFamily: isAr ? "var(--ar-text)" : "var(--mono)",
            fontSize: Math.max(7.5, size * 0.2),
            letterSpacing: isAr ? "0" : "0.22em",
            textTransform: isAr ? "none" : "uppercase",
            color: subColor,
            marginTop: 4,
            fontWeight: 500,
          }}
        >
          {isAr ? "أنظمة ذكية" : "AI Systems"}
        </span>
      </span>
    </span>
  );
}
