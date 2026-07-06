import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('knot_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    persist(res.data)
    return res.data
  }

  const register = async (fullName, email, password, role) => {
    const res = await api.post('/auth/register', { fullName, email, password, role })
    persist(res.data)
    return res.data
  }

  const persist = (data) => {
    localStorage.setItem('knot_token', data.token)
    const userData = { userId: data.userId, fullName: data.fullName, email: data.email, role: data.role }
    localStorage.setItem('knot_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('knot_token')
    localStorage.removeItem('knot_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
