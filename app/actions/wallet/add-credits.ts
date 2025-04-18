"use server"

import { z } from "zod"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { createStripeCheckoutSession } from "@/lib/stripe"
import { createPayPalOrder } from "@/lib/paypal"
import { TransactionStatus, TransactionType } from "@prisma/client"

const addCreditsSchema = z.object({
  amount: z.number().min(5, "Minimum amount is $5"),
  credits: z.number().min(100, "Minimum credits is 100"),
  provider: z.enum(["STRIPE", "PAYPAL"]),
})

export async function addCredits(data: z.infer<typeof addCreditsSchema>) {
  const validatedFields = addCreditsSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const user = await getCurrentUser()

  if (!user) {
    return {
      error: "Unauthorized",
    }
  }

  try {
    // Create transaction record
    const transaction = await db.transaction.create({
      data: {
        userId: user.id,
        amount: data.amount,
        credits: data.credits,
        status: TransactionStatus.pending,
        type: TransactionType.CREDIT_PURCHASE,
      },
    })

    // Create checkout session based on provider
    if (data.provider === "STRIPE") {
      const checkoutUrl = await createStripeCheckoutSession({
        amount: data.amount,
        credits: data.credits,
        transactionId: transaction.id,
        userId: user.id,
        userEmail: user.email || undefined,
      })

      return {
        checkoutUrl,
      }
    } else if (data.provider === "PAYPAL") {
      const approvalUrl = await createPayPalOrder({
        amount: data.amount,
        credits: data.credits,
        transactionId: transaction.id,
        userId: user.id,
      })

      return {
        checkoutUrl: approvalUrl,
      }
    }

    return {
      error: "Invalid payment provider",
    }
  } catch (error) {
    console.error("Error adding credits:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to add credits",
    }
  }
}

export async function getWalletBalance() {
  const user = await getCurrentUser()

  if (!user) {
    return {
      error: "Unauthorized",
    }
  }

  try {
    // Get wallet
    const wallet = await db.wallet.findUnique({
      where: { userId: user.id },
    })

    if (!wallet) {
      // Create wallet if it doesn't exist
      const newWallet = await db.wallet.create({
        data: {
          userId: user.id,
          credits: 0,
        },
      })

      return {
        credits: newWallet.credits,
      }
    }

    return {
      credits: wallet.credits,
    }
  } catch (error) {
    console.error("Error getting wallet balance:", error)
    return {
      error: "Failed to get wallet balance",
    }
  }
}

export async function getTransactions() {
  const user = await getCurrentUser()

  if (!user) {
    return {
      error: "Unauthorized",
    }
  }

  try {
    // Get transactions
    const transactions = await db.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    })

    return {
      transactions,
    }
  } catch (error) {
    console.error("Error getting transactions:", error)
    return {
      error: "Failed to get transactions",
    }
  }
}

// "use server"

// import { z } from "zod"
// import { db } from "@/lib/db"
// import { getCurrentUser } from "@/lib/session"
// import { createStripeCheckoutSession } from "@/lib/stripe"
// import { createPayPalOrder } from "@/lib/paypal"

// const addCreditsSchema = z.object({
//   amount: z.number().min(5),
//   provider: z.enum(["STRIPE", "PAYPAL"]),
// })

// export async function addCredits(data: z.infer<typeof addCreditsSchema>) {
//   const validatedFields = addCreditsSchema.safeParse(data)

//   if (!validatedFields.success) {
//     return {
//       error: "Invalid fields",
//     }
//   }

//   const user = await getCurrentUser()

//   if (!user) {
//     return {
//       error: "Unauthorized",
//     }
//   }

//   try {
//     // Calculate credits based on amount
//     // $1 = 1 credit
//     const credits = data.amount

//     // Create a pending transaction
//     const transaction = await db.transaction.create({
//       data: {
//         userId: user.id,
//         amount: data.amount,
//         credits,
//         description: `Add ${credits} credits`,
//         status: "pending",
//         provider: data.provider,
//       },
//     })

//     // Create checkout session based on provider
//     if (data.provider === "STRIPE") {
//       const checkoutUrl = await createStripeCheckoutSession({
//         amount: data.amount,
//         credits,
//         transactionId: transaction.id,
//         userId: user.id,
//         userEmail: user.email || undefined,
//       })

//       return {
//         checkoutUrl,
//       }
//     } else if (data.provider === "PAYPAL") {
//       const orderUrl = await createPayPalOrder({
//         amount: data.amount,
//         credits,
//         transactionId: transaction.id,
//         userId: user.id,
//       })

//       return {
//         checkoutUrl: orderUrl,
//       }
//     }

//     return {
//       error: "Invalid payment provider",
//     }
//   } catch (error) {
//     console.error("Error adding credits:", error)
//     return {
//       error: error instanceof Error ? error.message : "Failed to add credits",
//     }
//   }
// }
