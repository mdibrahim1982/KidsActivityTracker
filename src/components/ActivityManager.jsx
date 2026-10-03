import React, { useMemo, useState } from 'react'
import { CATEGORY_COLORS, isSuggestedFor, rewardFor } from '../data/activities.js'
import { useCurrency } from '../CurrencyContext.js'
import { useTranslation } from '../LanguageContext.js'
import { tActivity, tCategory } from '../i18n.js'

const REMOVE_PREFIX = 'remove:'

// A number box that keeps its own draft while you type and only saves when
// you leave the box (or press Enter) — so typing "12" doesn't save "1" first.
export function RewardInput({ value, onCommit }) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState(String(value))
  const [focused, setFocused] = useState(false)
  const shown = focused ? draft : String(value)

  function commit() {
    setFocused(false)
    const n = Number(draft)
    if (draft.trim() === '' || Number.isNaN(n) || n < 0) {
      setDraft(String(value))
      return
    }
    if (n !== Number(value)) onCommit(n)
  }

  return (
    <input
      className="am-reward-input"
      type="number"
      min="0"
      step="0.5"
      inputMode="decimal"
      value={shown}
      onFocus={() => {
        setDraft(String(value))
        setFocused(true)
      }}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur()
      }}
      aria-label={t('rewardAria')}
    />
  )
}

