import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('bugtrail_token'))

  // Restore user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('bugtrail_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { /* ignore */ }
    }
  }, [])

  const saveAuth = useCallback((tokenValue, userData) => {
    localStorage.setItem('bugtrail_token', tokenValue)
    localStorage.setItem('bugtrail_user', JSON.stringify(userData))
    setToken(tokenValue)
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('bugtrail_token')
    localStorage.removeItem('bugtrail_user')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, saveAuth, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
