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
    <section className="section section--line cv-auto" id="faq" aria-labelledby="faq-title">
      <div className="container">
        <SectionHead id="faq-title" label={s.label} title={s.title} center />
        <div className="faq-list">
          {s.items.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="faq">
                <h3 style={{ margin: 0 }}>
                  <button
                    type="button"
                    className="faq__q"
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    id={`faq-q-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    {f.q}
                    <span className="faq__chev" aria-hidden="true">
                      <Icon name="chevDown" size={17} />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <m.div
                      id={`faq-a-${i}`}
                      role="region"
                      aria-labelledby={`faq-q-${i}`}
                      className="faq__a"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <p className="faq__a-inner">{f.a}</p>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
