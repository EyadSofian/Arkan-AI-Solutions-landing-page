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
    <section className="section section--line final" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <m.div variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={VIEW}>
          <m.p className="t-label" variants={child} style={{ marginBottom: 18 }}>
            {s.label}
          </m.p>
          <m.h2 className="t-h2" id="contact-title" variants={child} style={{ maxWidth: 640, marginInline: "auto" }}>
            {s.title}
          </m.h2>
          <m.p className="t-lead" variants={child} style={{ maxWidth: 580, margin: "20px auto 36px" }}>
            {s.sub}
          </m.p>
          <m.div variants={child}>
            <button
              type="button"
              className="btn btn--primary"
              style={{ minHeight: 56, paddingInline: 36 }}
              onClick={() => {
                track("cta_click", { id: "final" });
                onBook("final");
              }}
            >
              {s.cta}
              <Icon name="arrowFwd" size={15} flip className="ic--fwd" />
            </button>
            <p className="t-small" style={{ marginTop: 14 }}>{s.reassure}</p>
          </m.div>

          <m.div className="final__alt" variants={child}>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("cta_click", { id: "final-whatsapp" })}
            >
              <Icon name="whatsapp" size={15} />
              {s.altWhatsApp}
            </a>
            <a href={`mailto:${SITE.email}`} onClick={() => track("cta_click", { id: "final-email" })}>
              <Icon name="mail" size={15} />
              {s.altEmail}
            </a>
            <a
              href={SITE.calendar}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("cta_click", { id: "final-calendar" })}
            >
              <Icon name="calendar" size={15} />
              {s.altCalendar}
            </a>
          </m.div>
        </m.div>
      </div>
    </section>
  );
}
