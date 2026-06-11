import { m } from "motion/react";
import { useI18n } from "../lib/i18n.jsx";
import { fadeUp } from "../lib/motion.js";

/** Quiet credibility layer: "we build inside the tools you already run." */
export function Trust() {
  const { t } = useI18n();
  const s = t.trust;

  return (
    <section className="trust" aria-label={s.line}>
      <div className="container container--wide">
        <m.div className="trust__inner" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px 0px" }}>
          <p className="trust__line">{s.line}</p>
          <div className="trust__items">
            {s.items.map((i) => (
              <span key={i} className="trust__item">{i}</span>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
}
