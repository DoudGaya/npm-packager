"use client"

import { useState, useEffect } from "react"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface PackageFile {
  path: string
  content: string
}

interface PackageFileViewerProps {
  file: PackageFile
}

export function PackageFileViewer({ file }: PackageFileViewerProps) {
  const [copied, setCopied] = useState(false)

  // Determine language for syntax highlighting
  const getLanguage = (path: string) => {
    const extension = path.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "js":
        return "javascript"
      case "ts":
        return "typescript"
      case "tsx":
        return "tsx"
      case "jsx":
        return "jsx"
      case "json":
        return "json"
      case "md":
        return "markdown"
      case "css":
        return "css"
      case "scss":
        return "scss"
      case "html":
        return "html"
      default:
        return "plaintext"
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(file.content)
      setCopied(true)
      toast({
        title: "Copied to clipboard",
        description: `${file.path} has been copied to your clipboard.`,
      })
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the file content to clipboard.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [copied])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{file.path}</h3>
        <Button variant="ghost" size="sm" onClick={copyToClipboard}>
          <Copy className={cn("h-4 w-4", copied && "text-green-500")} />
          <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      <div className="relative">
        <pre className="max-h-[550px] overflow-auto rounded-md bg-muted p-4 text-sm">
          <code className={`language-${getLanguage(file.path)}`}>{file.content}</code>
        </pre>
      </div>
    </div>
  )
}
