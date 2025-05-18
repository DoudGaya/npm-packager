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
    <html>
      <body>
        <div className="container flex min-h-screen flex-col items-center justify-center">
          <ErrorBoundary error={error} reset={reset} />
        </div>
      </body>
    </html>
  )
}
