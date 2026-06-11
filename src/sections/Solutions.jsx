import { m } from "motion/react";
import { useI18n } from "../lib/i18n.jsx";
import { track } from "../lib/analytics.js";
import { SectionHead } from "../components/ui/SectionHead.jsx";
import { Icon } from "../components/ui/Icon.jsx";
import { stagger, child, VIEW } from "../lib/motion.js";

export function Solutions({ onBook }) {
  const { t } = useI18n();
  const s = t.solutions;

  return (
    <section className="section section--sunk" id="solutions" aria-labelledby="solutions-title">
      <div className="container">
        <SectionHead id="solutions-title" label={s.label} title={s.title} lead={s.lead} />
        <m.div className="pillars" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={VIEW}>
          {s.items.map((p) => (
            <m.article key={p.num} className="card card--hover pillar corners" variants={child}>
              <span className="corner-mark tl" aria-hidden="true" />
              <span className="corner-mark tr" aria-hidden="true" />
              <span className="corner-mark bl" aria-hidden="true" />
              <span className="corner-mark br" aria-hidden="true" />

              <div className="pillar__top">
                <span className="pillar__num num" aria-hidden="true">{p.num}</span>
                <h3 className="t-h3 pillar__name">{p.name}</h3>
              </div>

              <p className="pillar__outcome">{p.outcome}</p>
              <p className="pillar__desc">{p.desc}</p>

              <ul className="pillar__list">
                {p.typical.map((item) => (
                  <li key={item}>
                    <Icon name="check" size={14} strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="pillar__tech">
                {p.tech.map((tech) => (
                  <span key={tech} className="chip">{tech}</span>
                ))}
              </div>

              <div className="pillar__foot">
                <button
                  type="button"
                  className="link-inline"
                  onClick={() => { track("cta_click", { id: `pillar-${p.num}` }); onBook(`pillar-${p.num}`); }}
                >
                  {s.discuss}
                  <Icon name="arrowUpRight" size={14} />
                </button>
              </div>
            </m.article>
          ))}
        </m.div>
      </div>
    </section>
  );
}
