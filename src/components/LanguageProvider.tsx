/**
 * SwarSaarthi — Language Context Provider
 *
 * Provides bilingual (English/Hindi) UI support throughout the app.
 * Wraps the i18n strings dictionary and exposes:
 *   - `lang`: current language ('en' | 'hi')
 *   - `t`: the translation strings object for the current language
 *   - `toggleLang`: function to switch between English and Hindi
 *
 * Usage in any client component:
 *   const { t, lang, toggleLang } = useLanguage();
 *   <h1>{t.heroTitle}</h1>
 */

"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { i18n, type I18nStrings } from "@/lib/i18n";
import type { UILanguage } from "@/types";

interface LanguageContextValue {
  lang: UILanguage;
  t: I18nStrings;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  t: i18n.en,
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<UILanguage>("en");

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "hi" : "en"));
  }, []);

  // t reference is stable per lang (i18n is a const object), but we memoise the
  // whole context value so consumers don't re-render when parent re-renders
  // for unrelated reasons (e.g. practice word index changing below).
  const t = i18n[lang];
  const value = useMemo<LanguageContextValue>(
    () => ({ lang, t, toggleLang }),
    [lang, t, toggleLang],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
