"use client"

import { useState } from "react"
import type { User } from "@prisma/client"
import { Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { changePlan } from "@/app/actions/subscription/change-plan"
import { getSubscriptionPlanDetails } from "@/lib/subscription"

interface SubscriptionFormProps {
  user: Pick<User, "id" | "subscriptionPlan">
}

export function SubscriptionForm({ user }: SubscriptionFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<"FREE" | "PRO" | "TEAM">((user.subscriptionPlan as any) || "FREE")
  const [paymentProvider, setPaymentProvider] = useState<"STRIPE" | "PAYPAL">("STRIPE")

  const currentPlan = getSubscriptionPlanDetails((user.subscriptionPlan as any) || "FREE")
  const plans = {
    FREE: getSubscriptionPlanDetails("FREE"),
    PRO: getSubscriptionPlanDetails("PRO"),
    TEAM: getSubscriptionPlanDetails("TEAM"),
  }

  const handleChangePlan = async () => {
    if (selectedPlan === user.subscriptionPlan) {
      toast({
        title: "No change",
        description: "You are already on this plan",
      })
      return
    }

    try {
      setIsLoading(true)

      const result = await changePlan({
        plan: selectedPlan,
        provider: paymentProvider,
      })

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl
        return
      }

      toast({
        title: "Success",
        description: "Subscription plan changed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change subscription plan",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
        <CardDescription>Manage your subscription plan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Current Plan</h3>
            <p className="text-sm text-muted-foreground">
              You are currently on the <span className="font-medium">{currentPlan.name}</span> plan.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Free Plan */}
              <Card className={`flex flex-col ${selectedPlan === "FREE" ? "border-primary" : ""}`}>
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
                    {plans.FREE.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={selectedPlan === "FREE" ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setSelectedPlan("FREE")}
                    disabled={user.subscriptionPlan === "FREE"}
                  >
                    {user.subscriptionPlan === "FREE" ? "Current Plan" : "Select Plan"}
                  </Button>
                </CardFooter>
              </Card>

              {/* Pro Plan */}
              <Card className={`flex flex-col ${selectedPlan === "PRO" ? "border-primary" : ""}`}>
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
                    {plans.PRO.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={selectedPlan === "PRO" ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setSelectedPlan("PRO")}
                    disabled={user.subscriptionPlan === "PRO"}
                  >
                    {user.subscriptionPlan === "PRO" ? "Current Plan" : "Select Plan"}
                  </Button>
                </CardFooter>
              </Card>

              {/* Team Plan */}
              <Card className={`flex flex-col ${selectedPlan === "TEAM" ? "border-primary" : ""}`}>
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
                    {plans.TEAM.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={selectedPlan === "TEAM" ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setSelectedPlan("TEAM")}
                    disabled={user.subscriptionPlan === "TEAM"}
                  >
                    {user.subscriptionPlan === "TEAM" ? "Current Plan" : "Select Plan"}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {selectedPlan !== user.subscriptionPlan && selectedPlan !== "FREE" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment Method</h3>
                <RadioGroup
                  defaultValue={paymentProvider}
                  onValueChange={(value) => setPaymentProvider(value as "STRIPE" | "PAYPAL")}
                  className="flex flex-col space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="STRIPE" id="stripe" />
                    <Label htmlFor="stripe" className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <line x1="2" x2="22" y1="10" y2="10" />
                      </svg>
                      Credit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PAYPAL" id="paypal" />
                    <Label htmlFor="paypal" className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.5 7H20.5C21.3 7 22 7.7 22 8.5C22 9.3 21.3 10 20.5 10H17.5C16.7 10 16 9.3 16 8.5C16 7.7 16.7 7 17.5 7Z" />
                        <path d="M2 16.5C2 15.7 2.7 15 3.5 15H14.5C15.3 15 16 15.7 16 16.5C16 17.3 15.3 18 14.5 18H3.5C2.7 18 2 17.3 2 16.5Z" />
                        <path d="M2 8.5C2 7.7 2.7 7 3.5 7H14.5C15.3 7 16 7.7 16 8.5C16 9.3 15.3 10 14.5 10H3.5C2.7 10 2 9.3 2 8.5Z" />
                      </svg>
                      PayPal
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {selectedPlan !== user.subscriptionPlan && (
              <Button onClick={handleChangePlan} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {selectedPlan === "FREE"
                  ? "Downgrade to Free"
                  : `Upgrade to ${selectedPlan.charAt(0) + selectedPlan.slice(1).toLowerCase()}`}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
