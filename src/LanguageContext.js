import { createContext, useContext } from 'react'
import { LANGUAGES } from './i18n.js'

export const LANG_STORAGE_KEY = 'kidsTracker:lang'

export function loadLang() {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY)
    if (saved && LANGUAGES.includes(saved)) return saved
  } catch (e) {
    // ignore — default below
  }
  return 'en'
}

export function saveLang(lang) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang)
  } catch (e) {
    // ignore — language just won't be remembered next visit
  }
}

// { lang, setLang, t } — a per-device display-language preference (kept in
// localStorage, NOT synced to the family's cloud data, since different
// people on different devices may want different languages: a dad on his
// phone in Tamil, a kid on a tablet in English). t(key, vars) looks the key
// up in src/i18n.js for the current language, falling back to English,
// then to the key itself if truly missing — see i18n.js for tActivity(),
// tCategory() and tTip(), the equivalents for activity data.
//
// No JSX in this file on purpose (see CurrencyContext.js): the provider is
// used directly as <LanguageContext.Provider value={...}> in App.jsx,
// which already computes `lang`/`setLang` as part of its own state.
export const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
})

export function useTranslation() {
  return useContext(LanguageContext)
}
