import React from 'react'
import { LANGUAGES, LANGUAGE_NAMES, t } from '../i18n.js'

// Three small buttons — English / தமிழ் / മലയാളം — shown wherever a person
// might land first (sign-up, kid login) and inside the app itself, so the
// language can be changed from anywhere, not just a buried settings page.
// Takes `lang` as a prop (rather than reading useTranslation() itself) so
// it still works on the very first screens, before a full provider value
// might be settled — and its own label switches immediately with `lang`.
export default function LanguageSwitcher({ lang, setLang, className }) {
  return (
    <div className={`lang-switcher ${className || ''}`} role="group" aria-label={t(lang, 'language')}>
      {LANGUAGES.map((code) => (
        <button
          key={code}
          type="button"
          className={`lang-btn ${lang === code ? 'active' : ''}`}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
        >
          {LANGUAGE_NAMES[code]}
        </button>
      ))}
    </div>
  )
}
