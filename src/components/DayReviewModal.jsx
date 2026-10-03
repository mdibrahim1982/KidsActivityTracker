import React from 'react'
import { useCurrency } from '../CurrencyContext.js'
import { useTranslation } from '../LanguageContext.js'
import { tActivity } from '../i18n.js'

// Shown after the parent passcode, right before a day locks. Every activity
// the kid marked "done" today is listed here so the parent can Approve it
// (nothing changes, the coin stays) or Reject it (the coin is taken back).
// This is the check against a kid over-claiming something like On Control
// or Obeyed, which nobody but the kid witnessed in the moment.
export default function DayReviewModal({ kidName, day, activities, rate, penalty, onApprove, onReject, onFinish, onCancel }) {
  const cur = useCurrency()
  const { lang, t } = useTranslation()
  const claimed = activities.filter((a) => day.activities[a.id]?.status === 'done')
  const reviewedCount = claimed.filter((a) => day.activities[a.id]?.reviewed).length
  const allReviewed = claimed.length === 0 || reviewedCount === claimed.length

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card review-card">
        <h3>{t('reviewCoinsTitle', { name: kidName })}</h3>
        <p className="modal-message">
          {claimed.length === 0
            ? t('noCoinsClaimed')
            : t('reviewExplain', { cur, amount: Number(penalty ?? 0).toFixed(2) })}
        </p>

        <div className="review-list">
          {claimed.map((a) => {
            const entry = day.activities[a.id]
            const reviewed = entry.reviewed
            return (
              <div key={a.id} className={`review-row ${reviewed ? `review-row-${reviewed}` : ''}`}>
                <div className="review-row-info">
                  <span className="review-row-label">{tActivity(lang, a, 'label')}</span>
                  <span className="review-row-time">
                    {entry.time ? entry.time.slice(0, 5) : t('markedDone')} · {cur}{(entry.credit ?? rate).toFixed(2)}
                  </span>
                </div>
                {reviewed ? (
                  <span className={`review-verdict verdict-${reviewed}`}>
                    {reviewed === 'approved' ? t('approvedBadge') : t('rejectedBadge')}
                  </span>
                ) : (
                  <div className="review-actions">
                    <button className="btn btn-done" onClick={() => onApprove(a.id)}>
                      {t('approveBtn')}
                    </button>
                    <button className="btn btn-missed" onClick={() => onReject(a.id)}>
                      {t('rejectBtn')}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <p className="review-hint">
          {claimed.length > 0 && !allReviewed ? t('unreviewedNote') : null}
        </p>

        <div className="modal-actions">
          <button type="button" className="ghost-btn" onClick={onCancel}>
            {t('reviewLater')}
          </button>
          <button type="button" className="btn btn-done" onClick={onFinish}>
            {t('finishLockDay')}
          </button>
        </div>
      </div>
    </div>
  )
}
