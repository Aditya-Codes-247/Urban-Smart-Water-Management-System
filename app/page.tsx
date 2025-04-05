"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import gsap from "gsap"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Droplet } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline()

    tl.from(titleRef.current, {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    })
      .from(
        subtitleRef.current,
        {
          y: -20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.5",
      )
      .from(
        buttonRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.5",
      )
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Droplet className="h-6 w-6 text-cyan-500" />
            <span className="font-bold text-xl">USWMS</span>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Button variant="outline" onClick={() => router.push("/login")}>
              Login
            </Button>
            <Button onClick={() => router.push("/register")}>Register</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1
            ref={titleRef}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent"
          >
            Urban Smart Water Management System
          </h1>
          <p ref={subtitleRef} className="text-lg md:text-xl mb-8 text-muted-foreground">
            Efficient water resource allocation, monitoring, and management for a sustainable urban future
          </p>
          <div ref={buttonRef}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              onClick={() => router.push("/register")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Urban Smart Water Management System. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

