import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  DEFAULT_REWARD,
  DEFAULT_CURRENCY,
  DEFAULT_REJECT_PENALTY,
  DEFAULT_ACTIVITY_IDS,
  ALL_ACTIVITIES,
  CATEGORY_COLORS,
  CHILD_COLORS,
  createChildRecord,
  newChildId,
  createCustomActivity,
  resolveActivities,
  getActivityById,
  rewardFor,
  todayKey,
  weekKey,
  monthKey,
  deadlineDate,
  hasReachedTime,
  formatTimeLabel,
  blankDay,
  blankWeek,
  withAllActivities,
  getCategoryTip,
} from './data/activities.js'
import WeeksView from './components/WeeksView.jsx'
import PasscodeModal from './components/PasscodeModal.jsx'
import DayReviewModal from './components/DayReviewModal.jsx'
import LoginGate from './components/LoginGate.jsx'
import ParentWeeklyPanel from './components/ParentWeeklyPanel.jsx'
import AuthGate from './components/AuthGate.jsx'
import ManageChildren from './components/ManageChildren.jsx'
import ActivityManager, { RewardInput } from './components/ActivityManager.jsx'
import { CurrencyContext, useCurrency } from './CurrencyContext.js'
import { auth, db } from './firebase.js'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc, onSnapshot, setDoc, updateDoc, deleteField } from 'firebase/firestore'

const LOGIN_STORAGE_KEY = 'kidsTracker:loggedInKid'
const TIP_MS = 4000
// Each signed-in parent's whole family lives in its own Firestore document,
// keyed by their Firebase Auth uid — see README.md for the security rules
// that keep one family's document private from every other family's.
function familyDocPath(uid) {
  return ['families', uid]
}
// Where this app's data used to live, back when it only supported one
// hardcoded family. Only used by the one-time "Import that data" button on
// a brand new account — see importLegacyData() below.
const LEGACY_DOC_PATH = ['app', 'state']
const LEGACY_CHILD_META = {
  muaadh: { name: 'Muaadh', age: '', grade: '7th Grade' },
  katheejah: { name: 'Khateejah', age: '', grade: '5th Grade' },
}

// Local development (npm run dev, previewing on localhost/127.0.0.1) never
// touches Firebase Auth or the shared Firestore data — it signs in as a
// fixed local-only "account" and stays on this machine's localStorage
// only, so testing locally can't overwrite or interfere with any real
// family's cloud data. Only a real deployed origin (e.g. the GitHub Pages
// URL) uses real accounts and the cloud.
//
// To try real sign-up / cloud sync from localhost on purpose, create a file
// named .env.local containing  VITE_FORCE_CLOUD=true  and restart `npm run dev`.
const IS_LOCAL_DEV =
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname) &&
  import.meta.env?.VITE_FORCE_CLOUD !== 'true'
const LOCAL_DEV_UID = 'local-dev'

// v8: the local cache is now stored per account (so two parents sharing one
// browser never see each other's children), and each child carries its own
// activity list + per-activity rewards.
function storageKey(uid) {
  return `kidsTracker:v8:${uid}`
}
const FLIGHT_MS = 650

// Fills in anything an older save (or a brand-new account) might not have.
function normalizeState(raw) {
  const s = { ...(raw || {}) }
  if (!s.kids || typeof s.kids !== 'object') s.kids = {}
  if (s.rewardRate == null) s.rewardRate = DEFAULT_REWARD
  if (!s.unlockTimes || typeof s.unlockTimes !== 'object') s.unlockTimes = {}
  if (!s.customActivities || typeof s.customActivities !== 'object') s.customActivities = {}
  if (s.parentPasscode == null) s.parentPasscode = ''
  return s
}

function loadState(uid) {
  try {
    const raw = localStorage.getItem(storageKey(uid))
    if (raw) return normalizeState(JSON.parse(raw))
  } catch (e) {
    console.error('Could not read saved data', e)
  }
  return normalizeState({
    // Local dev only — a real family sets their own during Sign Up.
    parentPasscode: IS_LOCAL_DEV ? 'devmode' : '',
  })
}

// Migrate data saved by an older version of the app (no `debt` field yet).
function ensureDebtField(kidData) {
  return kidData.debt == null ? { ...kidData, debt: 0 } : kidData
}

function saveState(uid, state) {
  try {
    localStorage.setItem(storageKey(uid), JSON.stringify(state))
  } catch (e) {
    console.error('Could not save data', e)
  }
}

// A child's ordered, resolved activity list. Pass a catalog (see
// makeCatalog below) so a family's own custom activities resolve too —
// without one, only the built-in defaults + suggestion library resolve.
function actsOf(kid, catalog) {
  return catalog ? catalog.resolve(kid?.activityIds) : resolveActivities(kid?.activityIds)
}

// Merges a family's custom activities on top of the built-in catalog, so
// the rest of the app can look activities up by id (or resolve a child's
// activityIds) without caring which list an id came from.
function makeCatalog(customList) {
  // Custom activities first, so a newly created one shows up at the top of
  // the suggestions panel (under Recommended) instead of buried below the
  // whole built-in library.
  const list = [...customList, ...ALL_ACTIVITIES]
  const byId = {}
  list.forEach((a) => {
    byId[a.id] = a
  })
  return {
    list,
    getById: (id) => byId[id] || null,
    resolve: (ids) => {
      const use = Array.isArray(ids) && ids.length ? ids : DEFAULT_ACTIVITY_IDS
      return use.map((id) => byId[id]).filter(Boolean)
    },
  }
}

// Closing a day only turns leftover "pending" rows into "missed" —
// coins are already credited the moment each activity is marked done.
function closeDay(day) {
  const activities = { ...day.activities }
  Object.keys(activities).forEach((id) => {
    if (activities[id].status === 'pending') activities[id] = { ...activities[id], status: 'missed' }
  })
  return { ...day, activities, locked: true }
}

function ensureToday(kidDataIn, todayId, catalog) {
  const kidData = ensureDebtField(kidDataIn)
  const acts = actsOf(kidData, catalog)
  const days = { ...(kidData.days || {}) }
  const weeks = { ...(kidData.weeks || {}) }

  // Any earlier day left open is closed off (pending -> missed).
  Object.keys(days).forEach((dateId) => {
    if (dateId !== todayId && !days[dateId].locked) {
      days[dateId] = closeDay(days[dateId])
    }
  })

  days[todayId] = days[todayId] ? withAllActivities(days[todayId], acts) : blankDay(acts)

  return { ...kidData, days, weeks }
}

// --- Cloud sync helpers ----------------------------------------------------
// The family document holds top-level settings plus one entry per child
// under `kids`. Writes send only the parts that changed (and only the
// child that changed), so two children tapping on two different devices at
// the same moment don't overwrite each other.
function syncParts(s) {
  const { kids, ...top } = s
  const topJson = {}
  Object.keys(top).forEach((k) => {
    topJson[k] = JSON.stringify(top[k])
  })
  const kidsJson = {}
  Object.keys(kids || {}).forEach((id) => {
    kidsJson[id] = JSON.stringify(kids[id])
  })
  return { top: topJson, kids: kidsJson }
}

function samePart(a, b) {
  const ak = Object.keys(a)
  if (ak.length !== Object.keys(b).length) return false
  return ak.every((k) => a[k] === b[k])
}

function sameParts(a, b) {
  return samePart(a.top, b.top) && samePart(a.kids, b.kids)
}

// What must be sent to the cloud so it matches `state`, given what it is
// already known to hold (`synced`). Pure so it can be tested on its own.
// `del` produces the "delete this field" marker (Firestore's deleteField).
function computeCloudUpdate(state, synced, del) {
  const nowParts = syncParts(state)
  const update = {}
  Object.keys(nowParts.top).forEach((k) => {
    if (nowParts.top[k] !== synced.top[k]) update[k] = cleanForCloud(state[k])
  })
  Object.keys(synced.top).forEach((k) => {
    if (!(k in nowParts.top)) update[k] = del()
  })
  Object.keys(nowParts.kids).forEach((id) => {
    if (nowParts.kids[id] !== synced.kids[id]) update[`kids.${id}`] = cleanForCloud(state.kids[id])
  })
  Object.keys(synced.kids).forEach((id) => {
    if (!(id in nowParts.kids)) update[`kids.${id}`] = del()
  })
  return { update, nowParts }
}

