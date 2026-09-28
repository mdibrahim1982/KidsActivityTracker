import React, { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase.js'
import { DEFAULT_REWARD, DEFAULT_CURRENCY, DEFAULT_REJECT_PENALTY } from '../data/activities.js'

const CURRENCY_CHOICES = ['₹', '$', '£', '€', 'AED', 'SAR', 'PKR', 'BDT', 'MYR', 'CAD', 'AUD']

const ERROR_MESSAGES = {
  'auth/email-already-in-use': 'An account already exists for that email — try logging in instead.',
  'auth/invalid-email': "That doesn't look like a valid email address.",
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/user-not-found': 'No account found for that email — sign up instead?',
  'auth/wrong-password': 'Incorrect password. Try again, or reset it below.',
  'auth/invalid-credential': "Email or password doesn't match our records.",
  'auth/too-many-requests': 'Too many attempts — please wait a bit and try again.',
}

function friendlyError(err) {
  return ERROR_MESSAGES[err?.code] || err?.message || 'Something went wrong. Please try again.'
}

// A real Firebase account per parent/family — this is what makes the app
// generic: any parent can sign up, and their family's data (children,
// activities, coins) is private to their own account, isolated from every
// other family's, via Firestore security rules keyed on this login.
export default function AuthGate() {
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
      setError(friendlyError(err))
    } finally {
      setBusy(false)
    }
  }

  async function handleSignup(e) {
    e.preventDefault()
    setError('')
    if (!parentName.trim()) return setError('Please enter your name.')
    if (parentPasscode.trim().length < 4) return setError('Please choose a parent code at least 4 characters long.')
    if (password.length < 6) return setError('Password should be at least 6 characters.')
    if (password !== confirmPassword) return setError("Passwords don't match.")

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
      setError(friendlyError(err))
    } finally {
      setBusy(false)
    }
  }

  async function handleReset(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    if (!email.trim()) return setError('Enter the email on your account first.')
    setBusy(true)
    try {
      await sendPasswordResetEmail(auth, email.trim())
      setInfo('Password reset email sent — check your inbox.')
    } catch (err) {
      setError(friendlyError(err))
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
        <span className="login-moon" aria-hidden="true">☾</span>
        <h1>Kids Productivity Tracker</h1>
        <p className="login-question">
          {mode === 'signup' ? 'Create your family account' : mode === 'reset' ? 'Reset your password' : 'Welcome back'}
        </p>

        {mode === 'login' && (
          <form className="login-form" onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="login-error">{error}</p>}
            <button type="submit" className="btn btn-done login-submit" disabled={busy}>
              {busy ? 'Logging in…' : 'Log In'}
            </button>
            <p className="auth-switch">
              <button type="button" onClick={() => switchMode('reset')}>Forgot password?</button>
            </p>
            <p className="auth-switch">
              New here?{' '}
              <button type="button" onClick={() => switchMode('signup')}>Create a family account</button>
            </p>
          </form>
        )}

        {mode === 'signup' && (
          <form className="login-form" onSubmit={handleSignup}>
            <label htmlFor="parentName">Your name</label>
            <input id="parentName" type="text" required value={parentName} onChange={(e) => setParentName(e.target.value)} />
            <label htmlFor="signupEmail">Email</label>
            <input id="signupEmail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="signupPassword">Password</label>
            <input
              id="signupPassword"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <label htmlFor="parentPasscode">Parent code (for day-review &amp; settings — kids won't see this)</label>
            <input
              id="parentPasscode"
              type="text"
              required
              value={parentPasscode}
              onChange={(e) => setParentPasscode(e.target.value)}
              placeholder="e.g. a 4+ digit code"
            />
            <label htmlFor="currency">Currency for rewards</label>
            <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {CURRENCY_CHOICES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {error && <p className="login-error">{error}</p>}
            <button type="submit" className="btn btn-done login-submit" disabled={busy}>
              {busy ? 'Creating account…' : 'Create Account'}
            </button>
            <p className="auth-switch">
              Already have an account? <button type="button" onClick={() => switchMode('login')}>Log in</button>
            </p>
          </form>
        )}

        {mode === 'reset' && (
          <form className="login-form" onSubmit={handleReset}>
            <label htmlFor="resetEmail">Email</label>
            <input id="resetEmail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            {error && <p className="login-error">{error}</p>}
            {info && <p className="auth-info">{info}</p>}
            <button type="submit" className="btn btn-done login-submit" disabled={busy}>
              {busy ? 'Sending…' : 'Send Reset Email'}
            </button>
            <p className="auth-switch">
              <button type="button" onClick={() => switchMode('login')}>Back to log in</button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
