"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

const accountSchema = z.object({
  twoFactorEnabled: z.boolean(),
  npmToken: z.string().optional(),
  githubToken: z.string().optional(),
})

export async function updateAccount(data: z.infer<typeof accountSchema>) {
  const validatedFields = accountSchema.safeParse(data)

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
    // Update user account settings
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        twoFactorEnabled: data.twoFactorEnabled,
        npmToken: data.npmToken || user.npmToken,
        githubToken: data.githubToken || user.githubToken,
      },
    })

    revalidatePath("/settings")
    return {
      success: true,
    }
  } catch (error) {
    console.error("Error updating account:", error)
    return {
      error: "Failed to update account",
    }
  }
}
