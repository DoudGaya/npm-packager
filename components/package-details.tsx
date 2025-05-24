"use client"

import { useState } from "react"
import type { Package } from "@prisma/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { PackageCode } from "@/components/package-code"
import { PackageDocumentation } from "@/components/package-documentation"
import { PackageFileTree } from "@/components/package-file-tree"

interface PackageDetailsProps {
  package: Package & {
    user?: {
      name: string | null
      email: string | null
    }
  }
}

export function PackageDetails({ package: pkg }: PackageDetailsProps) {
  const [activeTab, setActiveTab] = useState("documentation")

  // Parse package structure if available
  const packageStructure = pkg.packageStructure ? JSON.parse(pkg.packageStructure) : []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{pkg.name}</CardTitle>
              <CardDescription>{pkg.description}</CardDescription>
            </div>
            <Badge variant="outline" className="ml-2">
              {pkg.framework}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Created by</div>
              <div>{pkg.user?.name || pkg.user?.email || "Unknown user"}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Created on</div>
              <div>{formatDate(pkg.createdAt.toString())}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">AI Model</div>
              <div>{pkg.aiModel}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Status</div>
              <div>{pkg.status}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>
        <TabsContent value="documentation" className="space-y-4">
          <PackageDocumentation documentation={pkg.documentation} />
        </TabsContent>
        <TabsContent value="code" className="space-y-4">
          <PackageCode code={pkg.code} />
        </TabsContent>
        <TabsContent value="files" className="space-y-4">
          <PackageFileTree files={packageStructure} packageId={pkg.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}



// import type { Package } from "@prisma/client"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { formatDate } from "@/lib/utils"

// interface PackageDetailsProps {
//   package: Package
// }

// export function PackageDetails({ package: pkg }: PackageDetailsProps) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Package Details</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           <div className="space-y-1">
//             <div className="text-sm font-medium text-muted-foreground">Name</div>
//             <div>{pkg.name}</div>
//           </div>
//           <div className="space-y-1">
//             <div className="text-sm font-medium text-muted-foreground">Version</div>
//             <div>{pkg.version}</div>
//           </div>
//           <div className="space-y-1">
//             <div className="text-sm font-medium text-muted-foreground">Framework</div>
//             <div className="capitalize">{pkg.framework}</div>
//           </div>
//           <div className="space-y-1">
//             <div className="text-sm font-medium text-muted-foreground">Status</div>
//             <div>
//               <Badge
//                 variant={pkg.status === "PUBLISHED" ? "default" : pkg.status === "DRAFT" ? "outline" : "secondary"}
//               >
//                 {pkg.status.toLowerCase()}
//               </Badge>
//             </div>
//           </div>
//           <div className="space-y-1">
//             <div className="text-sm font-medium text-muted-foreground">Created</div>
//             <div>{formatDate(pkg.createdAt)}</div>
//           </div>
//           <div className="space-y-1">
//             <div className="text-sm font-medium text-muted-foreground">Updated</div>
//             <div>{formatDate(pkg.updatedAt)}</div>
//           </div>
//           <div className="space-y-1">
//             <div className="text-sm font-medium text-muted-foreground">AI Model</div>
//             <div>{pkg.aiModel}</div>
//           </div>
//           {pkg.repository && (
//             <div className="space-y-1">
//               <div className="text-sm font-medium text-muted-foreground">Repository</div>
//               <div>
//                 <a
//                   href={pkg.repository}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-500 hover:underline"
//                 >
//                   {pkg.repository.replace("https://github.com/", "")}
//                 </a>
//               </div>
//             </div>
//           )}
//           {pkg.npmUrl && (
//             <div className="space-y-1">
//               <div className="text-sm font-medium text-muted-foreground">NPM</div>
//               <div>
//                 <a
//                   href={pkg.npmUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-500 hover:underline"
//                 >
//                   {pkg.name}
//                 </a>
//               </div>
//             </div>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }