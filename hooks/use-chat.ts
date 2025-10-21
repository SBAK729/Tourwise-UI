"use client"

import { useState, useCallback } from "react"
import { apiClient } from "@/lib/api-client"

interface Activity {
  time: string
  title: string
  description: string
  duration_mins: number
  notes: string
}

interface Day {
  date: string
  activities: Activity[]
}

interface ConversationResponse {
  user_id: string
  query: string
  user_intent: {
    intent_type: "conversation"
    destination: string
    duration_days: null
    budget_usd: null
    travel_dates: {
      start: null
      end: null
    }
    preferences: {
      interests: string[]
    }
  }
  result: {
    response: string
    mode: "conversation"
  }
}

interface ItineraryResult {
  user_id: string
  query: string
  user_intent: {
    intent_type: "plan_trip"
    destination: string
    duration_days: number
    budget_usd: number | null
    travel_dates: {
      start: string | null
      end: string | null
    }
    preferences: {
      interests: string[]
    }
  }
  result: {
    generated_content: {
      days: Day[]
    }
    savings_options: Array<{
      option: string
      savings_usd: number
    }>
    estimated_total_cost_usd: number
    breakdown: {
      lodging: number
      meals: number
      transport: number
      attractions: number
    }
  }
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  itinerary?: ItineraryResult
  conversation?: ConversationResponse
  intentType?: "conversation" | "plan_trip"
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("authToken")
      const userId = localStorage.getItem("userId") || "user_" + Date.now()

      const response = await apiClient.generateItinerary(content, userId)

      const intentType = response.user_intent?.intent_type || "plan_trip"

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        intentType,
      }

      if (intentType === "conversation") {
        assistantMessage.content = response.result?.response || "I couldn't generate a response."
        assistantMessage.conversation = response
      } else {
        assistantMessage.content = `I've created an itinerary for you! Here's your ${response.user_intent?.destination || "trip"} plan.`
        assistantMessage.itinerary = response
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err: any) {
      console.error("Failed to send message:", err)
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: err.message || "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    messages,
    sendMessage,
    isLoading,
    error,
  }
}
