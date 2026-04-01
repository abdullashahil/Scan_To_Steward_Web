"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Check, Clock, Pill, Trash2, Repeat } from "lucide-react"
import { getMessagingInstance } from "@/lib/firebase"
import { getToken, onMessage } from "firebase/messaging"

type RepeatOption = "once" | "daily" | "3times"

interface Reminder {
  id: string
  medicine: string
  time: string
  repeat: RepeatOption
  completed: boolean
  createdAt: number
}

const REPEAT_LABELS: Record<RepeatOption, string> = {
  once: "One time",
  daily: "Daily",
  "3times": "3 times/day",
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [medicine, setMedicine] = useState("")
  const [time, setTime] = useState("")
  const [repeat, setRepeat] = useState<RepeatOption>("once")
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | "default">("default")
  const [fcmToken, setFcmToken] = useState<string | null>(null)

  // Hardcode VAPID key for testing (from .env.local)
  const VAPID_KEY = "BHWGm2K3_pulEPuV9Xcp0QT5jp-FnO6VHXizVN_V4ixpa8Vkbb4GzxZFUtcTCYUC8YINIaIsZyUs1rL1pepaTno"

  // Load reminders from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("medicineReminders")
    if (saved) {
      setReminders(JSON.parse(saved))
    }
  }, [])

  // Save reminders to localStorage
  useEffect(() => {
    localStorage.setItem("medicineReminders", JSON.stringify(reminders))
  }, [reminders])

  // Get FCM Token for push notifications
  useEffect(() => {
    const setupNotifications = async () => {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)

      if (permission === "granted") {
        const messaging = await getMessagingInstance()
        if (!messaging) {
          console.log("[FCM] Messaging not supported on this environment")
          return
        }

        console.log("[FCM] Permission granted, registering service worker...", messaging)
        try {
          // Register the Firebase messaging service worker
          const registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
          )
          console.log("[FCM] SW registered:", registration)

          // IMPORTANT: wait until it's ACTIVE before calling getToken
          await new Promise((resolve) => {
            if (registration.active) return resolve(true)

            registration.addEventListener("updatefound", () => {
              const newWorker = registration.installing
              newWorker?.addEventListener("statechange", () => {
                if (newWorker.state === "activated") {
                  resolve(true)
                }
              })
            })
          })
          console.log("[FCM] SW is ACTIVE now")

          const token = await getToken(messaging, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: registration,
          })
          console.log("token", token)
          if (token) {
            console.log("FCM Token:", token)
            setFcmToken(token)
          } else {
            console.log("No FCM token available")
          }

          // Handle foreground FCM messages
          onMessage(messaging, (payload) => {
            console.log("[FCM] Foreground message received:", payload)
            new Notification(payload.notification?.title || "Medicine Reminder", {
              body: payload.notification?.body || "Time to take your medicine",
              icon: "/favicon.ico",
            })
          })
        } catch (err) {
          console.error("Error getting FCM token:", err)
        }
      }
    }

    setupNotifications()
  }, [])

  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
    }
  }, [])

  const addReminder = () => {
    if (!medicine || !time) return

    const newReminder: Reminder = {
      id: crypto.randomUUID(),
      medicine,
      time,
      repeat,
      completed: false,
      createdAt: Date.now(),
    }

    setReminders((prev) => [...prev, newReminder])
    setMedicine("")
    setTime("")
    setRepeat("once")
  }

  const completeReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: true } : r))
    )
  }

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id))
  }

  const upcomingReminders = reminders.filter((r) => !r.completed)
  const completedReminders = reminders.filter((r) => r.completed)

  return (
    <div className="min-h-screen bg-background pt-24 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center flex items-center justify-center gap-3">
          <Bell className="w-8 h-8" />
          Medicine Reminders
        </h1>

        {/* Notification Permission Banner */}
        {notificationPermission !== "granted" ? (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4 flex items-center justify-between">
              <p className="text-sm text-blue-800">
                Enable browser notifications to get alerts when it&apos;s time to take your medicine.
              </p>
              <Button
                onClick={requestNotificationPermission}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Enable
              </Button>
            </CardContent>
          </Card>
        ) : fcmToken ? (
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="p-4">
              <p className="text-sm text-green-800 font-medium">
                ✅ Push notifications enabled! FCM token acquired.
              </p>
              <p className="text-xs text-green-600 mt-1 truncate" title={fcmToken}>
                Token: {fcmToken.substring(0, 30)}...
              </p>
            </CardContent>
          </Card>
        ) : null}

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
                />
              </div>

              {/* Repeat Select */}
              <div className="space-y-2">
                <Label htmlFor="repeat" className="flex items-center gap-2">
                  <Repeat className="w-4 h-4" />
                  Repeat
                </Label>
                <Select value={repeat} onValueChange={(v) => setRepeat(v as RepeatOption)}>
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

            <Button
              onClick={addReminder}
              disabled={!medicine || !time}
              className="w-full"
            >
              Add Reminder
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Reminders */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-blue-600">
              ⏰ Upcoming Reminders ({upcomingReminders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingReminders.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No upcoming reminders. Add one above!
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {reminder.time}
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{reminder.medicine}</p>
                        <p className="text-sm text-muted-foreground">
                          {REPEAT_LABELS[reminder.repeat]}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => completeReminder(reminder.id)}
                        className="text-green-600 hover:bg-green-50"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => deleteReminder(reminder.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-green-600">
              ✅ Completed ({completedReminders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {completedReminders.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No completed reminders yet.
              </p>
            ) : (
              <div className="space-y-3">
                {completedReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200 opacity-75"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {reminder.time}
                      </div>
                      <div>
                        <p className="font-semibold text-lg line-through">{reminder.medicine}</p>
                        <p className="text-sm text-muted-foreground">
                          {REPEAT_LABELS[reminder.repeat]}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => deleteReminder(reminder.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
