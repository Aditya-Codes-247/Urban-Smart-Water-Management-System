"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { FileText, Download, Calendar, Filter, Printer, Share2 } from "lucide-react"
import { generateTimeSeriesData } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function ReportsPage({ params }: { params: { role: string } }) {
  const { role } = params
  const { toast } = useToast()
  const [waterUsageData, setWaterUsageData] = useState<any[]>([])
  const [waterQualityData, setWaterQualityData] = useState<any[]>([])
  const [leakData, setLeakData] = useState<any[]>([])
  const [distributionData, setDistributionData] = useState<any[]>([])

  useEffect(() => {
    // Generate simulated data
    setWaterUsageData(generateTimeSeriesData(30, 500, 100))

    // Generate quality data
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
    setWaterQualityData(qualityData)

    // Generate leak data
    const leakData = []
    for (let i = 0; i < 12; i++) {
      const month = new Date()
      month.setMonth(month.getMonth() - i)

      leakData.push({
        month: month.toLocaleString("default", { month: "short", year: "numeric" }),
        leaks: Math.floor(Math.random() * 10) + 1,
      })
    }
    setLeakData(leakData.reverse())

    // Generate distribution data
    setDistributionData([
      { name: "Residential", value: 65 },
      { name: "Industrial", value: 25 },
      { name: "Commercial", value: 10 },
    ])
  }, [])

  const handleDownloadReport = (reportType: string) => {
    toast({
      title: "Report downloaded",
      description: `The ${reportType} report has been downloaded successfully.`,
    })
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>

        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="usage">
        <TabsList>
          <TabsTrigger value="usage">Usage Reports</TabsTrigger>
          <TabsTrigger value="quality">Quality Reports</TabsTrigger>
          <TabsTrigger value="leaks">Leak Reports</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Water Usage Report</CardTitle>
                <CardDescription>Water consumption data for the past 30 days</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownloadReport("water usage")}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterUsageData}>
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

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Usage Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Consumption</p>
                      <p className="text-2xl font-bold">
                        {Math.round(waterUsageData.reduce((sum, item) => sum + item.value, 0)).toLocaleString()} gallons
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Daily Average</p>
                      <p className="text-2xl font-bold">
                        {Math.round(
                          waterUsageData.reduce((sum, item) => sum + item.value, 0) / waterUsageData.length,
                        ).toLocaleString()}{" "}
                        gallons
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Peak Usage Day</p>
                      <p className="text-2xl font-bold">
                        {new Date(
                          waterUsageData.reduce((max, item) => (item.value > max.value ? item : max), { value: 0 })
                            .date,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Peak Usage</p>
                      <p className="text-2xl font-bold">
                        {Math.round(
                          waterUsageData.reduce((max, item) => Math.max(max, item.value), 0),
                        ).toLocaleString()}{" "}
                        gallons
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">Available Reports</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Daily Usage Report</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDownloadReport("daily usage")}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Weekly Usage Summary</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDownloadReport("weekly usage")}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Monthly Consumption Analysis</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDownloadReport("monthly consumption")}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Comparison</CardTitle>
                <CardDescription>
                  Comparing your usage with similar {role === "industrial" ? "industries" : "households"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Your Usage", value: 100 },
                      { name: "Average", value: 120 },
                      { name: "Efficient", value: 80 },
                    ]}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip formatter={(value) => [`${value}%`, "Relative Usage"]} />
                    <Legend />
                    <Bar dataKey="value" name="Relative Usage (%)" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Water Quality Report</CardTitle>
                <CardDescription>Water quality parameters for the past 30 days</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownloadReport("water quality")}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={waterQualityData}>
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
                  <Line type="monotone" dataKey="turbidity" name="Turbidity (NTU)" stroke="#22c55e" />
                  <Line type="monotone" dataKey="chlorine" name="Chlorine (mg/L)" stroke="#f59e0b" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Quality Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Average pH</p>
                      <p className="text-2xl font-bold">
                        {(
                          waterQualityData.reduce((sum, item) => sum + Number.parseFloat(item.ph), 0) /
                          waterQualityData.length
                        ).toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Average Turbidity</p>
                      <p className="text-2xl font-bold">
                        {(
                          waterQualityData.reduce((sum, item) => sum + Number.parseFloat(item.turbidity), 0) /
                          waterQualityData.length
                        ).toFixed(2)}{" "}
                        NTU
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Average Chlorine</p>
                      <p className="text-2xl font-bold">
                        {(
                          waterQualityData.reduce((sum, item) => sum + Number.parseFloat(item.chlorine), 0) /
                          waterQualityData.length
                        ).toFixed(2)}{" "}
                        mg/L
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Quality Rating</p>
                      <p className="text-2xl font-bold">Excellent</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">Available Reports</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Water Quality Certificate</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadReport("water quality certificate")}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Monthly Quality Analysis</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDownloadReport("monthly quality")}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Compliance Report</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDownloadReport("compliance")}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Compliance</CardTitle>
                <CardDescription>Compliance with water quality standards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 pt-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">pH Level (6.5-8.5)</div>
                      <div className="text-sm text-muted-foreground">100% Compliant</div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: "100%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Turbidity ({"<"} 5.0 NTU)</div>
                      <div className="text-sm text-muted-foreground">98% Compliant</div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: "98%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Chlorine (0.2-1.0 mg/L)</div>
                      <div className="text-sm text-muted-foreground">99% Compliant</div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: "99%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Bacteria (0 CFU/100mL)</div>
                      <div className="text-sm text-muted-foreground">100% Compliant</div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaks" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Leak Detection Report</CardTitle>
                <CardDescription>Leak incidents over the past 12 months</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownloadReport("leak detection")}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leakData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} incidents`, "Leaks"]} />
                  <Legend />
                  <Bar dataKey="leaks" name="Leak Incidents" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Leak Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Leaks (12 months)</p>
                      <p className="text-2xl font-bold">{leakData.reduce((sum, item) => sum + item.leaks, 0)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Monthly Average</p>
                      <p className="text-2xl font-bold">
                        {(leakData.reduce((sum, item) => sum + item.leaks, 0) / leakData.length).toFixed(1)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Peak Month</p>
                      <p className="text-2xl font-bold">
                        {leakData.reduce((max, item) => (item.leaks > max.leaks ? item : max), { leaks: 0 }).month}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Water Saved</p>
                      <p className="text-2xl font-bold">2.4M gallons</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">Available Reports</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Annual Leak Analysis</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDownloadReport("annual leak analysis")}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Leak Response Time Report</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDownloadReport("leak response time")}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Water Conservation Impact</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadReport("water conservation impact")}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leak Severity Distribution</CardTitle>
                <CardDescription>Distribution of leaks by severity level</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "High", value: 7 },
                        { name: "Medium", value: 18 },
                        { name: "Low", value: 25 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#ef4444" />
                      <Cell fill="#f59e0b" />
                      <Cell fill="#3b82f6" />
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} leaks`, "Count"]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Water Distribution Report</CardTitle>
                <CardDescription>Distribution of water resources across different sectors</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownloadReport("water distribution")}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value, percent }) => `${name}: ${value}% (${(percent * 100).toFixed(0)}%)`}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribution Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Daily Distribution</p>
                      <p className="text-2xl font-bold">24.7M gallons</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Peak Distribution Hour</p>
                      <p className="text-2xl font-bold">7:00 - 9:00 AM</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Distribution Efficiency</p>
                      <p className="text-2xl font-bold">94.3%</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Network Coverage</p>
                      <p className="text-2xl font-bold">98.7%</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">Available Reports</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Distribution Network Analysis</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDownloadReport("distribution network")}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Sector-wise Consumption</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDownloadReport("sector consumption")}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Water Allocation Report</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDownloadReport("water allocation")}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution Efficiency</CardTitle>
                <CardDescription>Efficiency metrics for water distribution network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 pt-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Network Efficiency</div>
                      <div className="text-sm text-muted-foreground">94.3%</div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: "94.3%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Pressure Optimization</div>
                      <div className="text-sm text-muted-foreground">92.1%</div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: "92.1%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Distribution Equity</div>
                      <div className="text-sm text-muted-foreground">97.5%</div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: "97.5%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Resource Utilization</div>
                      <div className="text-sm text-muted-foreground">89.8%</div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: "89.8%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

