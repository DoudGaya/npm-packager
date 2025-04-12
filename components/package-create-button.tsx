"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export function PackageCreateButton() {
  const router = useRouter()

  return (
    <Button onClick={() => router.push("/create")}>
      <Plus className="mr-2 h-4 w-4" />
      New Package
    </Button>
  )
}
