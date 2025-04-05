"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  Droplet,
  FileText,
  Settings,
  Users,
  LogOut,
  Bell,
  CreditCard,
  Droplets,
  Activity,
  AlertCircle,
  LayoutDashboard,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"

interface SidebarProps {
  role: string
}

export function Sidebar({ role }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  const getMenuItems = () => {
    const baseItems = [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: `/dashboard/${role}`,
      },
    ]

    const roleSpecificItems = {
      admin: [
        { title: "User Management", icon: Users, href: `/dashboard/${role}/users` },
        { title: "System Logs", icon: Activity, href: `/dashboard/${role}/logs` },
        { title: "System Settings", icon: Settings, href: `/dashboard/${role}/settings` },
      ],
      municipal: [
        { title: "Water Resources", icon: Droplets, href: `/dashboard/${role}/resources` },
        { title: "Quality Monitoring", icon: Activity, href: `/dashboard/${role}/quality` },
        { title: "Leak Detection", icon: AlertCircle, href: `/dashboard/${role}/leaks` },
        { title: "Reports", icon: FileText, href: `/dashboard/${role}/reports` },
        { title: "User Verification", icon: Users, href: `/dashboard/${role}/verify` },
      ],
      industrial: [
        { title: "Water Usage", icon: Droplets, href: `/dashboard/${role}/usage` },
        { title: "Billing", icon: CreditCard, href: `/dashboard/${role}/billing` },
        { title: "Compliance", icon: FileText, href: `/dashboard/${role}/compliance` },
        { title: "Alerts", icon: Bell, href: `/dashboard/${role}/alerts` },
      ],
      resident: [
        { title: "Water Usage", icon: Droplets, href: `/dashboard/${role}/usage` },
        { title: "Billing", icon: CreditCard, href: `/dashboard/${role}/billing` },
        { title: "Alerts", icon: Bell, href: `/dashboard/${role}/alerts` },
      ],
    }

    return [...baseItems, ...(roleSpecificItems[role as keyof typeof roleSpecificItems] || [])]
  }

  const menuItems = getMenuItems()

  const sidebarContent = (
    <>
      <div className="flex items-center h-16 px-4 border-b">
        <Link href={`/dashboard/${role}`} className="flex items-center space-x-2">
          <Droplet className="h-6 w-6 text-cyan-500" />
          <span className="font-bold text-xl">USWMS</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.title}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                router.push(item.href)
                if (isMobile) setIsOpen(false)
              }}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.title}
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium">{role.charAt(0).toUpperCase() + role.slice(1)} Account</div>
          <ModeToggle />
        </div>
        <Button
          variant="outline"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </>
  )

  if (isMobile) {
    return (
      <>
        <div className="h-16 border-b flex items-center px-4 md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              {sidebarContent}
            </SheetContent>
          </Sheet>
          <div className="ml-4 flex items-center space-x-2">
            <Droplet className="h-6 w-6 text-cyan-500" />
            <span className="font-bold text-xl">USWMS</span>
          </div>
        </div>
      </>
    )
  }

  return <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r">{sidebarContent}</div>
}

