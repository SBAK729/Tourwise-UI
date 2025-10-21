"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import ItineraryDisplay from "./itinerary-display"
import ConversationDisplay from "./conversation-display"
import Spinner from "@/components/ui/spinner"

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

interface ItineraryResult {
  user_id: string
  query: string
  user_intent: {
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

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  itinerary?: ItineraryResult
  conversation?: ConversationResponse
  intentType?: "conversation" | "plan_trip"
}

interface MessageListProps {
  messages: Message[]
  isLoading?: boolean
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  return (
    <div className="flex flex-col gap-4 p-6 max-w-4xl mx-auto w-full">
      {messages.map((message) => (
        <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
          {message.role === "user" ? (
            <Card className="max-w-md lg:max-w-2xl p-4 bg-primary text-primary-foreground">
              <p className="text-sm leading-relaxed">{message.content}</p>
              <span className="text-xs opacity-70 mt-2 block">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </Card>
          ) : (
            <div className="w-full">
              {message.intentType === "conversation" && message.conversation ? (
                <ConversationDisplay response={message.conversation.result.response} />
              ) : message.intentType === "plan_trip" && message.itinerary ? (
                <>
                  <Card className="p-4 bg-muted text-foreground mb-4">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <span className="text-xs opacity-70 mt-2 block">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </Card>
                  <ItineraryDisplay
                    destination={message.itinerary.user_intent.destination}
                    days={message.itinerary.result.generated_content.days}
                    estimatedCost={message.itinerary.result.estimated_total_cost_usd}
                    breakdown={message.itinerary.result.breakdown}
                    savingsOptions={message.itinerary.result.savings_options}
                    itineraryData={message.itinerary}
                  />
                </>
              ) : (
                <Card className="p-4 bg-muted text-foreground">
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </Card>
              )}
            </div>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <Card className="p-4 bg-muted text-foreground flex items-center gap-2">
            <Spinner />
            <span className="text-sm text-muted-foreground">Generating response...</span>
          </Card>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}
