"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Bell, CheckCircle2, Clock, Filter, Droplet, Activity, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AlertsPage({ params }: { params: { role: string } }) {
  const { role } = params
  const { toast } = useToast()
  const [alerts, setAlerts] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    // Generate simulated alerts
    const generatedAlerts = []

    // Leak alerts
    if (Math.random() > 0.5) {
      generatedAlerts.push({
        id: "alert-1",
        type: "leak",
        title: "Potential Leak Detected",
        message: "Unusual water flow pattern detected in your area.",
        severity: "medium",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        read: false,
      })
    }

    // Quality alerts
    if (Math.random() > 0.6) {
      generatedAlerts.push({
        id: "alert-2",
        type: "quality",
        title: "Water Quality Advisory",
        message: "Temporary increase in turbidity levels in your zone. Water remains safe for use.",
        severity: "low",
        timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
        read: false,
      })
    }

    // Billing alerts
    generatedAlerts.push({
      id: "alert-3",
      type: "billing",
      title: "Bill Payment Reminder",
      message: "Your water bill is due in 5 days. Please make payment to avoid late fees.",
      severity: "info",
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      read: true,
    })

    // Maintenance alerts
    generatedAlerts.push({
      id: "alert-4",
      type: "maintenance",
      title: "Scheduled Maintenance",
      message:
        "Water supply will be temporarily interrupted on June 15th from 10:00 AM to 2:00 PM for scheduled maintenance.",
      severity: "info",
      timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
      read: true,
    })

    // Usage alerts for industrial users
    if (role === "industrial") {
      generatedAlerts.push({
        id: "alert-5",
        type: "usage",
        title: "Approaching Usage Limit",
        message: "Your facility is at 85% of the allocated monthly water quota. Consider conservation measures.",
        severity: "medium",
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        read: false,
      })
    }

    // Conservation alerts
    generatedAlerts.push({
      id: "alert-6",
      type: "conservation",
      title: "Conservation Advisory",
      message: "Due to seasonal water scarcity, please reduce non-essential water usage during peak hours (4PM-8PM).",
      severity: "info",
      timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
      read: true,
    })

    setAlerts(generatedAlerts)

    // Generate notifications
    const generatedNotifications = [
      {
        id: "notif-1",
        title: "System Update",
        message: "The water management system has been updated with new features.",
        timestamp: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
        read: true,
      },
      {
        id: "notif-2",
        title: "Account Verification",
        message: "Your account has been successfully verified.",
        timestamp: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
        read: true,
      },
      {
        id: "notif-3",
        title: "New Feature Available",
        message: "You can now download your water usage reports directly from the dashboard.",
        timestamp: new Date(Date.now() - 3600000 * 24 * 14).toISOString(),
        read: false,
      },
    ]

    setNotifications([...generatedNotifications])
  }, [role])

  const markAsRead = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, read: true } : alert)))

    toast({
      title: "Alert marked as read",
      description: "This alert has been marked as read.",
    })
  }

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, read: true })))

    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))

    toast({
      title: "All marked as read",
      description: "All alerts and notifications have been marked as read.",
    })
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "leak":
        return <Droplet className="h-4 w-4" />
      case "quality":
        return <Activity className="h-4 w-4" />
      case "billing":
        return <CreditCard className="h-4 w-4" />
      case "usage":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const unreadCount = alerts.filter((alert) => !alert.read).length + notifications.filter((notif) => !notif.read).length

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Alerts & Notifications</h1>

        <div className="flex items-center mt-4 sm:mt-0">
          {unreadCount > 0 && (
            <Badge variant="secondary" className="mr-4">
              {unreadCount} unread
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        </div>
      </div>

      <Tabs defaultValue="alerts">
        <TabsList>
          <TabsTrigger value="alerts">
            Alerts
            {alerts.filter((alert) => !alert.read).length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {alerts.filter((alert) => !alert.read).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications
            {notifications.filter((notif) => !notif.read).length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {notifications.filter((notif) => !notif.read).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>System Alerts</CardTitle>
                  <CardDescription>Important alerts about your water service</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {alerts.length > 0 ? (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className={`rounded-lg border p-4 ${!alert.read ? "bg-muted/50" : ""}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className={`rounded-full p-1.5 ${getSeverityColor(alert.severity)}`}>
                            {getAlertIcon(alert.type)}
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <h3 className="font-medium">{alert.title}</h3>
                              {!alert.read && (
                                <Badge variant="secondary" className="ml-2">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                            <div className="flex items-center mt-2 text-xs text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              {new Date(alert.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        {!alert.read && (
                          <Button variant="ghost" size="sm" onClick={() => markAsRead(alert.id)}>
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Alerts</h3>
                  <p className="text-muted-foreground max-w-md">
                    You don't have any alerts at the moment. We'll notify you when there's something important.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Notifications</CardTitle>
              <CardDescription>Updates and information about the water management system</CardDescription>
            </CardHeader>
            <CardContent>
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`rounded-lg border p-4 ${!notification.read ? "bg-muted/50" : ""}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className="rounded-full p-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            <Bell className="h-4 w-4" />
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <h3 className="font-medium">{notification.title}</h3>
                              {!notification.read && (
                                <Badge variant="secondary" className="ml-2">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                            <div className="flex items-center mt-2 text-xs text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              {new Date(notification.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setNotifications((prev) =>
                                prev.map((notif) => (notif.id === notification.id ? { ...notif, read: true } : notif)),
                              )
                            }}
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Notifications</h3>
                  <p className="text-muted-foreground max-w-md">
                    You don't have any notifications at the moment. Check back later for updates.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Alert>
          <Bell className="h-4 w-4" />
          <AlertTitle>Alert Preferences</AlertTitle>
          <AlertDescription>
            You can customize your alert preferences in your account settings. Choose which types of alerts you want to
            receive and how you want to be notified.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}

