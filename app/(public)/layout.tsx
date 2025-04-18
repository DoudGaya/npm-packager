import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { Footer } from "@/components/tooter"

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen dark:bg-black flex-col">
      <header className="sticky px-6 top-0 z-40 dark:bg-black border-primary/30 border-b text-secondary">
        <div className="container mx-auto flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center">
            <Logo className="mr-2 stroke-primary h-6 w-6" />
            <span className="font-bold sm:flex hidden">NPM-Packager</span>
          </Link>
          <nav className="hidden items-center space-x-4 md:flex">
            <Link href="/features" className="text-sm hover:text-primary font-medium text-muted-foreground">
              Features
            </Link>
            <Link href="/pricing" className="text-sm hover:text-primary font-medium text-muted-foreground">
              Pricing
            </Link>
            <Link href="/about" className="text-sm hover:text-primary font-medium text-muted-foreground">
              About
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
