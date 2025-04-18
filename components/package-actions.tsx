"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Package } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { publishToNpm } from "@/app/actions/publish/npm"
import { publishToGithub } from "@/app/actions/publish/github"
import * as Icons from "@/components/icons"

interface PackageActionsProps {
  package: Package
}

export function PackageActions({ package: pkg }: PackageActionsProps) {
  const router = useRouter()
  const [isPublishingNpm, setIsPublishingNpm] = useState(false)
  const [isPublishingGithub, setIsPublishingGithub] = useState(false)

  const handlePublishToNpm = async () => {
    try {
      setIsPublishingNpm(true)
      const result = await publishToNpm(pkg.id)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Package published to NPM successfully",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish package to NPM",
        variant: "destructive",
      })
    } finally {
      setIsPublishingNpm(false)
    }
  }

  const handlePublishToGithub = async () => {
    try {
      setIsPublishingGithub(true)
      const result = await publishToGithub(pkg.id)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Package published to GitHub successfully",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish package to GitHub",
        variant: "destructive",
      })
    } finally {
      setIsPublishingGithub(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button onClick={handlePublishToNpm} disabled={isPublishingNpm || pkg.status === "PUBLISHED"}>
        {isPublishingNpm ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Publishing to NPM...
          </>
        ) : (
          "Publish to NPM"
        )}
      </Button>
      <Button variant="outline" onClick={handlePublishToGithub} disabled={isPublishingGithub}>
        {isPublishingGithub ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Publishing to GitHub...
          </>
        ) : (
          "Publish to GitHub"
        )}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <Icons.Icons.more className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/packages/${pkg.id}/edit`)}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => {
              // Delete package
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