// Firestore rejects `undefined` values; a JSON round-trip strips them.
function cleanForCloud(v) {
  return JSON.parse(JSON.stringify(v))
}

// Turns a backup file into this app's current shape. Accepts today's format
// and the original single-family format (children with no `meta`). Only
// data fields are taken — never the parent code or account details.
function importFromBackup(parsed, prev) {
  const kids = {}
  Object.entries(parsed.kids || {}).forEach(([id, k], i) => {
    if (k && k.meta) {
      kids[id] = k
      return
    }
    const guess = LEGACY_CHILD_META[id] || { name: id, age: '', grade: '' }
    kids[id] = {
      meta: {
        name: guess.name,
        age: guess.age,
        grade: guess.grade,
        color: CHILD_COLORS[i % CHILD_COLORS.length],
        initial: guess.name.charAt(0).toUpperCase(),
      },
      activityIds: DEFAULT_ACTIVITY_IDS,
      activityRewards: {},
      days: (k && k.days) || {},
      weeks: (k && k.weeks) || {},
      debt: (k && k.debt) || 0,
    }
  })
  const next = { ...prev, kids }
  ;['rewardRate', 'currency', 'rejectPenalty', 'unlockTimes'].forEach((f) => {
    if (parsed[f] != null) next[f] = parsed[f]
  })
  return next
}

// Signed-in shell: figures out who (if anyone) is signed in, then hands the
// whole app to FamilyApp — keyed by account, so switching accounts always
// starts from that account's own data and never leaks the previous one's.
export default function App() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    if (IS_LOCAL_DEV) {
      setUser({ uid: LOCAL_DEV_UID })
      setAuthLoading(false)
      return undefined
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthLoading(false)
    })
  }, [])

  function handleSignOut(uid) {
    try {
      sessionStorage.removeItem(LOGIN_STORAGE_KEY)
    } catch (e) {
      // ignore
    }
    if (IS_LOCAL_DEV) return
    // Wipe this account's local copy so the next person to use this device
    // can never see it.
    try {
      localStorage.removeItem(storageKey(uid))
    } catch (e) {
      // ignore
    }
    signOut(auth).catch((e) => console.error('Sign out failed', e))
  }

  if (authLoading) {
    return (
      <div className="login-gate">
        <div className="login-card">
          <span className="login-moon" aria-hidden="true">☾</span>
          <h1>Kids Productivity Tracker</h1>
          <p className="login-question">Loading…</p>
        </div>
      </div>
    )
  }

  if (!user) return <AuthGate />

  return <FamilyApp key={user.uid} user={user} onSignOut={() => handleSignOut(user.uid)} />
}

