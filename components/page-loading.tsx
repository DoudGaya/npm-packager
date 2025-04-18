import { LoadingSpinner } from "@/components/loading-spinner"

export function PageLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <LoadingSpinner size={40} />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
