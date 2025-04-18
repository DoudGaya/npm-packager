"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

const createApiKeySchema = z.object({
  name: z.string().min(1),
})

export async function createApiKey(data: z.infer<typeof createApiKeySchema>) {
  const validatedFields = createApiKeySchema.safeParse(data)

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
    // Generate a secure API key
    const apiKey = `npm_pk_${randomUUID().replace(/-/g, "")}`

    // Create API key in database
    const newApiKey = await db.apiKey.create({
      data: {
        userId: user.id,
        name: data.name,
        key: apiKey,
      },
    })

    revalidatePath("/settings")
    return {
      id: newApiKey.id,
      name: newApiKey.name,
      key: apiKey,
      createdAt: newApiKey.createdAt,
    }
  } catch (error) {
    console.error("Error creating API key:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to create API key",
    }
  }
}
