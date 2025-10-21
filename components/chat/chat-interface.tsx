"use client"

import { useState } from "react"
import Sidebar from "./sidebar"
import ChatArea from "./chat-area"
import { useAuth } from "@/hooks/use-auth"

interface ChatInterfaceProps {
  userName: string
}

export default function ChatInterface({ userName }: ChatInterfaceProps) {
  const { logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} onLogout={logout} />

      <ChatArea userName={userName} />
    </div>
  )
}
