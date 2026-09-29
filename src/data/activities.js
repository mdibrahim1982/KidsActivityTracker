// One coin bucket per activity. Every activity is independent — none is
// gated on another one being completed first (see App.jsx).
//
// control types:
//  - "timedPush": a live-clock push button. Pressing after the deadline
//    (target [+ graceMinutes]) marks it missed instead of done — no coin.
//    If the activity also sets `lateLabel` + `lateCredit`, a second
//    button is shown alongside "Push Now" so a genuinely late prayer can
//    still be self-reported for a smaller, fixed credit (see Fajr below
//    and App.jsx pressLateButton). There's no penalty for being late —
//    only a smaller credit than praying on time.
//  - "simple": a single button (default label "Completed on Time?",
//    overridable per-activity with `buttonLabel`). Pressing fills the
//    bucket immediately. If `visibleAfter` ("HH:MM") is set, the button
//    stays hidden behind a lock note until that time of day.
//
// Every activity's coin is provisional until the parent approves or
// rejects it in the day-end review (see App.jsx / DayReviewModal.jsx).
// A rejection reverses the coin AND deducts a further penalty (set by the parent) that
// carries forward — untouched by day or week resets — until it's paid
// off by a future week's earnings (see kid.debt in App.jsx).
export const ACTIVITIES = [
  {
    id: 'fajr',
    label: 'Fajr Prayer',
    category: 'prayer',
    control: 'timedPush',
    target: '06:00',
    lateLabel: 'Late Comer 🐢',
    lateCredit: 3,
    // No lateDeadline here — the late window is always target + 30 minutes,
    // computed in App.jsx, so a parent changing the target time (below)
    // automatically moves the late window with it.
    hint: 'Push "Push Now" by the target time for the full reward, or "Late Comer" within 30 minutes after for a smaller one. A parent can change the target time from the Activities tab.',
  },
  {
    id: 'quran',
    label: 'Quran Recitation',
    category: 'quran',
    control: 'simple',
    buttonLabel: 'Quran Recitation 📖',
    hint: '15 minutes, right after Fajr',
  },
  {
    id: 'hadith',
    label: 'Read Hadith',
    category: 'quran',
    icon: '📗',
    tint: '#EDE7F4',
    control: 'simple',
    buttonLabel: 'Completed',
    fixedCredit: 2,
    hint: 'Read one Hadith with its meaning.',
  },
  {
    id: 'study',
    label: 'Academic Study',
    category: 'study',
    control: 'simple',
    buttonLabel: 'Academic Study 📚',
    hint: 'Homework & lessons, before Dhuhr',
  },
  {
    id: 'dhuhr',
    label: 'Dhuhr Prayer',
    category: 'prayer',
    control: 'simple',
    visibleAfter: '15:45',
    hint: 'School days: mark after school hours. Sundays: at prayer time. Unlocks at 3:45 PM.',
  },
  {
    id: 'asr',
    label: 'Asr Prayer',
    category: 'prayer',
    control: 'simple',
    visibleAfter: '15:45',
    hint: 'School days: mark after school hours. Sundays: at prayer time. Unlocks at 3:45 PM.',
  },
  {
    id: 'maghrib',
    label: 'Maghrib Prayer',
    category: 'prayer',
    control: 'simple',
    visibleAfter: '18:00',
    hint: '4th prayer. Unlocks at 6:00 PM.',
  },
  {
    id: 'isha',
    label: 'Isha Prayer',
    category: 'prayer',
    control: 'simple',
    visibleAfter: '19:45',
    hint: '5th prayer. Unlocks at 7:45 PM.',
  },
  {
    id: 'mobile',
    label: 'Mobile Viewing',
    category: 'discipline',
    control: 'simple',
    buttonLabel: 'On Control 📵',
    hint: 'Allowed: 5:00–5:30 PM after Asr (30 min) and 9:45–10:00 PM after Isha (15 min). Reviewed by parent at day end.',
  },
  {
    id: 'obey',
    label: 'Obeyed Parents',
    category: 'discipline',
    icon: '👪',
    tint: '#F3ECDD',
    control: 'simple',
    buttonLabel: 'Yes off course',
    hint: 'Reviewed by parent at day end.',
  },
  {
    id: 'outdoor',
    label: 'Playing Outdoors',
    category: 'play',
    control: 'simple',
    buttonLabel: 'Oh Yes 👍',
    fixedCredit: 3,
    hint: 'Time outside, away from screens. Reviewed by parent at day end.',
  },
]

