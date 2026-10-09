const STATUS_META = {
  'Open':        { className: 'badge-open',        label: 'Open' },
  'In Progress': { className: 'badge-in-progress', label: 'In Progress' },
  'Resolved':    { className: 'badge-resolved',    label: 'Resolved' },
}

const PRIORITY_META = {
  'Low':    { className: 'priority-low',    dot: '●' },
  'Medium': { className: 'priority-medium', dot: '●' },
  'High':   { className: 'priority-high',   dot: '●' },
}

export function StatusBadge({ status }) {
  const meta = STATUS_META[status] ?? { className: '', label: status }
  return <span className={`badge ${meta.className}`}>{meta.label}</span>
}

export function PriorityIndicator({ priority }) {
  const meta = PRIORITY_META[priority] ?? { className: '', dot: '●' }
  return (
    <span className={`priority ${meta.className}`}>
      <span aria-hidden="true">{meta.dot}</span> {priority}
    </span>
  )
}
