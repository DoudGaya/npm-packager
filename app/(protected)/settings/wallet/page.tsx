import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { WalletForm } from "@/components/wallet-form"

export const metadata: Metadata = {
  title: "Wallet",
  description: "Manage your credits and transactions",
}

export default async function WalletPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Wallet" text="Manage your credits and transactions" />
      <div className="grid gap-8">
        <WalletForm />
      </div>
    </DashboardShell>
  )
}


// import type { Metadata } from "next"
// import { redirect } from "next/navigation"
// import { db } from "@/lib/db"
// import { getCurrentUser } from "@/lib/session"
// import { DashboardHeader } from "@/components/dashboard-header"
// import { DashboardShell } from "@/components/dashboard-shell"
// import { WalletForm } from "@/components/wallet-form"

// export const metadata: Metadata = {
//   title: "Wallet",
//   description: "Manage your wallet and credits",
// }

// export default async function WalletPage() {
//   const user = await getCurrentUser()

//   if (!user) {
//     redirect("/login")
//   }

//   // Get wallet
//   const wallet = await db.wallet.findUnique({
//     where: { userId: user.id },
//   })

//   // Get transactions
//   const transactions = await db.transaction.findMany({
//     where: { userId: user.id },
//     orderBy: { createdAt: "desc" },
//   })

//   return (
//     <DashboardShell>
//       <DashboardHeader heading="Wallet" text="Manage your wallet and credits" />
//       <div className="grid gap-8">
//         <WalletForm user={user} wallet={wallet} transactions={transactions} />
//       </div>
//     </DashboardShell>
//   )
// }
