import { m } from "motion/react";
import { useI18n } from "../lib/i18n.jsx";
import { track } from "../lib/analytics.js";
import { SystemDiagram } from "../components/SystemDiagram.jsx";
import { fadeUp, stagger, child, EASE } from "../lib/motion.js";

export function Hero({ onBook }) {
  const { t } = useI18n();
  const h = t.hero;

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true" />
      <div className="container container--wide">
        <div className="hero__grid">
          <m.div className="hero__copy" variants={stagger(0.1, 0.05)} initial="hidden" animate="show">
            <m.div className="hero__eyebrow" variants={child}>
              <span className="dot-live" aria-hidden="true" />
              {h.eyebrow}
            </m.div>

            <m.h1 className="t-display hero__title" id="hero-title" variants={child}>
              {h.h1Pre} <span className="em">{h.h1Em}</span>
            </m.h1>

            <m.p className="t-lead hero__sub" variants={child}>{h.sub}</m.p>

            <m.div className="cta-row hero__cta" variants={child}>
              <button
                type="button"
                className="btn btn--primary btn--lg"
                onClick={() => { track("cta_click", { id: "hero-primary" }); onBook("hero"); }}
              >
                {h.ctaPrimary}
              </button>
              <button
                type="button"
                className="btn btn--ghost btn--lg"
                onClick={() => { track("cta_click", { id: "hero-secondary" }); scrollTo("how"); }}
              >
                {h.ctaSecondary}
              </button>
            </m.div>
          </m.div>

          <m.div
            className="hero__visual"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            <SystemDiagram />
          </m.div>
        </div>

        <m.div
          className="hero__proof"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px 0px" }}
        >
          <div className="hero__proof-head">
            <span className="dot-live" aria-hidden="true" />
            <span className="t-label">{h.proofTitle}</span>
          </div>
          <m.div
            className="hero__proof-grid"
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            role="list"
            aria-label={h.proofTitle}
          >
            {h.proof.map((p) => (
              <m.div className="stat" key={p.label} variants={child} role="listitem">
                <span className="stat__rule" aria-hidden="true" />
                <span className="stat__num num">{p.num}</span>
                <span className="stat__label">{p.label}</span>
              </m.div>
            ))}
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
