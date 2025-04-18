import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { SubscriptionForm } from "@/components/subscription-form"

export const metadata: Metadata = {
  title: "Subscription",
  description: "Manage your subscription plan",
}

export default async function SubscriptionPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Subscription" text="Manage your subscription plan" />
      <div className="grid gap-8">
        <SubscriptionForm 
        // @ts-ignore
        user={user} />
      </div>
    </DashboardShell>
  )
}
