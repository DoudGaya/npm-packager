'use server'
import type { SubscriptionPlan } from "@prisma/client"
import { db } from "@/lib/db"

interface PlanDetails {
  name: string
  description: string
  features: string[]
  limits: {
    packagesPerMonth: number
    aiModels: string[]
    publishing: string[]
    analytics: string
  }
}

export async function getSubscriptionPlanDetails(plan: SubscriptionPlan): Promise<PlanDetails> {
  const plans: Record<SubscriptionPlan, PlanDetails> = {
    FREE: {
      name: "Free",
      description: "For individual developers",
      features: ["5 packages per month", "GPT-4o (10 prompts/day)", "GitHub publishing", "Basic package analytics"],
      limits: {
        packagesPerMonth: 5,
        aiModels: ["gpt4o"],
        publishing: ["github"],
        analytics: "basic",
      },
    },
    PRO: {
      name: "Pro",
      description: "For professional developers",
      features: [
        "Unlimited packages",
        "All AI models",
        "NPM and GitHub publishing",
        "Advanced package analytics",
        "Priority support",
      ],
      limits: {
        packagesPerMonth: Number.POSITIVE_INFINITY,
        aiModels: ["gpt4o", "claude", "deepseek", "groq"],
        publishing: ["github", "npm"],
        analytics: "advanced",
      },
    },
    TEAM: {
      name: "Team",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "5 team members",
        "Team collaboration features",
        "Advanced permissions",
        "Dedicated support",
      ],
      limits: {
        packagesPerMonth: Number.POSITIVE_INFINITY,
        aiModels: ["gpt4o", "claude", "deepseek", "groq"],
        publishing: ["github", "npm"],
        analytics: "advanced",
      },
    },
  }

  return plans[plan]
}

export async function  checkSubscriptionLimit(userId: string, model: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    return false
  }

  // Get plan details
  const planDetails = await getSubscriptionPlanDetails(user.subscriptionPlan as SubscriptionPlan)

  // Check if model is allowed for the plan
  if (!planDetails.limits.aiModels.includes(model)) {
    return false
  }

  // For free tier, check daily usage limit for GPT-4o
  if (user.subscriptionPlan === "FREE" && model === "gpt4o") {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const usageCount = await db.apiUsage.count({
      where: {
        userId: user.id,
        model: "gpt4o",
        createdAt: {
          gte: today,
        },
      },
    })

    const isAllowed = usageCount < 10


    return isAllowed // 10 prompts per day limit

    // 10 prompts per day limit
  }

  // For paid plans, check if subscription is active
  if (user.subscriptionPlan !== "FREE") {
    if (user.subscriptionStatus !== "active") {
      return false
    }

    // Check if subscription has expired
    if (user.subscriptionPeriodEnd && user.subscriptionPeriodEnd < new Date()) {
      return false
    }
  }

  // Check monthly package limit
  const currentMonth = new Date()
  currentMonth.setDate(1)
  currentMonth.setHours(0, 0, 0, 0)

  const packageCount = await db.package.count({
    where: {
      userId: user.id,
      createdAt: {
        gte: currentMonth,
      },
    },
  })

  return packageCount < planDetails.limits.packagesPerMonth
}

export async function checkPublishingPermission(userId: string, platform: "github" | "npm"): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    return false
  }

  // Get plan details
  const planDetails = await getSubscriptionPlanDetails(user.subscriptionPlan as SubscriptionPlan)

  // Check if platform is allowed for the plan
  return planDetails.limits.publishing.includes(platform)
}


// import { db } from "@/lib/db"
// import type { SubscriptionPlan } from "@prisma/client"

// interface SubscriptionLimit {
//   allowed: boolean
//   message: string
// }

// export async function checkSubscriptionLimit(userId: string, model: string): Promise<SubscriptionLimit> {
//   // Get user with subscription details
//   const user = await db.user.findUnique({
//     where: { id: userId },
//     select: {
//       id: true,
//       subscriptionPlan: true,
//       wallet: true,
//     },
//   })

//   if (!user) {
//     return {
//       allowed: false,
//       message: "User not found",
//     }
//   }

