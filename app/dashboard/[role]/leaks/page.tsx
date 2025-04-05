"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { AlertTriangle, CheckCircle2, Clock, MapPin, Droplet } from "lucide-react"
import { generateSensorData } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function LeakDetectionPage({ params }: { params: { role: string } }) {
  const { role } = params
  const { toast } = useToast()
  const [leakData, setLeakData] = useState<any[]>([])
  const [leakHistory, setLeakHistory] = useState<any[]>([])
  const [leaksByZone, setLeaksByZone] = useState<any[]>([])
  const [leaksBySeverity, setLeaksBySeverity] = useState<any[]>([])

  useEffect(() => {
    // Generate simulated data
    setLeakData(generateSensorData("leakDetection", 8))

    // Generate leak history data
    const historyData = []
    for (let i = 0; i < 12; i++) {
      const month = new Date()
      month.setMonth(month.getMonth() - i)

      historyData.push({
        month: month.toLocaleString("default", { month: "short", year: "numeric" }),
        leaks: Math.floor(Math.random() * 10) + 1,
      })
    }
    setLeakHistory(historyData.reverse())

    // Generate leaks by zone
    setLeaksByZone([
      { name: "Zone 1", value: 12 },
      { name: "Zone 2", value: 8 },
      { name: "Zone 3", value: 15 },
      { name: "Zone 4", value: 5 },
      { name: "Zone 5", value: 10 },
    ])

    // Generate leaks by severity
    setLeaksBySeverity([
      { name: "High", value: 7 },
      { name: "Medium", value: 18 },
      { name: "Low", value: 25 },
    ])
  }, [])

  const handleResolve = (leakId: string) => {
    setLeakData((prev) => prev.map((leak) => (leak.id === leakId ? { ...leak, status: "Resolved" } : leak)))

    toast({
      title: "Leak marked as resolved",
      description: "Maintenance team has been notified.",
    })
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]
  const SEVERITY_COLORS = {
    High: "#ef4444",
    Medium: "#f59e0b",
    Low: "#3b82f6",
  }

  // Count active leaks
  const activeLeaks = leakData.filter((leak) => leak.status === "Active").length

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Leak Detection</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leaks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLeaks}</div>
            <p className="text-xs text-muted-foreground">
              {activeLeaks > 0 ? "Requires attention" : "No active leaks"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved This Month</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leakData.filter((leak) => leak.status === "Resolved").length}</div>
            <p className="text-xs text-muted-foreground">Successfully addressed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2 hours</div>
            <p className="text-xs text-muted-foreground">From detection to resolution</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Affected Area</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Zone 3</div>
            <p className="text-xs text-muted-foreground">15 incidents this year</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="mt-6">
        <TabsList>
          <TabsTrigger value="active">Active Leaks</TabsTrigger>
          <TabsTrigger value="history">Leak History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Leak Alerts</CardTitle>
              <CardDescription>Current leak alerts requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              {activeLeaks > 0 ? (
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left font-medium">Location</th>
                        <th className="p-2 text-left font-medium">Detected</th>
                        <th className="p-2 text-left font-medium">Pressure Drop</th>
                        <th className="p-2 text-left font-medium">Flow Anomaly</th>
                        <th className="p-2 text-left font-medium">Severity</th>
                        <th className="p-2 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leakData
                        .filter((leak) => leak.status === "Active")
                        .map((leak) => (
                          <tr key={leak.id} className="border-b">
                            <td className="p-2">{leak.location}</td>
                            <td className="p-2">{new Date(leak.timestamp).toLocaleString()}</td>
                            <td className="p-2">{leak.pressureDrop} bar</td>
                            <td className="p-2">{leak.flowAnomaly ? "Yes" : "No"}</td>
                            <td className="p-2">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                  leak.severity === "High"
                                    ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                    : leak.severity === "Medium"
                                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                      : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                }`}
                              >
                                {leak.severity}
                              </span>
                            </td>
                            <td className="p-2">
                              <Button variant="outline" size="sm" onClick={() => handleResolve(leak.id)}>
                                Mark Resolved
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Active Leaks</h3>
                  <p className="text-muted-foreground max-w-md">
                    There are currently no active leak alerts in the system. The water distribution network is operating
                    normally.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Leak History</CardTitle>
              <CardDescription>Historical leak data over the past 12 months</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={leakHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="leaks"
                    name="Number of Leaks"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recently Resolved Leaks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left font-medium">Location</th>
                        <th className="p-2 text-left font-medium">Detected</th>
                        <th className="p-2 text-left font-medium">Resolved</th>
                        <th className="p-2 text-left font-medium">Severity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leakData
                        .filter((leak) => leak.status === "Resolved")
                        .slice(0, 5)
                        .map((leak) => (
                          <tr key={leak.id} className="border-b">
                            <td className="p-2">{leak.location}</td>
                            <td className="p-2">{new Date(leak.timestamp).toLocaleDateString()}</td>
                            <td className="p-2">
                              {new Date(
                                new Date(leak.timestamp).getTime() + Math.random() * 86400000 * 3,
                              ).toLocaleDateString()}
                            </td>
                            <td className="p-2">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                  leak.severity === "High"
                                    ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                    : leak.severity === "Medium"
                                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                      : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                }`}
                              >
                                {leak.severity}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Water Saved</CardTitle>
                <CardDescription>Estimated water saved by leak detection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-full py-6">
                  <div className="relative h-32 w-32 mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Droplet className="h-24 w-24 text-cyan-500 opacity-20" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold">2.4M</div>
                        <div className="text-sm text-muted-foreground">gallons</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-muted-foreground max-w-xs">
                    Early leak detection has saved an estimated 2.4 million gallons of water this year.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Leaks by Zone</CardTitle>
                <CardDescription>Distribution of leaks across different zones</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leaksByZone}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {leaksByZone.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} leaks`, "Count"]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leaks by Severity</CardTitle>
                <CardDescription>Distribution of leaks by severity level</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leaksBySeverity}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {leaksBySeverity.map((entry) => (
                        <Cell
                          key={`cell-${entry.name}`}
                          fill={SEVERITY_COLORS[entry.name as keyof typeof SEVERITY_COLORS]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} leaks`, "Count"]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Leak Detection Insights</CardTitle>
              <CardDescription>Key insights from leak detection system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Zone 3 Requires Attention</AlertTitle>
                  <AlertDescription>
                    Zone 3 has experienced 30% more leaks than other zones. Consider scheduling a comprehensive
                    infrastructure inspection.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Seasonal Pattern Detected</AlertTitle>
                  <AlertDescription>
                    Leak frequency increases by 40% during winter months. Implement preventive measures before the next
                    cold season.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Response Time Improvement</AlertTitle>
                  <AlertDescription>
                    Average leak response time has improved by 22% compared to last year, resulting in significant water
                    conservation.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

