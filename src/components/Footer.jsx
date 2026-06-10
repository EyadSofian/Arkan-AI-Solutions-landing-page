import { useI18n } from "../lib/i18n.jsx";
import { SITE, waLink } from "../config.js";
import { LogoLockup } from "./Logo.jsx";

export function Footer() {
  const { t } = useI18n();
  const f = t.footer;
  const year = new Date().getFullYear();

  const go = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__col">
            <LogoLockup size={44} />
            <p className="t-body" style={{ maxWidth: 320, marginTop: 20 }}>{f.tagline}</p>
          </div>

          <nav className="footer__col" aria-label={f.colPillars}>
            <h3 className="t-label">{f.colPillars}</h3>
            <ul>
              {f.pillars.map((p) => (
                <li key={p}>
                  <a href="#solutions" onClick={go("solutions")}>{p}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer__col" aria-label={f.colCompany}>
            <h3 className="t-label">{f.colCompany}</h3>
            <ul>
              {f.company.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} onClick={go(l.id)}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__col">
            <h3 className="t-label">{f.colContact}</h3>
            <ul>
              <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              <li><a href={waLink()} target="_blank" rel="noopener noreferrer">{f.whatsapp}</a></li>
              <li><a href={SITE.calendar} target="_blank" rel="noopener noreferrer">{f.calendar}</a></li>
              <li><span className="t-small">{f.locations}</span></li>
            </ul>
          </div>
        </div>

        <div className="footer__bar">
          <span className="t-small">© {year} Arkan AI Solutions · {f.rights}</span>
          <span className="t-small">{f.made}</span>
        </div>
      </div>
    </footer>
  );
}
