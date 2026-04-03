"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Bell, Clock, Pill, Trash2, Repeat, User, Mail, Edit2 } from "lucide-react"

type RepeatOption = "once" | "daily" | "3times"

interface Reminder {
  id: string
  medicine: string
  time: string
  repeat: RepeatOption
  createdAt: number
  backendId?: string
}

interface UserInfo {
  firstName: string
  email: string
}

const REPEAT_LABELS: Record<RepeatOption, string> = {
  once: "One time",
  daily: "Daily",
  "3times": "3 times/day",
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [medicine, setMedicine] = useState("")
  const [time, setTime] = useState("")
  const [repeat, setRepeat] = useState<RepeatOption>("once")
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [tempFirstName, setTempFirstName] = useState("")
  const [tempEmail, setTempEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Load user info and reminders from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("reminderUserInfo")
    if (savedUser) {
      setUserInfo(JSON.parse(savedUser))
    } else {
      setShowUserModal(true)
    }

    const saved = localStorage.getItem("medicineReminders")
    if (saved) {
      setReminders(JSON.parse(saved))
    }
  }, [])

  // Save reminders to localStorage
  useEffect(() => {
    localStorage.setItem("medicineReminders", JSON.stringify(reminders))
  }, [reminders])

  const handleSaveUserInfo = () => {
    if (!tempFirstName.trim() || !tempEmail.trim()) return
    
    const newUserInfo = { firstName: tempFirstName.trim(), email: tempEmail.trim() }
    setUserInfo(newUserInfo)
    localStorage.setItem("reminderUserInfo", JSON.stringify(newUserInfo))
    setShowUserModal(false)
  }

  const handleEditUserInfo = () => {
    if (userInfo) {
      setTempFirstName(userInfo.firstName)
      setTempEmail(userInfo.email)
    }
    setShowUserModal(true)
  }

  const addReminder = async () => {
    if (!medicine || !time || !userInfo) return

    setIsLoading(true)
    
    try {
      // Call backend API
      const reminderDate = new Date()
      const [hours, minutes] = time.split(":")
      reminderDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)

      const response = await fetch(`${API_BASE_URL}/reminders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: userInfo.firstName,
          user_email: userInfo.email,
          medicine: medicine,
          reminder_time: reminderDate.toISOString(),
          repeat_type: repeat,
        }),
      })

      let backendId = undefined
      if (response.ok) {
        const data = await response.json()
        backendId = data.id
      } else {
        console.error("Failed to create reminder on backend")
      }

      // Add to localStorage for display
      const newReminder: Reminder = {
        id: crypto.randomUUID(),
        medicine,
        time,
        repeat,
        createdAt: Date.now(),
        backendId,
      }

      setReminders((prev) => [...prev, newReminder])
      setMedicine("")
      setTime("")
      setRepeat("once")
    } catch (error) {
      console.error("Error adding reminder:", error)
      // Still add to localStorage even if backend fails
      const newReminder: Reminder = {
        id: crypto.randomUUID(),
        medicine,
        time,
        repeat,
        createdAt: Date.now(),
      }
      setReminders((prev) => [...prev, newReminder])
      setMedicine("")
      setTime("")
      setRepeat("once")
    } finally {
      setIsLoading(false)
    }
  }

  // Remove expired reminders (one-time reminders whose time has passed)
  useEffect(() => {
    const checkExpiredReminders = () => {
      const now = new Date()
      const currentHours = now.getHours()
      const currentMinutes = now.getMinutes()
      const currentTime = currentHours * 60 + currentMinutes

      setReminders((prev) => {
        const filtered = prev.filter((reminder) => {
          // Daily and 3times reminders never expire
          if (reminder.repeat !== "once") return true

          // For one-time reminders, check if time has passed
          const [hours, minutes] = reminder.time.split(":").map(Number)
          const reminderTime = hours * 60 + minutes

          // Remove if reminder time has passed today
          if (reminderTime < currentTime) {
            // Also delete from backend if we have backendId
            if (reminder.backendId) {
              fetch(`${API_BASE_URL}/reminders/${reminder.backendId}`, {
                method: "DELETE",
              }).catch((error) => {
                console.error("Error deleting expired reminder from backend:", error)
              })
            }
            return false
          }
          return true
        })
        return filtered
      })
    }

    // Check immediately on mount
    checkExpiredReminders()

    // Check every minute
    const interval = setInterval(checkExpiredReminders, 60000)

    return () => clearInterval(interval)
  }, [])

  const deleteReminder = async (id: string, backendId?: string) => {
    // Delete from backend if we have a backendId
    if (backendId) {
      try {
        await fetch(`${API_BASE_URL}/reminders/${backendId}`, {
          method: "DELETE",
        })
      } catch (error) {
        console.error("Error deleting reminder from backend:", error)
      }
    }

    // Delete from localStorage
    setReminders((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 p-4 sm:p-8">
      {/* User Info Modal - Non-closable until user info is provided */}
      <Dialog 
        open={showUserModal} 
        onOpenChange={(open) => {
          // Only allow closing if userInfo exists (editing mode)
          if (userInfo) {
            setShowUserModal(open)
          }
        }}
      >
        <DialogContent 
          className="sm:max-w-md"
          onPointerDownOutside={(e) => {
            // Prevent closing when clicking outside if no user info
            if (!userInfo) {
              e.preventDefault()
            }
          }}
          onEscapeKeyDown={(e) => {
            // Prevent closing with Escape key if no user info
            if (!userInfo) {
              e.preventDefault()
            }
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Your Information
            </DialogTitle>
            <DialogDescription>
              Please enter your details to set up medicine reminders. You can edit this later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="e.g., John"
                value={tempFirstName}
                onChange={(e) => setTempFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g., john@example.com"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
              />
            </div>
            <Button
              onClick={handleSaveUserInfo}
              disabled={!tempFirstName.trim() || !tempEmail.trim()}
              className="w-full"
            >
              Save & Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
            <Bell className="w-6 h-6 sm:w-8 sm:h-8" />
            Medicine Reminders
          </h1>
          {userInfo && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
              <span className="truncate max-w-[150px] sm:max-w-[200px]" title={`${userInfo.firstName} (${userInfo.email})`}>
                {userInfo.firstName}
              </span>
              <span className=" sm:inline text-muted-foreground/60">
                ({userInfo.email})
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditUserInfo}
                className="h-8 px-2 flex-shrink-0"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Add Reminder Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Set New Reminder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Medicine Input */}
              <div className="space-y-2">
                <Label htmlFor="medicine" className="flex items-center gap-2">
                  <Pill className="w-4 h-4" />
                  Medicine
                </Label>
                <Input
                  id="medicine"
                  placeholder="e.g., Amoxicillin"
                  value={medicine}
                  onChange={(e) => setMedicine(e.target.value)}
                  disabled={!userInfo}
                />
              </div>

              {/* Time Input */}
              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  disabled={!userInfo}
                />
              </div>

              {/* Repeat Select */}
              <div className="space-y-2">
                <Label htmlFor="repeat" className="flex items-center gap-2">
                  <Repeat className="w-4 h-4" />
                  Repeat
                </Label>
                <Select 
                  value={repeat} 
                  onValueChange={(v) => setRepeat(v as RepeatOption)}
                  disabled={!userInfo}
                >
                  <SelectTrigger id="repeat">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">One time</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="3times">3 times/day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!userInfo && (
              <p className="text-sm text-muted-foreground text-center">
                Please set up your information above to add reminders.
              </p>
            )}

            <Button
              onClick={addReminder}
              disabled={!medicine || !time || !userInfo || isLoading}
              className="w-full"
            >
              {isLoading ? "Adding..." : "Add Reminder"}
            </Button>
          </CardContent>
        </Card>

        {/* Reminders List */}
        <Card className="border-0 shadow-none p-0 bg-transparent">
          <CardHeader className="px-0 sm:px-0 pb-4">
            <CardTitle className="text-lg sm:text-xl text-blue-600">
              ⏰ Your Reminders ({reminders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 sm:px-0">
            {reminders.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No reminders yet. Add one above!
              </p>
            ) : (
              <div className="space-y-3">
                {reminders.map((reminder) => {
                  // Convert 24h time to 12h format with AM/PM
                  const [hours, minutes] = reminder.time.split(':').map(Number)
                  const period = hours >= 12 ? 'pm' : 'am'
                  const displayHours = hours % 12 || 12
                  const displayTime = `${displayHours}:${minutes.toString().padStart(2, '0')}${period}`
                  
                  return (
                    <div
                      key={reminder.id}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border-0 sm:border sm:border-blue-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Time Badge - Large and Prominent */}
                      <div className="flex-shrink-0 bg-blue-500 text-white rounded-xl px-3 py-2 sm:px-4 sm:py-3 flex flex-col items-center justify-center min-w-[70px] sm:min-w-[85px]">
                        <span className="text-lg sm:text-2xl font-bold leading-none">
                          {displayHours}:{minutes.toString().padStart(2, '0')}
                        </span>
                        <span className="text-xs sm:text-sm font-medium uppercase tracking-wider mt-0.5">
                          {period}
                        </span>
                      </div>
                      
                      {/* Medicine Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base sm:text-lg text-foreground truncate">
                          {reminder.medicine}
                        </p>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-0.5">
                          <Repeat className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span>{REPEAT_LABELS[reminder.repeat]}</span>
                        </div>
                      </div>
                      
                      {/* Delete Button */}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteReminder(reminder.id, reminder.backendId)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-full"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
