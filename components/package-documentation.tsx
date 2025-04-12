"use client"

import { MDXRemote } from "next-mdx-remote/rsc"
import { Card, CardContent } from "@/components/ui/card"

interface PackageDocumentationProps {
  documentation: string
}

export function PackageDocumentation({ documentation }: PackageDocumentationProps) {
  return (
    <Card>
      <CardContent className="prose prose-invert max-w-none p-6">
        <MDXRemote source={documentation} />
      </CardContent>
    </Card>
  )
}
