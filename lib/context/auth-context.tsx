"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  isEmailVerified: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem("authToken")
    console.log("Auth context initializing, stored token:", storedToken ? "exists" : "none")

    if (storedToken) {
      setToken(storedToken)
      validateToken(storedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const validateToken = async (authToken: string) => {
    try {
      console.log("Validating token...")
      const response = await fetch("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      console.log("Token validation response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Token validation response:", data)

        if (data.success && data.user) {
          console.log("Token valid, setting user:", data.user.email)
          setUser(data.user)
          setToken(authToken)
        } else {
          console.log("Token invalid, clearing storage")
          localStorage.removeItem("authToken")
          setToken(null)
          setUser(null)
        }
      } else {
        console.log("Token validation failed, clearing storage")
        localStorage.removeItem("authToken")
        setToken(null)
        setUser(null)
      }
    } catch (error) {
      console.error("Error validating token:", error)
      localStorage.removeItem("authToken")
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting login for:", email)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log("Login response:", data)

      if (data.success && data.token && data.user) {
        const authToken = data.token
        console.log("Login successful, storing token")
        localStorage.setItem("authToken", authToken)
        setToken(authToken)
        setUser(data.user)
        return true
      } else {
        console.error("Login failed:", data.message)
        return false
      }
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    console.log("Logging out user")
    localStorage.removeItem("authToken")
    setToken(null)
    setUser(null)
    router.push("/login")
  }

  const contextValue = {
    user,
    login,
    logout,
    loading,
    token,
  }

  console.log("Auth context state:", {
    hasUser: !!user,
    hasToken: !!token,
    loading,
    userEmail: user?.email,
  })

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
