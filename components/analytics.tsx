"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"

// Add this type declaration to tell TypeScript about the gtag function
declare global {
  interface Window {
    gtag: (
      command: string,
      trackingId: string,
      options?: { page_path?: string; [key: string]: any }
    ) => void;
  }
}

// Component that uses search params
function AnalyticsContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && typeof window.gtag === 'function') {
      window.gtag("config", process.env.NEXT_PUBLIC_GA_ID as string, {
        page_path: pathname,
      })
    }
  }, [pathname, searchParams])

  return null
}

// Main component with suspense boundary
export function Analytics() {
  return (
    <Suspense fallback={<>Loading...</>}>
      <AnalyticsContent />
    </Suspense>
  )
}
