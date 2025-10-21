"use client"

import { Card } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"

interface ConversationDisplayProps {
  response: string
}

export default function ConversationDisplay({ response }: ConversationDisplayProps) {
  return (
    <div className="w-full max-w-4xl space-y-4">
      <Card className="p-6 bg-muted/50 border border-border">
        <div className="flex items-start gap-3 mb-4">
          <MessageCircle className="text-primary flex-shrink-0 mt-1" size={20} />
          <div className="flex-1">
            <div className="prose prose-sm max-w-none text-foreground">
              {response.split("\n").map((paragraph, index) => {
                if (paragraph.trim() === "") return null

                // Handle bold text
                const parts = paragraph.split(/\*\*(.*?)\*\*/g)

                return (
                  <p key={index} className="mb-3 last:mb-0 leading-relaxed">
                    {parts.map((part, i) =>
                      i % 2 === 1 ? (
                        <strong key={i} className="font-semibold text-foreground">
                          {part}
                        </strong>
                      ) : (
                        <span key={i}>{part}</span>
                      ),
                    )}
                  </p>
                )
              })}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
