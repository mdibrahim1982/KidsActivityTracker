import React, { useState } from 'react'
import { useTranslation } from '../LanguageContext.js'

export default function PasscodeModal({ title, message, onConfirm, onCancel }) {
  const { t } = useTranslation()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    const ok = onConfirm(code)
    if (!ok) {
      setError(t('incorrectPasscode'))
      setCode('')
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <form className="modal-card" onSubmit={submit}>
        <h3>{title}</h3>
        {message && <p className="modal-message">{message}</p>}
        <input
          type="password"
          autoFocus
          placeholder={t('enterPasscode')}
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            setError('')
          }}
        />
        {error && <p className="modal-error">{error}</p>}
        <div className="modal-actions">
          <button type="button" className="ghost-btn" onClick={onCancel}>
            {t('cancel')}
          </button>
          <button type="submit" className="btn btn-done">
            {t('confirm')}
          </button>
        </div>
      </form>
    </div>
  )
}
