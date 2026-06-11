import { m } from "motion/react";
import { useI18n } from "../lib/i18n.jsx";
import { SectionHead } from "../components/ui/SectionHead.jsx";
import { stagger, child, VIEW, fadeUp } from "../lib/motion.js";

export function WhyArkan() {
  const { t } = useI18n();
  const s = t.why;

  return (
    <section className="section section--sunk" id="why" aria-labelledby="why-title">
      <div className="container">
        <SectionHead id="why-title" label={s.label} title={s.title} />

        <m.div className="why-grid" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={VIEW}>
          {s.items.map((w, i) => (
            <m.article key={w.title} className="why-item" variants={child}>
              <span className="why-item__num num" aria-hidden="true">{`0${i + 1}`}</span>
              <div>
                <h3 className="why-item__title">{w.title}</h3>
                <p className="why-item__desc">{w.desc}</p>
              </div>
            </m.article>
          ))}
        </m.div>

        <m.blockquote className="why-quote" variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEW}>
          <p className="why-quote__text">{s.quote}</p>
          <footer className="t-label">{s.quoteAttr}</footer>
        </m.blockquote>
      </div>
    </section>
  );
}
