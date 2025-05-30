"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { initializeAnalytics, trackPageView } from "@/lib/analytics"
import { FEATURES } from "@/lib/config"

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    if (FEATURES.ENABLE_ANALYTICS) {
      initializeAnalytics()
    }
  }, [])

  useEffect(() => {
    if (FEATURES.ENABLE_ANALYTICS) {
      trackPageView(pathname)
    }
  }, [pathname])

  return <>{children}</>
}
