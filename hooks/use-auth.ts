"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  // Load user from localStorage on mount
  const loadUser = useCallback(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }, [router])

  console.log("from use Auth", user)

  return {
    user: user || JSON.parse(localStorage.getItem("user") || "null"),
    email: localStorage.getItem("email") || "",
    logout,
    loadUser,
  }
}
