"use client"

import { useEffect, useState } from "react"
import AuthContainer from "@/components/auth/auth-container"
import ChatInterface from "@/components/chat/chat-interface"
import { apiClient } from "@/lib/api-client"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("User")

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      setIsAuthenticated(true)
      fetchUserInfo()
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUserInfo = async () => {
    try {
      const user = await apiClient.getMe()
      setUserName(user.email?.split("@")[0] || "User")
    } catch (err) {
      console.error("Failed to fetch user info:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAuthSuccess = async () => {
    setIsAuthenticated(true)
    await fetchUserInfo()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return isAuthenticated ? <ChatInterface userName={userName} /> : <AuthContainer onAuthSuccess={handleAuthSuccess} />
}
