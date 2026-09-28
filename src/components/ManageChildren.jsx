import React, { useState } from 'react'

// Minimal fields on purpose (name, age, grade) — this is meant to be quick
// for a parent to fill in, not a full profile form.
export default function ManageChildren({ kids, onAdd, onEdit, onRemove, onClose }) {
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
        <h2 className="parent-panel-title">👨‍👩‍👧 Manage children</h2>
        <button type="button" className="parent-lock-btn" onClick={onClose}>
          Done
        </button>
      </div>

      <div className="manage-children-list">
        {kids.length === 0 && (
          <p className="empty-note">No children yet — add your first one below to get started.</p>
        )}
        {kids.map((k) =>
          editingId === k.id ? (
            <form key={k.id} className="child-form" onSubmit={submit}>
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                type="number"
                min="1"
                max="25"
                placeholder="Age"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
              <input
                type="text"
                placeholder="Grade (e.g. 5th Grade)"
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
              />
              <div className="child-form-actions">
                <button type="submit" className="btn btn-done">Save</button>
                <button type="button" className="btn" onClick={cancel}>Cancel</button>
              </div>
            </form>
          ) : (
            <div key={k.id} className="child-row" style={{ '--kid-color': k.color }}>
              <span className="avatar">{k.initial}</span>
              <div className="child-row-info">
                <strong>{k.name}</strong>
                <small>
                  {k.grade || 'No grade set'}
                  {k.age ? ` · Age ${k.age}` : ''}
                </small>
              </div>
              <div className="child-row-actions">
                <button type="button" className="btn" onClick={() => startEdit(k)}>Edit</button>
                <button
                  type="button"
                  className="btn btn-missed"
                  onClick={() => {
                    if (window.confirm(`Remove ${k.name}? This deletes all of their saved history too.`)) {
                      onRemove(k.id)
                    }
                  }}
                >
                  Remove
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
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            autoFocus
          />
          <input
            type="number"
            min="1"
            max="25"
            placeholder="Age"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
          />
          <input
            type="text"
            placeholder="Grade (e.g. 5th Grade)"
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
          />
          <div className="child-form-actions">
            <button type="submit" className="btn btn-done">Add child</button>
            <button type="button" className="btn" onClick={cancel}>Cancel</button>
          </div>
        </form>
      ) : (
        <button type="button" className="btn btn-done add-child-btn" onClick={startAdd}>
          + Add a child
        </button>
      )}

      <p className="parent-panel-note">
        Every new child starts with the same default set of activities. Choosing which
        activities apply to which child (by age/grade) is coming in a future update.
      </p>
    </div>
  )
}
