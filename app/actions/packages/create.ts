"use server"

import { z } from "zod"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { generatePackage } from "@/app/actions/ai/generate"

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

    // Track API usage
    await db.apiUsage.create({
      data: {
        userId: user.id,
        model: data.aiModel,
        tokens: 0, // This would be calculated based on the actual usage
        cost: 0, // This would be calculated based on the actual usage
      },
    })

    return {
      packageId: newPackage.id,
    }
  } catch (error) {
    console.error("Error creating package:", error)
    return {
      error: "Failed to create package",
    }
  }
}
