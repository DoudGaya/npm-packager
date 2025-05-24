"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clipboard, Download, ChevronRight, ChevronDown, Folder, FileText } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { cn } from "@/lib/utils"

interface PackageFile {
  path: string
  content: string
}

interface PackageCodeProps {
  code: string | PackageFile[]
}

interface FileTreeItem {
  name: string
  path: string
  type: "file" | "directory"
  children?: FileTreeItem[]
  content?: string
}

export function PackageCode({ code }: PackageCodeProps) {
  const [activeFile, setActiveFile] = useState<string | null>(null)
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(["/"]))

  // Improved parsing logic to handle multiple scenarios
  const files = useMemo(() => {
    // If code is already an array of files, use it directly
    if (Array.isArray(code)) {
      return code
    }
    
    // If code is a string, try to parse it as JSON first
    if (typeof code === 'string') {
      try {
        // Try to parse as JSON
        const parsedCode = JSON.parse(code)
        
        // If parsing succeeded and result is an array, return it
        if (Array.isArray(parsedCode)) {
          return parsedCode as PackageFile[]
        } 
        
        // If parsed result is an object but not an array, wrap it
        if (parsedCode && typeof parsedCode === 'object') {
          return [{ path: 'file.js', content: JSON.stringify(parsedCode, null, 2) }]
        }
      } catch (error) {
        console.log("Not valid JSON, treating as raw code")
      }
      
      // If JSON parsing failed or result wasn't usable, treat it as raw code
      return [{
        path: detectFileType(code),
        content: code
      }]
    }
    
    // Fallback to empty array if code is neither string nor array
    return []
  }, [code])

  // Helper function to detect file type based on content
  function detectFileType(content: string): string {
    if (content.trim().startsWith('import React') || content.includes('jsx')) {
      return 'index.jsx'
    }
    if (content.trim().startsWith('import ') || content.includes('export ')) {
      return 'index.js'
    }
    if (content.includes('<html') || content.includes('<!DOCTYPE')) {
      return 'index.html'
    }
    if (content.includes('{') && content.includes('}') && !content.includes('import ')) {
      return 'data.json'
    }
    return 'index.js' // Default fallback
  }

  const fileTree = useMemo(() => {
    const root: FileTreeItem = {
      name: "/",
      path: "/",
      type: "directory",
      children: [],
    }

    // Sort files to ensure directories are processed first
    const sortedFiles = [...files].sort((a, b) => a.path.localeCompare(b.path))

    sortedFiles.forEach((file) => {
      const pathParts = file.path.split("/")
      let currentLevel = root.children

      // Process each part of the path
      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i]
        if (!part) continue // Skip empty parts

        const isFile = i === pathParts.length - 1
        const currentPath = pathParts.slice(0, i + 1).join("/")

        // Find if this part already exists at the current level
        let existingItem = currentLevel?.find((item) => item.name === part)

        if (!existingItem) {
          // Create new item
          const newItem: FileTreeItem = {
            name: part,
            path: currentPath,
            type: isFile ? "file" : "directory",
            children: isFile ? undefined : [],
          }

          if (isFile) {
            newItem.content = file.content
          }

          currentLevel?.push(newItem)
          existingItem = newItem
        }

        // Move to the next level if this is a directory
        if (!isFile) {
          currentLevel = existingItem.children
        }
      }
    })

    return root
  }, [files])

  // Set the first file as active by default
  useMemo(() => {
    if (files.length > 0 && !activeFile) {
      // Try to find package.json or README.md first
      const packageJson = files.find((f) => f.path.toLowerCase() === "package.json")
      const readme = files.find((f) => f.path.toLowerCase() === "readme.md")
      const indexFile = files.find(
        (f) => f.path.toLowerCase().includes("index.ts") || f.path.toLowerCase().includes("index.js"),
      )

      setActiveFile((packageJson || readme || indexFile || files[0]).path)
    }
  }, [files, activeFile])

  const activeFileContent = useMemo(() => {
    if (!activeFile) return ""
    const file = files.find((f) => f.path === activeFile)
    return file?.content || ""
  }, [files, activeFile])

  const getLanguage = (filePath: string) => {
    const extension = filePath.split(".").pop()?.toLowerCase() || ""

    const languageMap: Record<string, string> = {
      js: "javascript",
      jsx: "jsx",
      ts: "typescript",
      tsx: "tsx",
      json: "json",
      md: "markdown",
      css: "css",
      scss: "scss",
      html: "html",
      gitignore: "bash",
    }

    return languageMap[extension] || "text"
  }

  const toggleDir = (path: string) => {
    setExpandedDirs((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(path)) {
        newSet.delete(path)
      } else {
        newSet.add(path)
      }
      return newSet
    })
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied to clipboard",
      description: "The code has been copied to your clipboard.",
    })
  }

  const downloadFile = (path: string, content: string) => {
    const element = document.createElement("a")
    const file = new Blob([content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = path.split("/").pop() || "file.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const downloadAllFiles = () => {
    // Create a zip file with all the files
    import("jszip").then((JSZip) => {
      const zip = new JSZip.default()

      // Add all files to the zip
      files.forEach((file) => {
        const filePath = file.path
        const content = file.content
        zip.file(filePath, content)
      })

      // Generate the zip file
      zip.generateAsync({ type: "blob" }).then((content) => {
        const element = document.createElement("a")
        element.href = URL.createObjectURL(content)
        element.download = "package.zip"
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
      })
    })
  }

  const renderFileTree = (items?: FileTreeItem[], level = 0) => {
    if (!items || items.length === 0) return null

    return (
      <ul className={cn("pl-4", level === 0 ? "pl-0" : "")}>
        {items
          .sort((a, b) => {
            // Directories first, then files
            if (a.type !== b.type) {
              return a.type === "directory" ? -1 : 1
            }
            // Alphabetical within same type
            return a.name.localeCompare(b.name)
          })
          .map((item) => (
            <li key={item.path} className="py-1">
              {item.type === "directory" ? (
                <div>
                  <Button
                    // variant="ghost"
                    // size="sm"
                    className="h-6 px-2 justify-start text-left text-xs w-full"
                    onClick={() => toggleDir(item.path)}
                  >
                    {expandedDirs.has(item.path) ? (
                      <ChevronDown className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    )}
                    <Folder className="h-3.5 w-3.5 mr-1 text-blue-500" />
                    {item.name}
                  </Button>
                  {expandedDirs.has(item.path) && renderFileTree(item.children, level + 1)}
                </div>
              ) : (
                <Button
                  // variant={activeFile === item.path ? "secondary" : "ghost"}
                  // size="sm"
                  className="h-6 px-2 justify-start text-left text-xs w-full ml-4"
                  onClick={() => setActiveFile(item.path)}
                >
                  <FileText className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  {item.name}
                </Button>
              )}
            </li>
          ))}
      </ul>
    )
  }

  // When rendering for a single file case
  if (files.length === 1) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">{files[0].path}</h3>
            <div className="flex space-x-1">
              <Button
                onClick={() => copyToClipboard(files[0].content)}
                title="Copy to clipboard"
              >
                <Clipboard className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => downloadFile(files[0].path, files[0].content)}
                title="Download file"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="overflow-auto max-h-[600px]">
            <SyntaxHighlighter
              language={getLanguage(files[0].path)}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: "1rem",
                fontSize: "0.875rem",
                backgroundColor: "transparent",
              }}
            >
              {files[0].content}
            </SyntaxHighlighter>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Your existing return for multiple files
  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex h-[600px] flex-col md:flex-row">
          <div className="w-full border-b md:w-64 md:border-b-0 md:border-r">
            <div className="flex items-center justify-between border-b p-2">
              <h3 className="text-sm font-medium">Files</h3>
              <Button 
              
             
              
              // size="sm" 
              
              onClick={downloadAllFiles} title="Download all files">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-[200px] overflow-y-auto md:h-[556px]">
              <div className="p-2">{renderFileTree(fileTree.children)}</div>
            </div>
          </div>
          <div className="flex flex-1 flex-col">
            {activeFile && (
              <>
                <div className="flex items-center justify-between border-b p-2">
                  <h3 className="text-sm font-medium">{activeFile}</h3>
                  <div className="flex space-x-1">
                    <Button
                      // variant="ghost"
                      // size="sm"
                      onClick={() => copyToClipboard(activeFileContent)}
                      title="Copy to clipboard"
                    >
                      <Clipboard className="h-4 w-4" />
                    </Button>
                    <Button
                      // variant="ghost"
                      // size="sm"
                      onClick={() => downloadFile(activeFile, activeFileContent)}
                      title="Download file"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="h-[350px] overflow-auto md:h-[556px]">
                  <SyntaxHighlighter
                    language={getLanguage(activeFile)}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: "1rem",
                      height: "100%",
                      fontSize: "0.875rem",
                      backgroundColor: "transparent",
                    }}
                  >
                    {activeFileContent}
                  </SyntaxHighlighter>
                </div>
              </>
            )}
          </div>
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

