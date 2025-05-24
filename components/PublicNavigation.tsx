import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import  logo  from '@/public/logo.png'
import Image from 'next/image'

const PublicNavigation = () => {
  return (
    <div>
         <header className="sticky mx-10 top-0 z-40 border-b bg-background">
                <div className="container mx-auto flex h-16 items-center justify-between py-4">
                  <Link href="/" className="flex">
                    <Image alt='' src={logo} className=' h-10 object-left object-contain' />
                  </Link>
                  <nav className="hidden items-center space-x-4 md:flex">
                    <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                      Features
                    </Link>
                    <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                      Pricing
                    </Link>
                    <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                      Documentation
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground">
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
    </div>
  )
}

export default PublicNavigation