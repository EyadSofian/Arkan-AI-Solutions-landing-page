import { m } from "motion/react";
import { useI18n } from "../lib/i18n.jsx";
import { SectionHead } from "../components/ui/SectionHead.jsx";
import { stagger, child, VIEW } from "../lib/motion.js";

export function Process() {
  const { t, lang } = useI18n();
  const s = t.process;

  return (
    <section className="section section--line cv-auto" id="process" aria-labelledby="process-title">
      <div className="container">
        <SectionHead id="process-title" label={s.label} title={s.title} lead={s.lead} />
        <m.ol
          className="proc-grid"
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={VIEW}
          style={{ listStyle: "none" }}
        >
          {s.stages.map((st, i) => (
            <m.li key={st.num} className="proc" variants={child}>
              <div className="proc__rail" aria-hidden="true">
                <span className="proc__dot">{st.num}</span>
                {i < s.stages.length - 1 && <span className="proc__rail-line" />}
              </div>
              <h3 className="t-h3" style={{ marginBottom: 8 }}>{st.name}</h3>
              <p className="t-small" style={{ marginBottom: 10, color: "var(--accent-ink)", fontFamily: "var(--mono)", letterSpacing: "0.08em" }}>
                {st.time}
              </p>
              <p className="t-body" style={{ fontSize: "var(--fs-small)" }}>{st.desc}</p>
              <div className="proc__deliv">
                <span className="t-label t-label--dim">{lang === "en" ? "Deliverable" : "المخرَج"}</span>
                {st.deliverable}
              </div>
            </m.li>
          ))}
        </m.ol>
      </div>
    </section>
  );
}
