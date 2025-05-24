"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronRight, File, Folder } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PackageFileViewer } from "@/components/package-file-viewer"

interface PackageFile {
  path: string
  content: string
}

interface PackageFileTreeProps {
  files: PackageFile[]
  packageId: string
}

interface TreeNode {
  name: string
  path: string
  isDirectory: boolean
  children: TreeNode[]
  content?: string
}

export function PackageFileTree({ files, packageId }: PackageFileTreeProps) {
  const [selectedFile, setSelectedFile] = useState<PackageFile | null>(null)
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(["/"]))

  // Build file tree structure
  const buildFileTree = (files: PackageFile[]): TreeNode => {
    const root: TreeNode = {
      name: "/",
      path: "/",
      isDirectory: true,
      children: [],
    }

    files.forEach((file) => {
      const pathParts = file.path.split("/")
      let currentNode = root

      // Process each part of the path
      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i]
        if (!part) continue // Skip empty parts

        const isLastPart = i === pathParts.length - 1
        const fullPath = pathParts.slice(0, i + 1).join("/")

        // Find if this node already exists
        let foundNode = currentNode.children.find((child) => child.name === part)

        if (!foundNode) {
          // Create new node
          foundNode = {
            name: part,
            path: fullPath,
            isDirectory: !isLastPart,
            children: [],
            ...(isLastPart && { content: file.content }),
          }
          currentNode.children.push(foundNode)
        }

        currentNode = foundNode
      }
    })

    return root
  }

  const fileTree = buildFileTree(files)

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

  const renderTreeNode = (node: TreeNode, level = 0) => {
    const isExpanded = expandedDirs.has(node.path)

    if (node.isDirectory) {
      return (
        <div key={node.path}>
          <Button
            variant="ghost"
            className={cn(
              "flex w-full items-center justify-start p-2 text-sm",
              level > 0 && "pl-[calc(0.5rem*var(--level))]",
            )}
            style={{ "--level": level } as React.CSSProperties}
            onClick={() => toggleDir(node.path)}
          >
            {isExpanded ? <ChevronDown className="mr-2 h-4 w-4" /> : <ChevronRight className="mr-2 h-4 w-4" />}
            <Folder className="mr-2 h-4 w-4" />
            {node.name}
          </Button>
          {isExpanded && (
            <div className="ml-2">
              {node.children
                .sort((a, b) => {
                  // Directories first, then alphabetical
                  if (a.isDirectory && !b.isDirectory) return -1
                  if (!a.isDirectory && b.isDirectory) return 1
                  return a.name.localeCompare(b.name)
                })
                .map((child) => renderTreeNode(child, level + 1))}
            </div>
          )}
        </div>
      )
    } else {
      // Find the original file object
      const fileObj = files.find((f) => f.path === node.path)

      return (
        <Button
          key={node.path}
          variant="ghost"
          className={cn(
            "flex w-full items-center justify-start p-2 text-sm",
            "pl-[calc(0.5rem*var(--level))]",
            selectedFile?.path === node.path && "bg-accent",
          )}
          style={{ "--level": level } as React.CSSProperties}
          onClick={() => fileObj && setSelectedFile(fileObj)}
        >
          <File className="mr-2 h-4 w-4" />
          {node.name}
        </Button>
      )
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="md:col-span-1">
        <CardContent className="p-4">
          <div className="text-sm font-medium mb-2">Files</div>
          <div className="max-h-[600px] overflow-y-auto">
            {fileTree.children
              .sort((a, b) => {
                // Directories first, then alphabetical
                if (a.isDirectory && !b.isDirectory) return -1
                if (!a.isDirectory && b.isDirectory) return 1
                return a.name.localeCompare(b.name)
              })
              .map((node) => renderTreeNode(node))}
          </div>
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardContent className="p-4">
          {selectedFile ? (
            <PackageFileViewer file={selectedFile} />
          ) : (
            <div className="flex h-[600px] items-center justify-center text-muted-foreground">
              Select a file to view its contents
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
