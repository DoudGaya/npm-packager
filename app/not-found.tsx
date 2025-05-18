"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Create a client component that uses useSearchParams
function NotFoundContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto text-center p-4">
      <h1 className="text-4xl font-bold tracking-tight mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-8">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}

// This is the main not-found page component
export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  )
}
