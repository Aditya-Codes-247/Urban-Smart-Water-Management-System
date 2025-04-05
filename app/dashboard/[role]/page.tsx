"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { Droplet, AlertTriangle, Activity, TrendingUp, Users, FileText, Bell } from "lucide-react"
import { generateSensorData, generateTimeSeriesData } from "@/lib/utils"

export default function DashboardPage({ params }: { params: { role: string } }) {
  const { role } = params
  const router = useRouter()
  const [waterQualityData, setWaterQualityData] = useState<any[]>([])
  const [waterUsageData, setWaterUsageData] = useState<any[]>([])
  const [leakData, setLeakData] = useState<any[]>([])
  const [usageOverTime, setUsageOverTime] = useState<any[]>([])
  const [qualityOverTime, setQualityOverTime] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])

  useEffect(() => {
    // Check if user is logged in with correct role
    const userString = localStorage.getItem("user")
    if (!userString) {
      router.push("/login")
      return
    }

    try {
      const user = JSON.parse(userString)
      if (user.role !== role) {
        router.push(`/dashboard/${user.role}`)
      }
    } catch (error) {
      router.push("/login")
    }

    // Generate simulated data
    setWaterQualityData(generateSensorData("waterQuality", 5))
    setWaterUsageData(generateSensorData("waterUsage", 5))
    setLeakData(generateSensorData("leakDetection", 3))
    setUsageOverTime(generateTimeSeriesData(30, 500, 100))

    // Generate quality over time data
    const qualityData = []
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (30 - i - 1))

      qualityData.push({
        date: date.toISOString().split("T")[0],
        ph: (6.5 + Math.random() * 1.5).toFixed(2),
        turbidity: (Math.random() * 5).toFixed(2),
        chlorine: (0.2 + Math.random() * 0.8).toFixed(2),
      })
    }
    setQualityOverTime(qualityData)

    // Generate alerts
    const generatedAlerts = []
    if (Math.random() > 0.7) {
      generatedAlerts.push({
        id: "alert-1",
        type: "leak",
        message: "Potential leak detected in Zone 3",
        severity: "high",
        timestamp: new Date().toISOString(),
      })
    }

    if (Math.random() > 0.6) {
      generatedAlerts.push({
        id: "alert-2",
        type: "quality",
        message: "Water quality parameters outside normal range in Zone 2",
        severity: "medium",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      })
    }

    if (Math.random() > 0.5) {
      generatedAlerts.push({
        id: "alert-3",
        type: "usage",
        message: "Unusual water consumption pattern detected",
        severity: "low",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      })
    }

    setAlerts(generatedAlerts)
  }, [role, router])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  const renderDashboardByRole = () => {
    switch (role) {
      case "admin":
        return (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,284</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98.7%</div>
                  <p className="text-xs text-muted-foreground">+0.2% from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{alerts.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {alerts.length > 0 ? "Requires attention" : "All systems normal"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground">+3 new since yesterday</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>System Activity</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={usageOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => {
                          const date = new Date(value)
                          return `${date.getDate()}/${date.getMonth() + 1}`
                        }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" name="API Calls" stroke="#0ea5e9" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Residential", value: 845 },
                          { name: "Industrial", value: 267 },
                          { name: "Municipal", value: 172 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {[
                          { name: "Residential", value: 845 },
                          { name: "Industrial", value: 267 },
                          { name: "Municipal", value: 172 },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            {alerts.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xl font-bold mb-4">System Alerts</h2>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <Alert key={alert.id} variant={alert.severity === "high" ? "destructive" : "default"}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="ml-2">
                        {alert.severity === "high"
                          ? "Critical Alert"
                          : alert.severity === "medium"
                            ? "Warning"
                            : "Information"}
                      </AlertTitle>
                      <AlertDescription className="ml-2">{alert.message}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}
          </>
        )

      case "municipal":
        return (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Water Supply</CardTitle>
                  <Droplet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87.3%</div>
                  <p className="text-xs text-muted-foreground">of capacity available</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quality Index</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94.2%</div>
                  <p className="text-xs text-muted-foreground">+1.2% from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Leaks</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{leakData.filter((leak) => leak.status === "Active").length}</div>
                  <p className="text-xs text-muted-foreground">
                    {leakData.filter((leak) => leak.status === "Active").length > 0
                      ? "Requires attention"
                      : "No active leaks"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Daily Consumption</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24.7M</div>
                  <p className="text-xs text-muted-foreground">gallons (-2.1% from average)</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Water Consumption Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={usageOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => {
                          const date = new Date(value)
                          return `${date.getDate()}/${date.getMonth() + 1}`
                        }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Consumption (gallons)"
                        stroke="#0ea5e9"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Water Quality Parameters</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={qualityOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => {
                          const date = new Date(value)
                          return `${date.getDate()}/${date.getMonth() + 1}`
                        }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="ph" name="pH" stroke="#0ea5e9" />
                      <Line type="monotone" dataKey="turbidity" name="Turbidity" stroke="#22c55e" />
                      <Line type="monotone" dataKey="chlorine" name="Chlorine" stroke="#f59e0b" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            <div className="mt-4">
              <Tabs defaultValue="quality">
                <TabsList>
                  <TabsTrigger value="quality">Quality Monitoring</TabsTrigger>
                  <TabsTrigger value="leaks">Leak Detection</TabsTrigger>
                </TabsList>
                <TabsContent value="quality" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Water Quality Readings</CardTitle>
                      <CardDescription>Latest readings from water quality sensors across the city</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="p-2 text-left font-medium">Location</th>
                              <th className="p-2 text-left font-medium">pH</th>
                              <th className="p-2 text-left font-medium">Turbidity</th>
                              <th className="p-2 text-left font-medium">Chlorine</th>
                              <th className="p-2 text-left font-medium">Temperature</th>
                              <th className="p-2 text-left font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {waterQualityData.map((reading) => (
                              <tr key={reading.id} className="border-b">
                                <td className="p-2">{reading.location}</td>
                                <td className="p-2">{reading.ph}</td>
                                <td className="p-2">{reading.turbidity}</td>
                                <td className="p-2">{reading.chlorine}</td>
                                <td className="p-2">{reading.temperature}°C</td>
                                <td className="p-2">
                                  <span
                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                      reading.status === "Normal"
                                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                    }`}
                                  >
                                    {reading.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="leaks" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Leak Detection</CardTitle>
                      <CardDescription>Current and recent leak alerts from the system</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="p-2 text-left font-medium">Location</th>
                              <th className="p-2 text-left font-medium">Pressure Drop</th>
                              <th className="p-2 text-left font-medium">Flow Anomaly</th>
                              <th className="p-2 text-left font-medium">Severity</th>
                              <th className="p-2 text-left font-medium">Status</th>
                              <th className="p-2 text-left font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {leakData.map((leak) => (
                              <tr key={leak.id} className="border-b">
                                <td className="p-2">{leak.location}</td>
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
                                  <span
                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                      leak.status === "Active"
                                        ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                        : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                    }`}
                                  >
                                    {leak.status}
                                  </span>
                                </td>
                                <td className="p-2">
                                  <Button variant="outline" size="sm">
                                    {leak.status === "Active" ? "Resolve" : "View Details"}
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </>
        )

      case "industrial":
      case "resident":
        return (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Usage</CardTitle>
                  <Droplet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{role === "industrial" ? "12,847" : "427"}</div>
                  <p className="text-xs text-muted-foreground">gallons this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Bill</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${role === "industrial" ? "1,284.70" : "42.70"}</div>
                  <p className="text-xs text-muted-foreground">
                    Due on {new Date(new Date().setDate(new Date().getDate() + 15)).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{alerts.length}</div>
                  <p className="text-xs text-muted-foreground">{alerts.length > 0 ? "New alerts" : "No new alerts"}</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Water Usage History</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={usageOverTime.slice(-7)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => {
                          const date = new Date(value)
                          return `${date.getDate()}/${date.getMonth() + 1}`
                        }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Consumption (gallons)" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Water Quality in Your Area</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">pH Level</div>
                        <div className="text-sm text-muted-foreground">7.2 (Normal)</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-cyan-500" style={{ width: "72%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">Chlorine</div>
                        <div className="text-sm text-muted-foreground">0.5 mg/L (Normal)</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-cyan-500" style={{ width: "50%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">Turbidity</div>
                        <div className="text-sm text-muted-foreground">0.3 NTU (Excellent)</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-cyan-500" style={{ width: "30%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">Hardness</div>
                        <div className="text-sm text-muted-foreground">120 mg/L (Moderate)</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-cyan-500" style={{ width: "60%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {alerts.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xl font-bold mb-4">Recent Alerts</h2>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <Alert key={alert.id} variant={alert.severity === "high" ? "destructive" : "default"}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="ml-2">
                        {alert.type === "leak"
                          ? "Leak Alert"
                          : alert.type === "quality"
                            ? "Water Quality Alert"
                            : "Usage Alert"}
                      </AlertTitle>
                      <AlertDescription className="ml-2">{alert.message}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}
          </>
        )

      default:
        return <div>Invalid role</div>
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
      </h1>

      {renderDashboardByRole()}
    </div>
  )
}

