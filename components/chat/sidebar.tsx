"use client"

import { useState } from "react"
import { Menu, Plus, Trash2, LogOut, Settings } from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  onLogout: () => void
}

export default function Sidebar({ isOpen, onToggle, onLogout }: SidebarProps) {
  const [conversations, setConversations] = useState<Array<{ id: string; title: string }>>([])

  const handleNewChat = () => {
    const newConversation = {
      id: Date.now().toString(),
      title: "New Conversation",
    }
    setConversations([newConversation, ...conversations])
  }

  const handleDeleteConversation = (id: string) => {
    setConversations(conversations.filter((conv) => conv.id !== id))
  }

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col h-screen`}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <button
          onClick={onToggle}
          className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} className="text-sidebar-foreground" />
        </button>
        {isOpen && (
          <button
            onClick={handleNewChat}
            className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
            aria-label="New chat"
          >
            <Plus size={20} className="text-sidebar-foreground" />
          </button>
        )}
      </div>

      {/* Conversations List */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {conversations.length === 0 ? (
            <p className="text-sm text-sidebar-foreground/50 text-center py-8">No conversations yet</p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className="group flex items-center justify-between p-3 rounded-lg hover:bg-sidebar-accent transition-colors"
              >
                <span className="text-sm text-sidebar-foreground truncate flex-1">{conv.title}</span>
                <button
                  onClick={() => handleDeleteConversation(conv.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/20 rounded transition-all"
                  aria-label="Delete conversation"
                >
                  <Trash2 size={16} className="text-destructive" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4 space-y-2">
        {isOpen && (
          <>
            <button className="w-full flex items-center gap-3 p-2 hover:bg-sidebar-accent rounded-lg transition-colors text-sidebar-foreground text-sm">
              <Settings size={18} />
              <span>Settings</span>
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive text-sm"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