// One child's activities: the list on the left (also the drop zone), and a
// panel of ready-made suggestions on the right that can be dragged in — or
// added with the "+" button, which is what works on phones and tablets where
// dragging isn't reliable. The parent sets each activity's reward here.
export default function ActivityManager({
  kid,
  record,
  activities,
  catalog,
  rate,
  globalUnlockTimes,
  onAdd,
  onRemove,
  onReward,
  onUnlockTime,
  onCreateCustom,
}) {
  const cur = useCurrency()
  const { lang, t } = useTranslation()
  const [overMain, setOverMain] = useState(false)
  const [overSide, setOverSide] = useState(false)
  const [category, setCategory] = useState('all')
  const [customOpen, setCustomOpen] = useState(false)
  const [customForm, setCustomForm] = useState({ label: '', category: 'chores', hint: '', fixedCredit: String(rate) })
  const [customError, setCustomError] = useState('')

  const activeIds = useMemo(() => activities.map((a) => a.id), [activities])

  const available = useMemo(
    () => catalog.list.filter((a) => !activeIds.includes(a.id)),
    [activeIds, catalog],
  )
  const recommended = available.filter((a) => isSuggestedFor(a, kid))
  const others = available.filter((a) => !isSuggestedFor(a, kid))

  const categories = useMemo(() => {
    const set = new Set(available.map((a) => a.category))
    return ['all', ...Array.from(set)]
  }, [available])

  const inCategory = (a) => category === 'all' || a.category === category
  const recShown = recommended.filter(inCategory)
  const otherShown = others.filter(inCategory)

  const dailyMax = activities.reduce((n, a) => n + rewardFor(record, a, rate), 0)
  const canRemove = activities.length > 1

  function submitCustom(e) {
    e.preventDefault()
    const label = customForm.label.trim()
    if (!label) {
      setCustomError(t('giveItAName'))
      return
    }
    const credit = Number(customForm.fixedCredit)
    if (!Number.isFinite(credit) || credit < 0) {
      setCustomError(t('rewardMustBeNumber'))
      return
    }
    onCreateCustom({ label, category: customForm.category, hint: customForm.hint, fixedCredit: credit })
    setCustomForm({ label: '', category: customForm.category, hint: '', fixedCredit: String(rate) })
    setCustomError('')
    setCustomOpen(false)
  }

  function handleDropOnMain(e) {
    e.preventDefault()
    setOverMain(false)
    const id = e.dataTransfer.getData('text/plain')
    if (!id || id.startsWith(REMOVE_PREFIX)) return
    if (catalog.getById(id) && !activeIds.includes(id)) onAdd(id)
  }

  function handleDropOnSide(e) {
    e.preventDefault()
    setOverSide(false)
    const raw = e.dataTransfer.getData('text/plain')
    if (!raw.startsWith(REMOVE_PREFIX)) return
    requestRemove(raw.slice(REMOVE_PREFIX.length))
  }

  function requestRemove(id) {
    const a = catalog.getById(id)
    if (!a) return
    if (!canRemove) {
      window.alert(t('aChildNeedsOneActivity'))
      return
    }
    if (window.confirm(t('removeActivityConfirm', { label: tActivity(lang, a, 'label'), name: kid.name }))) {
      onRemove(id)
    }
  }

  // Show-button-after times are family-wide (prayer times are the same for
  // every child), so they live in the shared settings, not on one child.
  // A "simple" activity falls back to its built-in visibleAfter (if any);
  // a timed activity (Fajr) falls back to its built-in on-time target —
  // either way, a parent's override in globalUnlockTimes wins.
  function unlockValue(a) {
    const shared = globalUnlockTimes?.[a.id]
    if (shared !== undefined && shared !== null) return shared
    return a.visibleAfter || a.target || ''
  }

  function renderSuggestion(a) {
    const colors = CATEGORY_COLORS[a.category] || CATEGORY_COLORS.discipline
    const label = tActivity(lang, a, 'label')
    return (
      <div
        key={a.id}
        className="am-suggestion"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', a.id)
          e.dataTransfer.effectAllowed = 'copy'
        }}
        style={{ '--activity-color': colors.dot }}
      >
        <span className="am-icon" style={{ background: a.tint || colors.tint, color: colors.dot }}>
          {a.icon || colors.icon}
        </span>
        <div className="am-suggestion-body">
          <strong>{label}</strong>
          <small>
            {tCategory(lang, a.category, a.category)}
            {' · '}
            {t('suggestedWord')}
            {' '}
            {cur}
            {a.fixedCredit ?? rate}
          </small>
        </div>
        <button type="button" className="am-add-btn" onClick={() => onAdd(a.id)} aria-label={t('addActivityAria', { label })}>
          ＋
        </button>
      </div>
    )
  }

  return (
    <div className="activity-manager">
      <div
        className={`am-main ${overMain ? 'am-over' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          e.dataTransfer.dropEffect = 'copy'
          setOverMain(true)
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setOverMain(false)
        }}
        onDrop={handleDropOnMain}
      >
        <div className="am-head">
          <h3>
            <span className="avatar" style={{ '--kid-color': kid.color }}>{kid.initial}</span>
            {kid.name}
          </h3>
          <small>
            {t('activitiesActiveLine', { n: activities.length, cur, amount: dailyMax.toFixed(2).replace(/\.00$/, '') })}
          </small>
        </div>

        <p className="am-hint">{t('dragHint', { name: kid.name })}</p>

        <div className="am-list">
          {activities.map((a) => {
            const colors = CATEGORY_COLORS[a.category] || CATEGORY_COLORS.discipline
            const isTimed = a.control === 'timedPush'
            const own = record?.activityRewards?.[a.id]
            const reward = rewardFor(record, a, rate)
            const unlock = unlockValue(a)
            const unlockOverridden = globalUnlockTimes?.[a.id] != null
            const label = tActivity(lang, a, 'label')
            return (
              <div
                key={a.id}
                className="am-row"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', REMOVE_PREFIX + a.id)
                  e.dataTransfer.effectAllowed = 'move'
                }}
              >
                <span className="am-icon" style={{ background: a.tint || colors.tint, color: colors.dot }}>
                  {a.icon || colors.icon}
                </span>
                <div className="am-row-body">
                  <strong>{label}</strong>
                  <small>{tCategory(lang, a.category, a.category)}</small>
                </div>

                <div className="am-field">
                  <span>{t('rewardLabel')}</span>
                  <span className="am-reward-wrap">
                    <span className="am-cur">{cur}</span>
                    <RewardInput value={reward} onCommit={(n) => onReward(a.id, n)} />
                  </span>
                  {own != null && (
                    <button type="button" className="am-reset" onClick={() => onReward(a.id, null)}>
                      {t('defaultReset')}
                    </button>
                  )}
                </div>

                <div className="am-field">
                  <span>{isTimed ? t('onTimeByAll') : t('showButtonAfterAll')}</span>
                  <input
                    className="am-time-input"
                    type="time"
                    value={unlock}
                    aria-label={`${label}: ${isTimed ? t('onTimeByWord') : t('showButtonAfterWord')}`}
                    onChange={(e) => onUnlockTime(a.id, e.target.value)}
                  />
                  {unlockOverridden && (
                    <button type="button" className="am-reset" onClick={() => onUnlockTime(a.id, null)}>
                      {t('defaultReset')}
                    </button>
                  )}
                  {isTimed && a.lateLabel && <small>{t('lateWindowNote')}</small>}
                </div>

                <button
                  type="button"
                  className="am-remove-btn"
                  onClick={() => requestRemove(a.id)}
                  disabled={!canRemove}
                  aria-label={t('removeActivityAria', { label })}
                  title={canRemove ? t('removeFromChildTitle') : t('needOneActivityTitle')}
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>

        <div className="am-dropzone-hint">{t('dropHereToAdd')}</div>
      </div>

      <aside
        className={`am-side ${overSide ? 'am-over-remove' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          e.dataTransfer.dropEffect = 'move'
          setOverSide(true)
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setOverSide(false)
        }}
        onDrop={handleDropOnSide}
      >
        <div className="am-head">
          <h3>{t('suggestedActivitiesTitle')}</h3>
          <small>
            {t('pickedForName', { name: kid.name })}
            {kid.age ? t('agePart', { age: kid.age }) : ''}
            {kid.grade ? t('gradeCommaPrefix', { grade: kid.grade }) : ''}
          </small>
        </div>

        <button type="button" className="am-custom-toggle" onClick={() => setCustomOpen((v) => !v)}>
          {customOpen ? t('cancelX') : t('createCustomBtn')}
        </button>

        {customOpen && (
          <form className="am-custom-form" onSubmit={submitCustom}>
            <label>
              <span>{t('activityNameLabel')}</span>
              <input
                type="text"
                value={customForm.label}
                onChange={(e) => setCustomForm({ ...customForm, label: e.target.value })}
                placeholder={t('activityNamePlaceholder')}
                autoFocus
              />
            </label>
            <div className="am-custom-row">
              <label>
                <span>{t('categoryLabel')}</span>
                <select
                  value={customForm.category}
                  onChange={(e) => setCustomForm({ ...customForm, category: e.target.value })}
                >
                  {Object.keys(CATEGORY_COLORS).map((c) => (
                    <option key={c} value={c}>
                      {tCategory(lang, c, c)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>{t('rewardLabel')}</span>
                <span className="am-reward-wrap">
                  <span className="am-cur">{cur}</span>
                  <input
                    className="am-reward-input"
                    type="number"
                    min="0"
                    step="0.5"
                    inputMode="decimal"
                    value={customForm.fixedCredit}
                    onChange={(e) => setCustomForm({ ...customForm, fixedCredit: e.target.value })}
                  />
                </span>
              </label>
            </div>
            <label>
              <span>{t('hintOptionalLabel')}</span>
              <input
                type="text"
                value={customForm.hint}
                onChange={(e) => setCustomForm({ ...customForm, hint: e.target.value })}
                placeholder={t('hintPlaceholder')}
              />
            </label>
            {customError && <p className="login-error">{customError}</p>}
            <button type="submit" className="btn btn-done">
              {t('saveCustomActivityBtn')}
            </button>
            <p className="am-custom-note">{t('customNote', { name: kid.name })}</p>
          </form>
        )}

        <div className="am-chips" role="tablist" aria-label={t('filterCategoriesAria')}>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={`am-chip ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c === 'all' ? t('allFilter') : tCategory(lang, c, c)}
            </button>
          ))}
        </div>

        {overSide && <div className="am-remove-hint">{t('dropToRemove', { name: kid.name })}</div>}

        <div className="am-suggestions">
          {recShown.length === 0 && otherShown.length === 0 && (
            <p className="empty-note">{t('nothingLeftHere', { name: kid.name })}</p>
          )}
          {recShown.length > 0 && <div className="am-section-label">{t('recommendedFor', { name: kid.name })}</div>}
          {recShown.map(renderSuggestion)}
          {recShown.length === 0 && recommended.length === 0 && otherShown.length > 0 && (
            <p className="empty-note">{t('noMoreRecommendations')}</p>
          )}
        </div>

        {otherShown.length > 0 && (
          <details className="am-others">
            <summary>{t('otherIdeas', { n: otherShown.length, name: kid.name })}</summary>
            <div className="am-suggestions">
              {otherShown.map(renderSuggestion)}
            </div>
          </details>
        )}
      </aside>
    </div>
  )
}
