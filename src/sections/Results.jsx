import { m } from "motion/react";
import { useI18n } from "../lib/i18n.jsx";
import { track } from "../lib/analytics.js";
import { SectionHead } from "../components/ui/SectionHead.jsx";
import { Icon } from "../components/ui/Icon.jsx";
import { stagger, child, VIEW } from "../lib/motion.js";

export function Results({ onBook }) {
  const { t } = useI18n();
  const s = t.results;

  return (
    <section className="section section--alt section--line cv-auto" id="results" aria-labelledby="results-title">
      <div className="container">
        <SectionHead id="results-title" label={s.label} title={s.title} lead={s.lead} />

        <m.div className="case-grid" variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={VIEW}>
          {s.cases.map((c) => (
            <m.article key={c.title} className="card card--hover case" variants={child}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
                <span className="t-label">{c.tag}</span>
                <span className="t-label t-label--dim" style={{ letterSpacing: "0.1em", textTransform: "none" }}>
                  {c.client}
                </span>
              </div>

              <h3 className="t-h3" style={{ marginBottom: 18 }}>{c.title}</h3>

              <div className="case__block">
                <p className="t-body" style={{ color: "var(--text3)" }}>{c.problem}</p>
              </div>
              <div className="case__block">
                <p className="t-body" style={{ color: "var(--text)" }}>{c.built}</p>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
                {c.systems.map((sys) => (
                  <span key={sys} className="chip">{sys}</span>
                ))}
              </div>

              <div className="case__metrics">
                {c.metrics.map((mt) => (
                  <div key={mt.label}>
                    <div className="case__m-num">{mt.num}</div>
                    <div className="case__m-lbl">{mt.label}</div>
                  </div>
                ))}
              </div>

              <div className="case__foot">
                <span className="t-small" style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ok)", flexShrink: 0 }} aria-hidden="true" />
                  {c.context}
                </span>
                <button
                  type="button"
                  className="link-arrow"
                  onClick={() => {
                    track("cta_click", { id: "case" });
                    onBook("case");
                  }}
                >
                  {s.discuss}
                  <Icon name="arrowFwd" size={13} flip />
                </button>
              </div>
            </m.article>
          ))}
        </m.div>

        <p className="t-small" style={{ marginTop: 28, maxWidth: 620 }}>{s.note}</p>
      </div>
    </section>
  );
}
