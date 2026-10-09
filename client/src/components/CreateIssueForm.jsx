import { useState } from 'react'
import { createIssue } from '../api/issues'

const PRIORITIES = ['Low', 'Medium', 'High']

const PRIORITY_HINT = {
  Low:    'Minor issue, no urgency',
  Medium: 'Should be addressed soon',
  High:   'Blocks work or affects users',
}

export default function CreateIssueForm({ onCreated, onCancel }) {
  const [form, setForm]     = useState({ title: '', description: '', priority: 'Medium' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }
    setLoading(true)
    try {
      const res = await createIssue(form)
      onCreated(res.data.issue)
      setForm({ title: '', description: '', priority: 'Medium' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create issue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-page">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">New Issue</h1>
          <p className="page-subtitle">Describe the problem so it can be tracked and resolved</p>
        </div>
      </div>

      <div className="panel">
        {error && <div className="alert alert-error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="issue-form" noValidate>
          <div className="field">
            <label htmlFor="title">
              Title <span className="required-star" aria-hidden="true">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Short, descriptive summary of the issue"
              value={form.title}
              onChange={handleChange}
              required
              autoFocus
              maxLength={200}
            />
            <span className="field-hint">Be specific — a good title makes issues easy to find</span>
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Steps to reproduce, expected vs actual behavior, affected environment…"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {form.priority && (
              <span className="field-hint">{PRIORITY_HINT[form.priority]}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating…' : 'Create Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
