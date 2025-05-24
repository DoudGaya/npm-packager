"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"

// Separate component that uses useSearchParams
function NavigationEventsContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsNavigating(true)
    }

    const handleRouteChangeComplete = () => {
      setIsNavigating(false)
    }

    window.addEventListener("beforeunload", handleRouteChangeStart)
    window.addEventListener("load", handleRouteChangeComplete)

    return () => {
      window.removeEventListener("beforeunload", handleRouteChangeStart)
      window.removeEventListener("load", handleRouteChangeComplete)
    }
  }, [])

  useEffect(() => {
    setIsNavigating(false)
  }, [pathname, searchParams])

  if (!isNavigating) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary">
      <div className="h-full w-full animate-pulse bg-primary"></div>
    </div>
  )
}

// Wrapper component with Suspense
export function NavigationEvents() {
  return (
    <Suspense fallback={null}>
      <NavigationEventsContent />
    </Suspense>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavigationEvents />
      {children}
    </>
  )
}

// "use client"
// import type React from "react"
// import { useState, useEffect } from "react"
// import { usePathname, useSearchParams } from "next/navigation"
// export function NavigationEvents() {
//   const pathname = usePathname()
//   const searchParams = useSearchParams()
//   const [isNavigating, setIsNavigating] = useState(false)
//   useEffect(() => {
//     const handleRouteChangeStart = () => {
//       setIsNavigating(true)
//     }
//     const handleRouteChangeComplete = () => {
//       setIsNavigating(false)
//     }

//     window.addEventListener("beforeunload", handleRouteChangeStart)
//     window.addEventListener("load", handleRouteChangeComplete)

//     return () => {
//       window.removeEventListener("beforeunload", handleRouteChangeStart)
//       window.removeEventListener("load", handleRouteChangeComplete)
//     }
//   }, [])

//   useEffect(() => {
//     setIsNavigating(false)
//   }, [pathname, searchParams])

//   if (!isNavigating) return null

//   return (
//     <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary">
//       <div className="h-full w-full animate-pulse bg-primary"></div>
//     </div>
//   )
// }

// export function Providers({ children }: { children: React.ReactNode }) {
//   return (
//     <>
//       <NavigationEvents />
//       {children}
//     </>
//   )
// }
