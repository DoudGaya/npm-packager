import { LoadingSpinner } from "@/components/loading-spinner"

export default function GlobalLoading() {
  return (
    <div className="container flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center">
        <LoadingSpinner size={40} />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
