import React, { useState } from 'react'
import { useTranslation } from '../LanguageContext.js'
import LanguageSwitcher from './LanguageSwitcher.jsx'

// A light, fun "who's there?" gate — not real security (the password is
// just the kid's own name), just a nice ritual before the app opens, and a
// simple way to remember whose buttons are getting tapped this session.
export default function LoginGate({ kids, onLogin }) {
  const { lang, setLang, t } = useTranslation()
  const [picked, setPicked] = useState(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [welcome, setWelcome] = useState(null)

  function submit(e) {
    e.preventDefault()
    if (!picked) return
    if (password.trim().toLowerCase() !== picked.name.trim().toLowerCase()) {
      setError(t('wrongPassword'))
      setPassword('')
      return
    }
    setError('')
    setWelcome(picked)
    setTimeout(() => onLogin(picked.id), 1400)
  }

  if (welcome) {
    return (
      <div className="login-gate">
        <div className="login-card login-welcome">
          <span className="login-welcome-icon" aria-hidden="true">🌟</span>
          <h1>{t('welcomeNameExclaim', { name: welcome.name })}</h1>
          <p>{t('welcomeMessage')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="login-gate">
      <div className="login-card">
        <LanguageSwitcher lang={lang} setLang={setLang} className="lang-switcher-corner" />
        <span className="login-moon" aria-hidden="true">☾</span>
        <h1>{t('assalamu')}</h1>
        <p className="login-question">{t('whoAreYou')}</p>

        <div className="login-kid-picker">
          {kids.map((k) => (
            <button
              key={k.id}
              type="button"
              className={`login-kid-btn ${picked?.id === k.id ? 'active' : ''}`}
              style={{ '--kid-color': k.color }}
              onClick={() => {
                setPicked(k)
                setError('')
                setPassword('')
              }}
            >
              <span className="avatar">{k.initial}</span>
              <strong>{k.name}</strong>
            </button>
          ))}
        </div>

        {picked && (
          <form className="login-form" onSubmit={submit}>
            <label htmlFor="login-password">{t('passwordHint')}</label>
            <input
              id="login-password"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('enterPasswordFor', { name: picked.name })}
            />
            {error && <p className="login-error">{error}</p>}
            <button type="submit" className="btn btn-done login-submit">
              {t('logIn')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
