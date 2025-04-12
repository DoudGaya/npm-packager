"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && window.gtag) {
      window.gtag("config", process.env.NEXT_PUBLIC_GA_ID as string, {
        page_path: pathname,
      })
    }
  }, [pathname, searchParams])

  return null
}
