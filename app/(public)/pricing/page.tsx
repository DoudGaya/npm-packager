import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing | NPM-Packager",
  description: "Pricing plans for NPM-Packager",
}

export default function PricingPage() {
  return (
    <div className="container mx-auto py-12 md:py-24 lg:py-32">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Pricing Plans</h1>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Choose the perfect plan for your needs. All plans include core features.
          </p>
        </div>
      </div>
      <div className="grid gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>For individual developers</CardDescription>
            <div className="mt-4 flex items-baseline text-5xl font-bold">
              $0
              <span className="ml-1 text-lg font-medium text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>5 packages per month</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Basic AI model access</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>GitHub publishing</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Basic package analytics</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/register" className="w-full">
              <Button className="w-full">Get Started</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col border-primary">
          <CardHeader>
            <div className="text-sm font-medium text-primary">Most Popular</div>
            <CardTitle>Pro</CardTitle>
            <CardDescription>For professional developers</CardDescription>
            <div className="mt-4 flex items-baseline text-5xl font-bold">
              $19
              <span className="ml-1 text-lg font-medium text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Unlimited packages</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>All AI models</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>NPM and GitHub publishing</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Advanced package analytics</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Priority support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/register" className="w-full">
              <Button className="w-full">Get Started</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Team</CardTitle>
            <CardDescription>For teams and organizations</CardDescription>
            <div className="mt-4 flex items-baseline text-5xl font-bold">
              $49
              <span className="ml-1 text-lg font-medium text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>5 team members</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Team collaboration features</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Advanced permissions</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Dedicated support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/register" className="w-full">
              <Button className="w-full">Get Started</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Need a custom plan?</h2>
          <p className="text-muted-foreground">
            Contact us for enterprise pricing and custom solutions for your organization.
          </p>
        </div>
        <Button variant="outline">Contact Sales</Button>
      </div>
    </div>
  )
}