function FamilyApp({ user, onSignOut }) {
  const uid = user.uid
  const [state, setState] = useState(() => loadState(uid))
  const [loggedInKid, setLoggedInKid] = useState(() => {
    try {
      return sessionStorage.getItem(LOGIN_STORAGE_KEY) || null
    } catch (e) {
      return null
    }
  })
  const [activeKid, setActiveKid] = useState(() => loggedInKid || null)
  const [now, setNow] = useState(new Date())
  const [flights, setFlights] = useState([])
  const [tip, setTip] = useState(null) // { text, key }
  const [view, setView] = useState('today') // 'today' | 'weeks' | 'parent'
  const [parentSection, setParentSection] = useState('overview') // 'overview' | 'activities' | 'settings'
  const [viewMonth, setViewMonth] = useState(monthKey(new Date()))
  const [pendingAction, setPendingAction] = useState(null) // { title, message, run }
  const [reviewOpen, setReviewOpen] = useState(false)
  const [parentUnlocked, setParentUnlocked] = useState(false)
  const [manageChildrenOpen, setManageChildrenOpen] = useState(false)
  const [cloudStatus, setCloudStatus] = useState(IS_LOCAL_DEV ? 'local' : 'connecting') // 'connecting' | 'synced' | 'offline' | 'local'
  const [showScrollTop, setShowScrollTop] = useState(false)
  const bucketRefs = useRef({})
  const importInputRef = useRef(null)
  const stateRef = useRef(state)
  stateRef.current = state
  const syncedRef = useRef({ top: {}, kids: {} }) // what the cloud is known to hold
  const cloudReadyRef = useRef(false)
  const firstSnapshotRef = useRef(true)

  const todayId = todayKey(now)
  const weekId = weekKey(now)
  const rate = state.rewardRate ?? DEFAULT_REWARD
  const currency = state.currency || DEFAULT_CURRENCY
  const unlockTimes = state.unlockTimes || {}
  const parentPasscode = state.parentPasscode || ''
  // Family's own custom activities layered onto the built-in catalog — see
  // makeCatalog. Recomputed only when the custom list actually changes.
  const customActivities = state.customActivities || {}
  const customList = useMemo(() => Object.values(customActivities), [customActivities])
  const catalog = useMemo(() => makeCatalog(customList), [customList])

  // Every child, as a plain array with everything the UI needs (id, name,
  // age, grade, color, initial) — the source of truth for a child's
  // profile lives in Firestore/localStorage state, not in the source code,
  // which is what makes this app usable by any family.
  const dynamicKids = useMemo(
    () =>
      Object.entries(state.kids || {}).map(([id, k]) => ({
        id,
        name: k.meta?.name || 'Child',
        age: k.meta?.age ?? '',
        grade: k.meta?.grade || '',
        color: k.meta?.color || CHILD_COLORS[0],
        initial: k.meta?.initial || (k.meta?.name || '?').charAt(0).toUpperCase(),
      })),
    [state.kids],
  )

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // Shows a "back to top" button once the page has been scrolled down a
  // bit — this page can get long (activities + suggestions + history).
  useEffect(() => {
    function onScroll() {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleParentLogout() {
    setLoggedInKid(null)
    setParentUnlocked(false)
    onSignOut()
  }

  // --- Manage children (add/edit/remove) ------------------------------
  function addChild({ name, age, grade }) {
    setState((prev) => {
      const id = newChildId()
      const colorIndex = Object.keys(prev.kids || {}).length
      return { ...prev, kids: { ...prev.kids, [id]: createChildRecord({ name, age, grade }, colorIndex) } }
    })
  }

  function editChild(id, { name, age, grade }) {
    setState((prev) => {
      const kid = prev.kids[id]
      if (!kid) return prev
      return {
        ...prev,
        kids: {
          ...prev.kids,
          [id]: {
            ...kid,
            meta: {
              ...kid.meta,
              name: name.trim(),
              age: age ?? '',
              grade: (grade || '').trim(),
              initial: name.trim().charAt(0).toUpperCase() || kid.meta?.initial || '?',
            },
          },
        },
      }
    })
  }

  function removeChild(id) {
    setState((prev) => {
      const nextKids = { ...prev.kids }
      delete nextKids[id]
      return { ...prev, kids: nextKids }
    })
    if (activeKid === id) setActiveKid(null)
    if (loggedInKid === id) handleLogout()
  }

  // --- Each child's activities & rewards (see ActivityManager.jsx) ------
  function updateActiveKid(fn) {
    setState((prev) => {
      const kid = prev.kids[activeKid]
      if (!kid) return prev
      const nextKid = fn(kid)
      if (nextKid === kid) return prev
      return { ...prev, kids: { ...prev.kids, [activeKid]: nextKid } }
    })
  }

  function addActivityToKid(activityId) {
    if (!getActivityById(activityId)) return
    updateActiveKid((kid) => {
      const ids = kid.activityIds?.length ? kid.activityIds : DEFAULT_ACTIVITY_IDS
      if (ids.includes(activityId)) return kid
      return { ...kid, activityIds: [...ids, activityId] }
    })
  }

  function removeActivityFromKid(activityId) {
    updateActiveKid((kid) => {
      const ids = kid.activityIds?.length ? kid.activityIds : DEFAULT_ACTIVITY_IDS
      if (ids.length <= 1 || !ids.includes(activityId)) return kid
      return { ...kid, activityIds: ids.filter((id) => id !== activityId) }
    })
  }

  // Saves a brand-new, family-wide custom activity into the suggestions
  // panel — it is NOT auto-added to any child, so it behaves exactly like
  // a built-in suggestion: drag it into a child's list (or tap +).
  function addCustomActivity({ label, category, hint, fixedCredit }) {
    const trimmed = String(label || '').trim()
    if (!trimmed) return
    const activity = createCustomActivity({ label: trimmed, category, hint, fixedCredit })
    setState((prev) => ({ ...prev, customActivities: { ...(prev.customActivities || {}), [activity.id]: activity } }))
  }

  // value === null clears the parent's own reward, going back to the default.
  function setActivityReward(activityId, value) {
    updateActiveKid((kid) => {
      const rewards = { ...(kid.activityRewards || {}) }
      if (value == null) delete rewards[activityId]
      else rewards[activityId] = Number(value)
      return { ...kid, activityRewards: rewards }
    })
  }

  // --- Family-wide settings ---------------------------------------------
  function setSetting(key, value) {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  // Once a child is picked (or removed), keep activeKid pointing at a real
  // child instead of a stale/missing id.
  useEffect(() => {
    if (dynamicKids.length === 0) {
      if (activeKid !== null) setActiveKid(null)
      return
    }
    if (!dynamicKids.some((k) => k.id === activeKid)) {
      setActiveKid(loggedInKid && dynamicKids.some((k) => k.id === loggedInKid) ? loggedInKid : dynamicKids[0].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynamicKids, loggedInKid])

  useEffect(() => {
    setState((prev) => {
      const next = { ...prev, kids: { ...prev.kids } }
      Object.keys(prev.kids || {}).forEach((id) => {
        next.kids[id] = ensureToday(prev.kids[id], todayId, catalog)
      })
      return next
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayId, dynamicKids.length])

  useEffect(() => saveState(uid, state), [state, uid])

  // --- Cloud sync (Firestore) ----------------------------------------
  // Each signed-in parent's family lives in its own document at
  // families/{uid} — every device signed into the same account reads and
  // writes that one document. localStorage above acts as an instant-load
  // local cache. Skipped entirely on localhost/dev — see IS_LOCAL_DEV.
  useEffect(() => {
    if (IS_LOCAL_DEV) return undefined
    const ref = doc(db, ...familyDocPath(uid))
    setCloudStatus('connecting')
    cloudReadyRef.current = false
    firstSnapshotRef.current = true
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const first = firstSnapshotRef.current
        firstSnapshotRef.current = false

        if (!snap.exists()) {
          // Shouldn't normally happen (sign-up creates this document), but
          // seed it from what's in memory so there's somewhere to write to.
          const seed = normalizeState(stateRef.current)
          syncedRef.current = syncParts(seed)
          // merge:true and no empty parent code, so this can never wipe
          // details the sign-up form is writing at the same moment.
          const { parentPasscode: seedCode, ...seedRest } = seed
          const seedDoc = seedCode ? { ...seedRest, parentPasscode: seedCode } : seedRest
          setDoc(ref, cleanForCloud(seedDoc), { merge: true }).catch((e) => console.error('Initial cloud seed failed', e))
          cloudReadyRef.current = true
          setCloudStatus('synced')
          return
        }

        // Ignore echoes of our own in-flight writes, and never overwrite a
        // local change that hasn't been sent yet.
        if (!first) {
          if (snap.metadata.hasPendingWrites) return
          if (!sameParts(syncParts(stateRef.current), syncedRef.current)) return
        }

        const data = normalizeState(snap.data())
        syncedRef.current = syncParts(data)
        setState(data)
        cloudReadyRef.current = true
        setCloudStatus('synced')
      },
      (err) => {
        console.error('Cloud sync error — working from this device only', err)
        cloudReadyRef.current = false
        setCloudStatus('offline')
      },
    )
    return () => {
      unsub()
      cloudReadyRef.current = false
    }
  }, [uid])

  // Sends only what changed since the last sync (per top-level setting and
  // per child), so devices don't clobber each other's children.
  useEffect(() => {
    if (IS_LOCAL_DEV || !cloudReadyRef.current) return
    const { update, nowParts } = computeCloudUpdate(state, syncedRef.current, deleteField)
    if (Object.keys(update).length === 0) return
    syncedRef.current = nowParts
    const ref = doc(db, ...familyDocPath(uid))
    updateDoc(ref, update).catch((err) => {
      if (err?.code === 'not-found') {
        setDoc(ref, cleanForCloud(state)).catch((e) => console.error('Cloud save failed', e))
        return
      }
      console.error('Cloud save failed — this change is only saved on this device for now', err)
      setCloudStatus('offline')
    })
  }, [state, uid])

  // One-time bridge for this app's very first family (back when it only
  // supported one hardcoded household sharing a single global document).
  // Only offered while the signed-in account has no children yet, and only
  // works if the old document is still readable (see README.md).
  async function importLegacyData() {
    try {
      const legacySnap = await getDoc(doc(db, ...LEGACY_DOC_PATH))
      if (!legacySnap.exists()) {
        window.alert('No older data was found to import.')
        return
      }
      const legacy = legacySnap.data()
      if (!legacy?.kids || Object.keys(legacy.kids).length === 0) {
        window.alert('No older data was found to import.')
        return
      }
      const count = Object.keys(legacy.kids).length
      if (!window.confirm(`Import ${count} child(ren) from the old shared data into this account?`)) return
      setState((prev) => importFromBackup(legacy, prev))
      window.alert('Imported! Your children now appear here — you can edit their age and grade from the Parent tab.')
    } catch (e) {
      console.error('Legacy import failed', e)
      window.alert(
        'Could not read the older data. It may not exist, or the security rules no longer allow it — try importing a backup file instead (Parent tab → Settings → Import).',
      )
    }
  }

  const kidData = state.kids[activeKid]
  // This child's own activities (parents can add/remove them, see the
  // Parent tab). withAllActivities guards the very first render too, so a
  // saved day missing a newly added activity can never crash the render.
  const activities = useMemo(() => catalog.resolve(kidData?.activityIds), [kidData?.activityIds, catalog])
  const day = withAllActivities(kidData?.days?.[todayId] || blankDay(activities), activities)
  const week = kidData?.weeks?.[weekId] || blankWeek(activities)
  // What one coin of this activity is worth for this child.
  const rewardOf = (a) => rewardFor(kidData, a, rate)

  function handleLogin(kidId) {
    setLoggedInKid(kidId)
    setActiveKid(kidId)
    try {
      sessionStorage.setItem(LOGIN_STORAGE_KEY, kidId)
    } catch (e) {
      console.error('Could not save login', e)
    }
  }

  function handleLogout() {
    setLoggedInKid(null)
    setParentUnlocked(false)
    setView('today')
    try {
      sessionStorage.removeItem(LOGIN_STORAGE_KEY)
    } catch (e) {
      console.error('Could not clear login', e)
    }
  }

  // --- Manual backup (export/import) ----------------------------------
  // Cross-device sync now happens automatically via Firestore (see the
  // cloud-sync effects below) — this export/import pair is kept as a
  // manual backup/restore tool (e.g. a safety copy before "Pay & empty
  // buckets", or a fallback if a device can't reach the cloud).
  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kids-productivity-tracker-backup-${todayId}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  function requestExport() {
    setPendingAction({
      title: 'Parent passcode required',
      message: 'Download a backup file of all your children\u2019s data.',
      run: exportData,
    })
  }

  function importData(file) {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        if (!parsed || typeof parsed !== 'object' || !parsed.kids) {
          throw new Error('Missing "kids" in file')
        }
        if (!window.confirm('Replace the children and history in this account with the ones in that file?')) return
        setState((prev) => importFromBackup(parsed, prev))
        window.alert('Backup imported! Your account now shows that backup\u2019s data.')
      } catch (e) {
        console.error('Import failed', e)
        window.alert('Could not read that file \u2014 make sure it\u2019s a Kids Productivity Tracker backup .json file.')
      }
    }
    reader.readAsText(file)
  }

  function requestImport() {
    setPendingAction({
      title: 'Parent passcode required',
      message: 'Replace your children\u2019s data with a backup file you pick next.',
      run: () => importInputRef.current?.click(),
    })
  }

  function launchCoin(activityId, originEl) {
    const bucketEl = bucketRefs.current[activityId]
    if (!originEl || !bucketEl) return
    const fromRect = originEl.getBoundingClientRect()
    const toRect = bucketEl.getBoundingClientRect()
    const from = { x: fromRect.left + fromRect.width / 2, y: fromRect.top + fromRect.height / 2 }
    const to = { x: toRect.left + toRect.width / 2, y: toRect.top + toRect.height / 2 }
    const id = `${activityId}-${Date.now()}-${Math.random()}`
    setFlights((prev) => [...prev, { id, from, to }])
    setTimeout(() => setFlights((prev) => prev.filter((f) => f.id !== id)), FLIGHT_MS + 50)
  }

  // `credit` is the amount this entry earns — this activity's reward for
  // this child, or a smaller fixed amount for a self-reported late Fajr
  // (see pressLateButton). Stored on the entry itself so later reward
  // changes, rejections, and resets all stay accurate.
  function completeActivity(activityId, status, time, originEl, credit = rate) {
    setState((prev) => {
      const kid = ensureDebtField(prev.kids[activeKid])
      const acts = actsOf(kid, catalog)
      const currentDay = withAllActivities(kid.days[todayId] || blankDay(acts), acts)
      if (currentDay.locked) return prev
      if (currentDay.activities[activityId]?.status !== 'pending') return prev

      const nextDay = {
        ...currentDay,
        activities: {
          ...currentDay.activities,
          [activityId]: { status, time: time || '', reviewed: null, credit: status === 'done' ? credit : 0, penalty: 0 },
        },
      }
      const currentWeek = kid.weeks[weekId] || blankWeek(acts)
      const nextWeek =
        status === 'done'
          ? {
              cash: currentWeek.cash + credit,
              activities: { ...currentWeek.activities, [activityId]: (currentWeek.activities[activityId] || 0) + 1 },
              activityCash: {
                ...currentWeek.activityCash,
                [activityId]: (currentWeek.activityCash?.[activityId] || 0) + credit,
              },
            }
          : currentWeek

      return {
        ...prev,
        kids: {
          ...prev.kids,
          [activeKid]: {
            ...kid,
            days: { ...kid.days, [todayId]: nextDay },
            weeks: { ...kid.weeks, [weekId]: nextWeek },
          },
        },
      }
    })
    if (status === 'done' && originEl) {
      const activity = catalog.getById(activityId)
      const tipText = activity && getCategoryTip(activity.category)
      if (tipText) {
        setTip({ text: tipText, key: `${activityId}-${Date.now()}` })
        setTimeout(() => {
          setTip(null)
          launchCoin(activityId, originEl)
        }, TIP_MS)
      } else {
        launchCoin(activityId, originEl)
      }
    }
  }

  // A kid can take back an accidental tap: only while the day is still open
  // and before a parent has approved/rejected it in the day-end review —
  // once either of those happens, it's final.
  function undoActivity(activityId) {
    setState((prev) => {
      const kid = ensureDebtField(prev.kids[activeKid])
      const acts = actsOf(kid, catalog)
      const currentDay = withAllActivities(kid.days[todayId] || blankDay(acts), acts)
      if (currentDay.locked) return prev
      const entry = currentDay.activities[activityId]
      if (!entry || entry.status !== 'done' || entry.reviewed) return prev

      const earnedCredit = entry.credit || 0
      const nextDay = {
        ...currentDay,
        activities: {
          ...currentDay.activities,
          [activityId]: { status: 'pending', time: '', reviewed: null, credit: 0, penalty: 0 },
        },
      }
      const currentWeek = kid.weeks[weekId] || blankWeek(acts)
      const nextWeek = {
        cash: Math.max(0, currentWeek.cash - earnedCredit),
        activities: { ...currentWeek.activities, [activityId]: Math.max(0, (currentWeek.activities[activityId] || 0) - 1) },
        activityCash: {
          ...currentWeek.activityCash,
          [activityId]: Math.max(0, (currentWeek.activityCash[activityId] || 0) - earnedCredit),
        },
      }
      return {
        ...prev,
        kids: {
          ...prev.kids,
          [activeKid]: { ...kid, days: { ...kid.days, [todayId]: nextDay }, weeks: { ...kid.weeks, [weekId]: nextWeek } },
        },
      }
    })
  }


  // A timed activity's on-time target is a family-wide override (same
  // mechanism as a "simple" activity's unlock time) if the parent set one,
  // else the activity's own built-in default (see the Activities tab).
  const timedTargetOf = (a) => unlockTimes[a.id] ?? a.target

  // "Push Now": on-time press earns the full coin; a press after the
  // deadline is simply missed (no coin, no penalty) — a genuinely late
  // prayer should instead be logged with the "Late Comer" button below.
  function pressTimedButton(activity, e) {
    const pressedAt = new Date()
    const deadline = deadlineDate(todayId, timedTargetOf(activity), activity.graceMinutes || 0)
    const status = pressedAt <= deadline ? 'done' : 'missed'
    const timeStr = pressedAt.toTimeString().slice(0, 8)
    completeActivity(activity.id, status, timeStr, e.currentTarget, rewardOf(activity))
  }

  // A late prayer earns the activity's fixed late credit — but never more
  // than the on-time reward, in case a parent lowered that.
  const lateCreditOf = (a) => Math.min(a.lateCredit ?? 0, rewardOf(a))

  // The late window is always exactly 30 minutes after the on-time target
  // (not separately configurable) — moving the target moves this with it.
  const lateDeadlineOf = (a) => deadlineDate(todayId, timedTargetOf(a), 30)
  const timeStrOf = (d) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

  // "Late Comer": self-report that the prayer happened, within 30 minutes
  // after the on-time target. Always counts as done, but for a smaller,
  // fixed credit (`lateCredit`) instead of the full per-coin reward.
  function pressLateButton(activity, e) {
    const pressedAt = new Date()
    if (activity.lateLabel && pressedAt >= lateDeadlineOf(activity)) return
    const timeStr = pressedAt.toTimeString().slice(0, 8)
    completeActivity(activity.id, 'done', timeStr, e.currentTarget, lateCreditOf(activity))
  }

  function lockDay() {
    setState((prev) => {
      const kid = prev.kids[activeKid]
      const acts = actsOf(kid, catalog)
      const currentDay = withAllActivities(kid.days[todayId] || blankDay(acts), acts)
      if (currentDay.locked) return prev
      return {
        ...prev,
        kids: { ...prev.kids, [activeKid]: { ...kid, days: { ...kid.days, [todayId]: closeDay(currentDay) } } },
      }
    })
  }

  // Parent taps "Lock day & finish" -> passcode -> day-review screen, so a
  // kid can self-report a coin (e.g. On Control, Obeyed) but a parent still
  // has the final say before it's locked in for the day.
  function requestDayReview() {
    if (day.locked) return
    setPendingAction({
      title: 'Parent passcode required',
      message: `Review ${activeKidInfo.name}'s coins for today before locking.`,
      run: () => setReviewOpen(true),
    })
  }

  // Approving just marks the coin as checked — it was already credited the
  // moment the kid tapped the button, so nothing about the coin changes.
  function approveEntry(activityId) {
    setState((prev) => {
      const kid = prev.kids[activeKid]
      const acts = actsOf(kid, catalog)
      const currentDay = withAllActivities(kid.days[todayId] || blankDay(acts), acts)
      const entry = currentDay.activities[activityId]
      if (!entry || entry.status !== 'done') return prev
      const nextDay = {
        ...currentDay,
        activities: { ...currentDay.activities, [activityId]: { ...entry, reviewed: 'approved' } },
      }
      return { ...prev, kids: { ...prev.kids, [activeKid]: { ...kid, days: { ...kid.days, [todayId]: nextDay } } } }
    })
  }

  // Rejecting takes back a coin the kid claimed but the parent doesn't
  // believe — the entry is marked rejected, the earlier credit is undone,
  // AND a further penalty is added to the kid's carried-forward debt
  // (not just this week's bucket), so it keeps reducing payouts on
  // remaining days and weeks until it's fully paid off.
  const REJECT_PENALTY = Number(state.rejectPenalty ?? DEFAULT_REJECT_PENALTY)

  function rejectEntry(activityId) {
    setState((prev) => {
      const kid = ensureDebtField(prev.kids[activeKid])
      const acts = actsOf(kid, catalog)
      const currentDay = withAllActivities(kid.days[todayId] || blankDay(acts), acts)
      const entry = currentDay.activities[activityId]
      if (!entry || entry.status !== 'done') return prev
      const earnedCredit = entry.credit || 0

      const nextDay = {
        ...currentDay,
        activities: {
          ...currentDay.activities,
          [activityId]: { ...entry, status: 'rejected', reviewed: 'rejected', penalty: (entry.penalty || 0) + REJECT_PENALTY },
        },
      }
      const currentWeek = kid.weeks[weekId] || blankWeek(acts)
      const nextWeek = {
        cash: Math.max(0, currentWeek.cash - earnedCredit),
        activities: {
          ...currentWeek.activities,
          [activityId]: Math.max(0, (currentWeek.activities[activityId] || 0) - 1),
        },
        activityCash: {
          ...currentWeek.activityCash,
          [activityId]: Math.max(0, (currentWeek.activityCash?.[activityId] || 0) - earnedCredit),
        },
      }
      return {
        ...prev,
        kids: {
          ...prev.kids,
          [activeKid]: {
            ...kid,
            days: { ...kid.days, [todayId]: nextDay },
            weeks: { ...kid.weeks, [weekId]: nextWeek },
            debt: kid.debt + REJECT_PENALTY,
          },
        },
      }
    })
  }

  function finishReview() {
    setReviewOpen(false)
    lockDay()
  }

  // Pays out this week's bucket minus any carried-forward debt (from
  // rejection penalties). If the debt is bigger than the bucket, the
  // bucket just covers what it can and the remainder of the debt keeps
  // carrying forward into future weeks.
  function resetWeek() {
    const debtNow = kidData?.debt || 0
    const payout = Math.max(0, week.cash - debtNow)
    const confirmMsg =
      debtNow > 0
        ? `Empty all buckets for ${activeKidInfo.name}? ${currency}${Math.min(week.cash, debtNow).toFixed(2)} of this week's ${currency}${week.cash.toFixed(2)} goes toward carried-forward penalties, paying out ${currency}${payout.toFixed(2)}.`
        : `Empty all buckets for ${activeKidInfo.name} after paying out this week's ${currency}${week.cash.toFixed(2)}?`
    if (!window.confirm(confirmMsg)) return
    setState((prev) => {
      const kid = ensureDebtField(prev.kids[activeKid])
      const remainingDebt = Math.max(0, debtNow - week.cash)
      return {
        ...prev,
        kids: {
          ...prev.kids,
          [activeKid]: { ...kid, weeks: { ...kid.weeks, [weekId]: blankWeek(actsOf(kid, catalog)) }, debt: remainingDebt },
        },
      }
    })
  }

  // Admin/testing provision: works even after the day is locked. Reverts
  // any coins already credited today, reverses any rejection penalty
  // added today, and resets today back to a blank, unlocked day so
  // buttons can be tested again.
  function adminResetToday() {
    setState((prev) => {
      const kid = ensureDebtField(prev.kids[activeKid])
      const acts = actsOf(kid, catalog)
      const currentDay = withAllActivities(kid.days[todayId] || blankDay(acts), acts)
      const currentWeek = kid.weeks[weekId] || blankWeek(acts)
      const nextWeek = {
        cash: currentWeek.cash,
        activities: { ...currentWeek.activities },
        activityCash: { ...currentWeek.activityCash },
      }
      let debtToRevert = 0
      Object.entries(currentDay.activities).forEach(([id, entry]) => {
        if (entry?.status === 'done') {
          const earnedCredit = entry.credit || 0
          nextWeek.activities[id] = Math.max(0, (nextWeek.activities[id] || 0) - 1)
          nextWeek.cash = Math.max(0, nextWeek.cash - earnedCredit)
          nextWeek.activityCash[id] = Math.max(0, (nextWeek.activityCash[id] || 0) - earnedCredit)
        }
        if (entry?.penalty) debtToRevert += entry.penalty
      })
      return {
        ...prev,
        kids: {
          ...prev.kids,
          [activeKid]: {
            ...kid,
            days: { ...kid.days, [todayId]: blankDay(acts) },
            weeks: { ...kid.weeks, [weekId]: nextWeek },
            debt: Math.max(0, kid.debt - debtToRevert),
          },
        },
      }
    })
  }

  function requestAdminReset() {
    setPendingAction({
      title: 'Admin passcode required',
      message: `Reset today's activities for ${activeKidInfo.name} for testing (even though today may be locked)?`,
      run: adminResetToday,
    })
  }

  // A parent can override any activity's default unlock time (e.g. move
  // Dhuhr's unlock later on a half-day at school) — stored per activity id,
  // falling back to that activity's built-in default when not set.
  function setUnlockTime(activityId, timeStr) {
    setState((prev) => {
      const next = { ...(prev.unlockTimes || {}) }
      if (timeStr) next[activityId] = timeStr
      else delete next[activityId]
      return { ...prev, unlockTimes: next }
    })
  }

  // The Parent tab covers every child (progress, activities, settings), so
  // it's gated by the parent passcode rather than by the "active" kid.
  function requestParentView() {
    if (parentUnlocked) {
      setView('parent')
      return
    }
    setPendingAction({
      title: 'Parent passcode required',
      message: 'Open the parent area (progress, activities & settings).',
      run: () => {
        setParentUnlocked(true)
        setView('parent')
      },
    })
  }

  function confirmPasscode(code) {
    if (code !== parentPasscode) return false
    pendingAction?.run()
    setPendingAction(null)
    return true
  }

  const activeKidInfo = dynamicKids.find((k) => k.id === activeKid) || null
  const debt = kidData?.debt || 0
  const todayCash = useMemo(
    () =>
      activities.reduce(
        (n, a) => n + (day.activities[a.id]?.status === 'done' ? day.activities[a.id].credit || 0 : 0),
        0,
      ),
    [day, activities],
  )
  const maxDaily = activities.reduce((n, a) => n + rewardOf(a), 0)
  // Rough size of this family's saved data — it all lives in one cloud
  // document, which has a hard limit of about 1,000 KB (see README.md).
  const sizeKB =
    view === 'parent' && parentSection === 'settings' ? Math.round(JSON.stringify(state).length / 1024) : 0

  if (dynamicKids.length === 0) {
    return (
      <div className="login-gate">
        <div className="login-card" style={{ maxWidth: 460 }}>
          <span className="login-moon" aria-hidden="true">☾</span>
          <h1>Welcome!</h1>
          <p className="login-question">Let's add your first child to get started.</p>
          <ManageChildren kids={dynamicKids} onAdd={addChild} onEdit={editChild} onRemove={removeChild} onClose={() => {}} />
          {!IS_LOCAL_DEV && (
            <p className="auth-switch">
              Used the old single-family version of this app before?{' '}
              <button type="button" onClick={importLegacyData}>Import that data</button>
            </p>
          )}
          <p className="auth-switch">
            <button type="button" onClick={handleParentLogout}>Sign out</button>
          </p>
        </div>
      </div>
    )
  }

  // A saved "logged in" child that no longer exists (removed, or a different
  // account on this device) must not get past the login screen.
  if (!loggedInKid || !state.kids[loggedInKid]) {
    return <LoginGate kids={dynamicKids} onLogin={handleLogin} />
  }

  if (!activeKidInfo) return null // one frame while activeKid catches up

  return (
    <CurrencyContext.Provider value={currency}>
    <div className="app">
      {tip && (
        <div className="tip-toast" key={tip.key}>
          {tip.text}
        </div>
      )}
      <header className="hero-banner">
        <span className="hero-motif hero-motif-crescent" aria-hidden="true">☾</span>
        <span className="hero-motif hero-motif-quran" aria-hidden="true">📖</span>
        <span className="hero-motif hero-motif-books" aria-hidden="true">📚</span>
        <span className="hero-motif hero-motif-football" aria-hidden="true">⚽</span>
        <span className="hero-motif hero-motif-badminton" aria-hidden="true">🏸</span>
        <span className="hero-motif hero-motif-cricket" aria-hidden="true">🏏</span>
        <div className="hero-banner-text">
          <p className="hero-kicker">🕌 Deen &nbsp;·&nbsp; 📚 Studies &nbsp;·&nbsp; 🌳 Play</p>
          <h1>Kids Productivity Tracker</h1>
          <p className="subtitle">Daily habits, prayers &amp; discipline tracker</p>
        </div>
      </header>

      <div className="view-tabs">
        <button className={`view-tab ${view === 'today' ? 'active' : ''}`} onClick={() => setView('today')}>
          Today
        </button>
        <button className={`view-tab ${view === 'weeks' ? 'active' : ''}`} onClick={() => setView('weeks')}>
          Weeks
        </button>
        <button className={`view-tab ${view === 'parent' ? 'active' : ''}`} onClick={requestParentView}>
          👨‍👩‍👧 Parent
        </button>
      </div>

      <div className="kid-tabs-row">
        <nav className="kid-tabs">
          {dynamicKids.map((k) => (
            <button
              key={k.id}
              className={`kid-tab ${activeKid === k.id ? 'active' : ''}`}
              style={{ '--kid-color': k.color }}
              onClick={() => setActiveKid(k.id)}
            >
              <span className="avatar">{k.initial}</span>
              <span>
                <strong>{k.name}</strong>
                <small>{k.grade}</small>
              </span>
            </button>
          ))}
          <button type="button" className="logout-btn" onClick={handleLogout} title="Log out">
            👋 {activeKidInfo.name}, not you?
          </button>
        </nav>
        <DigitalClock time={now} />
      </div>

      <div className={`cloud-status cloud-status-${cloudStatus}`}>
        {cloudStatus === 'synced' && '☁️ Synced — every device shares this data'}
        {cloudStatus === 'connecting' && '🔄 Connecting to shared data…'}
        {cloudStatus === 'offline' && '📴 Offline — changes are saved on this device only for now'}
        {cloudStatus === 'local' && '💾 Synced to local storage (dev mode)'}
      </div>

      {view === 'weeks' && (
        <WeeksView
          days={kidData.days}
          activities={activities}
          rate={rate}
          viewMonth={viewMonth}
          onMonthChange={setViewMonth}
        />
      )}

      {view === 'parent' && (
        <>
          <div className="parent-subnav" role="tablist" aria-label="Parent sections">
            {[
              ['overview', '📊 Progress'],
              ['activities', '🎯 Activities'],
              ['settings', '⚙️ Settings'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={parentSection === id}
                className={`parent-subtab ${parentSection === id ? 'active' : ''}`}
                onClick={() => setParentSection(id)}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              className="parent-lock-btn"
              onClick={() => {
                setParentUnlocked(false)
                setView('today')
              }}
            >
              🔒 Lock
            </button>
          </div>

          {parentSection === 'overview' && (
            <ParentWeeklyPanel kids={dynamicKids} kidsState={state.kids} weekId={weekId} />
          )}

          {parentSection === 'activities' && (
            <>
              <p className="parent-panel-note" style={{ marginTop: 0 }}>
                Pick a child with the tabs above, then build their list. Each child can have a
                different set of activities and different rewards.
              </p>
              <ActivityManager
                kid={activeKidInfo}
                record={kidData}
                activities={activities}
                catalog={catalog}
                rate={rate}
                globalUnlockTimes={unlockTimes}
                onAdd={addActivityToKid}
                onRemove={removeActivityFromKid}
                onReward={setActivityReward}
                onUnlockTime={setUnlockTime}
                onCreateCustom={addCustomActivity}
              />
            </>
          )}

          {parentSection === 'settings' && (
            <SettingsPanel
              currency={currency}
              rate={rate}
              penalty={REJECT_PENALTY}
              parentCode={parentPasscode}
              cloudStatus={cloudStatus}
              sizeKB={sizeKB}
              userEmail={user.email || ''}
              isLocalDev={IS_LOCAL_DEV}
              onSetting={setSetting}
              onManageChildren={() => setManageChildrenOpen(true)}
              onExport={exportData}
              onImport={() => importInputRef.current?.click()}
              onSignOut={handleParentLogout}
            />
          )}
        </>
      )}

      {manageChildrenOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card" style={{ maxWidth: 520 }}>
            <ManageChildren
              kids={dynamicKids}
              onAdd={addChild}
              onEdit={editChild}
              onRemove={removeChild}
              onClose={() => setManageChildrenOpen(false)}
            />
          </div>
        </div>
      )}

      <input
        ref={importInputRef}
        type="file"
        accept="application/json"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) importData(file)
          e.target.value = ''
        }}
      />

      {view === 'today' && (
        <>
          <section className="summary-bar">
            <div className="summary-card">
              <span className="summary-label">Today</span>
              <span className="summary-value">
                {currency} {todayCash.toFixed(2)} / {maxDaily.toFixed(0)}
              </span>
            </div>
            <div className="summary-card highlight">
              <span className="summary-label">This week's buckets</span>
              <span className="summary-value">{currency} {week.cash.toFixed(2)}</span>
            </div>
            {debt > 0 && (
              <div className="summary-card debt-card">
                <span className="summary-label">Carried penalty (owed)</span>
                <span className="summary-value">− {currency} {debt.toFixed(2)}</span>
              </div>
            )}
            <button className="pay-btn" onClick={resetWeek}>
              💰 Pay &amp; empty buckets
            </button>
          </section>

          {day.locked && (
            <div className="locked-banner">
              🔒 Today is locked. Great work — come back tomorrow for a fresh day.
            </div>
          )}

          <div className="bucket-grid">
            {activities.map((a) => (
              <Bucket
                key={a.id}
                activity={a}
                coins={week.activities[a.id] || 0}
                cash={week.activityCash?.[a.id] || 0}
                bucketRef={(el) => (bucketRefs.current[a.id] = el)}
              />
            ))}
          </div>

          <div className="quran-verse-banner">
            <div className="verse-arabic" dir="rtl" lang="ar">
              إِنَّ ٱللَّهَ عَلِيمٌۢ بِمَا كُنتُمْ تَعْمَلُونَ
            </div>
            <div className="verse-translation">
              &ldquo;Surely Allah fully knows what you used to do.&rdquo;
            </div>
            <div className="verse-reference">Al Qur'aan (Surah An-Nahl, Verse 28)</div>
          </div>

          <div className="activity-list">
            {activities.map((activity) => {
              const entry = day.activities[activity.id]
              // Every activity stands on its own — none is gated on another
              // activity being done first. Only its own time rule applies.
              const unlocked = !day.locked
              // A parent can override any activity's default unlock time
              // (see the Parent tab's "Prayer unlock times" panel) — fall
              // back to the activity's built-in default when not set.
              const isTimed = activity.control === 'timedPush'
              // For a timed activity (Fajr) the "unlock time" concept is its
              // on-time target, not a "show button after" time — both use
              // the same parent override map, just a different fallback.
              const unlockTime = isTimed ? timedTargetOf(activity) : (unlockTimes[activity.id] ?? activity.visibleAfter)
              const timeReached = hasReachedTime(now, todayId, unlockTime)
              const pastDeadline = isTimed
                ? now >= deadlineDate(todayId, timedTargetOf(activity), activity.graceMinutes || 0)
                : false
              const pastLateDeadline = isTimed && activity.lateLabel ? now >= lateDeadlineOf(activity) : false
              return (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  entry={entry}
                  unlocked={unlocked}
                  locked={day.locked}
                  timeReached={timeReached}
                  unlockTime={unlockTime}
                  reward={rewardOf(activity)}
                  lateCredit={lateCreditOf(activity)}
                  pastDeadline={pastDeadline}
                  pastLateDeadline={pastLateDeadline}
                  targetLabel={isTimed ? formatTimeLabel(timedTargetOf(activity)) : null}
                  lateDeadlineLabel={isTimed && activity.lateLabel ? formatTimeLabel(timeStrOf(lateDeadlineOf(activity))) : null}
                  now={now}
                  onPressTimed={(e) => pressTimedButton(activity, e)}
                  onPressLate={(e) => pressLateButton(activity, e)}
                  onUndo={
                    unlocked && entry.status === 'done' && !entry.reviewed
                      ? () => {
                          if (window.confirm(`Undo "${activity.label}"? The coin will be taken back.`)) {
                            undoActivity(activity.id)
                          }
                        }
                      : null
                  }
                  onSimple={(e) =>
                    completeActivity(
                      activity.id,
                      'done',
                      new Date().toTimeString().slice(0, 8),
                      e.currentTarget,
                      rewardOf(activity),
                    )
                  }
                />
              )
            })}
          </div>

          <div className="footer-actions">
            <button className="lock-btn" onClick={requestDayReview} disabled={day.locked}>
              <span className="lock-btn-icon">{day.locked ? '🔒' : '✅'}</span>
              {day.locked ? 'Day locked' : 'Lock day & finish'}
            </button>
            <p className="footer-note">
              Each activity shows its own reward (a parent sets these). Locking the day marks any
              still-pending activity as missed (empty bucket).
            </p>
            <button className="admin-btn" onClick={requestAdminReset}>
              🔧 Reset Today
            </button>
          </div>
        </>
      )}

      {flights.map((f) => (
        <FlyingCoin key={f.id} from={f.from} to={f.to} duration={FLIGHT_MS} />
      ))}

      {pendingAction && (
        <PasscodeModal
          title={pendingAction.title}
          message={pendingAction.message}
          onConfirm={confirmPasscode}
          onCancel={() => setPendingAction(null)}
        />
      )}

      {reviewOpen && (
        <DayReviewModal
          kidName={activeKidInfo.name}
          day={day}
          activities={activities}
          rate={rate}
          penalty={REJECT_PENALTY}
          onApprove={approveEntry}
          onReject={rejectEntry}
          onFinish={finishReview}
          onCancel={() => setReviewOpen(false)}
        />
      )}
      {showScrollTop && (
        <button type="button" className="scroll-top-btn" onClick={scrollToTop} aria-label="Scroll to top">
          ⬆
        </button>
      )}
    </div>
    </CurrencyContext.Provider>
  )
}

function DigitalClock({ time }) {
  const timeStr = time.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
  const dateStr = time.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short' })

  return (
    <div className="banner-clock" aria-label={`Current time ${timeStr}`}>
      <span className="digital-time">{timeStr}</span>
      <span className="banner-clock-date">{dateStr}</span>
    </div>
  )
}

function FlyingCoin({ from, to, duration }) {
  const [pos, setPos] = useState({ x: from.x, y: from.y, scale: 1, opacity: 1 })

  useEffect(() => {
    const raf = requestAnimationFrame(() => setPos({ x: to.x, y: to.y, scale: 0.6, opacity: 0.5 }))
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="flying-coin"
      style={{
        left: pos.x,
        top: pos.y,
        transform: `translate(-50%, -50%) scale(${pos.scale})`,
        opacity: pos.opacity,
        transitionDuration: `${duration}ms`,
      }}
    >
      🪙
    </div>
  )
}

function Bucket({ activity, coins, cash, bucketRef }) {
  const cur = useCurrency()
  const colors = CATEGORY_COLORS[activity.category] || CATEGORY_COLORS.discipline
  const fillPct = Math.min(coins / 7, 1) * 100
  return (
    <div className="bucket-card" style={{ '--bucket-color': colors.dot }}>
      <div className="bucket-shape" ref={bucketRef}>
        <span className="bucket-shine" aria-hidden="true" />
        <div className="bucket-fill" style={{ height: `${fillPct}%`, background: colors.dot }} />
        <span className="bucket-coins">🪙 {coins}</span>
      </div>
      <div className="bucket-label">{activity.label}</div>
      <div className="bucket-cash">{cur}{cash.toFixed(0)}</div>
    </div>
  )
}

function ActivityCard({
  activity,
  entry,
  unlocked,
  locked,
  timeReached,
  unlockTime,
  reward,
  lateCredit,
  pastDeadline,
  pastLateDeadline,
  targetLabel,
  lateDeadlineLabel,
  now,
  onPressTimed,
  onPressLate,
  onSimple,
  onUndo,
}) {
  const cur = useCurrency()
  const colors = CATEGORY_COLORS[activity.category] || CATEGORY_COLORS.discipline
  const timeGated = activity.control === 'simple' && entry.status === 'pending' && !timeReached
  const finalOutcome = entry.status === 'done' || entry.status === 'rejected'
  const state = locked
    ? finalOutcome
      ? entry.status
      : 'locked'
    : !unlocked
      ? 'waiting'
      : timeGated
        ? 'timegate'
        : entry.status
  const wide = activity.control === 'timedPush'

  return (
    <div
      className={`activity-card state-${state}${wide ? ' activity-card--wide' : ''}`}
      style={{ '--activity-color': colors.dot }}
    >
      <span className="activity-card-sheen" aria-hidden="true" />
      <div className="activity-top">
        <span className="activity-icon" style={{ background: activity.tint || colors.tint, color: colors.dot }}>
          {activity.icon || colors.icon}
        </span>
        <div className="activity-label">{activity.label}</div>
        <span className="activity-reward" title="Reward for this activity">
          🪙 {cur}
          {Number(reward).toFixed(2).replace(/\.00$/, '')}
        </span>
      </div>
      {activity.hint && (
        <div className="activity-hint" title={activity.hint}>
          {activity.hint}
        </div>
      )}

      <div className="activity-control">
        {activity.control === 'timedPush' && (
          <TimedPushControl
            activity={activity}
            entry={entry}
            unlocked={unlocked}
            pastDeadline={pastDeadline}
            pastLateDeadline={pastLateDeadline}
            lateCredit={lateCredit}
            targetLabel={targetLabel}
            lateDeadlineLabel={lateDeadlineLabel}
            onPress={onPressTimed}
            onPressLate={onPressLate}
          />
        )}
        {activity.control === 'simple' &&
          (timeGated ? (
            <span className="time-gate-note">🔒 Unlocks at {formatTimeLabel(unlockTime)}</span>
          ) : (
            <button className="btn btn-done" disabled={!unlocked || entry.status !== 'pending'} onClick={onSimple}>
              {activity.buttonLabel || 'Completed on Time?'}
            </button>
          ))}
      </div>

      <StatusBadge
        state={state}
        time={entry.time}
        reviewed={entry.reviewed}
        credit={entry.credit}
        unlockTime={unlockTime && formatTimeLabel(unlockTime)}
      />
      {onUndo && (
        <button type="button" className="undo-btn" onClick={onUndo}>
          ↩️ Oops, undo
        </button>
      )}
    </div>
  )
}

function TimedPushControl({
  activity,
  entry,
  unlocked,
  pastDeadline,
  pastLateDeadline,
  lateCredit,
  targetLabel,
  lateDeadlineLabel,
  onPress,
  onPressLate,
}) {
  const cur = useCurrency()
  const deadlineLabel = targetLabel + (activity.graceMinutes ? ` + ${activity.graceMinutes} min grace` : '')
  const pending = entry.status === 'pending'
  // Base lock: the activity is closed off (day locked, or already
  // completed) regardless of time. Within that, the on-time target (a
  // parent can move it from the Activities tab) decides which single
  // button is open — "Push Now" before the target, "Late Comer" for 30
  // minutes after it, then both close for the day.
  const baseLocked = !unlocked || !pending
  const pushDisabled = baseLocked || pastDeadline
  const lateDisabled = baseLocked || !pastDeadline || pastLateDeadline

  return (
    <div className="timed-push">
      <div className="timed-push-buttons">
        <button className="btn btn-done" disabled={pushDisabled} onClick={onPress}>
          Push Now
        </button>
        {activity.lateLabel && (
          <button className="btn btn-late" disabled={lateDisabled} onClick={onPressLate}>
            {activity.lateLabel}
          </button>
        )}
      </div>
      <span className="deadline-note">
        Deadline: {deadlineLabel}
        {activity.lateLabel
          ? ` · "${activity.lateLabel}" credits ${cur}${lateCredit}${
              lateDeadlineLabel ? ` until ${lateDeadlineLabel}` : ''
            }`
          : ''}
      </span>
    </div>
  )
}

function StatusBadge({ state, time, reviewed, credit, unlockTime }) {
  const cur = useCurrency()
  const creditNote = credit ? ` · ${cur}${credit}` : ''
  const doneLabel =
    reviewed === 'approved'
      ? `Coin approved${creditNote}${time ? ` · ${time.slice(0, 5)}` : ''}`
      : `Coin earned${creditNote}${time ? ` · ${time.slice(0, 5)}` : ''} · pending parent review`
  const map = {
    done: { label: doneLabel, className: reviewed === 'approved' ? 'badge-done' : 'badge-pending' },
    rejected: { label: 'Coin rejected by parent', className: 'badge-missed' },
    missed: { label: 'Missed', className: 'badge-missed' },
    waiting: { label: 'Locked', className: 'badge-waiting' },
    locked: { label: 'Day closed', className: 'badge-waiting' },
    pending: { label: 'Ready', className: 'badge-pending' },
    timegate: { label: `Not yet${unlockTime ? ` · from ${unlockTime}` : ''}`, className: 'badge-waiting' },
  }
  const info = map[state] || map.pending
  return <span className={`badge ${info.className}`}>{info.label}</span>
}

const CURRENCY_CHOICES = ['₹', '$', '£', '€', 'AED', 'SAR', 'PKR', 'BDT', 'MYR', 'CAD', 'AUD']

// Everything a parent configures once: currency, defaults, the parent code,
// backups and the account itself. Lives behind the parent passcode.
function SettingsPanel({
  currency,
  rate,
  penalty,
  parentCode,
  cloudStatus,
  sizeKB,
  userEmail,
  isLocalDev,
  onSetting,
  onManageChildren,
  onExport,
  onImport,
  onSignOut,
}) {
  const [codeDraft, setCodeDraft] = useState('')
  const [codeMsg, setCodeMsg] = useState('')
  const choices = CURRENCY_CHOICES.includes(currency) ? CURRENCY_CHOICES : [currency, ...CURRENCY_CHOICES]
  const LIMIT_KB = 1000

  function saveCode(e) {
    e.preventDefault()
    const next = codeDraft.trim()
    if (next.length < 4) {
      setCodeMsg('Please use at least 4 characters.')
      return
    }
    onSetting('parentPasscode', next)
    setCodeDraft('')
    setCodeMsg('Parent code updated.')
  }

  return (
    <div className="settings-panel">
      <div className="parent-panel">
        <div className="parent-panel-head">
          <h2 className="parent-panel-title">👨‍👩‍👧 Children</h2>
        </div>
        <p className="parent-panel-note" style={{ marginTop: 0 }}>
          Add a child, or change a child's name, age and grade. Age and grade decide which
          suggested activities are recommended.
        </p>
        <button type="button" className="btn btn-done" onClick={onManageChildren}>
          Manage children
        </button>
      </div>

      <div className="parent-panel">
        <div className="parent-panel-head">
          <h2 className="parent-panel-title">💰 Rewards</h2>
        </div>
        <div className="settings-grid">
          <div className="settings-row">
            <label htmlFor="set-currency">Currency</label>
            <select id="set-currency" value={currency} onChange={(e) => onSetting('currency', e.target.value)}>
              {choices.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="settings-row">
            <label>Default reward per activity</label>
            <span className="am-reward-wrap">
              <span className="am-cur">{currency}</span>
              <RewardInput value={rate} onCommit={(n) => onSetting('rewardRate', n)} />
            </span>
            <small>Used for any activity you haven't given its own reward (Activities tab).</small>
          </div>
          <div className="settings-row">
            <label>Penalty for a rejected coin</label>
            <span className="am-reward-wrap">
              <span className="am-cur">{currency}</span>
              <RewardInput value={penalty} onCommit={(n) => onSetting('rejectPenalty', n)} />
            </span>
            <small>Taken back when you reject a claimed coin at day-end; carries forward until paid off.</small>
          </div>
        </div>
      </div>

      <div className="parent-panel">
        <div className="parent-panel-head">
          <h2 className="parent-panel-title">🔐 Parent code</h2>
        </div>
        <p className="parent-panel-note" style={{ marginTop: 0 }}>
          {parentCode
            ? 'This code protects the day-end review, resets and this parent area from the children.'
            : 'No parent code is set yet — choose one so the children can’t open the parent area.'}
        </p>
        <form className="settings-code-form" onSubmit={saveCode}>
          <input
            type="text"
            placeholder="New parent code"
            value={codeDraft}
            onChange={(e) => {
              setCodeDraft(e.target.value)
              setCodeMsg('')
            }}
          />
          <button type="submit" className="btn btn-done">Save code</button>
        </form>
        {codeMsg && <p className="parent-panel-note">{codeMsg}</p>}
      </div>

      <div className={`sync-note ${cloudStatus === 'synced' ? 'sync-note-ok' : ''} ${cloudStatus === 'local' ? 'sync-note-local' : ''}`}>
        {cloudStatus === 'synced' && (
          <p>
            <strong>☁️ Live sync is on.</strong> Every device signed in to {userEmail || 'this account'} shares
            the same children and history. Backups below are an extra safety copy.
          </p>
        )}
        {cloudStatus === 'local' && (
          <p>
            <strong>💾 Local dev mode.</strong> Running on localhost, so nothing here touches the cloud or
            needs a real account — data stays in this browser only.
          </p>
        )}
        {(cloudStatus === 'offline' || cloudStatus === 'connecting') && (
          <p>
            <strong>⚠️ Not connected right now.</strong> Changes are saved on this device and will sync
            when it reconnects. Use a backup to move data by hand in the meantime.
          </p>
        )}
        {!isLocalDev && sizeKB > 0 && (
          <p className={sizeKB > 700 ? 'settings-size-warn' : ''}>
            Cloud storage used: about {sizeKB} KB of roughly {LIMIT_KB} KB for one account.
            {sizeKB > 700 && ' Getting full — download a backup now.'}
          </p>
        )}
        <div className="sync-actions">
          <button type="button" className="btn btn-done" onClick={onExport}>
            ⬇️ Download backup
          </button>
          <button type="button" className="btn btn-late" onClick={onImport}>
            ⬆️ Restore from backup
          </button>
        </div>
        <p className="sync-hint">
          A backup file also imports data from the original single-family version of this app.
        </p>
      </div>

      <div className="parent-panel">
        <div className="parent-panel-head">
          <h2 className="parent-panel-title">👤 Account</h2>
        </div>
        {userEmail && <p className="parent-panel-note" style={{ marginTop: 0 }}>Signed in as {userEmail}</p>}
        <button type="button" className="btn btn-missed" onClick={onSignOut}>
          🚪 Sign out of this device
        </button>
      </div>
    </div>
  )
}
