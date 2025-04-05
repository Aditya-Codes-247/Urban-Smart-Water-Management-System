"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [role, setRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userString = localStorage.getItem("user")
    if (!userString) {
      router.push("/login")
      return
    }

    try {
      const user = JSON.parse(userString)
      setRole(user.role)
    } catch (error) {
      router.push("/login")
    }
  }, [router])

  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role={role} />
      <div className="md:pl-64">
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

