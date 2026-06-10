import { useEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { useI18n } from "../lib/i18n.jsx";
import { useTheme } from "../lib/theme.jsx";
import { track } from "../lib/analytics.js";
import { LogoLockup } from "./Logo.jsx";
import { Icon } from "./ui/Icon.jsx";
import { Modal } from "./ui/Modal.jsx";

export function Navbar({ onBook }) {
  const { t, lang, setLang } = useI18n();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const go = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header>
        <nav className="nav" data-scrolled={scrolled} aria-label="Main">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{ textDecoration: "none" }}
            aria-label="Arkan AI Solutions"
          >
            <LogoLockup size={34} />
          </a>

          <div className="nav__links">
            {t.nav.links.map((l) => (
              <a
                key={l.id}
                className="nav__link"
                href={`#${l.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(l.id);
                }}
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="nav__actions">
            <button type="button" className="icon-btn" onClick={toggle} aria-label={t.nav.themeToggle}>
              <Icon name={theme === "dark" ? "sun" : "moon"} size={15} />
            </button>
            <button
              type="button"
              className="icon-btn lang-btn"
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              aria-label={t.nav.langToggle}
            >
              {t.nav.langShort}
            </button>
            <button
              type="button"
              className="btn btn--primary btn--sm nav__cta"
              onClick={() => {
                track("cta_click", { id: "nav" });
                onBook("nav");
              }}
            >
              {t.nav.cta}
            </button>
            <button
              type="button"
              className="icon-btn burger"
              onClick={() => setMenuOpen(true)}
              aria-label={t.nav.menuOpen}
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
            >
              <Icon name="menu" size={18} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <MobileMenu
            t={t}
            onClose={() => setMenuOpen(false)}
            onNavigate={go}
            onBook={() => {
              setMenuOpen(false);
              onBook("mobile-menu");
            }}
            themeProps={{ theme, toggle }}
            langProps={{ lang, setLang }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function MobileMenu({ t, onClose, onNavigate, onBook, themeProps, langProps }) {
  // Reuse Modal's a11y plumbing but render as a full-screen sheet.
  return (
    <Modal onClose={onClose} labelledBy="mmenu-title" closeLabel={t.nav.menuClose} maxWidth="100%">
      <div className="mmenu" style={{ position: "static", height: "100%" }}>
        <div className="mmenu__top">
          <span id="mmenu-title">
            <LogoLockup size={32} />
          </span>
        </div>
        <div className="mmenu__links">
          {t.nav.links.map((l, i) => (
            <m.a
              key={l.id}
              className="mmenu__link"
              href={`#${l.id}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 + i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(l.id);
              }}
            >
              {l.label}
              <span className="t-label t-label--dim">0{i + 1}</span>
            </m.a>
          ))}
        </div>
        <div className="mmenu__foot">
          <button type="button" className="btn btn--primary" onClick={onBook}>
            {t.nav.cta}
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className="icon-btn" onClick={themeProps.toggle} aria-label={t.nav.themeToggle}>
              <Icon name={themeProps.theme === "dark" ? "sun" : "moon"} size={15} />
            </button>
            <button
              type="button"
              className="icon-btn lang-btn"
              onClick={() => {
                langProps.setLang(langProps.lang === "ar" ? "en" : "ar");
              }}
              aria-label={t.nav.langToggle}
            >
              {t.nav.langShort}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
