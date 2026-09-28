import React from 'react'
import { CATEGORY_COLORS, resolveActivities } from '../data/activities.js'
import { useCurrency } from '../CurrencyContext.js'

// A parent-passcode-gated, at-a-glance view of BOTH kids' current week —
// coins and cash per activity, side by side. The existing "Weeks" tab
// still covers full day-by-day history for one kid at a time; this is the
// quick weekly comparison a parent wants without digging through days.
export default function ParentWeeklyPanel({ kids, kidsState, weekId, onLock }) {
  const cur = useCurrency()
  return (
    <div className="parent-panel">
      <div className="parent-panel-head">
        <h2 className="parent-panel-title">📊 This week — all children</h2>
        {onLock && (
          <button type="button" className="parent-lock-btn" onClick={onLock}>
            🔒 Lock parent view
          </button>
        )}
      </div>

      <div className="parent-kid-grid">
        {kids.map((k) => {
          const week = kidsState[k.id]?.weeks?.[weekId] || { cash: 0, activities: {}, activityCash: {} }
          const debt = kidsState[k.id]?.debt || 0
          const activities = resolveActivities(kidsState[k.id]?.activityIds)
          const totalCoins = activities.reduce((n, a) => n + (week.activities[a.id] || 0), 0)

          return (
            <div key={k.id} className="parent-kid-card" style={{ '--kid-color': k.color }}>
              <div className="parent-kid-header">
                <span className="avatar">{k.initial}</span>
                <div>
                  <strong>{k.name}</strong>
                  <small>{k.grade}</small>
                </div>
              </div>

              <div className="parent-kid-totals">
                <div className="ptot">
                  <span className="ptot-label">This week</span>
                  <span className="ptot-value">{cur}{week.cash.toFixed(2)}</span>
                </div>
                <div className="ptot">
                  <span className="ptot-label">Coins</span>
                  <span className="ptot-value">🪙 {totalCoins}</span>
                </div>
                {debt > 0 && (
                  <div className="ptot">
                    <span className="ptot-label">Owed</span>
                    <span className="ptot-value ptot-debt">− {cur}{debt.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="parent-activity-rows">
                {activities.map((a) => {
                  const coins = week.activities[a.id] || 0
                  const cash = week.activityCash?.[a.id] || 0
                  const colors = CATEGORY_COLORS[a.category]
                  return (
                    <div key={a.id} className="parent-activity-row">
                      <span
                        className="parent-activity-icon"
                        style={{ background: a.tint || colors.tint, color: colors.dot }}
                      >
                        {a.icon || colors.icon}
                      </span>
                      <span className="parent-activity-name">{a.label}</span>
                      <span className="parent-activity-coins">🪙 {coins}</span>
                      <span className="parent-activity-cash">{cur}{cash.toFixed(0)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <p className="parent-panel-note">
        This resets whenever "Pay &amp; empty buckets" is used for a kid. For full day-by-day
        history, use the Weeks tab.
      </p>
    </div>
  )
}
