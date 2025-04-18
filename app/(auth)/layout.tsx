import type React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Logo } from "@/components/logo"
import { getCurrentUser } from "@/lib/session"

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Check if user is already logged in
  const user = await getCurrentUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-screen flex-col items-center justify-center py-12">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Link href="/" className="mx-auto flex items-center">
              <Logo className="mr-2 h-6 w-6" />
              <span className="font-bold">NPM-Packager</span>
            </Link>
          </div>
          {children}
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-brand underline underline-offset-4">
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}


// import type React from "react"
// import Link from "next/link"
// import { Logo } from "@/components/logo"

// export default function AuthLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <div className="flex min-h-screen flex-col">
//       <div className="flex min-h-screen flex-col items-center justify-center py-12">
//         <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] md:w-[450px]">
//           <div className="flex flex-col space-y-2 text-center">
//             <Link href="/" className="mx-auto flex items-center">
//               <Logo className="mr-2 h-6 w-6" />
//               <span className="font-bold">NPM-Packager</span>
//             </Link>
//           </div>
//           {children}
//           <p className="px-8 text-center text-sm text-muted-foreground">
//             <Link href="/" className="hover:text-brand underline underline-offset-4">
//               Back to home
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }
