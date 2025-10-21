"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, DollarSign, Clock, Mail } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

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

interface ItineraryDisplayProps {
  destination: string
  days: Day[]
  estimatedCost: number
  breakdown: {
    lodging: number
    meals: number
    transport: number
    attractions: number
  }
  savingsOptions: Array<{
    option: string
    savings_usd: number
  }>
  itineraryData?: any
}

export default function ItineraryDisplay({
  destination,
  days,
  estimatedCost,
  breakdown,
  savingsOptions,
  itineraryData,
}: ItineraryDisplayProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const {email} = useAuth()

  // ✅ Handle Save to Email
  const handleSaveToEmail = async () => {
    setIsSaving(true)
    setSaveMessage(null)

    try {
      // You can replace this with your app's actual user email source

      const userEmail = email 
      console.log(email)

      if (!userEmail) {
        setSaveMessage("Email is required to send itinerary.")
        setIsSaving(false)
        return
      }

      // Send itinerary + user email to backend → n8n webhook
      const response = await fetch("https://tourwise-xnrb.onrender.com/auth/send-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          email: userEmail,
          result: itineraryData?.result,
          destination,
          estimatedCost,
        }),
      })

      if (!response.ok) throw new Error("Failed to send itinerary")

      setSaveMessage("Itinerary sent to your email successfully!")
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (error) {
      console.error("Error saving itinerary:", error)
      setSaveMessage("Failed to send itinerary. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  // ✅ Limit number of displayed days
  const displayDays = (() => {
    const maxDays = itineraryData?.user_intent?.duration_days || days.length
    return days.slice(0, maxDays)
  })()

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="text-primary" size={24} />
        <div>
          <h2 className="text-2xl font-bold text-foreground">{destination} Itinerary</h2>
          <p className="text-sm text-muted-foreground">{displayDays.length} days planned</p>
        </div>
      </div>

      {/* Days and Activities */}
      <div className="space-y-4">
        {displayDays.map((day, dayIndex) => (
          <Card key={dayIndex} className="p-4 border border-border">
            <h3 className="font-semibold text-foreground mb-4">{day.date}</h3>
            <div className="space-y-3">
              {day.activities.map((activity, actIndex) => (
                <div key={actIndex} className="flex gap-4 pb-3 border-b border-border last:border-b-0">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg">
                      <Clock size={20} className="text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                      <span className="text-xs bg-muted px-2 py-1 rounded text-foreground">
                        {activity.duration_mins} mins
                      </span>
                    </div>
                    <p className="text-sm text-foreground mt-2">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-2 italic">{activity.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Cost Breakdown */}
      <Card className="p-6 border border-border bg-muted/50">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="text-primary" size={20} />
          <h3 className="font-semibold text-foreground">Cost Breakdown</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Lodging</p>
            <p className="text-lg font-bold text-foreground">${breakdown.lodging}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Meals</p>
            <p className="text-lg font-bold text-foreground">${breakdown.meals}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Transport</p>
            <p className="text-lg font-bold text-foreground">${breakdown.transport}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Attractions</p>
            <p className="text-lg font-bold text-foreground">${breakdown.attractions}</p>
          </div>
        </div>
        <div className="border-t border-border pt-4">
          <p className="text-sm text-muted-foreground mb-1">Estimated Total</p>
          <p className="text-3xl font-bold text-primary">${estimatedCost}</p>
        </div>
      </Card>

      {/* Savings Options */}
      {savingsOptions.length > 0 && (
        <Card className="p-6 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Money-Saving Tips</h3>
          <div className="space-y-3">
            {savingsOptions.map((option, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{option.option}</p>
                  <p className="text-xs text-primary font-semibold mt-1">Save ${option.savings_usd}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Save to Email Button */}
      <div className="flex flex-col gap-2">
        <Button
          onClick={handleSaveToEmail}
          disabled={isSaving}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2"
        >
          <Mail size={18} />
          {isSaving ? "Saving..." : "Save Itinerary to Email"}
        </Button>
        {saveMessage && (
          <p
            className={`text-sm text-center ${
              saveMessage.includes("successfully") ? "text-green-600" : "text-red-600"
            }`}
          >
            {saveMessage}
          </p>
        )}
      </div>
    </div>
  )
}
