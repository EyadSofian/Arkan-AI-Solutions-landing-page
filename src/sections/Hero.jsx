import { m } from "motion/react";
import { useI18n } from "../lib/i18n.jsx";
import { track } from "../lib/analytics.js";
import { Icon } from "../components/ui/Icon.jsx";
import { SystemDiagram } from "../components/SystemDiagram.jsx";
import { fadeUp, stagger, child } from "../lib/motion.js";

export function Hero({ onBook }) {
  const { t } = useI18n();
  const h = t.hero;

  const goHow = () => {
    track("cta_click", { id: "hero-secondary" });
    document.getElementById("how")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__grid" aria-hidden="true" />
      <div className="container">
        <div className="hero__inner">
          {/* Copy column */}
          <div>
            <m.p className="eyebrow-pill" variants={fadeUp} initial="hidden" animate="show" custom={0.05}>
              <span className="dot" aria-hidden="true" />
              {h.eyebrow}
            </m.p>

            <m.h1 className="t-display" id="hero-title" variants={fadeUp} initial="hidden" animate="show" custom={0.16}>
              {h.h1Pre} <em>{h.h1Em}</em>
            </m.h1>

            <m.p className="t-lead hero__sub" variants={fadeUp} initial="hidden" animate="show" custom={0.3}>
              {h.sub}
            </m.p>

            <m.div className="hero__ctas" variants={fadeUp} initial="hidden" animate="show" custom={0.42}>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => {
                  track("cta_click", { id: "hero-primary" });
                  onBook("hero");
                }}
              >
                {h.ctaPrimary}
                <Icon name="arrowFwd" size={15} flip className="ic--fwd" />
              </button>
              <button type="button" className="btn btn--ghost" onClick={goHow}>
                {h.ctaSecondary}
              </button>
            </m.div>

            <m.div
              className="hero__proof"
              variants={stagger(0.07, 0.65)}
              initial="hidden"
              animate="show"
              role="list"
              aria-label={h.proofTitle}
            >
              {h.proof.map((p) => (
                <m.div key={p.label} variants={child} role="listitem">
                  <div className="proof__num">{p.num}</div>
                  <div className="t-small proof__lbl">{p.label}</div>
                </m.div>
              ))}
            </m.div>
          </div>

          {/* Visual column */}
          <m.div variants={fadeUp} initial="hidden" animate="show" custom={0.35}>
            <SystemDiagram />
          </m.div>
        </div>
      </div>
    </section>
  );
}
