import { useAuth } from '../context/AuthContext'

export default function Sidebar({ view, setView, issueCount }) {
  const { user, logout } = useAuth()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '▦' },
    { id: 'create',    label: 'New Issue',  icon: '+' },
  ]

  return (
    <aside className="sidebar" aria-label="Main navigation">
      {/* Brand */}
      <div className="sidebar-header">
        <span className="logo-mark" aria-hidden="true">🐛</span>
        <span className="logo-text">BugTrail</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <p className="nav-section-label">Workspace</p>
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item${view === item.id ? ' active' : ''}`}
            onClick={() => setView(item.id)}
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.id === 'dashboard' && issueCount > 0 && (
              <span className="nav-badge" aria-label={`${issueCount} issues`}>
                {issueCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="avatar" aria-hidden="true">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
        </div>
        <button
          type="button"
          className="signout-btn"
          onClick={logout}
          aria-label="Sign out"
        >
          <span aria-hidden="true">↩</span> Sign out
        </button>
      </div>
    </aside>
  )
}
