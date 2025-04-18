import Stripe from "stripe"
import { env } from "@/lib/env"
import { db } from "@/lib/db"

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
})

interface CreateCheckoutSessionParams {
  amount: number
  credits: number
  transactionId: string
  userId: string
  userEmail?: string
}

export async function createStripeCheckoutSession({
  amount,
  credits,
  transactionId,
  userId,
  userEmail,
}: CreateCheckoutSessionParams) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${credits} Credits`,
            description: `Add ${credits} credits to your NPM-Packager account`,
          },
          unit_amount: amount * 100, // Amount in cents
        },
        quantity: 1,
      },
    ],
    metadata: {
      transactionId,
      userId,
      credits,
    },
    mode: "payment",
    success_url: `${env.NEXT_PUBLIC_APP_URL}/settings/wallet?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/settings/wallet?canceled=true`,
    customer_email: userEmail,
  })

  return session.url
}

export async function handleStripeWebhook(payload: any, signature: string) {
  const event = stripe.webhooks.constructEvent(payload, signature, env.STRIPE_WEBHOOK_SECRET)

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    // Get transaction details from metadata
    const { transactionId, userId, credits } = session.metadata as {
      transactionId: string
      userId: string
      credits: string
    }

    // Update transaction status
    await updateTransactionStatus(transactionId, session.id)

    // Add credits to user's wallet
    await addCreditsToWallet(userId, Number.parseInt(credits))
  }

  return { received: true }
}

async function updateTransactionStatus(transactionId: string, paymentId: string) {
  await db.transaction.update({
    where: { id: transactionId },
    data: {
      status: "completed",
      paymentId,
    },
  })
}

async function addCreditsToWallet(userId: string, credits: number) {
  // Check if wallet exists
  const wallet = await db.wallet.findUnique({
    where: { userId },
  })

  if (wallet) {
    // Update existing wallet
    await db.wallet.update({
      where: { userId },
      data: {
        credits: { increment: credits },
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
