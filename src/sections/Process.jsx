import { m } from "motion/react";
import { useI18n } from "../lib/i18n.jsx";
import { SectionHead } from "../components/ui/SectionHead.jsx";
import { Icon } from "../components/ui/Icon.jsx";
import { stagger, child, VIEW } from "../lib/motion.js";

export function Process() {
  const { t, lang } = useI18n();
  const s = t.process;
  const deliverableLabel = lang === "en" ? "Deliverable" : "المخرَج";

  return (
    <section className="section" id="process" aria-labelledby="process-title">
      <div className="container container--wide">
        <SectionHead id="process-title" label={s.label} title={s.title} lead={s.lead} />
        <m.ol className="process-grid" variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={VIEW} style={{ listStyle: "none" }}>
          {s.stages.map((st) => (
            <m.li key={st.num} className="stage" variants={child}>
              <div className="stage__num num">{st.num}</div>
              <h3 className="stage__name">{st.name}</h3>
              <p className="stage__desc">{st.desc}</p>
              <div className="stage__deliver">
                <Icon name="check" size={15} strokeWidth={2.5} />
                <span><strong style={{ color: "var(--ink)", fontWeight: 600 }}>{deliverableLabel}:</strong> {st.deliverable}</span>
              </div>
              <span className="chip stage__time">{st.time}</span>
            </m.li>
          ))}
        </m.ol>
      </div>
    </section>
  );
}
