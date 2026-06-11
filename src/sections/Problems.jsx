import { m } from "motion/react";
import { useI18n } from "../lib/i18n.jsx";
import { SectionHead } from "../components/ui/SectionHead.jsx";
import { Icon } from "../components/ui/Icon.jsx";
import { stagger, child, VIEW } from "../lib/motion.js";

export function Problems() {
  const { t } = useI18n();
  const s = t.problems;

  return (
    <section className="section" id="problems" aria-labelledby="problems-title">
      <div className="container">
        <SectionHead id="problems-title" label={s.label} title={s.title} lead={s.lead} />
        <m.div className="problems-grid" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={VIEW}>
          {s.items.map((p) => (
            <m.article key={p.pain} className="card card--pad card--hover corners" variants={child}>
              <span className="corner-mark tl" aria-hidden="true" />
              <span className="corner-mark br" aria-hidden="true" />
              <p className="problem__pain">{p.pain}</p>
              <p className="problem__detail">{p.detail}</p>
              <div className="problem__fix">
                <Icon name="fixArrow" size={18} />
                <div>
                  <p className="problem__fix-text">{p.fix}</p>
                  <p className="t-label problem__pillar">{p.pillar}</p>
                </div>
              </div>
            </m.article>
          ))}
        </m.div>
      </div>
    </section>
  );
}
