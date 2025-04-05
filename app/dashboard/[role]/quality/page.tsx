"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Activity, AlertTriangle, Droplet, ThermometerIcon, Gauge } from "lucide-react"
import { generateSensorData } from "@/lib/utils"

export default function WaterQualityPage({ params }: { params: { role: string } }) {
  const { role } = params
  const [waterQualityData, setWaterQualityData] = useState<any[]>([])
  const [qualityOverTime, setQualityOverTime] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  
  useEffect(() => {
    // Generate simulated data
    setWaterQualityData(generateSensorData("waterQuality", 10))
    
    // Generate quality over time data
    const qualityData = []
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (30 - i - 1))
      
      qualityData.push({
        date: date.toISOString().split('T')[0],
        ph: (6.5 + Math.random() * 1.5).toFixed(2),
        turbidity: (Math.random() * 5).toFixed(2),
        chlorine: (0.2 + Math.random() * 0.8).toFixed(2),
        temperature: (20 + Math.random() * 10).toFixed(1)
      })
    }
    setQualityOverTime(qualityData)
    
    // Generate alerts
    const generatedAlerts = []
    if (Math.random() > 0.7) {
      generatedAlerts.push({
        id: "alert-1",
        type: "quality",
        parameter: "pH",
        value: "8.9",
        threshold: "6.5-8.5",
        location: "Zone 3",
        message: "pH level above acceptable range in Zone 3",
        severity: "medium",
        timestamp: new Date().toISOString()
      })
    }
    
    if (Math.random() > 0.8) {
      generatedAlerts.push({
        id: "alert-2",
        type: "quality",
        parameter: "Turbidity",
        value: "5.7",
        threshold: "< 5.0",
        location: "Zone 1",
        message: "Turbidity above acceptable range in Zone 1",
        severity: "high",
        timestamp: new Date(Date.now() - 3600000).toISOString()
      })
    }
    
    setAlerts(generatedAlerts)
  }, [])
  
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Water Quality Monitoring</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average pH</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.2</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="text-green-500 font-medium mr-1">Normal</span>
              <span>(Range: 6.5-8.5)</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turbidity</CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.8 NTU</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="text-green-500 font-medium mr-1">Excellent</span>\
              <span>(Threshold: < 5.0)</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chlorine</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.5 mg/L</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="text-green-500 font-medium mr-1">Normal</span>
              <span>(Range: 0.2-1.0)</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <ThermometerIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22.4°C</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="text-green-500 font-medium mr-1">Normal</span>
              <span>(Range: 10-30°C)</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="trends" className="mt-6">
        <TabsList>
          <TabsTrigger value="trends">Quality Trends</TabsTrigger>
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="readings">Recent Readings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Water Quality  className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Water Quality Trends</CardTitle>
              <CardDescription>
                30-day history of key water quality parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
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
                  <Line type="monotone" dataKey="turbidity" name="Turbidity (NTU)" stroke="#22c55e" />
                  <Line type="monotone" dataKey="chlorine" name="Chlorine (mg/L)" stroke="#f59e0b" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="parameters" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Water Quality Parameters</CardTitle>
              <CardDescription>
                Detailed view of current water quality parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">pH Level</h3>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-muted-foreground">Acidic (0) to Alkaline (14)</div>
                    <div className="text-sm font-medium">7.2 (Normal)</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-cyan-500" style={{ width: '51.4%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0</span>
                    <span>7</span>
                    <span>14</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Turbidity</h3>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-muted-foreground">Clear (0) to Cloudy (10+)</div>
                    <div className="text-sm font-medium">0.8 NTU (Excellent)</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-cyan-500" style={{ width: '8%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0</span>
                    <span>5</span>
                    <span>10+</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Chlorine</h3>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-muted-foreground">Low (0) to High (2+)</div>
                    <div className="text-sm font-medium">0.5 mg/L (Normal)</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-cyan-500" style={{ width: '25%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0</span>
                    <span>1</span>
                    <span>2+</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Temperature</h3>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-muted-foreground">Cold (0°C) to Hot (40°C)</div>
                    <div className="text-sm font-medium">22.4°C (Normal)</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-cyan-500" style={{ width: '56%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0°C</span>
                    <span>20°C</span>
                    <span>40°C</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="readings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Water Quality Readings</CardTitle>
              <CardDescription>
                Latest readings from water quality sensors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left font-medium">Timestamp</th>
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
                        <td className="p-2">
                          {new Date(reading.timestamp).toLocaleString()}
                        </td>
                        <td className="p-2">{reading.location}</td>
                        <td className="p-2">{reading.ph}</td>
                        <td className="p-2">{reading.turbidity}</td>
                        <td className="p-2">{reading.chlorine}</td>
                        <td className="p-2">{reading.temperature}°C</td>
                        <td className="p-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            reading.status === "Normal" 
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}>
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
      </Tabs>
      
      {alerts.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Quality Alerts</h2>
          <div className="space-y-4">
            {alerts.map(alert => (
              <Alert 
                key={alert.id}
                variant={alert.severity === "high" ? "destructive" : "default"}
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="ml-2">
                  {alert.parameter} Alert: {alert.value} (Threshold: {alert.threshold})
                </AlertTitle>
                <AlertDescription className="ml-2">
                  {alert.message} - Detected at {new Date(alert.timestamp).toLocaleString()}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

