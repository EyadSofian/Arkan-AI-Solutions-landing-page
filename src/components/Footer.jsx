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
    <footer className="band footer">
      <div className="container container--wide">
        <div className="footer__grid">
          <div className="footer__col footer__col--brand">
            <LogoLockup size={40} tone="band" />
            <p className="footer__tag">{f.tagline}</p>
          </div>

          <nav className="footer__col" aria-label={f.colPillars}>
            <h4>{f.colPillars}</h4>
            <ul>
              {f.pillars.map((p) => (
                <li key={p}><a href="#solutions" onClick={go("solutions")}>{p}</a></li>
              ))}
            </ul>
          </nav>

          <nav className="footer__col" aria-label={f.colCompany}>
            <h4>{f.colCompany}</h4>
            <ul>
              {f.company.map((l) => (
                <li key={l.id}><a href={`#${l.id}`} onClick={go(l.id)}>{l.label}</a></li>
              ))}
            </ul>
          </nav>

          <div className="footer__col">
            <h4>{f.colContact}</h4>
            <ul>
              <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              <li><a href={waLink()} target="_blank" rel="noopener noreferrer">{f.whatsapp}</a></li>
              <li><a href={SITE.calendar} target="_blank" rel="noopener noreferrer">{f.calendar}</a></li>
              <li>{f.locations}</li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} Arkan AI Solutions · {f.rights}</span>
          <span>{f.made}</span>
        </div>
      </div>
    </footer>
  );
}
