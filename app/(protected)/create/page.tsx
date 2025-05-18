import type { Metadata } from "next"
import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { PackageCreateForm } from "@/components/package-create-form"

export const metadata: Metadata = {
  title: "Create Package",
  description: "Create a new NPM package using AI",
}

export default async function CreatePackagePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Create Package" text="Create a new NPM package using AI" />
      <div className="grid gap-8">
        <PackageCreateForm 
        // @ts-ignore
        user={user} />
      </div>
    </DashboardShell>
  )
}
