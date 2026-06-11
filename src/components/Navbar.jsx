import { useEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { useI18n } from "../lib/i18n.jsx";
import { useTheme } from "../lib/theme.jsx";
import { track } from "../lib/analytics.js";
import { LogoLockup } from "./Logo.jsx";
import { Icon } from "./ui/Icon.jsx";
import { EASE } from "../lib/motion.js";

export function Navbar({ onBook }) {
  const { t, lang, setLang } = useI18n();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Close mobile menu on Escape; lock scroll while open.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const go = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toTop = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header>
      <nav className="nav" data-scrolled={scrolled} aria-label="Main">
        <div className="container container--wide">
          <div className="nav__inner">
            <a href="#top" onClick={toTop} aria-label="Arkan AI Solutions">
              <LogoLockup size={32} />
            </a>

            <div className="nav__links">
              {t.nav.links.map((l) => (
                <a
                  key={l.id}
                  className="nav__link"
                  href={`#${l.id}`}
                  onClick={(e) => { e.preventDefault(); go(l.id); }}
                >
                  {l.label}
                </a>
              ))}
            </div>

            <div className="nav__actions">
              <button type="button" className="icon-btn" onClick={toggle} aria-label={t.nav.themeToggle}>
                <Icon name={theme === "dark" ? "sun" : "moon"} size={16} />
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                aria-label={t.nav.langToggle}
                style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", fontWeight: 600 }}
              >
                {t.nav.langShort}
              </button>
              <span className="nav__sep" aria-hidden="true" />
              <button
                type="button"
                className="btn btn--primary btn--sm nav__cta-desktop"
                onClick={() => { track("cta_click", { id: "nav" }); onBook("nav"); }}
              >
                {t.nav.cta}
              </button>
              <button
                type="button"
                className="icon-btn nav__burger"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? t.nav.menuClose : t.nav.menuOpen}
                aria-expanded={menuOpen}
                aria-controls="nav-mobile"
              >
                <Icon name={menuOpen ? "close" : "menu"} size={18} />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <m.div
              id="nav-mobile"
              className="nav__mobile"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              {t.nav.links.map((l) => (
                <a key={l.id} href={`#${l.id}`} onClick={(e) => { e.preventDefault(); go(l.id); }}>
                  {l.label}
                </a>
              ))}
              <button
                type="button"
                className="btn btn--primary btn--block"
                onClick={() => { setMenuOpen(false); track("cta_click", { id: "mobile-menu" }); onBook("mobile-menu"); }}
              >
                {t.nav.cta}
              </button>
            </m.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
