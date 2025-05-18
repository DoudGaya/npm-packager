// "use client"

// import { Button } from "@/components/ui/button"
// import { Plus } from "lucide-react"
// import { useRouter } from "next/navigation"

// export function PackageCreateButton() {
//   const router = useRouter()

//   return (
//     <Button onClick={() => router.push("/create")}>
//       <Plus className="mr-2 h-4 w-4" />
//       New Package
//     </Button>
//   )
// }

"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

interface PackageCreateButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
}

export function PackageCreateButton({ variant = "default" }: PackageCreateButtonProps) {
  const router = useRouter()

  return (
    <Button variant={variant} onClick={() => router.push("/create")}>
      <Plus className="mr-2 h-4 w-4" />
      New Package
    </Button>
  )
}

