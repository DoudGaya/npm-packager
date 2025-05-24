"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

const accountFormSchema = z.object({
  twoFactorEnabled: z.boolean(),
  npmToken: z.string().optional().nullable(),
  githubToken: z.string().optional().nullable(),
})

export async function updateAccount(values: z.infer<typeof accountFormSchema>) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return {
        error: "Unauthorized",
      }
    }

    // Update the user in the database
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        twoFactorEnabled: values.twoFactorEnabled,
        npmToken: values.npmToken || null,
        githubToken: values.githubToken || null,
      },
    })

    revalidatePath("/settings")
    revalidatePath("/settings/account")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error updating account settings:", error)
    return {
      error: "Failed to update account settings",
    }
  }
}