export const DEFAULT_REWARD = 5 // default reward per coin; a parent can set a different one per activity
export const DEFAULT_CURRENCY = '₹'
export const DEFAULT_REJECT_PENALTY = 5

// Short column headers for the compact Weeks history table.
export const SHORT_LABELS = {
  fajr: 'Fajr',
  quran: 'Qurʼan',
  hadith: 'Hadith',
  study: 'Study',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
  mobile: 'MobileView',
  obey: 'Obeyed',
  outdoor: 'Outdoors',
}


export const CATEGORY_COLORS = {
  prayer: { dot: '#1F6F6B', tint: '#E3F0EE', icon: '🕌' },
  quran: { dot: '#8A5FA8', tint: '#F0E9F5', icon: '📖' },
  study: { dot: '#3E6AC9', tint: '#E7EDFA', icon: '📚' },
  discipline: { dot: '#C97B84', tint: '#F8E9EA', icon: '📱' },
  play: { dot: '#4FA65B', tint: '#E7F4E9', icon: '🌳' },
  chores: { dot: '#B8863B', tint: '#F6EEDC', icon: '🧹' },
  health: { dot: '#2E8FA8', tint: '#E1F1F5', icon: '💧' },
  creative: { dot: '#D0663F', tint: '#FAE9E1', icon: '🎨' },
  kindness: { dot: '#C25A8A', tint: '#F8E6EF', icon: '💝' },
}

// A rotating palette so each new child gets a distinct color without the
// parent having to pick one.
export const CHILD_COLORS = ['#1F6F6B', '#C97B84', '#3E6AC9', '#B8863B', '#4FA65B', '#8A5FA8']

// A brand-new child starts with the default activities above, and no
// reward overrides. A parent then adds/removes activities (drag-and-drop
// from the suggestions panel) and sets a reward per activity from the
// Parent tab — see ActivityManager.jsx.
export function createChildRecord({ name, age, grade }, colorIndex = 0) {
  return {
    meta: {
      name: name.trim(),
      age: age ?? '',
      grade: (grade || '').trim(),
      color: CHILD_COLORS[colorIndex % CHILD_COLORS.length],
      initial: name.trim().charAt(0).toUpperCase() || '?',
    },
    activityIds: ACTIVITIES.map((a) => a.id),
    activityRewards: {},
    days: {},
    weeks: {},
    debt: 0,
  }
}

