"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clipboard } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface PackageDocumentationProps {
  documentation: string
}

export function PackageDocumentation({ documentation }: PackageDocumentationProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(documentation)
    toast({
      title: "Copied!",
      description: "Documentation copied to clipboard",
    })
  }

  return (
    <Card>
      <CardContent className="p-0 relative">
        <div className="absolute top-2 right-2 z-10">
          <Button variant="ghost" size="icon" onClick={copyToClipboard}>
            <Clipboard className="h-4 w-4" />
            <span className="sr-only">Copy documentation</span>
          </Button>
        </div>
        <div className="p-6 prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "")
                return !inline && match ? (
                  <SyntaxHighlighter language={match[1]} style={vscDarkPlus} PreTag="div" {...props}>
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              },
              // Add custom styling for tables
              table({ node, ...props }) {
                return (
                  <div className="overflow-x-auto">
                    <table className="border-collapse border border-gray-300 dark:border-gray-700" {...props} />
                  </div>
                )
              },
              th({ node, ...props }) {
                return (
                  <th
                    className="border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-gray-800"
                    {...props}
                  />
                )
              },
              td({ node, ...props }) {
                return <td className="border border-gray-300 dark:border-gray-700 px-4 py-2" {...props} />
              },
            }}
          >
            {documentation}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  )
}


// "use client"

// import { useState } from "react"
// import { Copy } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { toast } from "@/components/ui/use-toast"
// import { cn } from "@/lib/utils"
// import ReactMarkdown from "react-markdown"

// interface PackageDocumentationProps {
//   documentation: string
// }

// export function PackageDocumentation({ documentation }: PackageDocumentationProps) {
//   const [copied, setCopied] = useState(false)

//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(documentation)
//       setCopied(true)
//       toast({
//         title: "Copied to clipboard",
//         description: "Documentation has been copied to your clipboard.",
//       })
//     } catch (error) {
//       toast({
//         title: "Failed to copy",
//         description: "Could not copy the documentation to clipboard.",
//         variant: "destructive",
//       })
//     }
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h3 className="text-sm font-medium">Documentation</h3>
//         <Button variant="ghost" size="sm" onClick={copyToClipboard}>
//           <Copy className={cn("h-4 w-4", copied && "text-green-500")} />
//           <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
//         </Button>
//       </div>
//       <div className="prose prose-sm dark:prose-invert max-w-none">
//         <ReactMarkdown>{documentation}</ReactMarkdown>
//       </div>
//     </div>
//   )
// }


















// "use client"

// import { MDXRemote } from "next-mdx-remote/rsc"
// import { Card, CardContent } from "@/components/ui/card"

// interface PackageDocumentationProps {
//   documentation: string
// }

// export function PackageDocumentation({ documentation }: PackageDocumentationProps) {
//   return (
//     <Card>
//       <CardContent className="prose prose-invert max-w-none p-6">
//         <MDXRemote source={documentation} />
//       </CardContent>
//     </Card>
//   )
// }
