"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Paperclip, ImageIcon, Globe } from "lucide-react"
import MessageList from "./message-list"
import QuickPrompts from "./quick-prompts"
import { useChat } from "@/hooks/use-chat"
import Spinner from "@/components/ui/spinner"

interface ChatAreaProps {
  userName: string
}

export default function ChatArea({ userName }: ChatAreaProps) {
  const { messages, sendMessage, isLoading } = useChat()
  const [input, setInput] = useState("")
  const [showPrompts, setShowPrompts] = useState(messages.length === 0)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    await sendMessage(input)
    setInput("")
    setShowPrompts(false)
  }

  const handleQuickPrompt = async (prompt: string) => {
    await sendMessage(prompt)
    setShowPrompts(false)
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {showPrompts ? (
          <div className="h-full flex flex-col items-center justify-center px-4">
            <div className="text-center mb-12 max-w-2xl">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Hi there, <span className="text-primary">{userName}</span>
              </h1>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                What would <span className="text-primary">like to know?</span>
              </h2>
              <p className="text-muted-foreground text-sm">
                Use one of the most common prompts below or use your own to begin
              </p>
            </div>

            <QuickPrompts onSelectPrompt={handleQuickPrompt} />
          </div>
        ) : (
          <MessageList messages={messages} isLoading={isLoading} />
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background p-6">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-card rounded-lg border border-border p-4">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Ask whatever you want..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isLoading}
                  className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Add attachment"
                >
                  <Paperclip size={20} />
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Use image"
                >
                  <ImageIcon size={20} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Globe size={16} />
                  <span>All Web</span>
                </button>
              </div>
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2 h-auto flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    <span className="text-xs">Sending...</span>
                  </>
                ) : (
                  <Send size={20} />
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
