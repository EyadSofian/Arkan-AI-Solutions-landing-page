import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getContent } from "../content/index.js";
import { track } from "./analytics.js";

const LangContext = createContext(null);

function initialLang() {
  try {
    const qs = new URLSearchParams(window.location.search);
    const fromQuery = qs.get("lang");
    if (fromQuery === "en" || fromQuery === "ar") return fromQuery;
    const stored = localStorage.getItem("arkan-lang");
    if (stored === "en" || stored === "ar") return stored;
  } catch {
    /* no-op */
  }
  return "ar"; // Arabic-first
}

/** Swap document-level metadata when the language changes (SPA SEO hygiene). */
function applyDocumentLang(lang, meta) {
  const d = document.documentElement;
  d.setAttribute("lang", lang);
  d.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  document.title = meta.title;
  const set = (sel, val) => {
    const el = document.querySelector(sel);
    if (el && val) el.setAttribute("content", val);
  };
  set('meta[name="description"]', meta.description);
  set('meta[property="og:title"]', meta.ogTitle);
  set('meta[property="og:description"]', meta.ogDescription);
  set('meta[property="og:locale"]', lang === "ar" ? "ar_EG" : "en_US");
  set('meta[property="og:locale:alternate"]', lang === "ar" ? "en_US" : "ar_EG");
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);
  const t = useMemo(() => getContent(lang), [lang]);
  const isRTL = lang === "ar";

  useEffect(() => {
    applyDocumentLang(lang, t.meta);
    try {
      localStorage.setItem("arkan-lang", lang);
      const url = new URL(window.location.href);
      if (lang === "en") url.searchParams.set("lang", "en");
      else url.searchParams.delete("lang");
      window.history.replaceState({}, "", url);
    } catch {
      /* no-op */
    }
  }, [lang, t]);

  const setLang = (next) => {
    setLangState(next);
    track("lang_toggle", { lang: next });
  };

  const value = useMemo(
    () => ({ lang, setLang, t, isRTL, dir: isRTL ? "rtl" : "ltr" }),
    [lang, t, isRTL]
  );
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useI18n must be used inside <LangProvider>");
  return ctx;
}
