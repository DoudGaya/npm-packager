"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

const deleteApiKeySchema = z.object({
  id: z.string().min(1),
})

export async function deleteApiKey(data: z.infer<typeof deleteApiKeySchema>) {
  const validatedFields = deleteApiKeySchema.safeParse(data)

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
    // Delete API key
    await db.apiKey.deleteMany({
      where: {
        id: data.id,
        userId: user.id,
      },
    })

    revalidatePath("/settings")
    return { success: true }
  } catch (error) {
    console.error("Error deleting API key:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to delete API key",
    }
  }
}
