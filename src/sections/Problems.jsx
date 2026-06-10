import { m } from "motion/react";
import { useI18n } from "../lib/i18n.jsx";
import { SectionHead } from "../components/ui/SectionHead.jsx";
import { Icon } from "../components/ui/Icon.jsx";
import { stagger, child, VIEW } from "../lib/motion.js";

export function Problems() {
  const { t } = useI18n();
  const s = t.problems;

  return (
    <section className="section section--line cv-auto" id="problems" aria-labelledby="problems-title">
      <div className="container">
        <SectionHead id="problems-title" label={s.label} title={s.title} lead={s.lead} />
        <m.div className="prob-grid" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={VIEW}>
          {s.items.map((p) => (
            <m.article key={p.pain} className="card card--hover prob" variants={child}>
              <p className="prob__q">{p.pain}</p>
              <p className="t-body">{p.detail}</p>
              <div className="prob__fix">
                <span className="prob__fix-ic" aria-hidden="true">
                  <Icon name="fixArrow" size={17} flip />
                </span>
                <div>
                  <p className="t-body" style={{ color: "var(--text)" }}>{p.fix}</p>
                  <p className="t-label" style={{ marginTop: 10 }}>{p.pillar}</p>
                </div>
              </div>
            </m.article>
          ))}
        </m.div>
      </div>
    </section>
  );
}
