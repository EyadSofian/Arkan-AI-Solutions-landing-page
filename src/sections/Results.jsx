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
    <section className="section section--sunk" id="results" aria-labelledby="results-title">
      <div className="container container--wide">
        <SectionHead id="results-title" label={s.label} title={s.title} lead={s.lead} />

        <m.div className="cases" variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={VIEW}>
          {s.cases.map((c) => (
            <m.article key={c.title} className="card card--pad case corners" variants={child}>
              <span className="corner-mark tl" aria-hidden="true" />
              <span className="corner-mark br" aria-hidden="true" />
              <div className="case__grid">
                <div>
                  <div className="case__head">
                    <span className="chip">{c.tag}</span>
                    <span className="case__client">{c.client}</span>
                  </div>
                  <h3 className="t-h3 case__title">{c.title}</h3>
                  <p className="case__problem">{c.problem}</p>
                  <p className="case__built">{c.built}</p>
                  <div className="case__systems">
                    {c.systems.map((sys) => <span key={sys} className="chip">{sys}</span>)}
                  </div>
                </div>

                <div className="case__metrics">
                  {c.metrics.map((mt) => (
                    <div className="stat" key={mt.label}>
                      <span className="stat__rule" aria-hidden="true" />
                      <span className="stat__num num">{mt.num}</span>
                      <span className="stat__label">{mt.label}</span>
                    </div>
                  ))}
                  <span className="case__context">
                    <span className="dot-live" aria-hidden="true" />
                    {c.context}
                  </span>
                </div>
              </div>
            </m.article>
          ))}
        </m.div>

        <div style={{ marginTop: 30, display: "flex", flexWrap: "wrap", gap: "12px 24px", alignItems: "center", justifyContent: "space-between" }}>
          <p className="t-small" style={{ maxWidth: 620 }}>{s.note}</p>
          <button
            type="button"
            className="link-inline"
            onClick={() => { track("cta_click", { id: "results" }); onBook("results"); }}
          >
            {s.discuss}
            <Icon name="arrowUpRight" size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
