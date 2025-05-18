"use client"

import { ErrorBoundary } from "@/components/error-boundary"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
        <div className="container mx-auto flex min-h-screen flex-col items-center justify-center">
          <ErrorBoundary error={error} reset={reset} />
        </div>
  )
}
