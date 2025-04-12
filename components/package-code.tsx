"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface PackageCodeProps {
  code: string
}

export function PackageCode({ code }: PackageCodeProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy code",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardContent className="p-0 relative">
        <div className="absolute top-2 right-2 z-10">
          <Button variant="ghost" size="icon" onClick={copyToClipboard} disabled={copied}>
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy code</span>
          </Button>
        </div>
        <pre className="p-6 overflow-auto max-h-[600px] text-sm">
          <code>{code}</code>
        </pre>
      </CardContent>
    </Card>
  )
}
