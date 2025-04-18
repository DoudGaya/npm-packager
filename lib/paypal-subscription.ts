import { env } from "@/lib/env"
import { db } from "@/lib/db"
import type { SubscriptionPlan } from "@prisma/client"

interface CreatePayPalSubscriptionParams {
  planId: string
  userId: string
  plan: SubscriptionPlan
}

export async function createPayPalSubscription({ planId, userId, plan }: CreatePayPalSubscriptionParams) {
  // Get access token
  const accessToken = await getPayPalAccessToken()

  // Create subscription
  const response = await fetch(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      plan_id: planId,
      application_context: {
        return_url: `${env.NEXT_PUBLIC_APP_URL}/settings/subscription?success=true`,
        cancel_url: `${env.NEXT_PUBLIC_APP_URL}/settings/subscription?canceled=true`,
        user_action: "SUBSCRIBE_NOW",
        shipping_preference: "NO_SHIPPING",
      },
      custom_id: `${userId}|${plan}`,
    }),
  })

  const data = await response.json()

  if (data.error) {
    throw new Error(data.error.message)
  }

  // Find approval URL
  const approvalUrl = data.links.find((link: any) => link.rel === "approve").href

  return approvalUrl
}

export async function handlePayPalSubscriptionWebhook(payload: any) {
  // Verify webhook signature (in a real implementation)
  // ...

  const event = payload.event_type

  if (event === "BILLING.SUBSCRIPTION.CREATED") {
    const subscriptionId = payload.resource.id
    const customId = payload.resource.custom_id
    const [userId, plan] = customId.split("|")

    // Get subscription details
    const accessToken = await getPayPalAccessToken()
    const response = await fetch(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const subscription = await response.json()
    const periodEnd = new Date(subscription.billing_info.next_billing_time)

    // Update user subscription
    await db.user.update({
      where: { id: userId },
      data: {
        subscriptionPlan: plan as SubscriptionPlan,
        subscriptionStatus: "active",
        subscriptionId: subscriptionId,
        subscriptionPeriodEnd: periodEnd,
      },
    })

    // Add credits based on plan
    await addCreditsBasedOnPlan(userId, plan as SubscriptionPlan)
  }

  if (event === "BILLING.SUBSCRIPTION.PAYMENT.SUCCEEDED") {
    const subscriptionId = payload.resource.id

    // Get subscription details
    const accessToken = await getPayPalAccessToken()
    const response = await fetch(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const subscription = await response.json()
    const customId = subscription.custom_id
    const [userId, plan] = customId.split("|")
    const periodEnd = new Date(subscription.billing_info.next_billing_time)

    // Update subscription period end
    await db.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: "active",
        subscriptionPeriodEnd: periodEnd,
      },
    })

    // Add credits based on plan
    await addCreditsBasedOnPlan(userId, plan as SubscriptionPlan)
  }

  if (event === "BILLING.SUBSCRIPTION.CANCELLED") {
    const subscriptionId = payload.resource.id

    // Get subscription details
    const accessToken = await getPayPalAccessToken()
    const response = await fetch(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const subscription = await response.json()
    const customId = subscription.custom_id
    const [userId] = customId.split("|")

    // Downgrade to free plan
    await db.user.update({
      where: { id: userId },
      data: {
        subscriptionPlan: "FREE",
        subscriptionStatus: "inactive",
        subscriptionId: null,
        subscriptionPeriodEnd: null,
      },
    })

    // Add free tier credits
    await addCreditsBasedOnPlan(userId, "FREE")
  }

  return { received: true }
}

async function getPayPalAccessToken() {
  const auth = Buffer.from(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`).toString("base64")

  const response = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  })

  const data = await response.json()

  if (data.error) {
    throw new Error(data.error.message)
  }

  return data.access_token
}

async function addCreditsBasedOnPlan(userId: string, plan: SubscriptionPlan) {
  // Define credits for each plan
  const planCredits = {
    FREE: 10,
    PRO: 100,
    TEAM: 500,
  }

  const credits = planCredits[plan]

  // Check if wallet exists
  const wallet = await db.wallet.findUnique({
    where: { userId },
  })

  if (wallet) {
    // Update existing wallet
    await db.wallet.update({
      where: { userId },
      data: {
        credits,
      },
    })
  } else {
    // Create new wallet
    await db.wallet.create({
      data: {
        userId,
        credits,
      },
    })
  }
}
