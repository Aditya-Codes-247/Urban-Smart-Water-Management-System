import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simulate sensor data for water management system
export function generateSensorData(type: string, count = 1) {
  const now = new Date()

  if (type === "waterQuality") {
    return Array(count)
      .fill(0)
      .map((_, i) => ({
        id: `sensor-${i}`,
        timestamp: new Date(now.getTime() - i * 3600000).toISOString(),
        location: `Zone ${Math.floor(Math.random() * 5) + 1}`,
        ph: (6.5 + Math.random() * 1.5).toFixed(2),
        turbidity: (Math.random() * 5).toFixed(2),
        chlorine: (0.2 + Math.random() * 0.8).toFixed(2),
        temperature: (20 + Math.random() * 10).toFixed(1),
        status: Math.random() > 0.9 ? "Warning" : "Normal",
      }))
  }

  if (type === "waterUsage") {
    return Array(count)
      .fill(0)
      .map((_, i) => ({
        id: `usage-${i}`,
        timestamp: new Date(now.getTime() - i * 3600000).toISOString(),
        location: `Zone ${Math.floor(Math.random() * 5) + 1}`,
        consumption: Math.floor(100 + Math.random() * 900),
        flowRate: (0.5 + Math.random() * 4.5).toFixed(2),
        pressure: (2 + Math.random() * 3).toFixed(1),
      }))
  }

  if (type === "leakDetection") {
    return Array(count)
      .fill(0)
      .map((_, i) => ({
        id: `leak-${i}`,
        timestamp: new Date(now.getTime() - i * 3600000).toISOString(),
        location: `Zone ${Math.floor(Math.random() * 5) + 1}`,
        pressureDrop: (Math.random() * 0.5).toFixed(2),
        flowAnomaly: Math.random() > 0.8,
        severity: Math.random() > 0.7 ? "High" : Math.random() > 0.4 ? "Medium" : "Low",
        status: Math.random() > 0.8 ? "Active" : "Resolved",
      }))
  }

  if (type === "billing") {
    return Array(count)
      .fill(0)
      .map((_, i) => {
        const amount = Math.floor(500 + Math.random() * 5000)
        return {
          id: `bill-${i}`,
          period: `${new Date(now.getFullYear(), now.getMonth() - i, 1).toLocaleString("default", { month: "long", year: "numeric" })}`,
          amount: amount,
          consumption: Math.floor(amount / 10),
          dueDate: new Date(now.getFullYear(), now.getMonth() - i + 1, 10).toISOString(),
          status: Math.random() > 0.7 ? "Unpaid" : "Paid",
        }
      })
  }

  return []
}

// Generate time series data for charts
export function generateTimeSeriesData(days = 30, baseValue = 100, variance = 20) {
  const data = []
  const now = new Date()

  for (let i = 0; i < days; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - (days - i - 1))

    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.max(0, baseValue + Math.random() * variance * 2 - variance),
    })
  }

  return data
}

// Format date for display
export function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Format currency
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

