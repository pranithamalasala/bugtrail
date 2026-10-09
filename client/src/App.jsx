import { useState } from 'react'
import AuthPage from './components/AuthPage'
import CreateIssueForm from './components/CreateIssueForm'
import Dashboard from './components/Dashboard'
import Sidebar from './components/Sidebar'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { isAuthenticated } = useAuth()
  const [view, setView] = useState('dashboard')
  const [issues, setIssues] = useState([])

  if (!isAuthenticated) {
    return <AuthPage />
  }

  const handleCreated = (issue) => {
    setIssues((prev) => [issue, ...prev])
    setView('dashboard')
  }

  return (
    <div className="app-layout">
      <Sidebar view={view} setView={setView} />
      <main className="main-content">
        {view === 'dashboard' && (
          <Dashboard onNewIssue={() => setView('create')} />
        )}
        {view === 'create' && (
          <CreateIssueForm
            onCreated={handleCreated}
            onCancel={() => setView('dashboard')}
          />
        )}
      </main>
    </div>
  )
}
