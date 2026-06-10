import { m } from "motion/react";
import { useI18n } from "../lib/i18n.jsx";
import { SectionHead } from "../components/ui/SectionHead.jsx";
import { stagger, child, VIEW, fadeUp } from "../lib/motion.js";

export function WhyArkan() {
  const { t } = useI18n();
  const s = t.why;

  return (
    <section className="section section--alt section--line cv-auto" id="why" aria-labelledby="why-title">
      <div className="container">
        <SectionHead id="why-title" label={s.label} title={s.title} />
        <m.div className="why-grid" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={VIEW}>
          {s.items.map((w, i) => (
            <m.article key={w.title} className="card why" variants={child}>
              <div className="why__num" aria-hidden="true">0{i + 1}</div>
              <h3 className="t-h3" style={{ marginBottom: 10 }}>{w.title}</h3>
              <p className="t-body">{w.desc}</p>
            </m.article>
          ))}
        </m.div>

        <m.blockquote className="pull-quote" variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEW}>
          <p>{s.quote}</p>
          <footer className="t-label t-label--dim" style={{ marginTop: 18 }}>{s.quoteAttr}</footer>
        </m.blockquote>
      </div>
    </section>
  );
}
