import type { Metadata } from "next"
import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { SettingsTabs } from "@/components/settings-tabs"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings",
}

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Get API keys
  const apiKeys = await db.apiKey.findMany({
    where: { userId: user.id },
  })

  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" text="Manage your account settings" />
      <div className="grid gap-8">
      
        <SettingsTabs 
        // @ts-ignore

        
        user={user} apiKeys={apiKeys} />
      </div>
    </DashboardShell>
  )
}

// import type { Metadata } from "next"
// import { getCurrentUser } from "@/lib/session"
// import { redirect } from "next/navigation"
// import { DashboardHeader } from "@/components/dashboard-header"
// import { DashboardShell } from "@/components/dashboard-shell"
// import { SettingsTabs } from "@/components/settings-tabs"

// export const metadata: Metadata = {
//   title: "Settings",
//   description: "Manage your account settings",
// }

// export default async function SettingsPage() {
//   const user = await getCurrentUser()

//   if (!user) {
//     redirect("/login")
//   }

//   return (
//     <DashboardShell>
//       <DashboardHeader heading="Settings" text="Manage your account settings" />
//       <div className="grid gap-8">
//         <SettingsTabs user={user} />
//       </div>
//     </DashboardShell>
//   )
// }
