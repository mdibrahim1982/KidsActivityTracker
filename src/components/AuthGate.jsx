import React, { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase.js'
import { DEFAULT_REWARD, DEFAULT_CURRENCY, DEFAULT_REJECT_PENALTY } from '../data/activities.js'
import { useTranslation } from '../LanguageContext.js'
import LanguageSwitcher from './LanguageSwitcher.jsx'

const CURRENCY_CHOICES = ['₹', '$', '£', '€', 'AED', 'SAR', 'PKR', 'BDT', 'MYR', 'CAD', 'AUD']

// Firebase error code -> translation key (see src/i18n.js for the actual text).
const ERROR_KEYS = {
  'auth/email-already-in-use': 'authErrEmailInUse',
  'auth/invalid-email': 'authErrInvalidEmail',
  'auth/weak-password': 'authErrWeakPassword',
  'auth/user-not-found': 'authErrUserNotFound',
  'auth/wrong-password': 'authErrWrongPassword',
  'auth/invalid-credential': 'authErrInvalidCredential',
  'auth/too-many-requests': 'authErrTooManyRequests',
}

function friendlyError(err, t) {
  const key = ERROR_KEYS[err?.code]
  if (key) return t(key)
  return err?.message || t('authErrGeneric')
}

// A real Firebase account per parent/family — this is what makes the app
// generic: any parent can sign up, and their family's data (children,
// activities, coins) is private to their own account, isolated from every
// other family's, via Firestore security rules keyed on this login.
export default function AuthGate() {
  const { lang, setLang, t } = useTranslation()
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'reset'
  const [parentName, setParentName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [parentPasscode, setParentPasscode] = useState('')
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
      // App.jsx picks up the signed-in user via onAuthStateChanged.
    } catch (err) {
      setError(friendlyError(err, t))
    } finally {
      setBusy(false)
    }
  }

  async function handleSignup(e) {
    e.preventDefault()
    setError('')
    if (!parentName.trim()) return setError(t('authErrEnterName'))
    if (parentPasscode.trim().length < 4) return setError(t('authErrParentCodeShort'))
    if (password.length < 6) return setError(t('authErrPasswordShort'))
    if (password !== confirmPassword) return setError(t('authErrPasswordMismatch'))

    setBusy(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)
      // Seed this family's Firestore document right away so it exists the
      // moment App.jsx's listener attaches (kids get added afterwards from
      // the "Manage Children" screen).
      const ref = doc(db, 'families', cred.user.uid)
      // merge:true so this can never clobber (or be clobbered by) the empty
      // starter document the app itself may create the instant sign-up
      // succeeds — whichever lands first, the parent's own choices win.
      await setDoc(
        ref,
        {
          parentName: parentName.trim(),
          parentEmail: email.trim(),
          parentPasscode: parentPasscode.trim(),
          rewardRate: DEFAULT_REWARD,
          currency,
          rejectPenalty: DEFAULT_REJECT_PENALTY,
          unlockTimes: {},
          kids: {},
        },
        { merge: true },
      )
    } catch (err) {
      setError(friendlyError(err, t))
    } finally {
      setBusy(false)
    }
  }

  async function handleReset(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    if (!email.trim()) return setError(t('authErrEnterEmailFirst'))
    setBusy(true)
    try {
      await sendPasswordResetEmail(auth, email.trim())
      setInfo(t('authResetSent'))
    } catch (err) {
      setError(friendlyError(err, t))
    } finally {
      setBusy(false)
    }
  }

  function switchMode(next) {
    setMode(next)
    setError('')
    setInfo('')
  }

  return (
    <div className="login-gate">
      <div className="login-card auth-card">
        <LanguageSwitcher lang={lang} setLang={setLang} className="lang-switcher-corner" />
        <span className="login-moon" aria-hidden="true">☾</span>
        <h1>{t('appTitle')}</h1>
        <p className="login-question">
          {mode === 'signup' ? t('authCreateAccount') : mode === 'reset' ? t('authResetPassword') : t('authWelcomeBack')}
        </p>

        {mode === 'login' && (
          <form className="login-form" onSubmit={handleLogin}>
            <label htmlFor="email">{t('emailLabel')}</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="password">{t('passwordLabel')}</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="login-error">{error}</p>}
            <button type="submit" className="btn btn-done login-submit" disabled={busy}>
              {busy ? t('loggingIn') : t('logIn')}
            </button>
            <p className="auth-switch">
              <button type="button" onClick={() => switchMode('reset')}>{t('forgotPassword')}</button>
            </p>
            <p className="auth-switch">
              {t('newHere')}{' '}
              <button type="button" onClick={() => switchMode('signup')}>{t('createFamilyAccount')}</button>
            </p>
          </form>
        )}

        {mode === 'signup' && (
          <form className="login-form" onSubmit={handleSignup}>
            <label htmlFor="parentName">{t('yourName')}</label>
            <input id="parentName" type="text" required value={parentName} onChange={(e) => setParentName(e.target.value)} />
            <label htmlFor="signupEmail">{t('emailLabel')}</label>
            <input id="signupEmail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="signupPassword">{t('passwordLabel')}</label>
            <input
              id="signupPassword"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <label htmlFor="parentPasscode">{t('parentCodeLabel')}</label>
            <input
              id="parentPasscode"
              type="text"
              required
              value={parentPasscode}
              onChange={(e) => setParentPasscode(e.target.value)}
              placeholder={t('parentCodePlaceholder')}
            />
            <label htmlFor="currency">{t('currencyForRewards')}</label>
            <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {CURRENCY_CHOICES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {error && <p className="login-error">{error}</p>}
            <button type="submit" className="btn btn-done login-submit" disabled={busy}>
              {busy ? t('creatingAccount') : t('createAccount')}
            </button>
            <p className="auth-switch">
              {t('alreadyHaveAccount')} <button type="button" onClick={() => switchMode('login')}>{t('logIn')}</button>
            </p>
          </form>
        )}

        {mode === 'reset' && (
          <form className="login-form" onSubmit={handleReset}>
            <label htmlFor="resetEmail">{t('emailLabel')}</label>
            <input id="resetEmail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            {error && <p className="login-error">{error}</p>}
            {info && <p className="auth-info">{info}</p>}
            <button type="submit" className="btn btn-done login-submit" disabled={busy}>
              {busy ? t('sendingReset') : t('sendResetEmail')}
            </button>
            <p className="auth-switch">
              <button type="button" onClick={() => switchMode('login')}>{t('backToLogin')}</button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