// interface PackageCodeProps {
//   code: string
// }

// export function PackageCode({ code }: PackageCodeProps) {
//   const [copied, setCopied] = useState(false)

//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(code)
//       setCopied(true)
//       toast({
//         title: "Copied to clipboard",
//         description: "Code has been copied to your clipboard.",
//       })
//     } catch (error) {
//       toast({
//         title: "Failed to copy",
//         description: "Could not copy the code to clipboard.",
//         variant: "destructive",
//       })
//     }
//   }

//   return (
//     <div className="space-y-2">
//       <div className="flex items-center justify-between">
//         <h3 className="text-sm font-medium">Package Code</h3>
//         <Button variant="ghost" size="sm" onClick={copyToClipboard}>
//           <Copy className={cn("h-4 w-4", copied && "text-green-500")} />
//           <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
//         </Button>
//       </div>
//       <div className="relative">
//         <pre className="max-h-[600px] overflow-auto rounded-md bg-muted p-4 text-sm">
//           <code>{code}</code>
//         </pre>
//       </div>
//       <p className="text-sm text-muted-foreground mt-2">
//         Note: This is the combined code of all files. Use the Files tab to view individual files.
//       </p>
//     </div>
//   )
// }





















// "use client"

// import { useState } from "react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Copy } from "lucide-react"
// import { toast } from "@/components/ui/use-toast"

// interface PackageCodeProps {
//   code: string
// }

// export function PackageCode({ code }: PackageCodeProps) {
//   const [copied, setCopied] = useState(false)

//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(code)
//       setCopied(true)
//       toast({
//         title: "Copied!",
//         description: "Code copied to clipboard",
//       })
//       setTimeout(() => setCopied(false), 2000)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to copy code",
//         variant: "destructive",
//       })
//     }
//   }

//   return (
//     <Card>
//       <CardContent className="p-0 relative">
//         <div className="absolute top-2 right-2 z-10">
//           <Button variant="ghost" size="icon" onClick={copyToClipboard} disabled={copied}>
//             <Copy className="h-4 w-4" />
//             <span className="sr-only">Copy code</span>
//           </Button>
//         </div>
//         <pre className="p-6 overflow-auto max-h-[600px] text-sm">
//           <code>{code}</code>
//         </pre>
//       </CardContent>
//     </Card>
//   )
// }
