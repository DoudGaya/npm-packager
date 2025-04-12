"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { LayoutDashboard, Package, Plus, Settings } from "lucide-react"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items?: {
    href: string
    title: string
    icon: React.ReactNode
  }[]
}

export function Sidebar({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  const defaultItems = [
    {
      href: "/dashboard",
      title: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      href: "/create",
      title: "Create Package",
      icon: <Plus className="mr-2 h-4 w-4" />,
    },
    {
      href: "/packages",
      title: "My Packages",
      icon: <Package className="mr-2 h-4 w-4" />,
    },
    {
      href: "/settings",
      title: "Settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ]

  const navItems = items || defaultItems

  return (
    <nav className={cn("flex flex-col lg:space-x-0 lg:space-y-1", className)} {...props}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
            "justify-start",
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
