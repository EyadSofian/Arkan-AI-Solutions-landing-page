import { m } from "motion/react";
import { useI18n } from "../lib/i18n.jsx";
import { track } from "../lib/analytics.js";
import { SectionHead } from "../components/ui/SectionHead.jsx";
import { Icon } from "../components/ui/Icon.jsx";
import { stagger, child, VIEW } from "../lib/motion.js";

/**
 * "Inside one Arkan system" — a vertical operational walkthrough.
 * Every step is rendered (no hidden panels): better for reading, SEO and a11y.
 * Steps reveal on scroll; the rail draws the connecting structure.
 */
export function Anatomy({ onBook }) {
  const { t } = useI18n();
  const s = t.anatomy;
  const last = s.steps.length - 1;

  return (
    <section className="section" id="how" aria-labelledby="how-title">
      <div className="container">
        <SectionHead id="how-title" label={s.label} title={s.title} lead={s.lead} />

        <m.ol className="steps" variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={VIEW} style={{ listStyle: "none" }}>
          {s.steps.map((st, i) => (
            <m.li key={st.title} className={`step ${i === 0 ? "step--active" : ""}`} variants={child}>
              <div className="step__rail" aria-hidden="true">
                <span className="step__num num">{i + 1}</span>
                {i < last && <span className="step__line" />}
              </div>
              <div className="step__body">
                <h3 className="step__title">{st.title}</h3>
                <p className="step__short">{st.short}</p>
                <p className="step__text">{st.body}</p>
                <p className="step__msg" dir="auto">
                  <span className="dot-live" aria-hidden="true" style={{ background: "var(--accent)" }} />
                  {st.msg}
                </p>
                <span className="step__tech t-label">{st.tech}</span>
              </div>
            </m.li>
          ))}
        </m.ol>

        <div style={{ marginTop: "clamp(36px, 5vw, 52px)", display: "flex", flexWrap: "wrap", gap: "14px 28px", alignItems: "center" }}>
          <p className="t-body" style={{ maxWidth: 560, color: "var(--text-muted)" }}>{s.note}</p>
          <button
            type="button"
            className="link-inline"
            onClick={() => { track("cta_click", { id: "anatomy" }); onBook("anatomy"); }}
          >
            {s.cta}
            <Icon name="arrowUpRight" size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
