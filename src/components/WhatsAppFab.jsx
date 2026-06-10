import { useEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { useI18n } from "../lib/i18n.jsx";
import { waLink } from "../config.js";
import { track } from "../lib/analytics.js";
import { Icon } from "./ui/Icon.jsx";

/** Low-friction WhatsApp entry. Appears after the hero so it never
 *  competes with the primary CTA. Static — no looping pulse. */
export function WhatsAppFab() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const h = () => setShow(window.scrollY > window.innerHeight * 0.7);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <m.a
          className="fab"
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.fab.aria}
          initial={{ opacity: 0, scale: 0.6, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 14 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => track("cta_click", { id: "fab-whatsapp" })}
        >
          <Icon name="whatsapp" size={26} />
        </m.a>
      )}
    </AnimatePresence>
  );
}
