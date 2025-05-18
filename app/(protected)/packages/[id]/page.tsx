import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { db } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { PackageActions } from "@/components/package-actions"
import { PackageDetails } from "@/components/package-details"
import { PackageDocumentation } from "@/components/package-documentation"
import { PackageCode } from "@/components/package-code"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type PackagePageProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: PackagePageProps): Promise<Metadata> {
  const { id } = params

  const pkg = await db.package.findUnique({
    where: {
      id: id
    },
  })

  if (!pkg) {
    return {
      title: "Package Not Found",
    }
  }

  return {
    title: pkg.name,
    description: pkg.description,
  }
}

export default async function PackagePage({ params }: PackagePageProps) {
  const user = await getCurrentUser()

  const { id } = params

  if (!user) {
    return notFound()
  }

  const pkg = await db.package.findUnique({
    where: {
      id: id,
      userId: user.id,
    },
  })

  if (!pkg) {
    return notFound()
  }

  return (
    <DashboardShell>
      <DashboardHeader heading={pkg.name} text={pkg.description}>
        <PackageActions package={pkg} />
      </DashboardHeader>
      <div className="grid gap-8">
        <PackageDetails package={pkg} />
        <Tabs defaultValue="documentation" className="w-full">
          <TabsList>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="documentation" className="mt-4">
            <PackageDocumentation documentation={pkg.documentation} />
          </TabsContent>
          <TabsContent value="code" className="mt-4">
            <PackageCode code={pkg.code} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}

// import type { Metadata } from "next"
// import { notFound } from "next/navigation"
// import { getCurrentUser } from "@/lib/session"
// import { db } from "@/lib/db"
// import { DashboardHeader } from "@/components/dashboard-header"
// import { DashboardShell } from "@/components/dashboard-shell"
// import { PackageActions } from "@/components/package-actions"
// import { PackageDetails } from "@/components/package-details"
// import { PackageDocumentation } from "@/components/package-documentation"
// import { PackageCode } from "@/components/package-code"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


// type PackagePageProps = {
//   params: { id: string }
//   searchParams: { [key: string]: string | string[] | undefined }
// }

// export async function generateMetadata({ params }: PackagePageProps): Promise<Metadata> {
//   const { id } = params

//   const pkg = await db.package.findUnique({
//     where: {
//       id: id
//     },
//   })

//   if (!pkg) {
//     return {
//       title: "Package Not Found",
//     }
//   }

//   return {
//     title: pkg.name,
//     description: pkg.description,
//   }
// }

// export default async function PackagePage({ params }: PackagePageProps) {
//   const user = await getCurrentUser()

//   const { id } = await params

//   if (!user) {
//     return notFound()
//   }

//   const pkg = await db.package.findUnique({
//     where: {
//       id: id,
//       userId: user.id,
//     },
//   })

//   if (!pkg) {
//     return notFound()
//   }

//   return (
//     <DashboardShell>
//       <DashboardHeader heading={pkg.name} text={pkg.description}>
//         <PackageActions package={pkg} />
//       </DashboardHeader>
//       <div className="grid gap-8">
//         <PackageDetails package={pkg} />
//         <Tabs defaultValue="documentation" className="w-full">
//           <TabsList>
//             <TabsTrigger value="documentation">Documentation</TabsTrigger>
//             <TabsTrigger value="code">Code</TabsTrigger>
//           </TabsList>
//           <TabsContent value="documentation" className="mt-4">
//             <PackageDocumentation documentation={pkg.documentation} />
//           </TabsContent>
//           <TabsContent value="code" className="mt-4">
//             <PackageCode code={pkg.code} />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </DashboardShell>
//   )
// }
