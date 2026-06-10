// Official Arkan mark — Brand Identity Guide V2 (Steel-Blue), exact geometry.

export function ArkanMark({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none" aria-hidden="true" focusable="false">
      <rect width="96" height="96" rx="14" fill="#060D2E" />
      <rect x=".5" y=".5" width="95" height="95" rx="13.5" stroke="#3B82F6" strokeWidth=".8" opacity=".6" />
      <g transform="translate(8,4)">
        <circle cx="40" cy="20" r="5.5" fill="#3B82F6" />
        <circle cx="40" cy="20" r="9" fill="#3B82F6" opacity=".18" />
        <path d="M12 38 Q26 18,40 23 Q54 18,68 38" stroke="#3B82F6" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <rect x="10" y="38" width="7.5" height="46" rx="1.5" fill="#C8D8F8" />
        <rect x="36.5" y="29" width="7.5" height="55" rx="1.5" fill="#93C5FD" />
        <rect x="62.5" y="38" width="7.5" height="46" rx="1.5" fill="#C8D8F8" />
        <rect x="6" y="84" width="68" height="4" rx="1.5" fill="#BFDBFE" />
      </g>
    </svg>
  );
}

export function LogoLockup({ size = 34 }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 11 }}>
      <ArkanMark size={size} />
      <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            fontFamily: "var(--serif)",
            fontWeight: 400,
            fontSize: size * 0.55,
            letterSpacing: "-0.01em",
            color: "var(--text)",
          }}
        >
          Arkan
        </span>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: Math.max(7, size * 0.22),
            letterSpacing: "0.3em",
            color: "var(--accent-ink)",
            marginTop: 3,
          }}
        >
          AI · SOLUTIONS
        </span>
      </span>
    </span>
  );
}
