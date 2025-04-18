import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { handleStripeSubscriptionWebhook } from "@/lib/stripe-subscription"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("stripe-signature") as string

  try {
    const result = await handleStripeSubscriptionWebhook(body, signature)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error handling Stripe subscription webhook:", error)
    return new NextResponse("Webhook Error", { status: 400 })
  }
}
