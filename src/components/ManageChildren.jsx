import React, { useState } from 'react'
import { useTranslation } from '../LanguageContext.js'

// Minimal fields on purpose (name, age, grade) — this is meant to be quick
// for a parent to fill in, not a full profile form.
export default function ManageChildren({ kids, onAdd, onEdit, onRemove, onClose }) {
  const { t } = useTranslation()
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', age: '', grade: '' })
  const [adding, setAdding] = useState(false)

  function startEdit(k) {
    setEditingId(k.id)
    setForm({ name: k.name, age: k.age ?? '', grade: k.grade ?? '' })
    setAdding(false)
  }

  function startAdd() {
    setAdding(true)
    setEditingId(null)
    setForm({ name: '', age: '', grade: '' })
  }

  function cancel() {
    setEditingId(null)
    setAdding(false)
    setForm({ name: '', age: '', grade: '' })
  }

  function submit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    if (editingId) {
      onEdit(editingId, form)
    } else {
      onAdd(form)
    }
    cancel()
  }

  return (
    <div className="parent-panel">
      <div className="parent-panel-head">
        <h2 className="parent-panel-title">{t('manageChildrenTitle')}</h2>
        <button type="button" className="parent-lock-btn" onClick={onClose}>
          {t('done')}
        </button>
      </div>

      <div className="manage-children-list">
        {kids.length === 0 && (
          <p className="empty-note">{t('noChildrenYet')}</p>
        )}
        {kids.map((k) =>
          editingId === k.id ? (
            <form key={k.id} className="child-form" onSubmit={submit}>
              <input
                type="text"
                placeholder={t('namePlaceholder')}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                type="number"
                min="1"
                max="25"
                placeholder={t('agePlaceholder')}
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
              <input
                type="text"
                placeholder={t('gradePlaceholder')}
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
              />
              <div className="child-form-actions">
                <button type="submit" className="btn btn-done">{t('save')}</button>
                <button type="button" className="btn" onClick={cancel}>{t('cancel')}</button>
              </div>
            </form>
          ) : (
            <div key={k.id} className="child-row" style={{ '--kid-color': k.color }}>
              <span className="avatar">{k.initial}</span>
              <div className="child-row-info">
                <strong>{k.name}</strong>
                <small>
                  {k.grade || t('noGradeSet')}
                  {k.age ? t('ageSuffix', { age: k.age }) : ''}
                </small>
              </div>
              <div className="child-row-actions">
                <button type="button" className="btn" onClick={() => startEdit(k)}>{t('edit')}</button>
                <button
                  type="button"
                  className="btn btn-missed"
                  onClick={() => {
                    if (window.confirm(t('removeChildConfirm', { name: k.name }))) {
                      onRemove(k.id)
                    }
                  }}
                >
                  {t('remove')}
                </button>
              </div>
            </div>
          ),
        )}
      </div>

      {adding ? (
        <form className="child-form" onSubmit={submit}>
          <input
            type="text"
            placeholder={t('namePlaceholder')}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            autoFocus
          />
          <input
            type="number"
            min="1"
            max="25"
            placeholder={t('agePlaceholder')}
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
          />
          <input
            type="text"
            placeholder={t('gradePlaceholder')}
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
          />
          <div className="child-form-actions">
            <button type="submit" className="btn btn-done">{t('addChildSubmit')}</button>
            <button type="button" className="btn" onClick={cancel}>{t('cancel')}</button>
          </div>
        </form>
      ) : (
        <button type="button" className="btn btn-done add-child-btn" onClick={startAdd}>
          {t('addChildBtn')}
        </button>
      )}

      <p className="parent-panel-note">{t('manageChildrenNote')}</p>
    </div>
  )
}
