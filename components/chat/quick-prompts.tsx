"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface QuickPromptsProps {
  onSelectPrompt: (prompt: string) => void
}

const PROMPTS = [
  {
    id: 1,
    title: "Plan a 2-day trip to Ethiopia",
    icon: "✈",
  },
  {
    id: 2,
    title: "Create a 5-day itinerary for Ethiopia",
    icon: "🇪🇹",
  },
  {
    id: 3,
    title: "Plan a weekend getaway to Addis Abeba",
    icon: "🌃",
  },
  {
    id: 4,
    title: "Design a 10-day adventure in Semen mountain national park",
    icon: "⛰️",
  },
]

export default function QuickPrompts({ onSelectPrompt }: QuickPromptsProps) {
  return (
    <div className="w-full max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {PROMPTS.map((prompt) => (
          <Card
            key={prompt.id}
            className="p-4 cursor-pointer hover:bg-muted transition-colors border border-border"
            onClick={() => onSelectPrompt(prompt.title)}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{prompt.icon}</span>
              <p className="text-sm text-foreground font-medium">{prompt.title}</p>
            </div>
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground bg-transparent"
      >
        <RefreshCw size={16} />
        <span>Refresh Prompts</span>
      </Button>
    </div>
  )
}
