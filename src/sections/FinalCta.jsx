import { m } from "motion/react";
import { useI18n } from "../lib/i18n.jsx";
import { track } from "../lib/analytics.js";
import { SITE, waLink } from "../config.js";
import { Icon } from "../components/ui/Icon.jsx";
import { stagger, child, VIEW } from "../lib/motion.js";

export function FinalCta({ onBook }) {
  const { t } = useI18n();
  const s = t.finalCta;

  return (
    <section className="section band final-cta" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <m.div className="final-cta__inner" variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={VIEW}>
          <m.div className="sect-head__label" variants={child} style={{ justifyContent: "center" }}>
            <span className="t-label">{s.label}</span>
          </m.div>

          <m.h2 className="t-h2" id="contact-title" variants={child}>{s.title}</m.h2>

          <m.p className="t-lead final-cta__sub" variants={child}>{s.sub}</m.p>

          <m.div variants={child}>
            <button
              type="button"
              className="btn btn--primary btn--lg"
              onClick={() => { track("cta_click", { id: "final" }); onBook("final"); }}
            >
              {s.cta}
            </button>
            <p className="final-cta__reassure">{s.reassure}</p>
          </m.div>

          <m.div className="final-cta__alts" variants={child}>
            <a className="btn btn--ghost btn--sm" href={waLink()} target="_blank" rel="noopener noreferrer" onClick={() => track("cta_click", { id: "final-whatsapp" })}>
              <Icon name="whatsapp" size={15} />
              {s.altWhatsApp}
            </a>
            <a className="btn btn--ghost btn--sm" href={`mailto:${SITE.email}`} onClick={() => track("cta_click", { id: "final-email" })}>
              <Icon name="mail" size={15} />
              {s.altEmail}
            </a>
            <a className="btn btn--ghost btn--sm" href={SITE.calendar} target="_blank" rel="noopener noreferrer" onClick={() => track("cta_click", { id: "final-calendar" })}>
              <Icon name="calendar" size={15} />
              {s.altCalendar}
            </a>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
