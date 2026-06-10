import { useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { useI18n } from "../lib/i18n.jsx";
import { track } from "../lib/analytics.js";
import { SectionHead } from "../components/ui/SectionHead.jsx";
import { Icon } from "../components/ui/Icon.jsx";
import { EASE } from "../lib/motion.js";

/**
 * Interactive "inside one Arkan system" walkthrough.
 * Proper tabs semantics: tablist + roving focus with arrow keys.
 */
export function Anatomy({ onBook }) {
  const { t, isRTL } = useI18n();
  const s = t.anatomy;
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);

  const onKeyDown = (e) => {
    const max = s.steps.length - 1;
    let next = null;
    // In RTL the "next" arrow is Left.
    const fwd = isRTL ? "ArrowLeft" : "ArrowRight";
    const bwd = isRTL ? "ArrowRight" : "ArrowLeft";
    if (e.key === fwd || e.key === "ArrowDown") next = active === max ? 0 : active + 1;
    else if (e.key === bwd || e.key === "ArrowUp") next = active === 0 ? max : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = max;
    if (next !== null) {
      e.preventDefault();
      setActive(next);
      tabRefs.current[next]?.focus();
    }
  };

  const step = s.steps[active];

  return (
    <section className="section section--line cv-auto" id="how" aria-labelledby="how-title">
      <div className="container">
        <SectionHead id="how-title" label={s.label} title={s.title} lead={s.lead} />

        <div className="anatomy">
          {/* Step list (tabs) */}
          <div role="tablist" aria-label={s.title} className="an-steps" onKeyDown={onKeyDown}>
            {s.steps.map((st, i) => (
              <button
                key={st.title}
                ref={(el) => (tabRefs.current[i] = el)}
                role="tab"
                id={`an-tab-${i}`}
                aria-selected={active === i}
                aria-controls="an-panel"
                tabIndex={active === i ? 0 : -1}
                className="an-step"
                onClick={() => {
                  setActive(i);
                  track("anatomy_step", { step: i + 1 });
                }}
              >
                <span className="an-step__num" aria-hidden="true">{i + 1}</span>
                <span>
                  <span className="an-step__t" style={{ display: "block" }}>{st.title}</span>
                  <span className="t-small">{st.short}</span>
                </span>
              </button>
            ))}
          </div>

          {/* Active panel */}
          <div className="card an-panel" role="tabpanel" id="an-panel" aria-labelledby={`an-tab-${active}`}>
            {/* Pipeline state */}
            <div className="an-pipe" aria-hidden="true">
              {s.steps.map((_, i) => (
                <span key={i} style={{ display: "contents" }}>
                  <span
                    className="an-pipe__node"
                    data-state={i < active ? "done" : i === active ? "active" : "idle"}
                  >
                    {i + 1}
                  </span>
                  {i < s.steps.length - 1 && (
                    <span className="an-pipe__bar" data-state={i < active ? "done" : "idle"} />
                  )}
                </span>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <m.div
                key={active}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{ display: "flex", flexDirection: "column", flex: 1 }}
              >
                <div className="an-msg" dir="auto">{step.msg}</div>
                <h3 className="t-h3" style={{ marginBottom: 10 }}>{step.title}</h3>
                <p className="t-body">{step.body}</p>
                <p className="an-tech t-label t-label--dim">{step.tech}</p>
              </m.div>
            </AnimatePresence>
          </div>
        </div>

        <div style={{ marginTop: 36, display: "flex", flexWrap: "wrap", gap: "12px 24px", alignItems: "center" }}>
          <p className="t-body" style={{ maxWidth: 560 }}>{s.note}</p>
          <button
            type="button"
            className="link-arrow"
            onClick={() => {
              track("cta_click", { id: "anatomy" });
              onBook("anatomy");
            }}
          >
            {s.cta}
            <Icon name="arrowFwd" size={13} flip />
          </button>
        </div>
      </div>
    </section>
  );
}
