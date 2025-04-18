import { NextResponse } from "next/server"
import { handlePayPalSubscriptionWebhook } from "@/lib/paypal-subscription"

export async function POST(req: Request) {
  const payload = await req.json()

  try {
    const result = await handlePayPalSubscriptionWebhook(payload)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error handling PayPal subscription webhook:", error)
    return new NextResponse("Webhook Error", { status: 400 })
  }
}
