import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchIssues } from '../api/issues'
import { useAuth } from '../context/AuthContext'
import IssueCard from './IssueCard'

const STATUS_ORDER = ['Open', 'In Progress', 'Resolved']

export default function Dashboard({ onNewIssue }) {
  const { user } = useAuth()
  const [issues, setIssues]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [filter, setFilter]   = useState('All')
  const [search, setSearch]   = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetchIssues()
      setIssues(res.data.issues)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load issues.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleUpdated = useCallback((updated) => {
    setIssues((prev) => prev.map((i) => (i._id === updated._id ? updated : i)))
  }, [])

  const handleDeleted = useCallback((id) => {
    setIssues((prev) => prev.filter((i) => i._id !== id))
  }, [])

  // Stats always from full list, not filtered
  const counts = useMemo(() =>
    STATUS_ORDER.reduce((acc, s) => {
      acc[s] = issues.filter((i) => i.status === s).length
      return acc
    }, {}),
  [issues])

  // Apply status filter then search
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return issues
      .filter((i) => filter === 'All' || i.status === filter)
      .filter((i) => {
        if (!q) return true
        return (
          i.title.toLowerCase().includes(q) ||
          (i.description || '').toLowerCase().includes(q)
        )
      })
  }, [issues, filter, search])

  const filters = ['All', ...STATUS_ORDER]
  const greeting = user?.name ? `${user.name.split(' ')[0]}'s workspace` : 'My workspace'

  return (
    <div className="dashboard">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">{greeting}</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={onNewIssue}>
          <span aria-hidden="true">+</span> New Issue
        </button>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        {STATUS_ORDER.map((s) => (
          <button
            key={s}
            type="button"
            className={`stat-card stat-clickable${filter === s ? ' stat-active' : ''}`}
            onClick={() => setFilter(filter === s ? 'All' : s)}
            aria-pressed={filter === s}
          >
            <span className={`stat-dot stat-dot-${s.replace(' ', '-').toLowerCase()}`} aria-hidden="true" />
            <span className="stat-value">{counts[s]}</span>
            <span className="stat-label">{s}</span>
          </button>
        ))}
        <div className="stat-card stat-total">
          <span className="stat-value">{issues.length}</span>
          <span className="stat-label">Total</span>
        </div>
      </div>

      {/* Search + filter toolbar */}
      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            className="search-input"
            type="search"
            placeholder="Search by title or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search issues"
          />
          {search && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >×</button>
          )}
        </div>

        <div className="filter-tabs" role="group" aria-label="Filter by status">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              className={`filter-tab${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
              {f !== 'All' && (
                <span className="filter-count">{counts[f] ?? 0}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Results summary */}
      {!loading && !error && (
        <p className="results-summary">
          {visible.length === 0
            ? null
            : `${visible.length} issue${visible.length !== 1 ? 's' : ''}${search ? ` matching "${search}"` : ''}`}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="state-placeholder">
          <span className="spinner" aria-label="Loading issues" />
          <p>Loading issues…</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="alert alert-error">
          {error}
          <button type="button" className="link-btn" onClick={load}> Retry</button>
        </div>
      )}

      {/* Empty states */}
      {!loading && !error && visible.length === 0 && issues.length === 0 && (
        <div className="state-placeholder">
          <span className="empty-icon" aria-hidden="true">📭</span>
          <p className="empty-title">No issues yet</p>
          <p className="empty-body">Create your first issue to start tracking work.</p>
          <button type="button" className="btn btn-primary" onClick={onNewIssue}>
            Create your first issue
          </button>
        </div>
      )}

      {!loading && !error && visible.length === 0 && issues.length > 0 && (
        <div className="state-placeholder">
          <span className="empty-icon" aria-hidden="true">🔍</span>
          <p className="empty-title">No results</p>
          <p className="empty-body">
            {search
              ? `Nothing matched "${search}". Try a different search term.`
              : `No "${filter}" issues found.`}
          </p>
        </div>
      )}

      {/* Issue list */}
      {!loading && !error && visible.length > 0 && (
        <div className="issue-list">
          {visible.map((issue) => (
            <IssueCard
              key={issue._id}
              issue={issue}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}
    </div>
  )
}
