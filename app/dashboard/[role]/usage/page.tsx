"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Droplet, TrendingUp, TrendingDown, Clock, Calendar } from "lucide-react"
import { generateSensorData, generateTimeSeriesData } from "@/lib/utils"

export default function UsagePage({ params }: { params: { role: string } }) {
  const { role } = params
  const [waterUsageData, setWaterUsageData] = useState<any[]>([])
  const [dailyUsage, setDailyUsage] = useState<any[]>([])
  const [monthlyUsage, setMonthlyUsage] = useState<any[]>([])
  const [hourlyUsage, setHourlyUsage] = useState<any[]>([])
  const [usageByCategory, setUsageByCategory] = useState<any[]>([])

  useEffect(() => {
    // Generate simulated data
    setWaterUsageData(generateSensorData("waterUsage", 10))
    setDailyUsage(generateTimeSeriesData(30, role === "industrial" ? 500 : 50, role === "industrial" ? 100 : 10))

    // Generate monthly usage data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const monthlyData = months.map((month, index) => {
      const baseValue = role === "industrial" ? 15000 : 1500
      const variance = role === "industrial" ? 3000 : 300

      // Add seasonal variation
      let seasonalFactor = 1
      if (index >= 5 && index <= 7) {
        // Summer months (Jun-Aug)
        seasonalFactor = 1.3
      } else if (index >= 11 || index <= 1) {
        // Winter months (Dec-Feb)
        seasonalFactor = 0.8
      }

      return {
        month,
        value: Math.max(0, (baseValue + Math.random() * variance * 2 - variance) * seasonalFactor),
      }
    })
    setMonthlyUsage(monthlyData)

    // Generate hourly usage data
    const hourlyData = []
    for (let i = 0; i < 24; i++) {
      // Create a pattern with peak usage in morning and evening
      let timeFactor = 1
      if (i >= 6 && i <= 9) {
        // Morning peak
        timeFactor = 1.5
      } else if (i >= 17 && i <= 21) {
        // Evening peak
        timeFactor = 1.8
      } else if (i >= 0 && i <= 5) {
        // Night low
        timeFactor = 0.3
      }

      const baseValue = role === "industrial" ? 50 : 5
      const variance = role === "industrial" ? 10 : 2

      hourlyData.push({
        hour: `${i}:00`,
        value: Math.max(0, (baseValue + Math.random() * variance * 2 - variance) * timeFactor),
      })
    }
    setHourlyUsage(hourlyData)

    // Generate usage by category
    if (role === "industrial") {
      setUsageByCategory([
        { name: "Production", value: 45 },
        { name: "Cooling", value: 25 },
        { name: "Cleaning", value: 15 },
        { name: "Sanitation", value: 10 },
        { name: "Other", value: 5 },
      ])
    } else {
      setUsageByCategory([
        { name: "Bathroom", value: 40 },
        { name: "Kitchen", value: 30 },
        { name: "Laundry", value: 15 },
        { name: "Garden", value: 10 },
        { name: "Other", value: 5 },
      ])
    }
  }, [role])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  // Calculate current usage metrics
  const currentDailyUsage = dailyUsage.length > 0 ? dailyUsage[dailyUsage.length - 1].value : 0
  const previousDailyUsage = dailyUsage.length > 1 ? dailyUsage[dailyUsage.length - 2].value : 0
  const usageChange = previousDailyUsage ? ((currentDailyUsage - previousDailyUsage) / previousDailyUsage) * 100 : 0

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Water Usage</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Usage</CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(currentDailyUsage)} gallons</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {usageChange > 0 ? (
                <>
                  <TrendingUp className="mr-1 h-4 w-4 text-red-500" />
                  <span className="text-red-500">+{Math.abs(usageChange).toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-500">-{Math.abs(usageChange).toFixed(1)}%</span>
                </>
              )}
              <span className="ml-1">from yesterday</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(dailyUsage.reduce((sum, item) => sum + item.value, 0) / dailyUsage.length)} gallons/day
            </div>
            <p className="text-xs text-muted-foreground">
              For {new Date().toLocaleString("default", { month: "long" })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Usage Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{role === "industrial" ? "10:00 - 14:00" : "18:00 - 21:00"}</div>
            <p className="text-xs text-muted-foreground">Based on your usage pattern</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{role === "industrial" ? "B+" : "A-"}</div>
            <p className="text-xs text-muted-foreground">
              Compared to similar {role === "industrial" ? "industries" : "households"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily" className="mt-6">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="hourly">Hourly</TabsTrigger>
          <TabsTrigger value="category">By Category</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Water Consumption</CardTitle>
              <CardDescription>Last 30 days of water usage</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return `${date.getDate()}/${date.getMonth() + 1}`
                    }}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} gallons`, "Consumption"]}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Water Usage (gallons)" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Water Consumption</CardTitle>
              <CardDescription>Water usage by month</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${Math.round(value)} gallons`, "Consumption"]} />
                  <Legend />
                  <Bar dataKey="value" name="Water Usage (gallons)" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hourly" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Water Consumption</CardTitle>
              <CardDescription>Average water usage by hour of day</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toFixed(1)} gallons`, "Consumption"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Water Usage (gallons)"
                    stroke="#0ea5e9"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Water Usage by Category</CardTitle>
              <CardDescription>Breakdown of water consumption by purpose</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usageByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {usageByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Water Usage Readings</CardTitle>
            <CardDescription>Latest readings from your water meter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left font-medium">Timestamp</th>
                    <th className="p-2 text-left font-medium">Consumption</th>
                    <th className="p-2 text-left font-medium">Flow Rate</th>
                    <th className="p-2 text-left font-medium">Pressure</th>
                  </tr>
                </thead>
                <tbody>
                  {waterUsageData.map((reading) => (
                    <tr key={reading.id} className="border-b">
                      <td className="p-2">{new Date(reading.timestamp).toLocaleString()}</td>
                      <td className="p-2">{reading.consumption} gallons</td>
                      <td className="p-2">{reading.flowRate} gal/min</td>
                      <td className="p-2">{reading.pressure} bar</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