export function newChildId() {
  return `child_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
}

// Short, paraphrased reminders (not verbatim scripture) shown as a little
// pop-up tip right after a kid claims a coin, before it flies to the
// bucket — picked by the activity's category. One is chosen at random
// each time so it doesn't feel repetitive.
export const CATEGORY_TIPS = {
  prayer: [
    "🕌 The Prophet ﷺ taught that prayer is the coolness of his eyes — the more you love it, the more it shows.",
    '🕌 Prayer was the very first thing people are asked about on the Day of Judgment. Showing up for it matters!',
    '🕌 Every prayer on time is a small victory that keeps your heart connected to Allah.',
  ],
  quran: [
    "📖 The Prophet ﷺ said the best among you are those who learn the Qur'an and teach it.",
    '📖 Every letter recited from the Qurʼan brings its own reward — and rewards get multiplied!',
    "📖 The Qur'an will be a light for you on the Day of Judgment. Keep reciting, keep shining.",
    '📗 The Prophet ﷺ was the best example of kind and gentle character — reading about his life helps us follow it.',
  ],
  study: [
    '📚 The Prophet ﷺ said seeking knowledge is a duty upon every Muslim.',
    '📚 A moment spent learning is never wasted — knowledge is a light that never goes out.',
    '📚 Scholars are honoured greatly in Islam. Keep learning, keep growing!',
  ],
  discipline: [
    '😊 A smile and good manners are considered a form of charity. Keep it up!',
    '🤝 The Prophet ﷺ said the best of you are those who are best to their families.',
    "📱 Self-control is part of faith — nice job keeping your balance today.",
  ],
  play: [
    '🌳 The Prophet ﷺ encouraged play and exercise — a strong, healthy body helps you worship better too.',
    '🌳 Even the Prophet ﷺ used to race and play with others. Enjoy your time outdoors!',
  ],
  chores: [
    '🧹 Cleanliness is part of faith — a tidy space is a good deed too.',
    '🏠 The Prophet ﷺ used to help out around the house. Helping at home follows his example!',
  ],
  health: [
    '💧 A strong, healthy body helps you do good for longer. Well done looking after yourself!',
    '🍎 Islam teaches that your body has rights over you — caring for it is a good deed.',
  ],
  creative: [
    '🎨 Making something beautiful with your own hands is a lovely way to use the talents you were given.',
  ],
  kindness: [
    '💝 The best of people are those who are most helpful to others.',
    '😊 Even a kind word or a smile is a form of charity.',
  ],
}

export function getCategoryTip(category) {
  const list = CATEGORY_TIPS[category]
  if (!list || !list.length) return null
  return list[Math.floor(Math.random() * list.length)]
}

export function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10) // YYYY-MM-DD
}

export function monthKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function weekNumberInMonth(d = new Date()) {
  return Math.ceil(d.getDate() / 7)
}

// "Week 1" = days 1-7 of the month, "Week 2" = 8-14, etc. This keeps the
// coin-bucket week the same grouping shown on the Weeks page.
export function weekKey(d = new Date()) {
  return `${monthKey(d)}-W${weekNumberInMonth(d)}`
}

export function daysInMonth(monthId) {
  const [y, m] = monthId.split('-').map(Number)
  return new Date(y, m, 0).getDate()
}

export function formatMonthLabel(monthId) {
  const [y, m] = monthId.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

export function addMonths(monthId, delta) {
  const [y, m] = monthId.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return monthKey(d)
}

// All weeks in a month, each with its date-id list, for the Weeks page.
export function weeksInMonth(monthId) {
  const total = daysInMonth(monthId)
  const [y, m] = monthId.split('-').map(Number)
  const numWeeks = Math.ceil(total / 7)
  const weeks = []
  for (let w = 1; w <= numWeeks; w++) {
    const startDay = (w - 1) * 7 + 1
    const endDay = Math.min(w * 7, total)
    const dates = []
    for (let d = startDay; d <= endDay; d++) {
      dates.push(`${monthId}-${String(d).padStart(2, '0')}`)
    }
    weeks.push({ weekNum: w, id: `${monthId}-W${w}`, startDay, endDay, dates })
  }
  return weeks
}

// Build a real Date for "HH:MM" on the given YYYY-MM-DD date, so a
// timedPush button can be compared against the actual current time.
export function deadlineDate(dateId, timeStr, graceMinutes = 0) {
  const [y, m, d] = dateId.split('-').map(Number)
  const [hh, mm] = timeStr.split(':').map(Number)
  const dt = new Date(y, m - 1, d, hh, mm, 0, 0)
  if (graceMinutes) dt.setMinutes(dt.getMinutes() + graceMinutes)
  return dt
}

// True once `now` has reached HH:MM on the given date. No visibleAfter
// means "always visible" (true).
export function hasReachedTime(now, dateId, timeStr) {
  if (!timeStr) return true
  return now >= deadlineDate(dateId, timeStr)
}

// "15:45" -> "3:45 PM"
export function formatTimeLabel(timeStr) {
  const [hh, mm] = timeStr.split(':').map(Number)
  const period = hh >= 12 ? 'PM' : 'AM'
  const h12 = hh % 12 === 0 ? 12 : hh % 12
  return `${h12}:${String(mm).padStart(2, '0')} ${period}`
}

function blankEntry() {
  return { status: 'pending', time: '', reviewed: null, credit: 0, penalty: 0 }
}

// `activities` is the child's own active list (they differ per child now).
export function blankDay(activities = ACTIVITIES) {
  const entries = {}
  activities.forEach((a) => {
    entries[a.id] = blankEntry()
  })
  return { activities: entries, locked: false }
}

// Backfills any activity ids missing from a saved day — e.g. a day saved
// before a parent dragged a new activity into this child's list. Without
// this, reading `entry.status` on a missing entry would crash the render.
export function withAllActivities(day, activities = ACTIVITIES) {
  let changed = false
  const entries = { ...day.activities }
  activities.forEach((a) => {
    if (!entries[a.id]) {
      entries[a.id] = blankEntry()
      changed = true
    }
  })
  return changed ? { ...day, activities: entries } : day
}

export function blankWeek(activities = ACTIVITIES) {
  const counts = {}
  const cash = {}
  activities.forEach((a) => {
    counts[a.id] = 0
    cash[a.id] = 0
  })
  return { cash: 0, activities: counts, activityCash: cash }
}

// ---------------------------------------------------------------------------
// Activity catalog: the default set + a library of ready-made suggestions.
// A child stores only activity ids (kid.activityIds) plus any reward
// overrides (kid.activityRewards), so the definitions live here.
//
// Suggestion fields: minAge/maxAge and minGrade/maxGrade (grade 0 = K)
// decide which children an idea is recommended for. `fixedCredit` is the
// suggested reward — the parent can change it per child.
// ---------------------------------------------------------------------------
const done = (extra = {}) => ({ control: 'simple', buttonLabel: 'Done ✅', ...extra })

export const ACTIVITY_LIBRARY = [
  // Chores
  { id: 'lib_make_bed', label: 'Make My Bed', category: 'chores', icon: '🛏️', hint: 'Bed made neatly before leaving the room.', fixedCredit: 2, minAge: 5, maxAge: 17, ...done() },
  { id: 'lib_tidy_room', label: 'Tidy My Room', category: 'chores', icon: '🧺', hint: 'Toys, clothes and books put away.', fixedCredit: 3, minAge: 5, maxAge: 17, ...done() },
  { id: 'lib_set_table', label: 'Set / Clear the Table', category: 'chores', icon: '🍽️', hint: 'Help lay the table or clear it after a meal.', fixedCredit: 2, minAge: 5, maxAge: 14, ...done() },
  { id: 'lib_help_cook', label: 'Help in the Kitchen', category: 'chores', icon: '🍳', hint: 'Help prepare a meal or wash up.', fixedCredit: 4, minAge: 8, maxAge: 17, ...done() },
  { id: 'lib_laundry', label: 'Laundry Help', category: 'chores', icon: '👕', hint: 'Sort, fold or put away laundry.', fixedCredit: 3, minAge: 10, maxAge: 17, ...done() },
  { id: 'lib_trash', label: 'Take Out the Trash', category: 'chores', icon: '🗑️', hint: 'Empty the bins and replace the bags.', fixedCredit: 2, minAge: 8, maxAge: 17, ...done() },
  { id: 'lib_plants', label: 'Water the Plants', category: 'chores', icon: '🪴', hint: 'Look after the plants.', fixedCredit: 1, minAge: 5, maxAge: 12, ...done() },
  { id: 'lib_pet', label: 'Care for the Pet', category: 'chores', icon: '🐾', hint: 'Feed, water or walk the family pet.', fixedCredit: 3, minAge: 6, maxAge: 17, ...done() },

  // Health
  { id: 'lib_water', label: 'Drink Enough Water', category: 'health', icon: '💧', hint: 'A good number of glasses through the day.', fixedCredit: 1, minAge: 5, maxAge: 17, ...done() },
  { id: 'lib_exercise', label: 'Exercise 20 Minutes', category: 'health', icon: '🏃', hint: 'Run, cycle, stretch or play a sport.', fixedCredit: 3, minAge: 6, maxAge: 17, ...done() },
  { id: 'lib_sleep', label: 'Bed on Time', category: 'health', icon: '😴', hint: 'In bed by the agreed bedtime.', fixedCredit: 3, minAge: 5, maxAge: 17, ...done() },
  { id: 'lib_teeth', label: 'Brush Teeth Twice', category: 'health', icon: '🪥', hint: 'Morning and night.', fixedCredit: 1, minAge: 4, maxAge: 10, ...done() },
  { id: 'lib_veg', label: 'Eat My Vegetables', category: 'health', icon: '🥦', hint: 'Finish the veggies on the plate.', fixedCredit: 2, minAge: 4, maxAge: 12, ...done() },

  // Study
  { id: 'lib_read', label: 'Read a Book 20 Min', category: 'study', icon: '📕', hint: 'Any book you enjoy.', fixedCredit: 3, minGrade: 1, maxGrade: 12, ...done({ buttonLabel: 'Read 📕' }) },
  { id: 'lib_math', label: 'Maths Practice', category: 'study', icon: '➗', hint: 'A short set of practice questions.', fixedCredit: 3, minGrade: 1, maxGrade: 12, ...done({ buttonLabel: 'Practised ➗' }) },
  { id: 'lib_spelling', label: 'Spelling & Vocabulary', category: 'study', icon: '🔤', hint: 'Learn and revise new words.', fixedCredit: 2, minGrade: 1, maxGrade: 8, ...done() },
  { id: 'lib_homework_first', label: 'Homework Before Play', category: 'study', icon: '📝', hint: 'Homework finished before screens or games.', fixedCredit: 3, minGrade: 1, maxGrade: 12, ...done() },
  { id: 'lib_journal', label: 'Write in My Journal', category: 'study', icon: '📓', hint: 'A few lines about my day.', fixedCredit: 2, minGrade: 3, maxGrade: 12, ...done() },
  { id: 'lib_coding', label: 'Coding / Logic Puzzle', category: 'study', icon: '💻', hint: 'Code a little or solve a logic puzzle.', fixedCredit: 3, minGrade: 5, maxGrade: 12, ...done() },
  { id: 'lib_language', label: 'Practise a Language', category: 'study', icon: '🌍', hint: 'Ten minutes of a second language.', fixedCredit: 2, minGrade: 4, maxGrade: 12, ...done() },

  // Deen
  { id: 'lib_adhkar', label: 'Morning / Evening Adhkar', category: 'prayer', icon: '🤲', hint: 'Recite the daily remembrance.', fixedCredit: 2, minAge: 7, maxAge: 17, ...done() },
  { id: 'lib_dua', label: 'Learn a New Dua', category: 'quran', icon: '🌙', hint: 'Memorise one new supplication.', fixedCredit: 3, minAge: 5, maxAge: 17, ...done() },
  { id: 'lib_revise_surah', label: 'Revise a Surah', category: 'quran', icon: '📖', hint: 'Revise something already memorised.', fixedCredit: 3, minAge: 6, maxAge: 17, ...done() },
  { id: 'lib_sadaqah', label: 'Give Sadaqah', category: 'kindness', icon: '🪙', hint: 'Give something, however small.', fixedCredit: 2, minAge: 6, maxAge: 17, ...done() },

  // Creative
  { id: 'lib_draw', label: 'Draw or Paint', category: 'creative', icon: '🖍️', hint: 'Make a picture.', fixedCredit: 2, minAge: 4, maxAge: 17, ...done() },
  { id: 'lib_build', label: 'Build Something', category: 'creative', icon: '🧱', hint: 'Blocks, models or a craft project.', fixedCredit: 2, minAge: 4, maxAge: 14, ...done() },
  { id: 'lib_story', label: 'Write a Story', category: 'creative', icon: '✍️', hint: 'A short story or poem of my own.', fixedCredit: 3, minAge: 7, maxAge: 17, ...done() },

  // Kindness
  { id: 'lib_sibling', label: 'Help My Sibling', category: 'kindness', icon: '🤝', hint: 'Help a brother or sister without being asked.', fixedCredit: 3, minAge: 5, maxAge: 17, ...done() },
  { id: 'lib_grandparents', label: 'Call or Visit Family', category: 'kindness', icon: '📞', hint: 'Grandparents, aunts, uncles or cousins.', fixedCredit: 3, minAge: 6, maxAge: 17, ...done() },
  { id: 'lib_thanks', label: 'Say Thank You', category: 'kindness', icon: '😊', hint: 'Thank someone properly today.', fixedCredit: 1, minAge: 4, maxAge: 17, ...done() },
  { id: 'lib_share', label: 'Share Nicely', category: 'kindness', icon: '🧸', hint: 'Take turns and share with others.', fixedCredit: 2, minAge: 4, maxAge: 9, ...done() },
]

// Everything a child could have: the defaults plus the library. A family's
// own custom activities (see createCustomActivity below) are layered on
// top of this at runtime in App.jsx (see makeCatalog) — they aren't part
// of this static list since they're saved data, not code.
export const ALL_ACTIVITIES = [...ACTIVITIES, ...ACTIVITY_LIBRARY]
export const DEFAULT_ACTIVITY_IDS = ACTIVITIES.map((a) => a.id)

export function newCustomActivityId() {
  return 'custom_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

// A parent-made activity — same shape as anything in ACTIVITY_LIBRARY, so it
// works everywhere a built-in one does (rewards, drag-and-drop, tips, the
// Weeks table). Always a simple tap-to-claim button; no minAge/maxAge/
// minGrade/maxGrade, so it's always shown as "Recommended" (a parent who
// made it presumably wants it offered to their other children too).
export function createCustomActivity({ label, category, hint, fixedCredit }) {
  const trimmedLabel = String(label || '').trim()
  const cat = CATEGORY_COLORS[category] ? category : 'discipline'
  const credit = Number(fixedCredit)
  return {
    id: newCustomActivityId(),
    label: trimmedLabel,
    category: cat,
    control: 'simple',
    buttonLabel: `${trimmedLabel} ✅`,
    hint: String(hint || '').trim(),
    fixedCredit: Number.isFinite(credit) && credit >= 0 ? credit : undefined,
    custom: true,
  }
}

const ACTIVITY_BY_ID = ALL_ACTIVITIES.reduce((m, a) => {
  m[a.id] = a
  return m
}, {})

export function getActivityById(id) {
  return ACTIVITY_BY_ID[id] || null
}

// A child's ordered active activities. Unknown ids (e.g. from a newer app
// version) are skipped rather than crashing.
export function resolveActivities(ids) {
  const list = Array.isArray(ids) && ids.length ? ids : DEFAULT_ACTIVITY_IDS
  return list.map(getActivityById).filter(Boolean)
}

// The reward for one activity for one child: the parent's own setting if
// they set one, else the activity's suggested reward, else the family-wide
// default per coin.
export function rewardFor(kid, activity, rate) {
  const own = kid?.activityRewards?.[activity.id]
  if (own != null && own !== '' && !Number.isNaN(Number(own))) return Number(own)
  return activity.fixedCredit ?? rate
}

// "7th Grade", "Grade 5", "K", "Kindergarten", "Pre-K" -> 7, 5, 0, 0, -1
export function parseGradeNumber(grade) {
  if (grade == null) return null
  const g = String(grade).trim().toLowerCase()
  if (!g) return null
  if (/pre[\s-]?k|nursery/.test(g)) return -1
  if (/kinder|^k$|\bk\b/.test(g)) return 0
  const m = g.match(/\d+/)
  return m ? Number(m[0]) : null
}

// Best-effort age/grade for a child, filling one in from the other when
// only one was entered (grade ≈ age − 5).
export function childProfileLevel(kid) {
  const rawAge = Number(kid?.age)
  let age = Number.isFinite(rawAge) && rawAge > 0 ? rawAge : null
  let grade = parseGradeNumber(kid?.grade)
  if (age == null && grade != null) age = grade + 5
  if (grade == null && age != null) grade = age - 5
  return { age, grade }
}

// Is this idea a good fit for this child? Missing info never excludes.
export function isSuggestedFor(activity, kid) {
  const { age, grade } = childProfileLevel(kid)
  if (age != null) {
    if (activity.minAge != null && age < activity.minAge) return false
    if (activity.maxAge != null && age > activity.maxAge) return false
  }
  if (grade != null) {
    if (activity.minGrade != null && grade < activity.minGrade) return false
    if (activity.maxGrade != null && grade > activity.maxGrade) return false
  }
  return true
}

export const CATEGORY_LABELS = {
  prayer: 'Prayer',
  quran: "Qur'an & Dua",
  study: 'Study',
  discipline: 'Discipline',
  play: 'Play',
  chores: 'Chores',
  health: 'Health',
  creative: 'Creative',
  kindness: 'Kindness',
}

// Compact column header for the Weeks table: the hand-picked short label for
// the default activities, else the first word (or the whole label if short).
export function shortLabel(activity) {
  if (SHORT_LABELS[activity.id]) return SHORT_LABELS[activity.id]
  const label = activity.label || ''
  return label.length > 10 ? label.split(' ')[0] : label
}
