import { useState } from 'react'
import { deleteIssue, updateIssue } from '../api/issues'
import { PriorityIndicator, StatusBadge } from './IssueBadge'

const STATUSES = ['Open', 'In Progress', 'Resolved']

export default function IssueCard({ issue, onUpdated, onDeleted }) {
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [error, setError] = useState('')

  const handleStatusChange = async (e) => {
    setError('')
    setLoadingStatus(true)
    try {
      const res = await updateIssue(issue._id, { status: e.target.value })
      onUpdated(res.data.issue)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.')
    } finally {
      setLoadingStatus(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${issue.title}"?`)) return
    setError('')
    setLoadingDelete(true)
    try {
      await deleteIssue(issue._id)
      onDeleted(issue._id)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete issue.')
      setLoadingDelete(false)
    }
  }

  const createdAt = new Date(issue.createdAt).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  // Left border accent colour driven by priority
  const priorityClass = {
    High:   'card-priority-high',
    Medium: 'card-priority-medium',
    Low:    'card-priority-low',
  }[issue.priority] ?? ''

  return (
    <article className={`issue-card ${priorityClass}`}>
      <div className="issue-card-body">
        {/* Title row */}
        <div className="issue-title-row">
          <h3 className="issue-title">{issue.title}</h3>
          <StatusBadge status={issue.status} />
        </div>

        {/* Description */}
        {issue.description && (
          <p className="issue-description">{issue.description}</p>
        )}

        {/* Meta row */}
        <div className="issue-card-meta">
          <PriorityIndicator priority={issue.priority} />
          <span className="meta-divider" aria-hidden="true" />
          <span className="issue-date">{createdAt}</span>
          {issue.assignedTo && (
            <>
              <span className="meta-divider" aria-hidden="true" />
              <span className="issue-assignee">
                <span aria-hidden="true">👤</span> {issue.assignedTo.name}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Actions footer */}
      <div className="issue-card-footer">
        {error && <p className="card-error" role="alert">{error}</p>}
        <div className="issue-card-actions">
          <label className="sr-only" htmlFor={`status-${issue._id}`}>Change status</label>
          <select
            id={`status-${issue._id}`}
            className="select-sm"
            value={issue.status}
            onChange={handleStatusChange}
            disabled={loadingStatus}
            aria-busy={loadingStatus}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={handleDelete}
            disabled={loadingDelete}
            aria-label={`Delete issue: ${issue.title}`}
          >
            {loadingDelete ? '…' : 'Delete'}
          </button>
        </div>
      </div>
    </article>
  )
}
