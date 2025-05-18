"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { generatePackage } from "@/app/actions/ai/generate"
import { checkSubscriptionLimit } from "@/lib/subscription"

const packageSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(10),
  framework: z.string().min(1),
  aiModel: z.string().min(1),
  prompt: z.string().min(20),
})

export async function createPackage(data: z.infer<typeof packageSchema>) {
  const validatedFields = packageSchema.safeParse(data)


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
    // Check subscription limits for package creation
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    const nextMonth = new Date(monthStart)
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    const packageCount = await db.package.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: monthStart,
          lt: nextMonth,
        },
      },
    })

    const subscriptionDetails = await db.user.findUnique({
      where: { id: user.id },
      select: { subscriptionPlan: true },
    })

    const plan = subscriptionDetails?.subscriptionPlan || "FREE"
    const packageLimit = plan === "FREE" ? 5 : Number.POSITIVE_INFINITY

    if (packageCount >= packageLimit) {
      return {
        error: `You've reached your monthly limit of ${packageLimit} packages. Upgrade your plan to create more.`,
      }
    }

    // Check if user can use the selected AI model
    const canUseAI = await checkSubscriptionLimit(user.id, data.aiModel)

    if (canUseAI === false) {
      return {
        error: canUseAI,
      }
    }

    // Generate package code and documentation using AI
    const { code, documentation } = await generatePackage({
      name: data.name,
      description: data.description,
      framework: data.framework,
      prompt: data.prompt,
      model: data.aiModel,
    })

    // Create package in database
    const newPackage = await db.package.create({
      data: {
        name: data.name,
        description: data.description,
        framework: data.framework,
        aiModel: data.aiModel,
        code,
        documentation,
        userId: user.id,
      },
    })

    // Create initial version
    await db.packageVersion.create({
      data: {
        packageId: newPackage.id,
        version: "0.1.0",
        code,
        documentation,
      },
    })

    // Deduct credits if not on free tier or if using premium models
    //@ts-ignore
    if (user.subscriptionPlan !== "FREE" || data.aiModel !== "gpt4o") {
      await db.wallet.update({
        where: { userId: user.id },
        data: {
          credits: { decrement: 1 },
        },
      })
    }

    revalidatePath("/packages")
    revalidatePath("/dashboard")

    return {
      packageId: newPackage.id,
    }
  } catch (error) {
    console.error("Error creating package:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to create package",
    }
  }
}

