"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { createStripeSubscription } from "@/lib/stripe-subscription"
import { createPayPalSubscription } from "@/lib/paypal-subscription"
import type { SubscriptionPlan } from "@prisma/client"

const changePlanSchema = z.object({
  plan: z.enum(["FREE", "PRO", "TEAM"]),
  provider: z.enum(["STRIPE", "PAYPAL"]),
})

export async function changePlan(data: z.infer<typeof changePlanSchema>) {
  const validatedFields = changePlanSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    }
  }

  const user = await getCurrentUser()

  if (!user) {
    return {
      error: "Unauthorized",
    }
  }

  try {
    // If downgrading to FREE, just update the plan
    if (data.plan === "FREE") {
      await db.user.update({
        where: { id: user.id },
        data: {
          subscriptionPlan: data.plan,
          subscriptionStatus: "active",
          subscriptionId: null,
          subscriptionPeriodEnd: null,
        },
      })

      // Add free tier credits
      await ensureWallet(user.id, 10)

      revalidatePath("/settings")
      return { success: true }
    }

    // Get pricing for the selected plan
    const pricing = await db.subscriptionPricing.findFirst({
      where: { plan: data.plan as SubscriptionPlan },
    })

    if (!pricing) {
      return {
        error: "Pricing not found for the selected plan",
      }
    }

    // Create subscription based on provider
    if (data.provider === "STRIPE") {
      if (!pricing.stripePriceId) {
        return {
          error: "Stripe price ID not found for the selected plan",
        }
      }

      const checkoutUrl = await createStripeSubscription({
        priceId: pricing.stripePriceId,
        userId: user.id,
        userEmail: user.email || undefined,
        plan: data.plan as SubscriptionPlan,
      })

      return {
        checkoutUrl,
      }
    } else if (data.provider === "PAYPAL") {
      if (!pricing.paypalPlanId) {
        return {
          error: "PayPal plan ID not found for the selected plan",
        }
      }

      const subscriptionUrl = await createPayPalSubscription({
        planId: pricing.paypalPlanId,
        userId: user.id,
        plan: data.plan as SubscriptionPlan,
      })

      return {
        checkoutUrl: subscriptionUrl,
      }
    }

    return {
      error: "Invalid payment provider",
    }
  } catch (error) {
    console.error("Error changing subscription plan:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to change subscription plan",
    }
  }
}

async function ensureWallet(userId: string, credits: number) {
  const wallet = await db.wallet.findUnique({
    where: { userId },
  })

  if (wallet) {
    await db.wallet.update({
      where: { userId },
      data: {
        credits,
      },
    })
  } else {
    await db.wallet.create({
      data: {
        userId,
        credits,
      },
    })
  }
}
