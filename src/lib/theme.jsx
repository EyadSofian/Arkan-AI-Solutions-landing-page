import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { track } from "./analytics.js";

const ThemeContext = createContext(null);

function initialTheme() {
  try {
    const stored = localStorage.getItem("arkan-theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* no-op */
  }
  return "dark"; // brand rule: dark navy is the primary surface
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem("arkan-theme", theme);
    } catch {
      /* no-op */
    }
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggle: () => {
        setThemeState((cur) => {
          const next = cur === "dark" ? "light" : "dark";
          track("theme_toggle", { theme: next });
          return next;
        });
      },
    }),
    [theme]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
