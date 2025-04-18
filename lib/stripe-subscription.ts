import Stripe from "stripe"
import { env } from "@/lib/env"
import { db } from "@/lib/db"
import type { SubscriptionPlan } from "@prisma/client"

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
})

interface CreateStripeSubscriptionParams {
  priceId: string
  userId: string
  userEmail?: string
  plan: SubscriptionPlan
}

export async function createStripeSubscription({ priceId, userId, userEmail, plan }: CreateStripeSubscriptionParams) {
  // Create a subscription checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${env.NEXT_PUBLIC_APP_URL}/settings/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/settings/subscription?canceled=true`,
    customer_email: userEmail,
    metadata: {
      userId,
      plan,
    },
    subscription_data: {
      metadata: {
        userId,
        plan,
      },
    },
  })

  return session.url
}

export async function handleStripeSubscriptionWebhook(payload: any, signature: string) {
  const event = stripe.webhooks.constructEvent(payload, signature, env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET)

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const subscriptionId = session.subscription as string
    const { userId, plan } = session.metadata as {
      userId: string
      plan: SubscriptionPlan
    }

    // Retrieve the subscription to get the current period end
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    //@ts-ignore
    const periodEnd = new Date(subscription.current_period_end * 1000)

    // Update user subscription
    await db.user.update({
      where: { id: userId },
      data: {
        subscriptionPlan: plan,
        subscriptionStatus: "active",
        subscriptionId: subscriptionId,
        subscriptionPeriodEnd: periodEnd,
      },
    })

    // Add credits based on plan
    await addCreditsBasedOnPlan(userId, plan)
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice
    //@ts-ignore
    const subscriptionId = invoice.subscription as string

    // Retrieve the subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const { userId, plan } = subscription.metadata as {
      userId: string
      plan: SubscriptionPlan
    }
    //@ts-ignore
    const periodEnd = new Date(subscription.current_period_end * 1000)

    // Update subscription period end
    await db.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: "active",
        subscriptionPeriodEnd: periodEnd,
      },
    })

    // Add credits based on plan
    await addCreditsBasedOnPlan(userId, plan)
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription
    const { userId } = subscription.metadata as { userId: string }

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
