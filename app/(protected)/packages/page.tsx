import type { Metadata } from "next"
import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { PackageCreateButton } from "@/components/package-create-button"
import { PackagesTable } from "@/components/packages-table"
import { EmptyPlaceholder } from "@/components/empty-placeholder"

export const metadata: Metadata = {
  title: "Packages",
  description: "Manage your NPM packages",
}

export default async function PackagesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const packages = await db.package.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  return (
    <DashboardShell>
      <DashboardHeader heading="Packages" text="Manage your NPM packages">
        <PackageCreateButton />
      </DashboardHeader>
      <div>
        {packages.length > 0 ? (
          <PackagesTable packages={packages} />
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="package" />
            <EmptyPlaceholder.Title>No packages</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any packages yet. Create one to get started.
            </EmptyPlaceholder.Description>
            
            <PackageCreateButton 
            // @ts-ignore
            variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}
