import React, { useEffect, useState } from 'react'
import { useCurrency } from '../CurrencyContext.js'
import { useTranslation } from '../LanguageContext.js'
import { tActivity } from '../i18n.js'
import {
  weeksInMonth,
  formatMonthLabel,
  addMonths,
  todayKey,
} from '../data/activities.js'

export default function WeeksView({ days, activities, rate, viewMonth, onMonthChange }) {
  const cur = useCurrency()
  const { lang, t } = useTranslation()
  const weeks = weeksInMonth(viewMonth)
  const [selectedWeek, setSelectedWeek] = useState(weeks[0]?.weekNum || 1)
  const todayId = todayKey()

  useEffect(() => {
    setSelectedWeek(1)
  }, [viewMonth])

  const week = weeks.find((w) => w.weekNum === selectedWeek) || weeks[0]

  function dayTotal(dateId) {
    const d = days[dateId]
    if (!d) return 0
    return activities.reduce((sum, a) => {
      const entry = d.activities[a.id]
      if (entry?.status !== 'done') return sum
      return sum + (entry.credit ?? rate)
    }, 0)
  }

  const weekTotal = week ? week.dates.reduce((sum, dateId) => sum + dayTotal(dateId), 0) : 0

  return (
    <div className="weeks-view">
      <div className="month-nav">
        <button className="ghost-btn" onClick={() => onMonthChange(addMonths(viewMonth, -1))}>
          ◀
        </button>
        <span className="month-label">{formatMonthLabel(viewMonth)}</span>
        <button className="ghost-btn" onClick={() => onMonthChange(addMonths(viewMonth, 1))}>
          ▶
        </button>
      </div>

      <div className="week-tabs">
        {weeks.map((w) => (
          <button
            key={w.id}
            className={`week-tab ${w.weekNum === selectedWeek ? 'active' : ''}`}
            onClick={() => setSelectedWeek(w.weekNum)}
          >
            {t('weekN', { n: w.weekNum })}
            <small>
              {w.startDay}–{w.endDay}
            </small>
          </button>
        ))}
      </div>

      {week && (
        <div className="week-table-wrap">
          <table className="week-table">
            <thead>
              <tr>
                <th>{t('dateLabel')}</th>
                {activities.map((a) => (
                  <th key={a.id} title={tActivity(lang, a, 'label')}>
                    {tActivity(lang, a, 'label').length > 10
                      ? tActivity(lang, a, 'label').split(' ')[0]
                      : tActivity(lang, a, 'label')}
                  </th>
                ))}
                <th>{t('totalLabel')}</th>
              </tr>
            </thead>
            <tbody>
              {week.dates.map((dateId) => {
                const d = days[dateId]
                const isFuture = dateId > todayId
                return (
                  <tr key={dateId} className={dateId === todayId ? 'row-today' : ''}>
                    <td className="date-cell">
                      <div className="date-day">
                        {new Date(dateId).toLocaleDateString(undefined, { weekday: 'short' })}
                      </div>
                      <div className="date-num">{dateId.slice(8, 10)}</div>
                    </td>
                    {activities.map((a) => {
                      const status = d?.activities?.[a.id]?.status
                      let icon = '➖'
                      if (status === 'done') icon = '✅'
                      else if (status === 'missed') icon = '❌'
                      else if (status === 'rejected') icon = '🚫'
                      else if (isFuture) icon = '·'
                      const statusWord = status || (isFuture ? t('notYet') : t('noDataWord'))
                      return (
                        <td key={a.id} className="status-cell" title={`${tActivity(lang, a, 'label')}: ${statusWord}`}>
                          {icon}
                        </td>
                      )
                    })}
                    <td className="total-cell">{cur}{dayTotal(dateId).toFixed(0)}</td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={activities.length + 1}>{t('weekNTotal', { n: selectedWeek })}</td>
                <td className="total-cell">{cur}{weekTotal.toFixed(0)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  )
}
