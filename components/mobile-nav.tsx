"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Logo } from "@/components/logo"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className="flex items-center justify-between w-full px-8 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="px-7">
            <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
              <Logo className=" h-4 w-4" />
              <span className="font-bold">NPM-Packager</span>
            </Link>
          </div>
          <div className="my-4 ">
            <Sidebar />
          </div>
        </SheetContent>
      </Sheet>
      <Link href="/" className="flex items-center">
        <Logo className=" h-6 w-6" />
        <span className="font-bold">NPM-Packager</span>
      </Link>
    </div>
  )
}
