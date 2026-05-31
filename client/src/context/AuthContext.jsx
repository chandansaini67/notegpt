import { createContext, useContext, useState, useEffect } from 'react'
import { getMe, login as apiLogin, signup as apiSignup } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token')
      if (savedToken) {
        try {
          const res = await getMe()
          setUser(res.data)
          setToken(savedToken)
        } catch (err) {
          console.error('Auth check failed:', err)
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (email, password) => {
    const res = await apiLogin({ email, password })
    const { token: newToken, user: userData } = res.data
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(userData)
    return res.data
  }

  const signup = async (name, email, password) => {
    const res = await apiSignup({ name, email, password })
    const { token: newToken, user: userData } = res.data
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(userData)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user && !!token
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
