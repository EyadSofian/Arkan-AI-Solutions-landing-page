import { m } from "motion/react";
import { useI18n } from "../lib/i18n.jsx";
import { track } from "../lib/analytics.js";
import { SectionHead } from "../components/ui/SectionHead.jsx";
import { Icon } from "../components/ui/Icon.jsx";
import { stagger, child, VIEW } from "../lib/motion.js";

/** Abstract pillar glyphs — geometric, on-brand, no literal icons. */
function PillarGlyph({ index }) {
  const common = { stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", fill: "none" };
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true" focusable="false">
      {index === 0 && (
        <>
          {/* agent: pillar + speech arc */}
          <rect x="19" y="16" width="6" height="20" rx="1.5" fill="currentColor" opacity="0.9" stroke="none" />
          <path d="M10 14 Q22 4 34 14" {...common} />
          <circle cx="22" cy="9" r="2.2" fill="currentColor" stroke="none" />
          <line x1="12" y1="38" x2="32" y2="38" {...common} />
        </>
      )}
      {index === 1 && (
        <>
          {/* automation: relay of beams */}
          <rect x="8" y="22" width="5" height="14" rx="1.2" fill="currentColor" opacity="0.55" stroke="none" />
          <rect x="19.5" y="16" width="5" height="20" rx="1.2" fill="currentColor" opacity="0.8" stroke="none" />
          <rect x="31" y="10" width="5" height="26" rx="1.2" fill="currentColor" stroke="none" />
          <path d="M10 16 Q22 8 33 6" {...common} strokeDasharray="2 4" />
          <line x1="6" y1="38" x2="38" y2="38" {...common} />
        </>
      )}
      {index === 2 && (
        <>
          {/* custom: keystone in frame */}
          <rect x="9" y="9" width="26" height="26" rx="3" {...common} opacity="0.6" />
          <rect x="18.5" y="18.5" width="7" height="17.5" rx="1.5" fill="currentColor" stroke="none" />
          <circle cx="22" cy="14" r="2.4" fill="currentColor" stroke="none" />
        </>
      )}
      {index === 3 && (
        <>
          {/* integration: two pillars, one bridge */}
          <rect x="9" y="18" width="6" height="18" rx="1.5" fill="currentColor" opacity="0.85" stroke="none" />
          <rect x="29" y="18" width="6" height="18" rx="1.5" fill="currentColor" opacity="0.85" stroke="none" />
          <path d="M12 16 Q22 6 32 16" {...common} />
          <circle cx="22" cy="10" r="2" fill="currentColor" stroke="none" />
          <line x1="6" y1="38" x2="38" y2="38" {...common} />
        </>
      )}
    </svg>
  );
}

export function Solutions({ onBook }) {
  const { t } = useI18n();
  const s = t.solutions;

  return (
    <section className="section section--alt section--line cv-auto" id="solutions" aria-labelledby="solutions-title">
      <div className="container">
        <SectionHead id="solutions-title" label={s.label} title={s.title} lead={s.lead} />
        <m.div className="pillar-grid" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={VIEW}>
          {s.items.map((p, i) => (
            <m.article key={p.num} className="card card--hover pillar" variants={child}>
              <div className="pillar__top">
                <span className="pillar__glyph">
                  <PillarGlyph index={i} />
                </span>
                <span className="t-label t-label--dim">{p.num}</span>
              </div>
              <p className="t-label">{p.name}</p>
              <h3 className="t-h3 pillar__outcome">{p.outcome}</h3>
              <p className="t-body">{p.desc}</p>
              <ul className="pillar__list">
                {p.typical.map((item) => (
                  <li key={item}>
                    <Icon name="check" size={13} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="pillar__tech">
                {p.tech.map((tech) => (
                  <span key={tech} className="chip">{tech}</span>
                ))}
              </div>
              <div style={{ marginTop: 18 }}>
                <button
                  type="button"
                  className="link-arrow"
                  onClick={() => {
                    track("cta_click", { id: `pillar-${p.num}` });
                    onBook(`pillar-${p.num}`);
                  }}
                >
                  {s.discuss}
                  <Icon name="arrowFwd" size={13} flip />
                </button>
              </div>
            </m.article>
          ))}
        </m.div>
      </div>
    </section>
  );
}
