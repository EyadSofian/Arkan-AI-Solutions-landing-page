import { useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { useI18n } from "../lib/i18n.jsx";
import { SectionHead } from "../components/ui/SectionHead.jsx";
import { Icon } from "../components/ui/Icon.jsx";

export function Faq() {
  const { t } = useI18n();
  const s = t.faq;
  const [open, setOpen] = useState(0);

  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <div className="container">
        <div className="faq__grid">
          <SectionHead id="faq-title" label={s.label} title={s.title} />

          <div className="acc">
            {s.items.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q} className="acc__item">
                  <h3 style={{ margin: 0 }}>
                    <button
                      type="button"
                      className="acc__btn"
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${i}`}
                      id={`faq-q-${i}`}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                    >
                      {f.q}
                      <span className="acc__icon" aria-hidden="true">
                        <Icon name="chevDown" size={18} />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <m.div
                        id={`faq-a-${i}`}
                        role="region"
                        aria-labelledby={`faq-q-${i}`}
                        className="acc__panel"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <p className="acc__panel-inner">{f.a}</p>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