//   // Check if user has a wallet, if not create one
//   if (!user.wallet) {
//     await db.wallet.create({
//       data: {
//         userId,
//         credits: user.subscriptionPlan === "FREE" ? 10 : user.subscriptionPlan === "PRO" ? 100 : 500,
//       },
//     })
//   }

//   // Free tier can only use GPT-4o and has a limit of 10 generations per day
//   if (user.subscriptionPlan === "FREE") {
//     if (model !== "gpt4o") {
//       return {
//         allowed: false,
//         message: "Free tier can only use GPT-4o. Upgrade to access other models.",
//       }
//     }

//     // Check daily usage limit
//     const today = new Date()
//     today.setHours(0, 0, 0, 0)

//     const tomorrow = new Date(today)
//     tomorrow.setDate(tomorrow.getDate() + 1)

//     const todayUsage = await db.apiUsage.count({
//       where: {
//         userId,
//         model: "gpt4o",
//         createdAt: {
//           gte: today,
//           lt: tomorrow,
//         },
//       },
//     })

//     if (todayUsage >= 10) {
//       return {
//         allowed: false,
//         message: "You've reached your daily limit of 10 free generations. Upgrade your plan or try again tomorrow.",
//       }
//     }
//   }

//   // Pro tier can use all models but has credit limits
//   if (user.subscriptionPlan === "PRO") {
//     const wallet = await db.wallet.findUnique({
//       where: { userId },
//     })

//     if (!wallet || wallet.credits <= 0) {
//       return {
//         allowed: false,
//         message: "You've used all your credits. Add more credits to continue.",
//       }
//     }
//   }

//   // Team tier has higher limits but still needs credits
//   if (user.subscriptionPlan === "TEAM") {
//     const wallet = await db.wallet.findUnique({
//       where: { userId },
//     })

//     if (!wallet || wallet.credits <= 0) {
//       return {
//         allowed: false,
//         message: "Your team has used all credits. Add more credits to continue.",
//       }
//     }
//   }

//   return {
//     allowed: true,
//     message: "Generation allowed",
//   }
// }

// export function getSubscriptionPlanDetails(plan: SubscriptionPlan) {
//   switch (plan) {
//     case "FREE":
//       return {
//         name: "Free",
//         description: "For individual developers",
//         features: [
//           "5 packages per month",
//           "GPT-4o access (10 prompts/day)",
//           "GitHub publishing",
//           "Basic package analytics",
//         ],
//         limitations: {
//           packagesPerMonth: 5,
//           aiModels: ["gpt4o"],
//           promptsPerDay: 10,
//         },
//       }
//     case "PRO":
//       return {
//         name: "Pro",
//         description: "For professional developers",
//         features: [
//           "Unlimited packages",
//           "All AI models",
//           "NPM and GitHub publishing",
//           "Advanced package analytics",
//           "Priority support",
//         ],
//         limitations: {
//           packagesPerMonth: Number.POSITIVE_INFINITY,
//           aiModels: ["gpt4o", "claude", "deepseek", "groq"],
//           promptsPerDay: 100,
//         },
//       }
//     case "TEAM":
//       return {
//         name: "Team",
//         description: "For teams and organizations",
//         features: [
//           "Everything in Pro",
//           "5 team members",
//           "Team collaboration features",
//           "Advanced permissions",
//           "Dedicated support",
//         ],
//         limitations: {
//           packagesPerMonth: Number.POSITIVE_INFINITY,
//           aiModels: ["gpt4o", "claude", "deepseek", "groq"],
//           promptsPerDay: 500,
//           teamMembers: 5,
//         },
//       }
//     default:
//       return {
//         name: "Free",
//         description: "For individual developers",
//         features: [
//           "5 packages per month",
//           "GPT-4o access (10 prompts/day)",
//           "GitHub publishing",
//           "Basic package analytics",
//         ],
//         limitations: {
//           packagesPerMonth: 5,
//           aiModels: ["gpt4o"],
//           promptsPerDay: 10,
//         },
//       }
//   }
// }
